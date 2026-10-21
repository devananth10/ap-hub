import { body, json } from "@/lib/account-server";
import { serverSupabase } from "@/lib/supabase/server";
import { appOrigin, registrationEnabled } from "@/lib/supabase/config";
import { validEmail, validPassword, safeReturnTo } from "@/lib/account-policy";
import { recoveryReady, verifyRecovery } from "@/lib/recovery-proof";
export async function POST(request:Request){
 try{
  const input=await body(request,8000);const client=await serverSupabase();
  if(!client)return json({error:"Cloud accounts are not configured yet. Guest studying is available."},503);
  const action=input.action;const next=safeReturnTo(input.next);const callback=new URL("/auth/callback",appOrigin());callback.searchParams.set("next",next);
  if(action==="logout"){
    const {error}=await client.auth.signOut({scope:"local"});return error?json({error:"Sign out failed. Please retry before sharing this browser."},503):json({ok:true});
  }
  if(action==="google"){
    if(!registrationEnabled())return json({error:"Google sign-in is closed until provider and privacy review are complete."},403);
    const {data,error}=await client.auth.signInWithOAuth({provider:"google",options:{redirectTo:callback.toString(),skipBrowserRedirect:true,queryParams:{prompt:"select_account",max_age:"0"}}});
    return error||!data.url?json({error:"Google sign-in could not start. Try again later."},503):json({url:data.url});
  }
  if(action==="signup" && !registrationEnabled())return json({error:"New accounts are closed pending setup and privacy review. You can keep studying as a guest."},403);
  if(action==="password"){
    const {data,error}=await client.auth.getUser();if(error||!data.user)return json({error:"Open a valid recovery link or sign in again."},401);
    if(!validPassword(input.password))return json({error:"Use a password of 12–128 characters."},400);
    if(input.currentPassword!==undefined){
      if(typeof input.currentPassword!=="string")return json({error:"Enter your current password."},400);
      const verified=await client.auth.signInWithPassword({email:data.user.email!,password:input.currentPassword});
      if(verified.error||verified.data.user?.id!==data.user.id)return json({error:"Current password could not be verified."},403);
    }else{
      // Recovery must arrive through the dedicated confirmation flow, not just a stale session.
      const {cookies}=await import("next/headers");const jar=await cookies();
      const claims=await client.auth.getClaims();
      if(!verifyRecovery(jar.get("prepatlas-recovery")?.value,data.user.id,String(claims.data?.claims?.session_id||"")))return json({error:"Request a fresh password reset link."},403);
    }
    const changed=await client.auth.updateUser({password:input.password});
    if(changed.error)return json({error:"Password change failed. Request a fresh recovery link or reauthenticate."},400);
    const {cookies}=await import("next/headers");(await cookies()).set("prepatlas-recovery","",{path:"/api/auth",maxAge:0});
    const revoked=await client.auth.signOut({scope:"others"});
    return json({ok:true,message:revoked.error?"Password updated. Other-device sign-out could not be confirmed; review your provider sessions.":"Password updated. Other device sessions were signed out; existing access tokens can remain valid until their expiry."});
  }
  if(!validEmail(input.email))return json({error:"Enter a valid email address."},400);
  if(action==="forgot"){
    if(!recoveryReady())return json({error:"Password recovery still needs server setup. Guest studying remains available."},503);
    const redirect=new URL("/auth/callback",appOrigin());redirect.searchParams.set("next","/reset-password");
    // Deliberately identical result for unknown and known addresses.
    await client.auth.resetPasswordForEmail(input.email,{redirectTo:redirect.toString()});
    return json({ok:true,message:"If recovery is available for that address, a reset email will arrive. Check your inbox and spam folder."});
  }
  if(action==="login"?(typeof input.password!=="string"||input.password.length<1||input.password.length>128):!validPassword(input.password))return json({error:"Enter a valid password. New passwords need 12–128 characters."},400);
  if(action==="signup"){
    await client.auth.signUp({email:input.email,password:input.password as string,options:{emailRedirectTo:callback.toString()}});
    return json({ok:true,message:"If registration is available for that address, check your email for confirmation. You can then sign in."});
  }
  if(action==="login"){
    const {error}=await client.auth.signInWithPassword({email:input.email,password:input.password as string});
    return error?json({error:"Sign-in was unsuccessful. Check your details, email confirmation, or try password recovery."},400):json({ok:true,next});
  }
  return json({error:"Unknown authentication action."},400);
 }catch{return json({error:"Authentication is temporarily unavailable. Your local study data is unchanged."},503);}
}
