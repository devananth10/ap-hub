import { courses, findTopic } from "./courses.ts";
import { isInstructorId } from "./video-instructors.ts";
import type { StudyData } from "./study-storage.ts";

export const kinds = ["course", "topic", "video", "instructor", "note", "saved", "recent", "attempt", "import"] as const;
export type Kind = typeof kinds[number];
export type Attempt = { id: string; courseId: string; topicId: string | null; questionIds: string[]; total: number; correct: number; answered: number; percent: number; startedAt: string; completedAt: string };
export type RecordValue = boolean | string | Attempt | { completed: boolean; lastStudied: string | null };
export type CloudRecord = { kind: Kind; key: string; value: RecordValue; revision: number };
export type Change = CloudRecord & { mutation: string };
export type CloudState = { records: CloudRecord[]; pending: Change[]; conflicts: { local: Change; remote: CloudRecord | null }[] };
export const emptyCloud = (): CloudState => ({ records: [], pending: [], conflicts: [] });
export const recordId = (r: Pick<CloudRecord,"kind"|"key">) => `${r.kind}:${r.key}`;
export const uuid = (v: unknown): v is string => typeof v === "string" && /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(v);
const date = (v: unknown): v is string => typeof v === "string" && v.length <= 40 && Number.isFinite(Date.parse(v));
export function canonicalTopic(key: string) { const [c,t,...extra] = key.split("/"); return !extra.length && !!findTopic(c,t).topic; }
export function validRecord(record: unknown): record is CloudRecord {
  if (!record || typeof record !== "object") return false;
  const r = record as CloudRecord;
  if (!kinds.includes(r.kind) || typeof r.key !== "string" || r.key.length > 220 || !Number.isSafeInteger(r.revision) || r.revision < 0) return false;
  const v = r.value;
  if (r.kind === "course") return courses.some(c=>c.id===r.key) && typeof v === "boolean";
  if (r.kind === "note") return canonicalTopic(r.key) && typeof v === "string" && v.length <= 50000;
  if (r.kind === "topic") return canonicalTopic(r.key) && !!v && typeof v === "object" && "completed" in v && typeof v.completed === "boolean" && (v.lastStudied === null || date(v.lastStudied)) && Object.keys(v).length === 2;
  if (r.kind === "instructor") return r.key === "human-geography" && isInstructorId(v);
  if (r.kind === "video") return /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]{11}$/.test(r.key) && typeof v === "boolean";
  if (r.kind === "saved") return /^[a-zA-Z0-9_-]+$/.test(r.key) && typeof v === "boolean";
  if (r.kind === "recent") return r.key === "last" && typeof v === "string" && canonicalTopic(v);
  if (r.kind === "import") return /^[a-f0-9]{64}$/.test(r.key) && v === true;
  if (r.kind === "attempt") {
    if (!v || typeof v !== "object" || !("questionIds" in v)) return false;
    const a = v as Attempt;
    return uuid(r.key) && a.id === r.key && courses.some(c=>c.id===a.courseId) && (a.topicId===null || !!findTopic(a.courseId,a.topicId).topic) && Array.isArray(a.questionIds) && a.questionIds.length===a.total && a.questionIds.every(id=>typeof id==="string" && /^[\w-]{1,100}$/.test(id)) && new Set(a.questionIds).size===a.total && Number.isInteger(a.total) && a.total>0 && a.total<=2640 && Number.isInteger(a.correct) && Number.isInteger(a.answered) && a.correct>=0 && a.correct<=a.answered && a.answered<=a.total && a.percent===Math.round(a.correct/a.total*100) && date(a.startedAt) && date(a.completedAt) && Date.parse(a.completedAt)>=Date.parse(a.startedAt) && Object.keys(a).length===10;
  }
  return false;
}
export function validChange(v: unknown): v is Change { return validRecord(v) && uuid((v as Change).mutation) && Object.keys(v).sort().join(",")==="key,kind,mutation,revision,value"; }
export function projectStudy(records: CloudRecord[]): StudyData {
  const d: StudyData = { selected: [], notes: {}, completed: [], saved: [], watchedVideos: [], preferredInstructors: {}, lastTopic: null };
  for (const r of records) {
    if (!validRecord(r)) continue;
    if (r.kind==="course" && r.value===true) d.selected.push(r.key);
    if (r.kind==="note") d.notes[r.key]=r.value as string;
    if (r.kind==="topic" && (r.value as {completed:boolean}).completed) d.completed.push(r.key);
    if (r.kind==="saved" && r.value===true) d.saved.push(r.key);
    if (r.kind==="video" && r.value===true) d.watchedVideos.push(r.key);
    if (r.kind==="instructor" && isInstructorId(r.value)) d.preferredInstructors![r.key]=r.value;
    if (r.kind==="recent") d.lastTopic=r.value as string;
  }
  return d;
}
export function visibleRecords(state: CloudState) {
  const records = new Map(state.records.map(r=>[recordId(r),r]));
  for (const c of state.pending) records.set(recordId(c),c);
  for (const c of state.conflicts) records.set(recordId(c.local),c.local);
  return [...records.values()];
}
export function queueChange(state: CloudState, kind: Kind, key: string, value: RecordValue, mutation: string): CloudState {
  const id=recordId({kind,key});
  const old=state.pending.find(r=>recordId(r)===id) || state.records.find(r=>recordId(r)===id);
  const change: Change={kind,key,value,revision:old?.revision||0,mutation};
  if (!validChange(change)) throw new Error("This study change is invalid or too large.");
  const conflict=state.conflicts.find(c=>recordId(c.local)===id);
  if(conflict) return {...state,conflicts:state.conflicts.map(c=>c===conflict?{...c,local:change}:c)};
  return {...state,pending:[...state.pending.filter(r=>recordId(r)!==id),change]};
}
export function acceptChange(state: CloudState, sent: Change, remote: CloudRecord): CloudState {
  const id=recordId(sent);
  return {...state,records:[...state.records.filter(r=>recordId(r)!==id),remote],pending:state.pending.flatMap(r=>recordId(r)!==id?[r]:r.mutation===sent.mutation?[]:[{...r,revision:remote.revision}])};
}
export function conflictChange(state: CloudState, sent: Change, remote: CloudRecord|null): CloudState {
  const id=recordId(sent), local=state.pending.find(r=>recordId(r)===id)||sent;
  return {...state,pending:state.pending.filter(r=>recordId(r)!==id),conflicts:[...state.conflicts.filter(c=>recordId(c.local)!==id),{local,remote}]};
}
export function resolveConflict(state: CloudState, id: string, choice: "local"|"remote", mutation: string): CloudState {
  const c=state.conflicts.find(c=>recordId(c.local)===id);if(!c)return state;
  let next={...state,conflicts:state.conflicts.filter(item=>item!==c),records:state.records.filter(r=>recordId(r)!==id)};
  if(c.remote) next.records.push(c.remote);
  if(choice==="local") next=queueChange(next,c.local.kind,c.local.key,c.local.value,mutation);
  return next;
}
export function legacyChanges(data: StudyData): Omit<CloudRecord,"revision">[] {
  return [
    ...data.selected.map(key=>({kind:"course" as const,key,value:true})),
    ...Object.entries(data.notes).filter(([,v])=>v.trim()).map(([key,value])=>({kind:"note" as const,key,value})),
    ...data.completed.map(key=>({kind:"topic" as const,key,value:{completed:true,lastStudied:null}})),
    ...data.saved.map(key=>({kind:"saved" as const,key,value:true})),
    ...data.watchedVideos.map(key=>({kind:"video" as const,key,value:true})),
    ...Object.entries(data.preferredInstructors||{}).map(([key,value])=>({kind:"instructor" as const,key,value})),
    ...(data.lastTopic?[{kind:"recent" as const,key:"last",value:data.lastTopic}]:[]),
  ].filter(r=>validRecord({...r,revision:0}));
}
