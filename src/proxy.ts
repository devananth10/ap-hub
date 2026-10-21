import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { cloudConfig } from "./lib/supabase/config";
import { timedFetch } from "./lib/supabase/request";
export async function proxy(request: NextRequest) {
  const config = cloudConfig();
  if (!config) return NextResponse.next();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.key, { global:{fetch:timedFetch}, cookies: {
    getAll: () => request.cookies.getAll(),
    setAll(items, headers) {
      for (const { name, value } of items) request.cookies.set(name, value);
      response = NextResponse.next({ request });
      for (const { name, value, options } of items) response.cookies.set(name, value, options);
      if (headers) for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
    },
  } });
  // Refresh only. Every private operation separately verifies the user at Supabase.
  try { await supabase.auth.getClaims(); } catch { /* Guest pages remain available during outages. */ }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
