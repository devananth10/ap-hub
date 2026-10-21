# Student accounts implementation plan and checkpoint

## Audit — October 21, 2026

Baseline `7000b47` has a clean working tree. The interrupted run reached the read-only audit; no partial account code or crash log was saved. Shell, dependency installation and repository access work. No competing development run was active. There is no existing database or authentication. Next 16.4 uses `src/proxy.ts` and asynchronous cookies; installed Next authentication, proxy and cookies guides were read before implementation.

Guest study state is `ap-hub:v1`: selected course IDs, topic-key notes/completion, saved official resource IDs, resource-ID:YouTube-ID watched identities, course-scoped instructor preferences and last topic. Theme is `ap-hub:theme`. Practice answers are React reducer state; only the first graded answer contributes to scoring. Feedback is a separate existing server SQLite system. Preserve these and all educational content.

## Ordered milestones

1. Supabase SSR/browser clients, safe missing configuration, normalized schema, RLS/CAS functions and isolated SQL security verification.
2. Authentication routes/forms/callback, account settings/deletion and registration gate. No custom passwords or credentials.
3. Account-isolated study state, durable scoped outbox, revision conflicts, explicit guest import, completed Practice history and personal progress.
4. Mock/SQL/security and regression tests, desktop/mobile checks, owner checklist and draft privacy/retention documents; verified GitHub checkpoint.

Cloud data travels through authenticated, same-origin, bounded Route Handlers and user-scoped Supabase clients. Database RLS is a second enforcement layer. Notes and other mutable records use compare-and-swap revisions, not whole-profile last-writer-wins. Completed attempts have stable IDs and immutable first-attempt results. All unresolved conflicts retain both copies. No account cache is read until its owner is verified; guest data is never silently imported. No public deployment or paid service.

## External dependencies

No Supabase project, credentials, Google OAuth configuration or live authentication/database testing is available. Track exact owner actions and pending live tests in OWNER_SETUP_TODO.md. SQL policies and mocks are not live RLS verification. Registration stays closed by default in the application and must also be disabled at Supabase until review.

Foundation checkpoint: supported @supabase/ssr 0.12.7 and supabase-js 2.118.0 installed. Browser/server clients and Next 16 refresh proxy fail safely without configuration. Normalized tables, canonical ID seeds, private RLS, constrained grants and a user-scoped revision/idempotency RPC are prepared. Five new tests passed, including real isolated PostgreSQL policy/CAS/cascade execution with PGlite and a simulated Supabase auth.uid context. All 203 existing tests, TypeScript, production build and live preview smoke checks passed. This is not hosted Supabase, provider authentication or live RLS verification. Next: authentication routes/UI and account-scoped sync integration.
