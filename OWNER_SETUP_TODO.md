# PrepAtlas — owner setup checklist

Accounts are prepared locally; **no hosted service, credentials, real email delivery or real Google login was tested**. Guest studying works without setup. No public deployment has occurred. Do these steps later at home. You do not need to buy anything.

## 1. Review eligibility and privacy before opening registration

- [ ] Read the draft `/privacy` and `/terms` pages and `docs/STUDENT_DATA_RETENTION.md`. Decide the operator/contact, supported countries/ages, retention periods and any necessary parental/school consent. Obtain qualified review where appropriate; these drafts do not establish legal compliance.
- [ ] Keep `APP_REGISTRATION_ENABLED=false`. In Supabase **Authentication → Sign In / Providers**, also disable **Allow new users to sign up**. App buttons alone cannot prevent direct provider signup. Leave Google disabled until its configuration is ready. Only invited/created test users should be used during closed testing.
- [ ] The Supabase project operator must be able to accept a binding service agreement; do not assume a minor can enter it independently. Supabase's current [terms](https://supabase.com/terms) require authority to enter the agreement, rather than providing an app-wide student age policy.
- [ ] Google independent-account ages vary by country (13 where no exception is listed); school-managed accounts have different rules and may block OAuth. Review [Google's age guidance](https://support.google.com/accounts/answer/1350409). Google sign-in is not proof of eligibility for PrepAtlas.
- [ ] Review the [FTC COPPA guidance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions) for under-13 collection/actual knowledge and consent; the [Department of Education's provider guidance](https://studentprivacy.ed.gov/resources/responsibilities-third-party-service-providers-under-ferpa) if schools/education records become involved; and [EU child-consent guidance](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data/are-there-any-specific-safeguards-data-about-children_en) where relevant. EU consent thresholds vary from 13–16. Determine applicable laws and state/country requirements rather than claiming COPPA/FERPA/GDPR compliance. No birth dates, legal names, schools or phone numbers have been added.

## 2. Create a free Supabase project

- [ ] Visit [Supabase](https://supabase.com/dashboard), create your own account, and create a **Free** organization/project. Choose a region appropriate for your intended students. Save the database password in a password manager, not this repository or chat. Decline upgrades/add-ons.
- [ ] Review current [free-plan limits](https://supabase.com/pricing): at research time, 500 MB database, 50,000 monthly active users, 5 GB egress and two active free projects; projects may pause after a week of inactivity. These can change. Notes/history consume database space; the shared question bank stays in code and is not copied per student. Avoid an upgrade if a cap is reached: keep the pilot small or use guest mode/export until a separately authorized plan is chosen.
- [ ] Use the project's **Connect** dialog / **Settings → API Keys** to find its Project URL and **publishable** key (starts `sb_publishable_`). A legacy `anon` key is supported, but the publishable key is preferred. Both are public client identifiers; RLS and Auth secure the data. Never use a secret/service-role key in a `NEXT_PUBLIC_` variable.

## 3. Configure the local app privately

- [ ] In `C:\Users\devan\OneDrive\Documents\ChatGPT\StudyHub`, copy `.env.example` to `.env.local`. `.env.local` is ignored by Git.
- [ ] Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with the real values. Do not paste them into chat.
- [ ] Keep `APP_ORIGIN=http://127.0.0.1:3000` for the current preview. Always use that exact hostname; `localhost` and `127.0.0.1` are different origins. This value is used for callback construction and same-origin checks, not an untrusted request Host header.
- [ ] Generate a **server-only** `AUTH_FLOW_SECRET` locally with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`, then paste that output directly into `.env.local`. This signs short-lived, session-bound password-recovery proofs; it is not a Supabase password. Do not commit, screenshot or share it. Rotation invalidates outstanding recovery proofs.
- [ ] For self-service deletion, find a Supabase **secret** API key under API Keys and put it only in `SUPABASE_SECRET_KEY`. It bypasses RLS, so keep it server-only. If you leave it blank, ordinary account features still work and the deletion UI honestly reports unavailable. Supabase stores Google credentials in its dashboard; they never belong in Next public variables.
- [ ] Confirm `git status --short` does not show `.env.local`. Never stage credentials. Do not send private exports or notes to GitHub.

## 4. Apply the database migrations

- [ ] Start with a disposable test project before real students. In the Supabase SQL Editor, run these complete files **in order**:
  1. `supabase/migrations/202610210001_student_accounts.sql`
  2. `supabase/migrations/202610210002_catalog.sql`
  3. `supabase/migrations/202610210003_account_hardening.sql`
  4. `supabase/migrations/202610210004_validate_sync_boundary.sql`
- [ ] They are additive/re-runnable; never run a destructive database reset. Alternatively, if you already use the Supabase CLI, link the intended project and use its migration workflow (`supabase db push`) after checking its pending migration list. CLI credentials and database passwords stay private. SQL Editor is sufficient; Docker is not required.
- [ ] Check Table Editor / SQL that the ten private student tables have RLS enabled. Tables are profile, course selections, topic progress, video progress, instructor preferences, notes, saved resource references, study preferences, Practice attempts and import receipts. Foreign keys reference canonical IDs and `auth.users`; deletion cascades private records. Video course/topic context is normalized through `study_videos` and retains the full resource/video watched key.
- [ ] Confirm `anon` has no private reads/writes; `authenticated` has private reads under ownership policies, limited profile writes, and only the validated `save_study_change` RPC for study writes. `apply_study_change` is internal and must not be callable by students. The security-definer RPCs have fixed search paths and derive ownership from `auth.uid()`.

## 5. Enable and test email authentication

- [ ] In Authentication providers, enable email/password; keep **Confirm email** on. Set minimum password length to at least 12 to match new PrepAtlas passwords. Review provider brute-force/rate limits and available password protections; do not disable verification to make a test pass.
- [ ] In **Authentication → URL Configuration**, set Site URL to `http://127.0.0.1:3000`. Add exact allowed redirect URLs:
  - `http://127.0.0.1:3000/auth/callback`
  - `http://127.0.0.1:3000/auth/callback?next=/account`
  - `http://127.0.0.1:3000/auth/callback?next=/reset-password`
  - `http://127.0.0.1:3000/auth/confirm`
  Add further exact local return-path variants if Supabase rejects a tested `next` value. Avoid broad production wildcards. See [redirect configuration](https://supabase.com/docs/guides/auth/redirect-urls).
- [ ] In **Email Templates → Confirm signup**, change the confirmation link to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=/account`.
- [ ] In **Reset Password**, change the recovery link to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`. This dedicated verification route is required for the signed recovery proof. The default implicit/password callback alone does not grant a recovery proof. Set email link tracking off if it rewrites or pre-consumes one-time links.
- [ ] Review [Supabase email delivery limitations](https://supabase.com/docs/guides/auth/auth-smtp). The built-in SMTP currently sends only to project-team addresses and has a very low rate limit (2/hour at research time); it is not a public student email service. Do not add students to the project team to bypass this. For a broader pilot, configure a separately reviewed SMTP provider's free allowance if suitable, or keep registration closed and test with authorized team/test addresses. A production email/domain arrangement is a later owner decision, not a reason to buy anything now.
- [ ] Create/invite two disposable test accounts through the provider while registration is closed. Use distinct private passwords stored in a password manager. Never test deletion on your only real account.

## 6. Configure Google OAuth

- [ ] Use [Supabase's Google guide](https://supabase.com/docs/guides/auth/social-login/auth-google). In Google Cloud Console, create/select a project (no paid APIs/billing needed for this OAuth setup). Under **Google Auth Platform**, configure Branding, Audience, Data Access and Clients; older interfaces call this OAuth consent screen / Credentials.
- [ ] Choose a suitable External/testing audience for a personal pilot, or the correct Workspace audience if applicable. Supply the required operator/support contact privately. Request only basic OpenID/email/profile identity scopes. Add only consenting test users while the app is in Testing. School administrators may restrict access; do not bypass those restrictions.
- [ ] Create an OAuth **Web application** client. Add `http://127.0.0.1:3000` as an authorized JavaScript origin if required by the chosen flow. Use the **exact Supabase provider callback** shown in its Google provider panel as the authorized redirect URI, typically `https://PROJECT_REF.supabase.co/auth/v1/callback` — **not** PrepAtlas's `/auth/callback` here.
- [ ] Copy the Google Client ID and Client Secret into **Supabase → Authentication → Providers → Google**, then enable it. The secret belongs only in Supabase/your password manager, not this repository, `.env.example` or chat. Do not disable nonce/security checks.
- [ ] Supabase's allowed redirect list should include the PrepAtlas callbacks above. After Google returns to Supabase, Supabase returns a PKCE code to `/auth/callback`, which exchanges it and permits only a relative internal return path.
- [ ] Keep the application registration flag false until privacy/eligibility and provider review are complete. Google sign-in can create new accounts, so it is intentionally gated too. When ready for a private test, enable provider signups and set `APP_REGISTRATION_ENABLED=true`, restart locally, then test with the approved test audience. This is **not permission to deploy publicly**.

## 7. Start the local app and verify real flows

- [ ] Open the project folder, run `pnpm install`, then `pnpm dev --port 3000`. If the existing preview is already running, keep it and restart it once intentionally after changing environment variables; do not launch a competing server. Visit [Local Preview](http://127.0.0.1:3000/).
- [ ] Check `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/account` and `/progress`. Missing/invalid config should leave disabled account controls and a usable guest app.
- [ ] With disposable accounts, test signup, email confirmation, failed login, successful login, refresh, logout and a canceled Google flow. Never enter real passwords into chat. Verify callbacks return to the requested internal topic and external `next` URLs cannot redirect elsewhere.
- [ ] Request recovery, use a fresh recovery email, change the password, then confirm the old password fails and other sessions are revoked as the provider permits. Test expired/reused links. Test authenticated password change separately with the current password.
- [ ] In two separate browser profiles, sign in as **A** and **B**. Enter different non-sensitive test notes. A must never read/update/delete B's notes, completion or Practice history, including direct API/RPC requests and forged `owner` fields. Use `supabase/tests/account-isolation.sql` on the disposable project, with the two test user IDs substituted. No hosted RLS test is marked passed yet.
- [ ] As **A** in two profiles/devices, change notes, course selections, completion, watched status and instructor preference. Refresh/return to focus (or wait for the visible-page 60-second refresh). Verify the second client receives them. Different videos/instructors must retain independent watched states.
- [ ] True two-device testing requires a privately reachable **secure origin** (HTTPS, or the localhost exception). The current server binds only to 127.0.0.1; a phone cannot use your PC's loopback address. Do not open router ports or create a public tunnel. After a separate trusted-LAN HTTPS setup (for example a locally trusted development certificate), set `APP_ORIGIN`, Site URL and exact redirects to that private origin and bind the server only on that trusted interface. Trust the development certificate explicitly on the second device; never bypass browser security warnings. No domain purchase is required. Until then, two independent profiles test sync logic, but do not count as verified physical-device access.
- [ ] Edit the same note in both clients before saving. Verify both versions appear in Account, neither is silently discarded, and either choice uses a fresh revision. Download a recovery copy before resolving.
- [ ] Disconnect the network **after identity/cloud data are loaded**, edit a note, reload and reconnect. Confirm pending edits upload once. A full offline identity check fails closed to guest mode; account caches are not exposed without verified identity. Re-sign in to recover that account's pending work. Closed-tab outboxes can be recovered explicitly from Account.
- [ ] Finish Practice after a wrong first answer and correct retry. Confirm the original score is saved once in My progress, survives refresh and reaches the second client. Review/finish again must not create duplicates or change the saved score. Start again creates a new attempt. Unfinished answers are intentionally session-only.

## 8. Test guest import and deletion

- [ ] As a guest, save representative Chemistry, Calculus and Geography notes/completion, individual watched videos and a completed Practice attempt. Sign in to a test account and confirm **nothing imports automatically**.
- [ ] In Account, explicitly confirm that the guest data belongs to this student and select Import. Existing cloud notes must cause a conflict rather than automatic replacement. Unrecognized old IDs/oversized notes remain in the original guest copy. The original `ap-hub:v1` and guest history are retained; an account-scoped recovery copy is made first. Cloud import receipt must appear only after successful saves/conflict resolution.
- [ ] Retry the import/reconnect: attempt IDs must not duplicate. Sign out and sign in as another student: prior account caches/notes must not appear and guest work must not silently import.
- [ ] Download test account progress. Type DELETE and reauthenticate to delete that **disposable** account. Confirm all owned tables cascade-delete and other accounts remain intact. Google deletion requires a fresh Google sign-in within five minutes; email deletion requires the current password.
- [ ] Confirm this browser's account cache clears; guest data is separate. Other devices' local copies, downloaded exports, provider logs/backups and separate existing feedback have distinct retention. Finalize the policy and response process before launch.

## 9. Final launch gate — still pending, no deployment authorization

- [ ] Run `pnpm typecheck`, `pnpm test:unit`, `pnpm test:accounts`, `pnpm test:smoke`, `pnpm test:accounts:smoke` and `pnpm build`. Live smoke checks need the running preview. Local isolated PostgreSQL and mocked SDK tests are useful but do not verify the hosted provider.
- [ ] Finish real email/Google/RLS/two-device/conflict/deletion checks above. Document results with no private data in Git.
- [ ] Review access logs, provider region/DPA, backups, email capacity, incident response, retention/contact details, legal drafts, age/consent enforcement, anti-abuse/CAPTCHA needs and current free limits. CAPTCHA and broad public abuse protections are not a substitute for the closed registration gate.
- [ ] Keep registration closed if any required setup, eligibility or privacy review is incomplete. Public deployment requires a separate explicit request.

All provider/legal links were consulted October 21, 2026. Menu names and free limits can change; follow the linked current primary documentation when configuring.
