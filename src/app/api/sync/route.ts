import { authenticated, body, json } from "@/lib/account-server";
import { validChange, validRecord, type CloudRecord } from "@/lib/cloud-model";
import { practiceEntries } from "@/lib/practice";
export async function GET(){
 try{
  const auth=await authenticated();if(!auth)return json({error:"Sign in to load cloud progress."},401);
  // Paginate; default PostgREST limits must never silently truncate a large study history.
  const records:CloudRecord[]=[];
  for(let offset=0;;offset+=500){
    const {data,error}=await auth.client.from("study_snapshot").select("kind,key,value,revision").eq("user_id",auth.user.id).order("kind").order("key").range(offset,offset+499);
    if(error)return json({error:"Cloud progress could not be loaded. Your pending local changes are preserved."},503);
    if(!data||!data.every(validRecord))return json({error:"Cloud data needs review; nothing was overwritten."},409);
    records.push(...data);if(data.length<500)break;
    if(offset>=99500)return json({error:"History exceeds this client's safe loading limit. Export your data before continuing."},413);
  }
  return json({owner:auth.user.id,records});
 }catch{return json({error:"Cloud progress is temporarily unavailable."},503);}
}
export async function POST(request:Request){
 try{
  const input=await body(request);const auth=await authenticated();if(!auth)return json({error:"Sign in again. Your pending changes are preserved."},401);
  // owner is a comparison guard only. It never supplies a database user_id.
  if(input.owner!==auth.user.id)return json({error:"Account changed. Reload before synchronizing."},409);
  if(Object.keys(input).sort().join(",")!=="change,owner"||!validChange(input.change))return json({error:"Invalid study change."},400);
  const c=input.change;
  if(c.kind==="attempt" && typeof c.value==="object" && c.value && "questionIds"in c.value){
    const a=c.value;const available=new Set(practiceEntries({...(a.courseId?{courseId:a.courseId}:{}),...(a.topicId?{topicId:a.topicId}:{})}).map(e=>e.id));
    if(a.questionIds.some(id=>!available.has(id)))return json({error:"Practice question scope is invalid."},400);
  }
  const {data,error}=await auth.client.rpc("save_study_change",{p_kind:c.kind,p_key:c.key,p_value:c.value,p_revision:c.revision,p_mutation:c.mutation});
  if(error)return json({error:"Cloud save failed. Keep this tab or retry from Account."},503);
  return json({owner:auth.user.id,...data},data?.ok?200:409);
 }catch{return json({error:"Cloud save could not be completed. Pending changes remain on this device."},400);}
}
