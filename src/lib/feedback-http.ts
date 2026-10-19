import { FeedbackError, validateFeedback } from "./feedback.ts";
import { createFeedbackSession, feedbackCookie, openFeedbackStore, saveFeedback } from "./feedback-store.ts";
import { practiceEntries } from "./practice.ts";

const entries = new Map(practiceEntries().map(entry => [entry.id, entry]));
function response(body: unknown, status = 200, extra: Record<string,string> = {}) {
  return Response.json(body, {status, headers:{"Cache-Control":"no-store", ...extra}});
}
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  // Next's internal URL can use localhost even when the browser uses 127.0.0.1.
  // Host is browser-controlled by the destination, unlike a caller-supplied Origin.
  const url = new URL(request.url), host = request.headers.get("host") || url.host;
  const expected = process.env.PREPATLAS_PUBLIC_ORIGIN || `${url.protocol}//${host}`;
  if ((request.method === "POST" && !origin) || (origin && origin !== expected) || request.headers.get("sec-fetch-site") === "cross-site") throw new FeedbackError("Please submit feedback from PrepAtlas.",403);
}
function cookie(request: Request) {
  return request.headers.get("cookie")?.split(";").map(item => item.trim()).find(item => item.startsWith(`${feedbackCookie}=`))?.slice(feedbackCookie.length+1);
}
async function limitedBody(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new FeedbackError("Use a JSON feedback form.",415);
  const reader = request.body?.getReader();
  if (!reader) throw new FeedbackError("Feedback form is empty.");
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const {done,value} = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); throw new FeedbackError("Feedback form is too large.",413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new FeedbackError("Feedback form could not be read."); }
}
export async function handleFeedback(request: Request, sessionOnly = false, file?: string) {
  let db: ReturnType<typeof openFeedbackStore> | undefined;
  try {
    sameOrigin(request);
    if (sessionOnly) {
      if (request.method !== "GET") return response({error:"Method not allowed."},405);
      db = openFeedbackStore(file);
      const token = createFeedbackSession(db,cookie(request));
      const secure = process.env.PREPATLAS_PUBLIC_ORIGIN?.startsWith("https://") || new URL(request.url).protocol === "https:";
      return response({ready:true},200,{"Set-Cookie":`${feedbackCookie}=${token}; HttpOnly; SameSite=Strict; Path=/api/feedback; Max-Age=7200${secure ? "; Secure" : ""}`});
    }
    if (request.method !== "POST") return response({error:"Method not allowed."},405);
    const input = validateFeedback(await limitedBody(request));
    const entry = input.kind === "question-report" ? entries.get(input.questionId) : undefined;
    if (input.kind === "question-report" && !entry) throw new FeedbackError("This question is not available for reporting.");
    db = openFeedbackStore(file);
    const receipt = saveFeedback(db,input,cookie(request) || "",entry && input.kind === "question-report" ? {
      questionId:entry.id, courseId:entry.course.id, courseName:entry.course.title, unitNumber:entry.unit.number,
      topicId:entry.topic.id, topicNumber:entry.topic.number, displayedNumber:input.displayedNumber,
    } : undefined);
    return response({accepted:true,id:receipt.id},receipt.repeated ? 200 : 201);
  } catch (error) {
    const known = error instanceof FeedbackError;
    const status = known ? error.status : 503;
    return response({error:known ? error.message : "Feedback could not be saved. Your form is still here; please try again later."},status,status === 429 ? {"Retry-After":"3600"} : {});
  } finally { db?.close(); }
}
