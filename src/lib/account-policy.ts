export function publicCloudConfig(url?: string, key?: string) {
  if (!url || !key || /placeholder|your[-_ ]|example/i.test(url + key)) return null;
  try {
    const parsed = new URL(url);
    if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) return null;
    if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && ["127.0.0.1", "localhost"].includes(parsed.hostname))) return null;
    // Reject privileged modern keys and legacy service-role JWTs even when misconfigured.
    if (key.startsWith("sb_secret_")) return null;
    if (key.startsWith("eyJ")) {
      const payload = JSON.parse(atob(key.split(".")[1].replaceAll("-", "+").replaceAll("_", "/")));
      if (payload.role !== "anon") return null;
    } else if (!key.startsWith("sb_publishable_")) return null;
    return { url: parsed.origin, key };
  } catch { return null; }
}
export function safeReturnTo(value: unknown, fallback = "/account") {
  if (typeof value !== "string" || value.length > 1000 || !value.startsWith("/") || value.startsWith("//") || /[\\\r\n\u0000]/.test(value)) return fallback;
  try { const u = new URL(value, "https://prepatlas.invalid"); return u.origin === "https://prepatlas.invalid" && !u.pathname.startsWith("/auth/") && !u.pathname.startsWith("/api/") ? u.pathname + u.search + u.hash : fallback; } catch { return fallback; }
}
export function isSameOrigin(origin: string | null, configured: string) {
  try { return !!origin && new URL(origin).origin === new URL(configured).origin; } catch { return false; }
}
export function validPassword(value: unknown): value is string { return typeof value === "string" && value.length >= 12 && value.length <= 128; }
export function validEmail(value: unknown): value is string { return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
