"use client";
import { createContext,useContext,useEffect,useRef,useState,type ReactNode } from "react";
import { courses } from "@/lib/courses";
import type { InstructorId } from "@/lib/video-instructors";
import { STORAGE_KEY,THEME_KEY,defaultStudyData,parseStudyData,type StudyData } from "@/lib/study-storage";
import { legacyChanges,projectStudy,validRecord,type Attempt,type CloudRecord } from "@/lib/cloud-model";
import { GUEST_ATTEMPTS_KEY } from "@/lib/account-cache";
import { useAuth } from "./auth-provider";
import { useCloudStudy,type SyncStatus } from "./cloud-study";
type StudyContext=StudyData&{
 ready:boolean;storageError:boolean;theme:"light"|"dark";syncStatus:SyncStatus|"guest";attempts:Attempt[];
 toggleCourse:(id:string)=>void;setNote:(id:string,text:string)=>void;toggleCompleted:(id:string)=>void;toggleSaved:(id:string)=>void;visitTopic:(id:string)=>void;toggleTheme:()=>void;toggleWatchedVideo:(id:string)=>void;setPreferredInstructor:(courseId:string,instructor:InstructorId)=>void;
 recordAttempt:(attempt:Attempt)=>void;retrySync:()=>void;
 conflicts:ReturnType<typeof useCloudStudy>["state"]["conflicts"];resolve:(id:string,choice:"local"|"remote")=>void;
 importGuest:()=>Promise<void>;legacyAvailable:boolean;recoverOtherTabs:()=>void;eraseLocalAccount:()=>Promise<void>;
 records:CloudRecord[];
};
const Context=createContext<StudyContext|null>(null);
export function StudyProvider({children}:{children:ReactNode}){
 const auth=useAuth();
 const scope=!auth.ready?"locked":auth.user?.id||"guest";
 return <StudySession key={scope}>{children}</StudySession>;
}
function StudySession({children}:{children:ReactNode}){
 const auth=useAuth(),cloud=useCloudStudy(auth.user?.id||null,auth.ready);
 const [guest,setGuest]=useState<StudyData>(defaultStudyData),[guestReady,setGuestReady]=useState(false),[localError,setLocalError]=useState(false),[legacyAvailable,setLegacyAvailable]=useState(false),[guestAttempts,setGuestAttempts]=useState<Attempt[]>([]),[theme,setTheme]=useState<"light"|"dark">("light");
 const guestRef=useRef(guest),attemptsRef=useRef(guestAttempts),corrupt=useRef(false);
 useEffect(()=>{
  setTheme(document.documentElement.dataset.theme==="dark"?"dark":"light");
  if(!auth.ready)return;
  try{
   const stored=localStorage.getItem(STORAGE_KEY);setLegacyAvailable(!!stored);
   if(!auth.user){
    if(stored){const parsed=parseStudyData(JSON.parse(stored),courses);guestRef.current=parsed;setGuest(parsed);}
    const attempts=JSON.parse(localStorage.getItem(GUEST_ATTEMPTS_KEY)||"[]");
    if(!Array.isArray(attempts)||!attempts.every((a:Attempt)=>validRecord({kind:"attempt",key:a.id,value:a,revision:0})))throw new Error();
    attemptsRef.current=attempts;setGuestAttempts(attempts);
   }
  }catch{corrupt.current=true;setLocalError(true);}
  setGuestReady(true);
 },[auth.ready,auth.user]);
 const records=cloud.records, data=auth.user?projectStudy(records):guest;
 const ready=auth.ready&&(auth.user?cloud.ready:guestReady);
 const storageError=localError||cloud.storageError;
 function saveGuest(next:StudyData){
  if(!ready)return;
  try{
   if(corrupt.current){const original=localStorage.getItem(STORAGE_KEY);if(original)localStorage.setItem(STORAGE_KEY+":recovery:"+crypto.randomUUID(),original);corrupt.current=false;}
   localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setLocalError(false);
  }catch{setLocalError(true);}
  guestRef.current=next;setGuest(next);
 }
 function list(kind:"selected"|"completed"|"saved"|"watchedVideos",id:string){
  if(!ready)return;
  if(auth.user){
   if(kind==="completed"){
    const existing=records.find(r=>r.kind==="topic"&&r.key===id)?.value as {completed:boolean;lastStudied:string|null}|undefined;
    cloud.change("topic",id,{completed:!data.completed.includes(id),lastStudied:existing?.lastStudied||null});
   }else cloud.change(kind==="selected"?"course":kind==="saved"?"saved":"video",id,!data[kind].includes(id));
  }else{const current=guestRef.current;saveGuest({...current,[kind]:current[kind].includes(id)?current[kind].filter(item=>item!==id):[...current[kind],id]});}
 }
 function setNote(id:string,text:string){if(!ready)return;if(auth.user)cloud.change("note",id,text);else saveGuest({...guestRef.current,notes:{...guestRef.current.notes,[id]:text}});}
 function visitTopic(id:string){
  if(!ready)return;
  if(auth.user){cloud.change("recent","last",id);cloud.change("topic",id,{completed:data.completed.includes(id),lastStudied:new Date().toISOString()});}
  else if(guestRef.current.lastTopic!==id)saveGuest({...guestRef.current,lastTopic:id});
 }
 function setPreferredInstructor(courseId:string,instructor:InstructorId){if(!ready||courseId!=="human-geography")return;if(auth.user)cloud.change("instructor",courseId,instructor);else saveGuest({...guestRef.current,preferredInstructors:{...guestRef.current.preferredInstructors,[courseId]:instructor}});}
 function toggleTheme(){const next=theme==="light"?"dark":"light";setTheme(next);document.documentElement.dataset.theme=next;try{localStorage.setItem(THEME_KEY,next);}catch{setLocalError(true);}}
 const attempts=auth.user?records.filter(r=>r.kind==="attempt").map(r=>r.value as Attempt):guestAttempts;
 function recordAttempt(a:Attempt){
  if(!ready||!validRecord({kind:"attempt",key:a.id,value:a,revision:0})||attempts.some(item=>item.id===a.id))return;
  if(auth.user)cloud.change("attempt",a.id,a);
  else{
   const next=[...attemptsRef.current,a];attemptsRef.current=next;setGuestAttempts(next);
   try{localStorage.setItem(GUEST_ATTEMPTS_KEY,JSON.stringify(next));setLocalError(false);}catch{setLocalError(true);}
  }
 }
 async function importGuest(){
  if(!auth.user)throw new Error("Sign in before importing guest progress.");
  const raw=localStorage.getItem(STORAGE_KEY);if(!raw)throw new Error("No guest progress was found.");
  const parsed=parseStudyData(JSON.parse(raw),courses), changes:Omit<CloudRecord,"revision">[]=legacyChanges(parsed);
  const attemptsRaw=localStorage.getItem(GUEST_ATTEMPTS_KEY)||"[]";const old=JSON.parse(attemptsRaw);
  if(!Array.isArray(old)||!old.every((a:Attempt)=>validRecord({kind:"attempt",key:a.id,value:a,revision:0})))throw new Error("Guest Practice history needs review; original data retained.");
  changes.push(...old.map((a:Attempt)=>({kind:"attempt" as const,key:a.id,value:a})));
  const encoded=new TextEncoder().encode(raw+"\n"+attemptsRaw),digest=await crypto.subtle.digest("SHA-256",encoded);
  const fingerprint=[...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,"0")).join("");
  localStorage.setItem(`prepatlas:account:v1:${auth.user.id}:recovery:guest-${fingerprint}`,JSON.stringify({study:raw,attempts:attemptsRaw}));
  await cloud.importRecords(changes,fingerprint);
 }
 return <Context.Provider value={{...data,ready,storageError,theme,toggleTheme,attempts,records,syncStatus:auth.user?cloud.status:"guest",retrySync:cloud.retry,conflicts:cloud.state.conflicts,resolve:cloud.choose,importGuest,legacyAvailable,recoverOtherTabs:cloud.recoverOtherTabs,eraseLocalAccount:cloud.eraseLocalAccount,recordAttempt,setNote,visitTopic,setPreferredInstructor,toggleCourse:id=>list("selected",id),toggleCompleted:id=>list("completed",id),toggleSaved:id=>list("saved",id),toggleWatchedVideo:id=>list("watchedVideos",id)}}>{children}</Context.Provider>;
}
export function useStudy(){const value=useContext(Context);if(!value)throw new Error("useStudy must be used within StudyProvider");return value;}
