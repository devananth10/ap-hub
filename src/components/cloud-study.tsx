"use client";
import { useEffect,useRef,useState,useCallback } from "react";
import { accountCacheKey,parseAccountCache,serializeAccountCache,ACCOUNT_CACHE_PREFIX } from "@/lib/account-cache";
import { emptyCloud,queueChange,acceptChange,conflictChange,resolveConflict,visibleRecords,validRecord,recordId,type CloudState,type Kind,type RecordValue,type CloudRecord } from "@/lib/cloud-model";
export type SyncStatus="loading"|"saving"|"saved"|"offline"|"error"|"conflict";
export function useCloudStudy(owner:string|null,enabled:boolean){
 const [state,setState]=useState<CloudState>(emptyCloud),[status,setStatus]=useState<SyncStatus>("loading"),[storageError,setStorageError]=useState(false),[initialized,setInitialized]=useState(false),[hydrated,setHydrated]=useState(false),[tick,setTick]=useState(0);
 const current=useRef(state),key=useRef(""),active=useRef(true),busy=useRef(false),loaded=useRef(false),abort=useRef<AbortController|null>(null);
 const persist=useCallback((next:CloudState)=>{
  current.current=next;
  try{if(owner&&key.current)localStorage.setItem(key.current,serializeAccountCache(owner,next));setStorageError(false);}catch{setStorageError(true);}
  setState(next);
 },[owner]);
 useEffect(()=>{
  active.current=true;if(!owner||!enabled)return;
  try{
   let tab=sessionStorage.getItem("prepatlas-tab");if(!tab){tab=crypto.randomUUID();sessionStorage.setItem("prepatlas-tab",tab);}key.current=accountCacheKey(owner,tab);
   const raw=localStorage.getItem(key.current);if(raw){const next=parseAccountCache(raw,owner);current.current=next;setState(next);setHydrated(true);}
  }catch{key.current=accountCacheKey(owner,crypto.randomUUID());setStorageError(true);}
  setInitialized(true);
  return()=>{active.current=false;abort.current?.abort();};
 },[owner,enabled]);
 const refresh=useCallback(()=>setTick(t=>t+1),[]);
 useEffect(()=>{
  if(!owner||!initialized||!enabled)return;
  const go=()=>refresh();const visible=()=>{if(document.visibilityState==="visible")go();};window.addEventListener("online",go);document.addEventListener("visibilitychange",visible);
  const poll=setInterval(()=>{if(document.visibilityState==="visible"&&!current.current.pending.length)go();},60000);
  return()=>{clearInterval(poll);window.removeEventListener("online",go);document.removeEventListener("visibilitychange",visible);};
 },[owner,initialized,enabled,refresh]);
 useEffect(()=>{
  if(!owner||!initialized||!enabled)return;
  const timer=setTimeout(async()=>{
   if(busy.current||!active.current)return;
   if(!navigator.onLine){setStatus("offline");return;}
   busy.current=true;abort.current=new AbortController();setStatus("saving");
   try{
    const response=await fetch("/api/sync",{cache:"no-store",signal:AbortSignal.any([abort.current.signal,AbortSignal.timeout(20000)])});const remote=await response.json();
    if(!response.ok||remote.owner!==owner||!Array.isArray(remote.records)||!remote.records.every(validRecord))throw new Error();
    if(!active.current)return;
    loaded.current=true;
    setHydrated(true);
    // Never replace the outbox with a fetched snapshot. Unsent edits keep their base revisions.
    persist({...current.current,records:remote.records});
    let processed=0;
    while(current.current.pending.length&&processed++<100){
      const sent=current.current.pending[0];
      const reply:Response=await fetch("/api/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({owner,change:sent}),signal:AbortSignal.any([abort.current.signal,AbortSignal.timeout(20000)]),cache:"no-store"});const result:{owner?:string;ok?:boolean;record?:CloudRecord|null}=await reply.json();
      if(!active.current)return;
      if(result.owner!==owner)throw new Error();
      if(reply.status===409&&result.ok===false&&(result.record===null||validRecord(result.record)))persist(conflictChange(current.current,sent,result.record));
      else if(reply.ok&&result.ok===true&&validRecord(result.record)&&recordId(result.record)===recordId(sent))persist(acceptChange(current.current,sent,result.record));
      else throw new Error();
    }
    setStatus(current.current.conflicts.length?"conflict":current.current.pending.length?"saving":"saved");
    if(current.current.pending.length)refresh();
   }catch{if(active.current)setStatus(navigator.onLine?"error":"offline");}
   finally{busy.current=false;}
  },700);
  return()=>clearTimeout(timer);
 // Scheduling depends on local edits/retry, not every status repaint or response.
 },[owner,initialized,enabled,tick,persist,refresh]);
 function change(kind:Kind,recordKey:string,value:RecordValue){
   if(!owner||!initialized) return;
   const next=queueChange(current.current,kind,recordKey,value,crypto.randomUUID());persist(next);setStatus(next.conflicts.length?"conflict":"saving");refresh();
 }
 function choose(id:string,choice:"local"|"remote"){
  // Preserve the discarded version in the same owner's recoverable cache before resolving.
  try{localStorage.setItem(key.current+":recovery:"+crypto.randomUUID(),serializeAccountCache(owner!,current.current));}catch{setStorageError(true);return;}
  persist(resolveConflict(current.current,id,choice,crypto.randomUUID()));refresh();
 }
 function recoverOtherTabs(){
   if(!owner)return;
   for(let i=0;i<localStorage.length;i++){
    const storedKey=localStorage.key(i)!;
    if(!storedKey.startsWith(ACCOUNT_CACHE_PREFIX+owner+":")||storedKey===key.current||storedKey.includes(":recovery:")||storedKey.endsWith(":import"))continue;
    // Never silently take ownership of a possibly active tab's edits. Explicit recovery creates conflicts.
    const old=parseAccountCache(localStorage.getItem(storedKey)!,owner);
    for(const pending of [...old.pending,...old.conflicts.map(c=>c.local)]){
     if(current.current.pending.some(c=>c.mutation===pending.mutation)||current.current.conflicts.some(c=>c.local.mutation===pending.mutation))continue;
     const remote=current.current.records.find(r=>recordId(r)===recordId(pending))||null;
     persist(conflictChange(current.current,pending,remote));
    }
   }
   setStatus(current.current.conflicts.length?"conflict":status);
 }
 async function importRecords(records:Omit<CloudRecord,"revision">[],fingerprint:string){
  if(!loaded.current||busy.current||!owner)throw new Error("Wait for cloud progress to load before importing.");
  if(current.current.records.some(r=>r.kind==="import"&&r.key===fingerprint))return;
  for(const record of records){
   const existing=visibleRecords(current.current).find(r=>recordId(r)===recordId(record));
   if(existing&&JSON.stringify(existing.value)===JSON.stringify(record.value))continue;
   const sent={...record,revision:0,mutation:crypto.randomUUID()};
   if(existing)persist(conflictChange(current.current,sent,existing));else persist(queueChange(current.current,record.kind,record.key,record.value,sent.mutation));
  }
  // Receipt must wait until every imported edit/conflict has been acknowledged.
  try{localStorage.setItem(key.current+":import",fingerprint);}catch{setStorageError(true);}
  refresh();
 }
 useEffect(()=>{
   if(status!=="saved"||!owner||state.pending.length||state.conflicts.length)return;
   try{const fingerprint=localStorage.getItem(key.current+":import");
   if(fingerprint&&!state.records.some(r=>r.kind==="import"&&r.key===fingerprint)){change("import",fingerprint,true);}
   else if(fingerprint)localStorage.removeItem(key.current+":import");}catch{setStorageError(true);}
 // The receipt is a real confirmed cloud record, not a premature local success flag.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[status,state,owner]);
 async function eraseLocalAccount(){
   if(!owner)return;active.current=false;abort.current?.abort();for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i)!;if(k.startsWith(ACCOUNT_CACHE_PREFIX+owner+":"))localStorage.removeItem(k);}
 }
 return {state,records:visibleRecords(state),change,choose,importRecords,recoverOtherTabs,eraseLocalAccount,status,storageError,ready:initialized&&hydrated,retry:refresh};
}
