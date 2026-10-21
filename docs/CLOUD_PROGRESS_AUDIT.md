# Authenticated progress audit — October 21, 2026

Baseline: `5512ee9`, clean working tree. The owner reports successful real-account creation and sign-in. This audit preserves that account and all existing guest progress. No production DDL, RLS/auth setting changes, account creation, student writes, imports, sign-outs or browser-storage clearing were performed. No credentials or student content were collected for this report.

## Findings and focused fixes

1. **Topic-level Practice results were rejected by `/api/sync`.** The validator called `practiceEntries` with a course/topic but no unit. That is an invalid Practice scope, returning an empty question list and rejecting otherwise valid attempts. The route now derives the unit from the canonical course/topic inventory. It still rejects questions from other topics/courses. Existing failed attempts retain their stable IDs in the outbox; no reimport or replacement is needed. A stalled attempt could also delay later queued changes. Retry from Account after the updated code loads.
2. **Review could change the displayed completed score.** Finishing with unanswered questions, then reviewing/answering them and finishing again, changed the results screen while the saved attempt stayed immutable. The reducer now retains the first finished answers for scoring. Review feedback still works; Start again starts a new attempt. Existing saved scores are untouched.
3. **Practice input could precede account/progress initialization.** The question component previously waited only for its own hydration, while the parent account scope could still change and remount it, resetting early answers. Answer/check/retry and navigation/Finish controls now wait for study readiness. Question text/layout remain available during loading.

All three problems were reproduced with failing tests before their fixes. No other application changes were needed by this audit.

## Save/read paths inspected

| Data | Cloud record / storage | Retrieval and behavior |
|---|---|---|
| Notes | `note` / `student_notes`, canonical course/topic key | Immediate owner-scoped local outbox, 700 ms debounced sync, expected revision/CAS, conflict keeps both versions. UI reports cloud success only after acknowledgement. |
| Course selections | `course` / `course_selections`, canonical course ID | Boolean selections; false records preserve deselection. |
| Topic completion and recent study | `topic` / `topic_progress`; `recent` / `study_preferences` | Completion is separate from videos/scores. Last-studied timestamps feed recent topics. |
| Watched videos | `video` / `video_progress` | Stable resource + actual video identity; Mr. Sinn and Heimler have separate records. |
| Instructor preference | `instructor` / `instructor_preferences` | Canonical Human Geography instructor ID. |
| Saved resources | `saved` / `saved_resources` | Canonical official resource ID and saved/unsaved boolean; no library publication changes. |
| Finished Practice | `attempt` / `practice_attempts` | Stable attempt/mutation UUIDs, original first-graded-answer score, immutable persisted result. Question IDs checked against the published scope. Unfinished answers remain session-only. |
| Dashboard | Projection of the above snapshot/outbox | Separate topic, watched-video and finished-attempt totals; per-course percentages, recent topics and original scores. Dashboard rendering does not write/import progress. |

`/api/sync` checks the current user through server `getUser`, filters snapshot reads by that verified ID, paginates in batches of 500, validates records and returns private/no-store responses. POST's owner field is only an equality guard; database ownership never comes from that input. Ordinary reads/writes use the public client key with the student's session, not a privileged key.

`AuthProvider` revalidates identity, ignores stale requests, and locks/remounts private study state when the account changes. Same-account refreshes retain active study state. Cookie-backed SSR clients, proxy refresh, PKCE callback handling, safe internal redirects, origin checks, recovery proof and logout failure handling were inspected against the installed Next/Supabase integration.

## Hosted checks actually performed (read only)

- Verified the connected audit project matches the app's configured Supabase project.
- Inspected PostgreSQL catalog metadata: **all ten private tables have RLS enabled** and ownership policies use `auth.uid() = user_id` for both visibility and ownership checks.
- Confirmed anonymous SELECT is denied on private tables. Student study-table writes are restricted to the validated RPC; profile writes retain ownership policies/trigger protections.
- Confirmed `study_snapshot` uses `security_invoker=true`.
- Confirmed only authenticated students can execute `save_study_change`; neither anonymous nor authenticated students can execute the internal `apply_study_change` directly. The functions have fixed search paths and derive identity from `auth.uid()`. The internal mutator includes revision, transaction-lock and mutation-replay guards.
- Sent **zero-row anonymous REST reads** to all ten private tables and the snapshot view: **11/11 denied with HTTP 401 and PostgreSQL permission code 42501**. A public Auth-settings request with the same key returned HTTP 200 as a positive control, distinguishing permission denial from a broken key. No student rows were fetched.
- Canonical catalog counts: **7 courses, 251 topics, 319 resources, 319 videos**.
- Read security-advisor results. No recommended changes were applied.

These results verify deployed metadata and anonymous denial, **not a live two-student JWT isolation test**.

## Security-advisor items for review — no changes applied

- **Leaked-password protection is disabled.** Review provider availability/plan constraints and password protections before expanding student access. No authentication settings were changed.
- **`public.rls_auto_enable()` has anonymous/authenticated EXECUTE grants.** This is the provider's `event_trigger` helper with a fixed `pg_catalog` search path, not an ordinary student-data RPC. The advisor flags its definer permissions; this alone does not establish that ordinary callers can run it as a normal function. Review with the project owner/provider. A possible least-privilege proposal, subject to confirming provider automation compatibility, is:

  ```sql
  -- PROPOSAL ONLY. Not executed by this audit.
  revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  ```

- The advisor also flags authenticated EXECUTE on **`save_study_change`** because it is a security-definer function. This entry point is intentional: students have no direct study-table writes, the wrapper validates inputs and the internal mutator derives ownership and enforces CAS. Do not remove the guard or change it to an invoker function merely to silence a warning. Its grants and checks passed metadata inspection and isolated SQL tests; live two-user exercise remains pending.

## Automated verification

- **26 account tests pass** (14 previously, 12 added), including actual React providers/hooks/Practice/dashboard with simulated HTTP and browser storage; real Route Handlers with a mocked SDK; and disposable in-memory PostgreSQL migrations/RLS/CAS tests.
- **204 existing/scoring/content tests pass** (203 previously, one added for immutable review scoring). Content fixtures and original question explanations are unchanged.
- New coverage: all seven study data categories plus instructor preferences across reload/new authenticated sessions and a simulated new browser; guest data never imported on login; independent watched identities; offline refresh/reconnection; typing during a delayed save; committed-but-lost responses with mutation replay; late old-account responses; failed logout and stale identity responses; quota/write errors; dashboard calculations; valid topic/course/all-course attempt scopes; forged owner/extra fields/foreign questions/CSRF denial; 502-record pagination; malformed/failed snapshots and safe errors.
- Isolated PostgreSQL tests apply all four migrations twice, exercise A/B RLS isolation, anonymous denial, forged ownership, stale revisions, idempotency, immutable scores and deletion cascades. All writes/deletions are in that disposable local database, never the hosted project.
- **TypeScript and the production webpack build pass.** Account smoke passes eight account/progress/legal routes plus safe callback failures; the existing smoke suite passes 20 routes, CSS, seven 404s, fixed course themes and home-art randomization. Both test suites finish with zero failures/skips: **230 automated tests total (204 + 26)**.
- The configured preview's anonymous `/api/account` check returns HTTP 200 with cloud configuration recognized and registration disabled. No authenticated student response or credentials were printed.

Mock/simulated transport tests do not establish real email delivery, OAuth, browser session persistence or cross-device success. No authenticated browser was driven through changes on the owner's existing account, and no second disposable student's live credentials were available for the write scenarios.

## Remaining manual acceptance tests

Use **disposable student accounts A/B in separate browser profiles**; do not clear site data or use existing personal notes for destructive/conflict tests. Keep registration/provider settings unchanged unless separately authorized.

1. Sign in to A, save synthetic notes in unused Chemistry/Calculus/Geography topics, choose courses, complete a topic, save a resource, mark separate Mr. Sinn/Heimler videos and change the instructor preference. Wait for **Saved to your account**.
2. Finish a topic Practice set, recording its original score. Review and answer a previously skipped question, then finish again: results/history must retain the original score and one attempt. Start again must create a new attempt.
3. Refresh, sign out, sign back in, then sign in to A in another independent profile. Verify all saved fields and dashboard/history agree. Guest data must remain separate; do not select Import.
4. In B's profile verify A's notes/history/progress are absent. Exercise cross-account REST/RPC ownership checks with two real test-user sessions through a reviewed test harness. Do not run the existing write-based SQL procedure on personal data without review.
5. Edit the same synthetic note as A in two profiles before saving. Verify both versions survive and Account offers conflict resolution. Download a recovery copy before choosing.
6. After loading identity/cloud state, go offline, edit, reconnect and verify one successful save. If a full offline reload cannot verify identity, the app deliberately falls back to guest mode; sign back in as the same account to recover its isolated pending edits. Do not import guest data as a substitute for recovery.
7. Test real expired-session refresh, canceled Google login, recovery-email links and sign-out. Email/OAuth provider behavior and revocation were not proven by mock tests.

Two profiles on `http://127.0.0.1:3000` can exercise account sync on one computer. Physical two-device authenticated testing still requires a trusted private HTTPS origin and separately reviewed origin/redirect configuration. The existing LAN HTTP preview supports guest browsing; this audit did not weaken its account origin protections or configure public access.

Do not call the authenticated system fully verified for student rollout until these live acceptance checks pass. Account deletion remains outside this audit's live test scope. Existing limits (plaintext device-local recovery caches, finite storage, session-only unfinished Practice) remain documented in `ACCOUNTS_VALIDATION.md`.

## Reference guidance

- [Supabase SSR clients and server identity verification](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)
- [Supabase SSR session/cookie guidance](https://supabase.com/docs/guides/auth/server-side/advanced-guide)
- [Supabase changelog](https://supabase.com/changelog): checked for relevant breaking changes. No package replacement or schema upgrade was required for these application fixes.
