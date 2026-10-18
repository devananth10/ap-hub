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

The files are in the local project directory you opened in Codex. Its name has not changed with the brand. Source code lives in `src/`; the existing remote is [devananth10/ap-hub](https://github.com/devananth10/ap-hub). GitHub stores source code; it does not automatically keep a local server running.

Development builds use `.next-preview/`, while production builds use `.next/`. Both are ignored by Git. The development preview can stay open during production validation.

## What works

- Dashboard, selectable course outlines, search, unit/topic navigation, and the primary AP Chemistry example workspace.
- Optional notes, hidden until opened, with local autosave and a notes library.
- Local course selections, official resource bookmark IDs, completion tracking, last topic, and light/dark mode.
- Owner-approved resource cards and an approved-video selector, ready for individually approved URLs. Video frames remain mounted when notes, summaries, or study tabs change. Switching between approved videos pauses the previous player and preserves its frame; returning requires resuming it. Leaving/reloading the topic resets playback.
- Six-bullet **demo** summary from original topic notes; no AI backend or video analysis.
- Eleven approved MCQs for AP Chemistry Topic 1.1, **Moles and Molar Mass**, with answer explanations, a question counter, and Previous/Next navigation. Answers and feedback are retained between questions during the session; no scores or results are saved.
- Topic 1.5 has no published questions; its demonstration was removed at the owner’s request. Its Study Workspace, notes, overview, and summary remain available. Other completed question drafts stay unpublished until reviewed and approved. FRQs and mixed practice are planned.
- Prominent **Start Practice** actions on the dashboard, course cards, course outlines, units, topics, and Study Workspace. The practice page filters by course, unit, and topic; empty scopes explain that questions are coming soon. Practice can be available before a lesson workspace is ready. FRQ and mixed modes are visibly disabled.
- Eight original lightweight SVG designs: chemistry, biology, calculus, physics, computer science, history, geography, and literature. Only the home hero chooses randomly on each fresh load. Course pages and workspaces use their fixed subject artwork. Course cards stay minimal, with soft subject colors, a simple icon, and a faint subject-specific line motif with no glow or fine detail.
- Responsive layouts, keyboard tab navigation, friendly missing-page states, and a warning when local saving fails.

## Official resources: owner approval required

**No external educational resources are currently approved or published.** The previously selected external resources have been removed. Jeremy Krug is the owner's preferred AP Chemistry creator, but no individual video is approved until the owner supplies its exact URL. No playlists are imported.

The empty resource area is intentional. The Topic 1.5 overview, notes, summary, and completion tracking remain usable. Topic 1.1 offers eleven MCQs.

Use [docs/RESOURCE_APPROVAL.md](docs/RESOURCE_APPROVAL.md) for the configuration format and approval process. Edit `src/config/official-resources.json` to add, edit, unpublish, or remove entries. Every published entry needs a stable ID, valid course/unit/topic association, safe URL, and a dated owner approval reference. Draft metadata stays server-side. This is an editorial configuration system; there is no administrator UI or authentication yet.

Student-private resource bookmarks are a future separate collection. Existing saved official IDs are retained locally; withdrawn/unapproved links are not displayed. The application cannot use student browser storage to publish official resources.

## Data stays on this device

The existing internal storage keys are intentionally unchanged by the rename. Notes, selections, completion, saved IDs, and theme remain available at the same browser origin. Clearing site data, changing hostname/port, using another browser/profile, or moving to another device does not carry that local data with you. There is no cloud synchronization or database.

## Run checks

```sh
pnpm typecheck
pnpm test:unit
pnpm build
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

The suite includes 31 unit tests, 19 page-route checks, compiled CSS, seven invalid-route checks, all six fixed course-art mappings, and multiple fresh homepage responses to verify artwork rotation. It also checks question-batch validation, approval gating, draft exclusion, scope isolation, URL/video policy, legacy saved-data compatibility, branding, and absence of unapproved resources. Synthetic test fixtures are never published or fetched from a provider.

Browser checklist:

1. Check PrepAtlas branding, course selection/reload, empty course state, search, and expandable units.
2. Open Chemistry Topic 1.5. Verify the honest empty-video/resource states and that no unapproved iframe or resource link appears.
3. Open notes, write, hide/reopen, and reload. Check the notes library and explicit completion. Keep notes hidden unless opened or following a notes deep link.
4. Open the summary: check the demo disclosure and six bullets. Check that Topic 1.5 practice shows zero questions; test answers in Topic 1.1 instead.
5. Check themes, mobile navigation, keyboard tab controls, and 320/390/768/1440-pixel layouts.
6. Once the owner supplies approved video URLs, test switching videos, playback continuity while using tools, provider restrictions, and the original-link fallback. Actual approved video playback cannot be verified while the catalog is empty.
7. In a disposable browser profile, block localStorage writes and confirm the save warning. Copy important notes before closing any tab where saving fails.
8. Use Start Practice from the dashboard, a course, a unit, and a topic. Check the selected scope. Topic 1.1 has eleven questions: test incorrect/correct answers, Try again, Previous/Next, answer retention, first/last boundaries, and a reload reset. Biology and unimplemented Chemistry topics should show honest empty states, never unrelated questions.
9. Refresh the homepage several times: subjects should vary, although a random draw can repeat. Opening menus or course management must leave that page's art unchanged. Refresh a course page: its artwork must stay subject-specific.

## File guide

- `src/lib/courses.ts`: existing typed course/unit/topic catalog. No additional courses were automatically added.
- `src/lib/lessons.ts`: original per-topic study prompts, sample recaps, and demo practice.
- `src/lib/practice.ts`: validated practice scopes, links, and question selection from the existing catalog.
- `src/content/practice/` and `src/lib/practice-bank.ts`: owner-approved question batches and their validated publication registry. See [docs/PRACTICE.md](docs/PRACTICE.md) for adding more questions and the official Chemistry naming reference.
- `src/lib/artwork.ts` and `src/components/academic-art.tsx`: artwork pool and original SVGs. Each course's `artwork` field selects its fixed theme. Computer science/geography artwork is ready for future courses; those courses have not been added.
- `src/config/official-resources.json`: owner-controlled resource catalog.
- `src/lib/resource-policy.ts`: validation, publishing gate, video parsing, and topic selection.
- `src/lib/official-resources.ts`: server-only catalog loading; only approved entries reach the client.
- `src/lib/study-storage.ts`: preserved local storage schema and keys.
- `src/components/`: reusable navigation, dashboard, outlines, video lessons, study tools, resource cards, and libraries.
- `tests/`: automated policy/storage and HTTP smoke checks.

Homepage artwork is selected on the server after `connection()` and passed as a stable prop. The SVG has a fixed aspect ratio, so hydration does not draw another image or change its size. All eight large illustrations use flat, muted line work and dots without gradients, halos, sparkles, or glossy fills. They retain more subject detail than the small course-card motifs. The artwork has no external image downloads or animations. Randomness never changes study data, resources, notes, or progress. Navigating back may reuse Next.js's cached page; a fresh load/refresh requests a new draw.

## Chemistry content development

The complete official Chemistry outline now contains 91 topics. See [CONTENT_IMPORT_GUIDE.md](CONTENT_IMPORT_GUIDE.md) for exact IDs and the distinction between preserved IDs and newly assigned IDs. The current [progress ledger](content-drafts/chemistry/PROGRESS.md) lists every topic and identifies unavailable historical drafts.

New question sets and video candidates live under `content-drafts/chemistry/` and are not application imports. Validation does not approve or publish them. Run:

```sh
node --experimental-strip-types scripts/check-question-drafts.mjs
node scripts/check-chemistry-science.mjs
node --experimental-strip-types scripts/report-chemistry-progress.mjs
```

The video manifest records creator-index links and public provider metadata, not verified playback or embedding permission. Every discovered video remains pending owner approval. The official catalog is unchanged.

## Troubleshooting

- **Connection refused:** run `pnpm dev` and keep it open. Use the printed local URL; if port 3000 is occupied, identify the existing app before starting another copy. Different ports use separate browser storage.
- **pnpm not found:** install pnpm, then open a new terminal so PATH is refreshed. Codex's bundled pnpm can also be invoked by its full path on this machine.
- **Video area is empty:** waiting for owner-approved exact URLs is expected. Do not add a replacement automatically.
- **An approved video will not play:** use its original link. Provider, school-network, regional, and embedding restrictions remain outside this prototype's control.
- **Windows Turbopack worker failure:** the existing scripts use the supported `--webpack` option.
- **Stale build output:** stop only the affected server, remove only its project-local output directory, and restart. Do not delete student browser storage to fix a build.

No authentication, payments, production database, paid AI API, or real AI summary service is included. All interface artwork, overview prompts, recap examples, and practice text are original. AP is a trademark of College Board, which is not affiliated with this independent prototype.

For commits and pushes to the existing repository, see [CONTRIBUTING.md](CONTRIBUTING.md).

The latest verification results and preview images are listed in [docs/VALIDATION.md](docs/VALIDATION.md).
