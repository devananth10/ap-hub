<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## PrepAtlas milestone workflow

The user wants this app backed up to GitHub at each logical milestone.

- Treat a milestone as a coherent, working improvement, rather than every individual edit.
- Before committing, review the diff and run checks appropriate to the change. For application changes, run `pnpm typecheck`, `pnpm build`, and the existing smoke checks against a running server. Stop any temporary verification server you start, but preserve the user's preview server.
- Commit the milestone with a descriptive message, then push the current branch to its configured GitHub upstream. This is the user's standing preference for work on this app; do not create a timed automation.
- Never commit credentials, local notes/browser storage, `.env` files, dependencies, or generated build output. Inspect newly added files before staging. Keep unrelated user changes out of a milestone commit.
- Use normal pushes. Never force-push, discard work, merge branches, or change repository visibility without explicit authorization.
- Use the `codex/` prefix for new feature branches. Do not create a new branch for routine milestone saves unless the task needs isolation or the user requests one.
- If authentication or access is unavailable, preserve the local work and report that the push is pending. Never claim GitHub is up to date until the remote commit is verified.

## Branding and editorial approval

- The working brand is PrepAtlas. Domain and trademark availability have not been verified. Keep the existing project folder and `devananth10/ap-hub` repository.
- Every official resource normally requires the owner's explicit approval of its exact URL. A preferred creator/channel is not approval of its videos. Exception: the owner's October 18 post-publication master prompt Phase 3.1 explicitly authorized the initial verified Jeremy Krug Chemistry directory collection once. `docs/INITIAL_KRUG_APPROVAL.json` records its 102 unique exact URLs; the duplicate 9.8b alias remains pending. No future imports, other teachers or other subjects are covered.
- The official catalog is `src/config/official-resources.json`. Unapproved or hidden resources never reach student pages. Follow `docs/RESOURCE_APPROVAL.md` and `VIDEO_EDIT_GUIDE.md`; never invent approval records or extend the initial collection authorization to replacement URLs.
- Preserve the legacy browser-storage keys so branding changes do not reset student data. Keep any future student-private resource collection separate from the official catalog.
- Preserve the live development preview at port 3000 during active work. Production output uses `.next`; development uses `.next-preview` so builds do not replace the live preview's files.
- Randomize decorative artwork only on fresh home responses. Use fixed subject artwork on course pages and never randomize educational content or saved student data. Keep incomplete practice modes explicitly labeled and unavailable.
- Use verified College Board unit/topic display names as courses are developed, keeping internal IDs stable for saved data and routes. Do not label PrepAtlas practice questions as official College Board questions.
- Permanent MCQ policy, explicitly authorized 2026-10-19: automatically publish completed and validated original MCQs to the correct Practice topic, without individual approval or waiting for the full course. Applies to Calculus AB, future AP banks, additions, corrections and replacements. Aim for exactly eleven original MCQs per topic unless instructed otherwise. Independently recompute answers, check all options, ambiguity/duplicates, scope, JSON/IDs and explanations; withhold unresolved errors and continue other work. Never claim independent human review. See `docs/PRACTICE.md`.
- After each tested coherent milestone, update the registry/count index and progress, commit, push the existing upstream normally and verify its remote SHA. Keep stable IDs for targeted corrections and preserve unrelated questions/student data. The October 18 Chemistry authorization remains historical provenance; the October 19 policy supersedes older manual-approval/draft-only MCQ instructions. It does not authorize FRQs, third-party questions, video URLs, other educational resources or public website deployment.

- Separate one-time exception, explicitly authorized October 19: the initial verified Flipped Math/The Algebros Version 1 Calculus AB collection. docs/INITIAL_FLIPPED_MATH_APPROVAL.json freezes 81 exact URLs for all 81 AB topics; research is content-drafts/calculus-ab/research/FLIPPED_MATH_V1_VERIFICATION.json. Thirty BC-only lessons and non-video applets are excluded. This does not authorize Version 2, future replacements/imports, other resources or public deployment. Keep uncertain entries unpublished. Preserve all 1,892 published MCQs.

- Human Geography: the owner explicitly authorized one initial verified Mr. Sinn/Heimler collection, superseding the attachment's earlier pending-only instruction. docs/INITIAL_HUMAN_GEOGRAPHY_APPROVAL.json freezes 136 exact URLs (68 per instructor); thirteen unmapped extras remain unpublished. No future collections/replacements or public deployment are authorized. Preserve stable human-geography/topic-u-t IDs, course/topic notes and independent watched identities. The subsequent complete-question-bank master prompt authorizes 748 original MCQs (68 topics × 11) in validated automatically published batches, with 35–40% meaningful geographic stimuli and checked explanations/visuals. See content-drafts/human-geography/PROGRESS.md; do not regenerate existing banks.

## Student accounts and cloud sync — October 21 authorization

The owner authorized Supabase Auth/PostgreSQL accounts and private progress sync, superseding the prototype's earlier no-auth/no-database limitation. Preserve all 2,640 MCQs, 240 summaries, approved videos and legacy guest keys. Missing cloud setup must retain guest functionality. See docs/ACCOUNTS_IMPLEMENTATION.md and OWNER_SETUP_TODO.md. Never invent credentials or claim hosted Auth/RLS/email/OAuth/two-device checks were performed without evidence. Keep application registration false and Supabase signups disabled pending provider and privacy/eligibility review. Do not deploy publicly.

Study mutations use a user-scoped validated CAS RPC; never replace entire accounts with local snapshots. Keep outboxes/account caches isolated by verified owner and preserve both note versions on conflicts. Guest import requires an explicit ownership choice and confirmed cloud receipt, retaining originals. Completed attempts have stable immutable IDs and preserve first-graded-answer scoring; unfinished answers remain session-only. Do not use a service/secret key for ordinary reads/writes. Account deletion requires confirmation and reauthentication. Run pnpm test:accounts and test:accounts:smoke along with existing regression/type/build checks for account changes. Isolated PostgreSQL and mock-backed tests do not certify a live Supabase deployment.
