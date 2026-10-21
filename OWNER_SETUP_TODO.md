# PrepAtlas owner setup — accounts and cloud sync

Status: implementation in progress; no cloud project or live credentials have been configured. Guest studying remains available. Public registration must remain disabled until configuration, age eligibility and privacy review are complete. No public deployment is authorized.

Do not commit `.env.local`, secret/service-role keys, OAuth secrets, passwords or private exports. Do not paste them into chat. The final consolidated steps and live-verification checklist will be expanded during implementation.

- [ ] Create/configure a free Supabase project later, not during the autonomous run.
- [ ] Review student privacy/age eligibility before enabling registration.
- [ ] Apply additive migrations and run cross-user security verification on a disposable test project before real students.
- [ ] Configure email delivery/confirmation/recovery and Google OAuth privately.
- [ ] Test real login, account switching, two-device sync, import, conflicts and deletion. Local mocks/isolated PostgreSQL do not verify hosted behavior.
