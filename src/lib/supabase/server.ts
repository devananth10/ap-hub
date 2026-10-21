import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cloudConfig } from "./config";
import { timedFetch } from "./request";
export async function serverSupabase() {
  const config = cloudConfig(); if (!config) return null;
  const jar = await cookies();
  return createServerClient(config.url, config.key, { global:{fetch:timedFetch}, cookies: {
    getAll: () => jar.getAll(),
    setAll(items) { for (const { name, value, options } of items) jar.set(name, value, options); },
  } });
}
