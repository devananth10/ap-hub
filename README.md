# PrepAtlas

An existing Next.js, TypeScript, and Tailwind study prototype, renamed to **PrepAtlas**. This is a working brand: domain and trademark availability have not been verified. The project folder and existing GitHub repository remain unchanged.

## Preview the application

From the project folder, with Node.js 22.18 or newer and pnpm installed:

```sh
pnpm install
pnpm dev
```

Open **http://127.0.0.1:3000** in Local Preview or your browser. Keep the development server running. Saving an application file updates the preview automatically; refresh if your browser still shows an older page. Ctrl+C stops the server. A connection-refused message means the server must be started again.

In this Codex-bundled Windows environment, if `pnpm` is not on PATH, run this from the project folder instead:

```powershell
& "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm.cmd" dev
```

The files are in `C:\Users\devan\OneDrive\Documents\ChatGPT\StudyHub` on this computer. Its name has not changed with the brand. Source code lives in `src/`; the existing remote is [devananth10/ap-hub](https://github.com/devananth10/ap-hub). GitHub stores source code; it does not automatically keep a local server running.

Development builds use `.next-preview/`, while production builds use `.next/`. Both are ignored by Git. The development preview can stay open during production validation.

## What works

- Dashboard, selectable course outlines, search, unit/topic navigation, and the primary AP Chemistry example workspace.
- Optional notes, hidden until opened, with local autosave and a notes library.
- Local course selections, official resource bookmark IDs, completion tracking, last topic, and light/dark mode.
- 102 verified Jeremy Krug video lessons across all 91 Chemistry topics under the owner’s one-time approval. Multipart tabs, Previous/Next Video, actual titles and attribution, a single click-to-load player, native fullscreen plus a page shortcut, and Watch on YouTube fallback. Switching videos resets that player; notes, summaries and study tabs keep the selected player mounted.
- Optional local notes in every registered topic workspace. Manual Mark as Watched / Undo persists separately from topic completion and quiz scores. Watched identity follows a video when reordered/moved, but a different video replacement starts unwatched.
- Six-bullet **demo** summary from the existing Topic 1.5 notes; other topics clearly state when no sample summary exists. No AI backend or video analysis.
- **1,001 original AP Chemistry MCQs across all 91 official topics, eleven per topic**, published under the owner's explicit October 18 bulk authorization. Question content, IDs, keys and explanations match the completed checkpoint. No human scientific approval is claimed; see the [publication review](content-drafts/chemistry/PUBLICATION_REVIEW.md).
- One question at a time, Previous/Next, retained selections/feedback, explanations of all four options, and final session scores with review/restart. First graded answers count once; retries are for learning. Finishing grades remaining selections; unanswered questions count as incorrect. Reload, leaving Practice or changing scope resets the session; results are not saved.
- Topic 1.5's demonstration remains removed; its eleven proper original questions are now available. Its Study Workspace, notes, overview and summary remain available. FRQs and mixed practice remain disabled and planned.
- Prominent **Start Practice** actions on the dashboard, course cards, course outlines, units, topics, and Study Workspace. The practice page filters by course, unit, and topic; empty scopes explain that questions are coming soon. Practice can be available before a lesson workspace is ready. FRQ and mixed modes are visibly disabled.
- Eight original lightweight SVG designs: chemistry, biology, calculus, physics, computer science, history, geography, and literature. Only the home hero chooses randomly on each fresh load. Course pages and workspaces use their fixed subject artwork. Course cards stay minimal, with soft subject colors, a simple icon, and a faint subject-specific line motif with no glow or fine detail.
- Responsive layouts, keyboard tab navigation, friendly missing-page states, and a warning when local saving fails.

## Official resources: owner approval required

**The initial verified Jeremy Krug AP Chemistry collection is published:** 103 directory entries represent 102 unique videos covering 91 topics. All 102 unique videos passed current directory/metadata checks and received the owner’s one-time collection authorization. The separate 9.8b entry repeats Part A’s URL and remains pending as a distinct lesson. No replacement was guessed and no playlists were imported. Future unrelated resources still need explicit approval.

Every Chemistry topic has video lessons, optional notes and eleven MCQs in the existing workspace. All 81 Calculus AB topics now have a Flipped Math Version 1 lesson and eleven MCQs. Other subjects retain honest empty states without unrelated Chemistry suggestions. See [VIDEO_EDIT_GUIDE.md](VIDEO_EDIT_GUIDE.md) for editing/reordering/hiding resources, [Chemistry verification](docs/VIDEO_VERIFICATION.md) and [Calculus verification](docs/FLIPPED_MATH_VERIFICATION.md) for authorization boundaries and limitations.

Use [docs/RESOURCE_APPROVAL.md](docs/RESOURCE_APPROVAL.md) for the configuration format and approval process. Edit `src/config/official-resources.json` to add, edit, unpublish, or remove entries. Every published entry needs a stable ID, valid course/unit/topic association, safe URL, and a dated owner approval reference. Draft metadata stays server-side. This is an editorial configuration system; there is no administrator UI or authentication yet.

Student-private resource bookmarks are a future separate collection. Existing saved official IDs are retained locally; withdrawn/unapproved links are not displayed. The application cannot use student browser storage to publish official resources.

## Data stays on this device

The existing internal storage keys are intentionally unchanged by the rename. Notes, selections, completion, saved IDs, and theme remain available at the same browser origin. Clearing site data, changing hostname/port, using another browser/profile, or moving to another device does not carry that local data with you. There is no cloud synchronization or database.

## Run checks

```sh
pnpm typecheck
pnpm test:unit
pnpm build
pnpm test:publication
```

Keep `pnpm dev` running at port 3000 and run `pnpm test` in another terminal. This runs policy/storage tests plus HTTP route/CSS checks. To test the production build separately:

```sh
pnpm start --port 3100
```

Then in a second PowerShell terminal:

```powershell
$env:BASE_URL = 'http://127.0.0.1:3100'
pnpm test
```

The suite includes 154 unit tests, 20 page-route checks, compiled CSS, seven invalid-route checks, all seven fixed course-art mappings and multiple fresh homepage responses to verify artwork rotation. It checks all published answer keys, scoring/navigation, question-batch validation, publication scope/counts, URL/video policy, legacy saved-data compatibility, branding and absence of unapproved resources. Calculus tests include mathematical-model mutations, original graph/table checks, domains and theorem hypotheses. Synthetic test fixtures are never published or fetched from a provider. `pnpm test:publication` additionally verifies all 91 Chemistry topic routes, nine unit routes and the full Chemistry course, plus frozen question hashes and flagged calculations; it needs a running server. `BASE_URL` also selects its production target.

Browser checklist:

1. Check PrepAtlas branding, course selection/reload, empty course state, search, and expandable units.
2. Open Chemistry Topic 1.1 (two videos), Topic 1.2 (one), and Topic 4.5 (four). Test tab order, keyboard arrows/Home/End, Previous/Next Video, titles and attribution. Open Calculus Topic 1.1 for its Flipped Math Version 1 video and eleven MCQs. All 81 Calculus topics are complete; single-video topics intentionally have no lesson tabs.
3. Open notes, write, hide/reopen, and reload. Check the notes library and explicit completion. Keep notes hidden unless opened or following a notes deep link.
4. Open the summary: check the demo disclosure and six bullets. Topic 1.5 now offers eleven proper MCQs, with its former demonstration absent.
5. Check themes, mobile navigation, keyboard tab controls, and 320/390/768/1440-pixel layouts.
6. Select Play, test native fullscreen and its exit, then toggle notes/material tabs without restarting playback. Test Mark as Watched/Undo, refresh and navigation persistence. Provider/browser restrictions may require Watch on YouTube; actual mobile-device fullscreen behavior is not guaranteed.
7. In a disposable browser profile, block localStorage writes and confirm the save warning. Copy important notes before closing any tab where saving fails.
8. Use Start Practice from the dashboard, a course, a unit and a topic. Chemistry has 1,001 questions; every topic has eleven. Test incorrect/correct answers, Try again, Previous/Next, checked and unchecked answer retention, first/last boundaries, Finish practice, final score, Review answers, Start again and reload reset. First graded answers must continue to count after retries; unanswered questions count as incorrect. Biology should show an honest empty state, never unrelated Chemistry questions.
9. Refresh the homepage several times: subjects should vary, although a random draw can repeat. Opening menus or course management must leave that page's art unchanged. Refresh a course page: its artwork must stay subject-specific.

## File guide

- `src/lib/courses.ts`: existing typed course/unit/topic catalog. No additional courses were automatically added.
- `src/lib/lessons.ts`: original per-topic study prompts, sample recaps, and demo practice.
- `src/lib/practice.ts`: server-side question selection. `practice-scope.ts` and `src/config/published-practice-index.json` provide lightweight scope/count helpers to client components. `practice-session.ts` holds session scoring/navigation logic.
- `src/content/practice/` and `src/lib/practice-bank.ts`: original question batches and their validated publication registry. See [docs/PRACTICE.md](docs/PRACTICE.md) for adding more questions and the official Chemistry naming reference.
- `src/lib/artwork.ts` and `src/components/academic-art.tsx`: artwork pool and original SVGs. Each course's `artwork` field selects its fixed theme. Computer science/geography artwork is ready for future courses; those courses have not been added.
- `src/config/official-resources.json`: owner-controlled resource catalog.
- `src/lib/resource-policy.ts`: validation, publishing gate, video parsing, and topic selection.
- `src/lib/official-resources.ts`: server-only catalog loading; only approved entries reach the client.
- `src/lib/study-storage.ts`: preserved local storage schema and keys.
- `src/components/`: reusable navigation, dashboard, outlines, video lessons, study tools, resource cards, and libraries.
- `tests/`: automated policy/storage and HTTP smoke checks.

Homepage artwork is selected on the server after `connection()` and passed as a stable prop. The SVG has a fixed aspect ratio, so hydration does not draw another image or change its size. All eight large illustrations use flat, muted line work and dots without gradients, halos, sparkles, or glossy fills. They retain more subject detail than the small course-card motifs. The artwork has no external image downloads or animations. Randomness never changes study data, resources, notes, or progress. Navigating back may reuse Next.js's cached page; a fresh load/refresh requests a new draw.

## Chemistry content development

The complete official Chemistry outline contains 91 topics, each with eleven published questions (1,001 total, zero withheld). See [CONTENT_IMPORT_GUIDE.md](CONTENT_IMPORT_GUIDE.md) for exact IDs and the distinction between preserved IDs and newly assigned IDs. The [progress ledger](content-drafts/chemistry/PROGRESS.md) lists every topic and identifies unavailable historical sources. The [publication review](content-drafts/chemistry/PUBLICATION_REVIEW.md) records authorization, concern dispositions, preservation and verification limits.

The ninety completed files under `content-drafts/chemistry/pending/` remain unchanged historical source snapshots of the now-published bank. Do not count these copies twice. Other drafts and video candidates are not application imports. Validation alone does not approve or publish future content. Run:

```sh
node --experimental-strip-types scripts/check-question-drafts.mjs
node scripts/check-chemistry-science.mjs
node --experimental-strip-types scripts/audit-chemistry-bank.mjs
node --experimental-strip-types scripts/check-chemistry-publication.mjs
node --experimental-strip-types scripts/report-chemistry-progress.mjs
```

The older research manifest is preserved as historical provenance. The official catalog now contains the initial authorized collection; `KRUG_VERIFICATION.json` records fresh directory/public-metadata checks. Actual playback was spot-checked, not certified for all videos or devices. Future resource approval remains separate from question publication.

## Troubleshooting

- **Connection refused:** run `pnpm dev` and keep it open. Use the printed local URL; if port 3000 is occupied, identify the existing app before starting another copy. Different ports use separate browser storage.
- **pnpm not found:** install pnpm, then open a new terminal so PATH is refreshed. Codex's bundled pnpm can also be invoked by its full path on this machine.
- **Video area is empty:** another course may have no approved resources. Hidden/unapproved videos do not display. Do not add a replacement without approval.
- **An approved video will not play:** use its original link. Provider, school-network, regional, and embedding restrictions remain outside this prototype's control.
- **Windows Turbopack worker failure:** the existing scripts use the supported `--webpack` option.
- **Stale build output:** stop only the affected server, remove only its project-local output directory, and restart. Do not delete student browser storage to fix a build.

Run `pnpm test:workspace` against a running server to check all 172 Chemistry/Calculus topic pages, and `pnpm test:preview` for a bounded 80-request development-stability check. The [preview investigation](docs/PREVIEW_STABILITY.md) records the unresolved intermittent manifest warning; passing tests are not a permanent-fix claim.

AP Calculus AB development follows the verified 81-topic curriculum (891-MCQ target). There are 891 published original MCQs: eleven in all 81 official topics across Units 1–8. No topics or questions remain missing or withheld. Completed, validated original sets are automatically published one topic at a time under the October 19 policy; missing sets remain honestly empty. See [Calculus progress](content-drafts/calculus-ab/PROGRESS.md), [complete bank audit](content-drafts/calculus-ab/BANK_AUDIT.md), [curriculum audit](content-drafts/calculus-ab/CURRICULUM_AUDIT.md) and [QA limitations](content-drafts/calculus-ab/VALIDATION.md). Run `pnpm test:calculus` for saved question/QA checks and `node --experimental-strip-types tests/calculus-smoke.mjs` against the preview for all 81 topic routes. The Chemistry bank and its video records remain unchanged. Calculus now has 81 verified initial Flipped Math Version 1 videos, one per AB topic; see [verification](docs/FLIPPED_MATH_VERIFICATION.md).

Practice scores remain session-only. A safe local history proposal is documented in [development progress](docs/DEVELOPMENT_PROGRESS.md); it has not been implemented.

The footer now includes **Rate PrepAtlas**, and every Practice MCQ has a small red **Report this question** flag, including in the Study Workspace. Both forms save to a real private SQLite database on the local server, outside the repository and browser storage. Reviews default to private; public display requires student opt-in and owner privacy moderation. No genuine public reviews exist yet, so that section stays hidden. Owner commands, storage location, abuse limits and future persistent-hosting setup are in [docs/FEEDBACK.md](docs/FEEDBACK.md).

No authentication, payments, public hosting deployment, paid AI API, or real AI summary service is included. The feedback database is operational for this local Node server; it is not a configured production hosting service. Interface artwork, original overview prompts, recap examples and practice text remain original; the linked videos belong to their creator. AP is a trademark of College Board, which is not affiliated with this independent prototype.

For commits and pushes to the existing repository, see [CONTRIBUTING.md](CONTRIBUTING.md).

The latest verification results and preview images are listed in [docs/VALIDATION.md](docs/VALIDATION.md).

The frozen prepublication [audit report](content-drafts/chemistry/BANK_AUDIT.md) retains preservation evidence and historical review flags; the current publication review records their dispositions. Inventory hashes are checked by default; refresh them with `--write` only after reviewing intentional content changes. No future draft becomes live merely by saving, auditing, committing or pushing it. The current bank was explicitly registered under the owner's bulk authorization. No public website deployment was performed.

The October 19 initial Flipped Math Version 1 AB collection is published under the owner’s one-time authorization, recorded in `docs/INITIAL_FLIPPED_MATH_APPROVAL.json`. It adds 81 unique videos covering all 81 Calculus AB topics while preserving all 102 Krug entries. BC-only lessons and unrelated applets are excluded. Existing shared video/fullscreen/watched/notes/Practice controls are reused; future replacement URLs still require explicit authorization. See `VIDEO_EDIT_GUIDE.md` for targeted corrections.

AP Human Geography is registered with seven units and 68 official topics. All have verified Mr. Sinn and Heimler lessons (136 videos), a saved instructor preference, the shared player/fullscreen/manual watched tools, optional notes and scoped Practice. The initial collection is authorized; thirteen unmapped extras remain unpublished. The course/video checkpoint has zero Human Geography questions; the subsequent question-bank master prompt authorizes a 748-MCQ phase, now in progress. See [Human Geography status](content-drafts/human-geography/PROGRESS.md) and [verification](docs/HUMAN_GEOGRAPHY.md). Run pnpm test:human-geography against the preview.

Human Geography original-question progress is recorded in its tracker. The shared renderer supports original hypothetical maps, charts, population pyramids, model schematics and accessible tables, with enlargement/zoom that preserves answers. See [stimulus schema and QA](docs/GEOGRAPHY_STIMULI.md). Run pnpm test:geography-bank and the course smoke checks before publishing a completed topic.
