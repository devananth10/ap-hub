"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { accountRequest,useAuth } from "./auth-provider";
import { safeReturnTo } from "@/lib/account-policy";
export function AuthForm({mode}:{mode:"login"|"signup"|"forgot"|"password"}){
 const auth=useAuth(),params=useSearchParams();const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
 const next=safeReturnTo(params.get("next"));const title={login:"Welcome back.",signup:"Make room for your progress.",forgot:"Reset your password.",password:"Choose a new password."}[mode];
 const enabled=auth.ready&&auth.configured&&(mode!=="signup"||auth.registration);
 async function submit(action:string=mode){setBusy(true);setMessage("");setError("");try{const result=await accountRequest("/api/auth",{action,email,password,next});if(result.url)window.location.assign(result.url);else if(action==="login"){await auth.refresh();window.location.assign(next);}else{setMessage(result.message||"Saved.");setPassword("");await auth.refresh();}}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 return <div className="page account-page"><section className="panel auth-card"><span className="eyebrow">PREPATLAS · YOUR ACCOUNT</span><h1>{title}</h1><p>{mode==="forgot"?"We’ll send a recovery link if one is available for your address.":mode==="password"?"Use the recovery link from your email. Your study data stays in your account.":"Keep your notes and learning progress together across devices."}</p>
 {!auth.ready?<p role="status">Checking account availability…</p>:!auth.configured?<div className="account-notice" role="status">Cloud accounts are not configured yet. You can keep studying as a guest; your work is saved in this browser.</div>:!auth.registration&&(mode==="signup"||mode==="login")?<div className="account-notice">New accounts and Google sign-in are closed pending setup and privacy review. Existing test accounts can use email sign-in.</div>:null}
 {(params.get("error")||auth.error)&&<p role="alert" className="form-error">{auth.error||"The sign-in link expired or was canceled. Please try again or request a new link."}</p>}
 <form onSubmit={e=>{e.preventDefault();void submit();}}>
 {mode!=="password"&&<label>Email<input type="email" name="email" autoComplete="email" required maxLength={254} disabled={!enabled||busy} value={email} onChange={e=>setEmail(e.target.value)}/></label>}
 {mode!=="forgot"&&<label>{mode==="password"?"New password":"Password"}<input type="password" name="password" autoComplete={mode==="login"?"current-password":"new-password"} minLength={mode==="login"?1:12} maxLength={128} required disabled={!enabled||busy} value={password} onChange={e=>setPassword(e.target.value)}/>{mode!=="login"&&<small>Use 12–128 characters. Passwords are managed by Supabase.</small>}</label>}
 <button className="button primary" disabled={!enabled||busy}>{busy?"Please wait…":{login:"Sign in",signup:"Create account",forgot:"Send reset link",password:"Save new password"}[mode]}</button></form>
 {(mode==="login"||mode==="signup")&&<button className="button secondary google-button" disabled={!enabled||!auth.registration||busy} onClick={()=>void submit("google")}>Continue with Google</button>}
 {error&&<p role="alert" className="form-error">{error}</p>}{message&&<p role="status">{message}</p>}
 <div className="auth-links">{mode==="login"?<><Link href="/forgot-password">Forgot password?</Link><Link href={`/signup?next=${encodeURIComponent(next)}`}>Create an account</Link></>:<Link href={`/login?next=${encodeURIComponent(next)}`}>Back to sign in</Link>}<Link href="/">Continue as a guest</Link></div><p className="small muted">No legal name, school, birth date or phone number is needed. <Link href="/privacy">Privacy draft</Link> · <Link href="/terms">Terms draft</Link></p></section></div>;
}
