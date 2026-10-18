# PrepAtlas milestone verification

## Unit 3 content checkpoint — October 18, 2026

- Saved twenty complete unpublished sets (220 questions), including all thirteen Unit 3 topics. Topic 1.1 remains the only live bank, with eleven questions. Total complete-file coverage is 231 of the 1,001 target; the bank is unfinished. Recovered partials and unavailable earlier sets are tracked separately.
- All draft structure/ID/count/answer-position checks and implemented numerical/model checks pass. Every pending topic has a scope/QA record; normalized exact duplicate prompts are rejected. Human scientific review and owner approval are still pending.
- TypeScript, production build, all 31 unit tests, and development/production smoke suites passed. Each smoke suite checks 19 routes, CSS, seven 404 cases, six course-art mappings, and home-art rotation. The temporary production server was stopped; the restored background development preview remains on 3000.
- Mobile course outline at 390 pixels with Units 3/9 open wraps long new names without horizontal overflow. Unit 3 practice shows zero, verifying unpublished drafts stay out of the app. Topic 1.1 shows eleven without the removed badge. The browser console was clean and viewport override reset. Existing selections/theme restored after the preview restart.
- The official resource catalog is unchanged and empty. All 103 source-index videos remain suggestions, with provider metadata checked October 17; no playback/embed approval is inferred.
- Detailed verification and exact next work are in [the content checkpoint](../content-drafts/chemistry/VALIDATION.md) and [progress ledger](../content-drafts/chemistry/PROGRESS.md). Git checkpoints remain local under the handoff's no-push restriction.

## Current curriculum and question checkpoint — October 17, 2026

- Topic 1.1 now has exactly eleven questions: original 001–010 preserved, plus the owner-requested independently recalculated 011. Topic 1.5 demo deleted; its workspace remains, published count zero. Owner-approval question badges removed for every question.
- All 91 official Chemistry topics registered using verified display names. Seventeen existing topic IDs retained, 74 new mappings documented. Other course data and legacy storage remain unchanged.
- Three recovered complete banks were audited into unpublished working files (33 questions). Historical source text remains unchanged; unavailable sets/fragments are recorded in the progress ledger.
- Creator-index research contains 103 exact YouTube links covering 91 topics. All public metadata checks succeeded and matched Jeremy Krug; actual playback/embedding permission was not tested. Every link remains pending approval. Official resource catalog SHA-256 remains `3544CEB6D9770BA4A72E429A8A73EEC3313C482365C4B8C35784F3709E4A0571`.
- TypeScript, production build, and all 31 unit tests passed. Live preview smoke checks passed 19 routes, CSS, seven 404s, all six course themes, and artwork rotation (8 themes in 12 fresh responses).
- Browser: eleven-question counter; correct/incorrect feedback; Try again; Previous/Next answer retention; first/last boundaries; new question 011 correct response; reload reset; optional notes; six-bullet summary disclosure; Topic 1.5 Practice 0 empty state. No student notes/completion were edited. No console warnings/errors observed.
- Responsive checks at 390 and 1440 pixels showed no horizontal overflow. Preview screenshots below now show the current eleven-question bank without the badge. Viewport override was reset after testing.
- Development preview remains on port 3000. No pending questions/videos were registered. The continuation restricts Git saves to local checkpoints; no push/deployment was authorized in this content task.

Earlier entries below document historical states; the ten-question/demo counts in those entries are superseded by this checkpoint.

## Earlier Topic 1.1 practice set — October 17, 2026

- Added the owner's ten approved questions, mapping the incoming topic ID to the existing `moles` route. No question text, options, answer indexes, or explanations were changed.
- Verified AP Chemistry's nine unit names and 17 existing topic display titles against the official College Board course description. Internal IDs, existing storage keys, and other course outlines were preserved. The naming reference and future batch workflow are documented in [PRACTICE.md](PRACTICE.md).
- TypeScript and the Webpack production build passed. All 29 unit tests passed, including malformed-batch rejection, question-scope isolation, practice independent of lesson readiness, and official title checks.
- Production HTTP checks passed for 19 app routes, compiled CSS, seven invalid paths, six fixed course-art mappings, and 12 fresh home responses. Existing resource approval and saved-data compatibility checks still passed. No external resources were added.
- Browser checks reached all ten questions; verified incorrect/correct feedback, Try again, Previous/Next, retained answers and feedback, and disabled navigation at the first/last question. Reload cleared the answers. Switching to Topic 1.5 showed the separate one-question demo, and its workspace Start Practice button still selected the practice tab.
- Topic 1.1's topic page and course outline correctly distinguished available practice from the planned lesson workspace. Course/unit/topic names, counts, and links matched the selected scope.
- Inspected desktop at 1440 pixels and mobile at 390 pixels. Mobile answer options wrapped cleanly, navigation worked, and there was no horizontal overflow. No browser console errors or warnings were observed. No personal notes or completion values were edited.
- The development preview remained running on port 3000 during production checks. The temporary production verification server used port 3100.

Practice remains unscored and session-only. Refreshing, leaving practice, or changing scope resets question answers; existing local notes and completion behavior is unchanged. FRQ/mixed modes, the Topic 1.1 lesson workspace, real AI summaries, and exact owner-approved videos remain unfinished.

![Topic 1.1 question set](../artifacts/prepatlas-topic-1-1.jpg)

[Mobile practice preview](../artifacts/prepatlas-topic-1-1-mobile.jpg)

## Earlier layout and artwork milestone

Verified October 17, 2026, for the practice navigation and academic artwork milestone, building on the existing prototype.

Follow-up: simplified every subject card to its original soft color background, category label, and single subject icon, then added a faint, low-detail subject motif at the owner's request. These small SVGs use only a few plain strokes with no gradients, glow, or animation. The home hero and course/workspace illustrations remain unchanged. Updated the dashboard screenshot after checking Local Preview; TypeScript, production build, and the existing automated suite passed again.

Latest artwork refinement: removed gradients, halos, sparkle marks, background grids, and excess detail from all eight large illustrations. They now use flat muted strokes and small dots, with more detail than course-card motifs. The shared artwork component keeps course/workspace art consistent too; card art and rotation behavior were not changed. Local Preview was visually checked, and TypeScript, production build, and all existing tests passed. The dashboard image below reflects this flatter style; the other screenshots document the earlier layout milestone.

## Automated checks

- TypeScript check: passed.
- Final production build with Webpack: passed.
- 26 unit tests: passed. The existing 20 approval/storage checks remain, plus six checks for practice scopes, isolation of unavailable questions, catalog-wide practice destinations, the artwork pool, and fixed subject mappings.
- Production HTTP checks: 17 page routes, compiled CSS, seven 404 paths, six fixed course themes, and 12 fresh home responses passed. The randomization run observed seven distinct academic themes. Checks also verify PrepAtlas branding and absence of withdrawn/draft URLs and unapproved embeds.
- Development preview: HTTP 200 at `http://127.0.0.1:3000`, still serving PrepAtlas after production validation. The temporary production test server used port 3100.

## Browser checks for this milestone

- PrepAtlas navigation and page titles displayed correctly; existing course choices and theme loaded from the original browser data.
- The empty video/resource states explained that exact owner-approved URLs are pending. No iframe or unapproved educational resource link was shown.
- Existing notes, completion, course selections, and bookmark storage code was preserved; compatibility remains covered by the existing unit tests. Notes opened alongside practice and summaries. No student notes or completion values were edited in this milestone's browser checks.
- Dashboard, course-card, unit, and topic links opened the correct practice scope. Course/unit/topic dropdowns worked. Biology showed an honest empty state. FRQ and mixed controls were disabled.
- The workspace Start Practice button selected and focused the practice panel. The original demo MCQ gave correct feedback on the practice page and retained a selected answer when switching workspace tabs.
- The summary showed six bullets and explicit demonstration/no-video-analysis disclosures.
- Mobile menu opened/closed, and mobile workspace/practice controls worked.
- Desktop, tablet, and mobile layouts were inspected at 320, 390, 768, and 1440 viewport settings. Checked narrow home/workspace/practice layouts and tablet practice showed no horizontal overflow.
- Fresh browser reloads showed history, geography, chemistry, and calculus artwork. Menu interactions and light/dark toggles preserved the current home illustration. Biology artwork stayed biology after reload. All six course-art mappings were verified through automated HTTP and unit checks.
- Light and dark modes worked. The saved theme preference was restored after checks.
- No browser console errors or warnings were observed in the final check.

## Limits and pending work

The official catalog is empty. Actual Jeremy Krug playback, provider-specific embedding permission, switching between real approved videos, and bookmarking a newly approved card must be checked after the owner supplies exact approved URLs. No real or synthetic video was published to perform this milestone's tests. Synthetic policy fixtures are unit-test data only and never fetched.

An authenticated administration dashboard, student-private bookmark editor, real AI summaries/transcript processing, a fuller original MCQ/FRQ bank, accounts, payments, database, and domain/trademark verification remain future work. Browser storage-denial behavior remains in the documented manual checklist and was not simulated during this run.

## Updated previews

![PrepAtlas dashboard](../artifacts/prepatlas-dashboard.jpg)

![PrepAtlas study workspace](../artifacts/prepatlas-workspace.jpg)

![PrepAtlas mobile workspace](../artifacts/prepatlas-mobile.jpg)

![PrepAtlas practice](../artifacts/prepatlas-practice.jpg)

![PrepAtlas mobile practice](../artifacts/prepatlas-practice-mobile.jpg)
