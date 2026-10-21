import { publicCloudConfig } from "../account-policy.ts";
function originConfig(){
  const value=process.env.APP_ORIGIN||"http://127.0.0.1:3000";
  try{const u=new URL(value);if(u.username||u.password||u.pathname!=="/"||u.search||u.hash||(u.protocol!=="https:"&&!(u.protocol==="http:"&&["localhost","127.0.0.1"].includes(u.hostname))))return null;return u.origin;}catch{return null;}
}
export function cloudConfig() { return originConfig()?publicCloudConfig(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY):null; }
export function appOrigin() { return originConfig()||"http://127.0.0.1:3000"; }
export function registrationEnabled() { return process.env.APP_REGISTRATION_ENABLED === "true"; }
