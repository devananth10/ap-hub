import { createClient } from "@supabase/supabase-js";
import { authenticated, body, json } from "@/lib/account-server";
import { cloudConfig, registrationEnabled } from "@/lib/supabase/config";
import { validPassword } from "@/lib/account-policy";
export async function GET() {
  const configured=!!cloudConfig();
  try {
    const auth=configured?await authenticated():null;
    const label=auth?.user.user_metadata?.display_name;
    return json({configured,registration:configured&&registrationEnabled(),deletion:!!process.env.SUPABASE_SECRET_KEY,user:auth?{id:auth.user.id,email:auth.user.email||"",displayName:typeof label==="string"?label.slice(0,60):""}:null});
  }catch{return json({error:"Account service is temporarily unavailable."},503);}
}
export async function POST(request:Request){
 try{
  const input=await body(request,4000);const auth=await authenticated();if(!auth)return json({error:"Please sign in again."},401);
  if(input.action==="profile"){
    if(typeof input.displayName!=="string" || input.displayName.trim().length>60 || /[\u0000-\u001f]/.test(input.displayName))return json({error:"Use a display name of up to 60 characters."},400);
    const name=input.displayName.trim();
    const {error}=await auth.client.from("student_profiles").upsert({user_id:auth.user.id,display_name:name,updated_at:new Date().toISOString()});
    if(error)return json({error:"Profile could not be saved. Try again."},503);
    const result=await auth.client.auth.updateUser({data:{display_name:name}});
    return result.error?json({error:"Profile saved; account label could not refresh. Try saving again."},503):json({ok:true});
  }
  if(input.action==="delete"){
    if(input.confirm!=="DELETE")return json({error:"Type DELETE to confirm."},400);
    const cfg=cloudConfig(), secret=process.env.SUPABASE_SECRET_KEY;
    if(!cfg||!secret)return json({error:"Account deletion needs server setup. Your account has not been deleted."},503);
    if(auth.user.app_metadata?.providers?.includes("email")){
      if(typeof input.password!=="string"||!input.password.length||input.password.length>128)return json({error:"Confirm with your current password."},400);
      const verified=await auth.client.auth.signInWithPassword({email:auth.user.email!,password:input.password});
      if(verified.error || verified.data.user?.id!==auth.user.id)return json({error:"Reauthentication failed. Your account has not been deleted."},403);
    }else if(!auth.user.last_sign_in_at || Date.now()-Date.parse(auth.user.last_sign_in_at)>5*60*1000){return json({error:"Sign in with Google again, then confirm deletion within five minutes."},403);}
    // Privileged client is created only here, never used for normal student reads/writes.
    const admin=createClient(cfg.url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
    const deleted=await admin.auth.admin.deleteUser(auth.user.id);
    if(deleted.error)return json({error:"Deletion failed. Your account may still exist; retry or contact the operator."},503);
    await auth.client.auth.signOut({scope:"local"});
    return json({ok:true,deleted:true});
  }
  return json({error:"Unknown account action."},400);
 }catch{return json({error:"Account request could not be completed. No private details were logged."},400);}
}
