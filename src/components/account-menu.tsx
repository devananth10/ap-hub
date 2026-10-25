"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { useStudy } from "./study-provider";
export function AccountMenu(){
 const auth=useAuth(),study=useStudy();const [error,setError]=useState(""),[busy,setBusy]=useState(false);
 const path=usePathname();
 const menu=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{
  const dismiss=(event:PointerEvent)=>{if(event.target instanceof Node&&!menu.current?.contains(event.target))menu.current?.removeAttribute("open");};
  const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"&&menu.current?.open){menu.current.removeAttribute("open");menu.current.querySelector("summary")?.focus();}};
  document.addEventListener("pointerdown",dismiss);document.addEventListener("keydown",escape);
  return()=>{document.removeEventListener("pointerdown",dismiss);document.removeEventListener("keydown",escape);};
 },[]);
 if(!auth.user)return <Link className="account-entry" href={`/login?next=${encodeURIComponent(path)}`} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname+window.location.search)}`);}}>Sign in</Link>;
 const parts=auth.user.displayName.trim().split(/\s+/).filter(Boolean);
 const name=parts.join(" ")||"Your account";
 const initials=parts.length?[Array.from(parts[0])[0],...(parts.length>1?[Array.from(parts.at(-1)!)[0]]:[])].join("").toUpperCase():"";
 return <details ref={menu} key={`${auth.user.id}:${path}`} className="account-menu"><summary aria-label="Open account menu" title={name}><span className="avatar" aria-hidden="true">{initials||<UserRound size={20}/>}</span></summary><div className="panel account-menu-panel"><strong>{name}</strong><Link href="/account">Account settings</Link><Link href="/progress">My progress</Link><small>{study.syncStatus==="saved"?"Cloud progress up to date":study.syncStatus==="saving"?"Saving progress…":"Check sync status in Account"}</small><button className="text-button" disabled={busy} onClick={async()=>{setBusy(true);setError("");if(!await auth.signOut())setError("Could not sign out. Please retry.");setBusy(false);}}>Sign out</button>{error&&<span role="alert">{error}</span>}</div></details>;
}
export function SyncStatus(){
 const study=useStudy();const auth=useAuth();
 const text=!auth.ready?"Checking account…":study.storageError?"Local saving failed — copy important work":!auth.user?"Saved in this browser only":({loading:"Loading cloud progress…",saving:"Saving…",saved:"Saved to your account",offline:"Offline — changes pending",error:"Sync failed — retry",conflict:"Changes need review"} as const)[study.syncStatus as Exclude<typeof study.syncStatus,"guest">];
 return <span className="sync-status" role="status">{text}{auth.user&&(study.syncStatus==="error"||study.syncStatus==="offline")&&<button className="text-button" onClick={study.retrySync}>Retry</button>}{auth.user&&study.conflicts.length>0&&<Link href="/account#conflicts">Review</Link>}</span>;
}
