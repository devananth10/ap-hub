"use client";
import { createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode } from "react";
import { browserSupabase } from "@/lib/supabase/browser";
export type AccountUser={id:string;email:string;displayName:string};
type AuthState={ready:boolean;configured:boolean;registration:boolean;deletion:boolean;user:AccountUser|null;error:string|null};
type Auth=AuthState&{refresh:()=>Promise<void>;signOut:()=>Promise<boolean>};
const Context=createContext<Auth|null>(null);
export async function accountRequest(path:string,value:unknown){
 const response=await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(value),cache:"no-store",signal:AbortSignal.timeout(20000)});
 const data=await response.json();if(!response.ok)throw new Error(data.error||"Request failed. Please retry.");return data;
}
export function AuthProvider({children}:{children:ReactNode}){
 const [state,setState]=useState<AuthState>({ready:false,configured:false,registration:false,deletion:false,user:null,error:null});
 const seq=useRef(0);const channel=useRef<BroadcastChannel|null>(null);
 const knownUser=useRef<string|null>(null);
 const verified=useRef(false);
 const refresh=useCallback(async()=>{
   const n=++seq.current;
   try{const response=await fetch("/api/account",{cache:"no-store",signal:AbortSignal.timeout(20000)});if(!response.ok)throw new Error();const data=await response.json();if(n===seq.current){knownUser.current=data.user?.id||null;verified.current=true;setState({...data,ready:true,error:null});}}
   catch{if(n===seq.current)setState(s=>({...s,user:null,ready:true,error:"Account service is unavailable. Guest study remains available; account edits are preserved separately."}));}
 },[]);
 useEffect(()=>{
  void refresh().then(()=>{if(verified.current)channel.current?.postMessage({userId:knownUser.current});});let debounce:ReturnType<typeof setTimeout>|undefined;
  const changed=()=>{++seq.current;setState(s=>({...s,ready:false,user:null}));clearTimeout(debounce);debounce=setTimeout(()=>void refresh(),0);};
  const client=browserSupabase();const subscription=client?.auth.onAuthStateChange((event,session)=>{if(event==="SIGNED_IN"&&session?.user?.id===knownUser.current)void refresh();else if(event==="SIGNED_IN"||event==="SIGNED_OUT"||event==="PASSWORD_RECOVERY"||event==="USER_UPDATED")changed();else if(event==="TOKEN_REFRESHED")void refresh();});
  if(typeof BroadcastChannel!=="undefined"){channel.current=new BroadcastChannel("prepatlas-auth");channel.current.onmessage=event=>{if(event.data?.userId===knownUser.current)void refresh();else changed();};}
  const focus=()=>{if(document.visibilityState==="visible")void refresh();};document.addEventListener("visibilitychange",focus);
  return()=>{++seq.current;clearTimeout(debounce);subscription?.data.subscription.unsubscribe();channel.current?.close();document.removeEventListener("visibilitychange",focus);};
 },[refresh]);
 const signOut=async()=>{
  try{await accountRequest("/api/auth",{action:"logout"});++seq.current;knownUser.current=null;setState(s=>({...s,user:null}));channel.current?.postMessage({userId:null});await refresh();return true;}
  catch{return false;}
 };
 return <Context.Provider value={{...state,refresh,signOut}}>{children}</Context.Provider>;
}
export function useAuth(){const value=useContext(Context);if(!value)throw new Error("AuthProvider required");return value;}
