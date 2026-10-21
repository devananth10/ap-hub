import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
import { appOrigin } from "@/lib/supabase/config";
import { safeReturnTo } from "@/lib/account-policy";
import { privateHeaders } from "@/lib/account-server";
export async function GET(request:Request){
 const u=new URL(request.url);const code=u.searchParams.get("code");const next=safeReturnTo(u.searchParams.get("next"));
 try{
  const client=await serverSupabase();
  if(client && code){const {data,error}=await client.auth.exchangeCodeForSession(code);if(!error&&data.user){
    const response=NextResponse.redirect(new URL(next,appOrigin()));for(const [k,v]of Object.entries(privateHeaders))response.headers.set(k,v);
    // The code exchange is PKCE protected. Recovery markers are created only by the recovery-confirm route.
    return response;
  }}
 }catch{/* No provider token or private error is sent to logs or redirects. */}
 return NextResponse.redirect(new URL("/login?error=callback",appOrigin()),{headers:privateHeaders});
}
