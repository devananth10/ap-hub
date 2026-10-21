"use client";
import { createBrowserClient } from "@supabase/ssr";
import { cloudConfig } from "./config";
export function browserSupabase() { const config = cloudConfig(); return config ? createBrowserClient(config.url, config.key,{cookieOptions:{path:"/",sameSite:"lax",secure:typeof window!=="undefined"&&window.location.protocol==="https:"}}) : null; }
