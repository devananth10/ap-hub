"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { useStudy } from "./study-provider";
export function AccountMenu(){
 const auth=useAuth(),study=useStudy();const [error,setError]=useState(""),[busy,setBusy]=useState(false);
 const path=usePathname();
 if(!auth.user)return <Link className="account-entry" href={`/login?next=${encodeURIComponent(path)}`} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname+window.location.search)}`);}}>Sign in</Link>;
 const name=auth.user.displayName||"Your account";
 return <details key={path} className="account-menu"><summary aria-label="Open account menu"><span className="avatar">{name[0].toUpperCase()}</span></summary><div className="panel account-menu-panel"><strong>{name}</strong><Link href="/account">Account &amp; settings</Link><Link href="/progress">My progress</Link><small>{study.syncStatus==="saved"?"Cloud progress up to date":study.syncStatus==="saving"?"Saving progress…":"Check sync status in Account"}</small><button className="text-button" disabled={busy} onClick={async()=>{setBusy(true);if(!await auth.signOut())setError("Could not sign out. Please retry.");setBusy(false);}}>Sign out</button>{error&&<span role="alert">{error}</span>}</div></details>;
}
export function SyncStatus(){
 const study=useStudy();const auth=useAuth();
 const text=!auth.ready?"Checking account…":study.storageError?"Local saving failed — copy important work":!auth.user?"Saved in this browser only":({loading:"Loading cloud progress…",saving:"Saving…",saved:"Saved to your account",offline:"Offline — changes pending",error:"Sync failed — retry",conflict:"Changes need review"} as const)[study.syncStatus as Exclude<typeof study.syncStatus,"guest">];
 return <span className="sync-status" role="status">{text}{auth.user&&(study.syncStatus==="error"||study.syncStatus==="offline")&&<button className="text-button" onClick={study.retrySync}>Retry</button>}{auth.user&&study.conflicts.length>0&&<Link href="/account#conflicts">Review</Link>}</span>;
}
