import { NextResponse } from "next/server";
import { isSameOrigin } from "./account-policy";
import { appOrigin } from "./supabase/config";
import { serverSupabase } from "./supabase/server";
export const privateHeaders = { "Cache-Control":"private, no-store, no-cache, max-age=0", "Pragma":"no-cache", "Expires":"0", "Vary":"Cookie", "X-Content-Type-Options":"nosniff", "Referrer-Policy":"no-referrer" };
export function json(body: unknown, status=200) { return NextResponse.json(body,{status,headers:privateHeaders}); }
export async function body(request: Request, limit=420000) {
  if(!isSameOrigin(request.headers.get("origin"),appOrigin()) || !request.headers.get("content-type")?.startsWith("application/json")) throw new Error("origin");
  if(Number(request.headers.get("content-length"))>limit) throw new Error("size");
  const reader=request.body?.getReader();if(!reader)throw new Error("body");
  const chunks:Uint8Array[]=[];let size=0;
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new Error("size");}chunks.push(value);}
  const combined=new Uint8Array(size);let at=0;for(const c of chunks){combined.set(c,at);at+=c.length;}
  const value=JSON.parse(new TextDecoder().decode(combined));
  if(!value || typeof value!=="object" || Array.isArray(value))throw new Error("body");return value as Record<string,unknown>;
}
export async function authenticated() {
  const client=await serverSupabase();if(!client)return null;
  const {data,error}=await client.auth.getUser();
  return !error && data.user ? {client,user:data.user} : null;
}
