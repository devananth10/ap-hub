# Student accounts — local validation and handoff

Implementation is complete for work that does not require owner configuration. Public registration remains closed by default; no Supabase project, Google client, email service, live students, secrets or public deployment were created.

## Architecture and security

- Supported `@supabase/ssr` cookie clients with the installed Next 16 `src/proxy.ts`, async cookie access and verified server `getUser` for every private operation. Proxy refreshes claims and forwards cookies/cache headers. Cookies are SameSite=Lax and Secure for configured HTTPS; ordinary SSR tokens are browser-readable, not falsely described as HttpOnly. Recovery proof is HttpOnly, signed, session-bound and short-lived.
- Missing/invalid public credentials or insecure/noncanonical app origin disable cloud functionality. Guest pages stay usable. Server handlers bound request bodies, validate schemas and same-origin mutations, return no-store private responses, construct callbacks from the configured origin and reject external return paths. Normal reads/writes never use the deletion-only secret key. Requests have timeouts; failures do not erase outboxes.
- Ten private normalized tables have RLS and Auth user cascade ownership; four canonical reference tables contain IDs, not per-student copies of the content bank. The validated `save_study_change` RPC derives `auth.uid()`, rejects invalid inputs and uses an advisory transaction lock plus expected revisions and mutation UUIDs. Students cannot call the internal mutator or bypass CAS with direct study-table writes. The invoker snapshot view retains RLS.
- Notes, course choices, completion, watched identities, instructor preferences, resource bookmarks, recent topic records and completed attempts synchronize through one private boundary. Conflicts preserve both copies. Guest import is explicit, backs up originals and receives a cloud receipt only after acknowledged saves and conflict choices. Equivalent database timestamp formats do not duplicate attempts. Unknown legacy IDs/oversized notes remain local.
- Account switches clear private in-memory/Practice state, abort old workers and load only the verified new owner. Same-account tab notifications do not remount studying. Fresh page outboxes fork the prior account cache, avoiding Duplicate Tab's cloned sessionStorage identity. Prior dirty/recovery copies are retained. Storage failure warns rather than pretending local persistence succeeded.

## Checks actually executed locally

| Check | Result / scope |
|---|---|
| TypeScript and production webpack build | Passed. Initial sandbox EPERM creating generated `.next/server/app/api` resolved by running the ordinary build outside the restricted sandbox. No source/student/preview data was deleted. |
| Existing unit/regression tests | 203 passed; scoring reducer/content/resource/feedback/summary/visual checks retained. |
| New account tests | 14 passed: actual DOM hooks/provider/Practice with simulated browser stores/HTTP, SDK-mocked auth handler, pure boundaries/recovery proofs and isolated PostgreSQL. These are not hosted-provider tests. |
| PostgreSQL migrations and RLS | All four migrations applied twice to an isolated in-memory PGlite PostgreSQL instance with a simulated `auth.users`/`auth.uid()` schema. Actual grants/RLS, forged ownership, A/B isolation, private notes/history reads, forbidden update/delete, anonymous denial, CAS/replay, immutable scores, size/ID boundaries and cascade deletion passed. The prepared hosted SQL procedure was also executed there after substituting disposable IDs. Real Supabase JWT/network/provider execution is still pending. |
| Existing content | Chemistry 1,001/91, Calculus 891/81, Geography 748/68 and all 240 summaries passed their existing structural/scientific/math/geographic/summary gates. Source content and official-resource catalog have no diff from `7000b47`. The original study parser/legacy keys and first-answer reducer also have no diff. |
| Live local routes | Existing 20-route/CSS/404/artwork smoke; eight new account/progress/legal pages; missing configuration/401 guards and callback failure redirects passed. All 172 Chemistry/Calculus lesson routes, 68 Geography lesson/Practice routes and 240 summary routes passed. |
| Browser | Missing-config sign-in/recovery and new progress UI checked at desktop and 390px mobile, light/dark. Course totals corrected to 91/81/68; video totals 102/81/136. Document scroll width equals viewport width at both sizes. Forms have labels/disabled-unavailable controls, native navigation and visible focus styles. Theme/viewport restored. No browser runtime errors observed; development Fast Refresh reload warnings occurred while editing shared modules. No real credentials/authentication were entered. |

Final preview stability passed 80 requests across eight routes at concurrency 3 without retries or new manifest parse errors. Final account and guest route smoke checks also passed. Total automated test count is **217 (203 existing + 14 accounts)**. No runtime browser errors were observed. Never infer live cloud success from these local results or claim the intermittent preview issue permanently fixed.

## Pending owner/live verification

- Supabase project/region/keys, migration application and hosted RLS/JWT/API tests.
- Email delivery/template/verification/recovery, Google consent/provider/redirect setup, real signup/login/logout, expired tokens and reauthentication.
- Real two-device HTTPS sync, provider outages/revocation and confirmed account deletion on disposable accounts.
- Operator/age/privacy/retention review and a provider-side closed signup setting before any public registration.

The complete beginner-friendly checklist, current primary provider/legal links and secret-handling instructions are in **OWNER_SETUP_TODO.md**. These pending items are not marked passed.

## Explicit limits

Unfinished Practice answers remain session-only; only finished immutable attempts persist. Old unsaved scores cannot be recovered. Private outbox/recovery files are device-local plaintext gated by verified owner in the app; shared physical/browser access is not protected by encryption at rest. Recovery copies can accumulate and storage quota failures are reported. Account deletion removes active owned rows and this browser's account copies, not other devices, downloaded exports, separate feedback or provider backups/logs. Provider email limits and free-project pauses apply. Scores are personal learning records, not tamper-proof official assessments. No guarantee of legal compliance, error-free content, external video availability or a permanently fixed intermittent Next preview issue is made.
