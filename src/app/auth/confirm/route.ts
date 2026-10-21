import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
import { appOrigin } from "@/lib/supabase/config";
import { safeReturnTo } from "@/lib/account-policy";
import { privateHeaders } from "@/lib/account-server";
import { recoveryProof } from "@/lib/recovery-proof";
export async function GET(request:Request){
 const u=new URL(request.url),hash=u.searchParams.get("token_hash"),type=u.searchParams.get("type");
 try{
  const client=await serverSupabase();
  if(client&&hash&&(type==="signup"||type==="recovery"||type==="email")){
    const {data,error}=await client.auth.verifyOtp({token_hash:hash,type});
    if(!error&&data.user){
      const response=NextResponse.redirect(new URL(type==="recovery"?"/reset-password":safeReturnTo(u.searchParams.get("next")),appOrigin()));
      for(const[k,v]of Object.entries(privateHeaders))response.headers.set(k,v);
      if(type==="recovery"){
        const claims=await client.auth.getClaims();const session=String(claims.data?.claims?.session_id||"");if(!session)throw new Error("missing session");
        response.cookies.set("prepatlas-recovery",recoveryProof(data.user.id,session),{httpOnly:true,secure:new URL(appOrigin()).protocol==="https:",sameSite:"lax",path:"/api/auth",maxAge:600});
      }
      return response;
    }
  }
 }catch{/* Fail closed; no token logging. */}
 return NextResponse.redirect(new URL("/login?error=expired",appOrigin()),{headers:privateHeaders});
}
