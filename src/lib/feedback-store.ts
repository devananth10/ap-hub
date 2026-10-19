// Node-only persistent store. Never import this module from a client component.
import { DatabaseSync } from "node:sqlite";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { chmodSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { FeedbackError, validFeedbackId, validatePublicText, type FeedbackInput, type QuestionReference } from "./feedback.ts";

export const feedbackCookie = "prepatlas-feedback";
const hour = 60 * 60 * 1000;
export function feedbackDatabasePath() {
  const configured = process.env.PREPATLAS_FEEDBACK_DB;
  if (configured && (!isAbsolute(configured) || configured === ":memory:")) throw new Error("Feedback needs an absolute persistent database path.");
  const file = configured || join(process.env.LOCALAPPDATA || join(homedir(), ".local", "share"), "PrepAtlas", "feedback.sqlite");
  const inPublic = relative(resolve("public"), resolve(file));
  if (!inPublic.startsWith("..") && !isAbsolute(inPublic)) throw new Error("Private feedback cannot be stored in public/.");
  return file;
}
export function openFeedbackStore(file = feedbackDatabasePath()) {
  if (process.env.PREPATLAS_FEEDBACK_DISABLED === "1") throw new Error("Feedback storage disabled.");
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(file);
  try {
    db.exec(`PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY, rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5), text TEXT NOT NULL CHECK(length(text)<=500),
        public_opt_in INTEGER NOT NULL CHECK(public_opt_in IN (0,1)), moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK(moderation_status IN ('pending','approved','rejected')),
        public_text TEXT, created_at TEXT NOT NULL, moderated_at TEXT,
        CHECK(moderation_status != 'approved' OR (public_opt_in=1 AND public_text IS NOT NULL))
      ) STRICT;
      CREATE TABLE IF NOT EXISTS question_reports (
        id TEXT PRIMARY KEY, question_id TEXT NOT NULL, course_id TEXT NOT NULL, course_name TEXT NOT NULL, unit_number INTEGER NOT NULL,
        topic_id TEXT NOT NULL, topic_number TEXT NOT NULL, displayed_number INTEGER NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('incorrect-answer','multiple-answers','explanation','formatting','other')),
        comment TEXT NOT NULL CHECK(length(comment)<=500), status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewed','resolved')),
        created_at TEXT NOT NULL, reviewed_at TEXT
      ) STRICT;
      CREATE INDEX IF NOT EXISTS report_question ON question_reports(question_id,created_at);
      CREATE TABLE IF NOT EXISTS receipts (submission_id TEXT PRIMARY KEY, body_hash TEXT NOT NULL, record_id TEXT NOT NULL, kind TEXT NOT NULL) STRICT;
      CREATE TABLE IF NOT EXISTS feedback_sessions (hash TEXT PRIMARY KEY, expires INTEGER NOT NULL) STRICT;
      CREATE TABLE IF NOT EXISTS feedback_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL) STRICT;
      CREATE TABLE IF NOT EXISTS feedback_recent (key TEXT PRIMARY KEY, expires INTEGER NOT NULL) STRICT;`);
    if (process.platform !== "win32") chmodSync(file, 0o600);
    return db;
  } catch (error) { db.close(); throw error; }
}
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
function transact<T>(db: DatabaseSync, action: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try { const result = action(); db.exec("COMMIT"); return result; }
  catch (error) { db.exec("ROLLBACK"); throw error; }
}
function prune(db: DatabaseSync, now: number) {
  for (const table of ["feedback_sessions", "feedback_limits", "feedback_recent"]) db.prepare(`DELETE FROM ${table} WHERE expires <= ?`).run(now);
}
function limit(db: DatabaseSync, key: string, max: number, expires: number) {
  const row = db.prepare("SELECT count FROM feedback_limits WHERE key=?").get(key);
  if (row && Number(row.count) >= max) throw new FeedbackError("Too many submissions. Please try again later.", 429);
  db.prepare("INSERT INTO feedback_limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1").run(key, expires);
}
export function createFeedbackSession(db: DatabaseSync, existing?: string, now = Date.now()) {
  return transact(db, () => {
    prune(db, now);
    if (existing && /^[a-f0-9]{64}$/.test(existing) && db.prepare("SELECT hash FROM feedback_sessions WHERE hash=? AND expires>?").get(hash(existing), now)) return existing;
    limit(db, `session-issuance:${Math.floor(now/hour)}`, 1000, now+hour);
    const token = randomBytes(32).toString("hex");
    db.prepare("INSERT INTO feedback_sessions VALUES(?,?)").run(hash(token), now+2*hour);
    return token;
  });
}
export function saveFeedback(db: DatabaseSync, input: FeedbackInput, session: string, reference?: QuestionReference, now = Date.now()) {
  return transact(db, () => {
    prune(db, now);
    const client = hash(session);
    if (!/^[a-f0-9]{64}$/.test(session) || !db.prepare("SELECT hash FROM feedback_sessions WHERE hash=? AND expires>?").get(client, now)) throw new FeedbackError("Your submission session expired. Please retry.", 403);
    const { submissionId, ...body } = input;
    const bodyHash = hash(JSON.stringify(body));
    const receipt = db.prepare("SELECT body_hash, record_id FROM receipts WHERE submission_id=?").get(submissionId);
    if (receipt) {
      if (receipt.body_hash !== bodyHash) throw new FeedbackError("This submission changed. Please reopen the form and retry.", 409);
      return { id: String(receipt.record_id), repeated: true };
    }
    const recentKey = `${client}:${bodyHash}`;
    if (db.prepare("SELECT key FROM feedback_recent WHERE key=? AND expires>?").get(recentKey, now)) throw new FeedbackError("This feedback was already received recently. Please wait before submitting it again.", 409);
    const bucket = Math.floor(now/hour);
    limit(db, `global:${bucket}`, 200, now+hour);
    limit(db, `${client}:${input.kind}:${bucket}`, input.kind === "review" ? 3 : 20, now+hour);
    const id = randomUUID(), timestamp = new Date(now).toISOString();
    if (input.kind === "review") db.prepare("INSERT INTO reviews(id,rating,text,public_opt_in,created_at) VALUES(?,?,?,?,?)").run(id,input.rating,input.text,Number(input.publicOptIn),timestamp);
    else {
      if (!reference || reference.questionId !== input.questionId) throw new FeedbackError("This question is not available for reporting.");
      db.prepare("INSERT INTO question_reports(id,question_id,course_id,course_name,unit_number,topic_id,topic_number,displayed_number,category,comment,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)").run(id,reference.questionId,reference.courseId,reference.courseName,reference.unitNumber,reference.topicId,reference.topicNumber,input.displayedNumber,input.category,input.comment,timestamp);
    }
    db.prepare("INSERT INTO receipts VALUES(?,?,?,?)").run(submissionId,bodyHash,id,input.kind);
    db.prepare("INSERT INTO feedback_recent VALUES(?,?)").run(recentKey,now+10*60*1000);
    return { id, repeated: false };
  });
}
export type PublicReview = { rating: number; text: string };
export function publicReviews(db: DatabaseSync): PublicReview[] {
  return db.prepare("SELECT rating,public_text FROM reviews WHERE public_opt_in=1 AND moderation_status='approved' AND public_text IS NOT NULL ORDER BY created_at DESC,id DESC LIMIT 12").all().map(row => ({rating:Number(row.rating),text:String(row.public_text)}));
}
export function readPublicReviews(): PublicReview[] {
  let db: DatabaseSync | undefined;
  try {
    const file = feedbackDatabasePath();
    if (!existsSync(file) || process.env.PREPATLAS_FEEDBACK_DISABLED === "1") return [];
    db = new DatabaseSync(file,{readOnly:true}); db.exec("PRAGMA busy_timeout=5000"); return publicReviews(db);
  }
  catch { return []; } finally { db?.close(); }
}
export function moderateReview(db: DatabaseSync, id: string, status: string, publicText?: string, privacyReviewed = false) {
  if (!validFeedbackId(id) || !["pending","approved","rejected"].includes(status)) throw new FeedbackError("Invalid review ID or moderation status.");
  const row = db.prepare("SELECT public_opt_in FROM reviews WHERE id=?").get(id);
  if (!row) throw new FeedbackError("Review not found.",404);
  let excerpt: string | null = null;
  if (status === "approved") {
    if (row.public_opt_in !== 1 || !privacyReviewed || typeof publicText !== "string") throw new FeedbackError("Publication requires student opt-in, an explicit public excerpt, and owner privacy review.");
    excerpt = validatePublicText(publicText);
  }
  db.prepare("UPDATE reviews SET moderation_status=?,public_text=?,moderated_at=? WHERE id=?").run(status,excerpt,new Date().toISOString(),id);
}
export function updateReportStatus(db: DatabaseSync, id: string, status: string) {
  if (!validFeedbackId(id) || !["new","reviewed","resolved"].includes(status)) throw new FeedbackError("Invalid report ID or status.");
  if (!db.prepare("UPDATE question_reports SET status=?,reviewed_at=? WHERE id=?").run(status,new Date().toISOString(),id).changes) throw new FeedbackError("Report not found.",404);
}
