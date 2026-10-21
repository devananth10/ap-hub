"use client";
import { createBrowserClient } from "@supabase/ssr";
import { cloudConfig } from "./config";
export function browserSupabase() { const config = cloudConfig(); return config ? createBrowserClient(config.url, config.key) : null; }
