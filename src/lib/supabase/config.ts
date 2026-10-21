import { publicCloudConfig } from "../account-policy.ts";
export function cloudConfig() { return publicCloudConfig(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY); }
export function appOrigin() { return process.env.APP_ORIGIN || "http://127.0.0.1:3000"; }
export function registrationEnabled() { return process.env.APP_REGISTRATION_ENABLED === "true"; }
