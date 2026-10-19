# PrepAtlas post-publication development

Updated October 18, 2026. Baseline: `cfde6c5`, verified on GitHub main. Clean working tree before this milestone. All 1,001 published Chemistry MCQs remain unchanged; no generation or reimport is needed.

## Current milestone and checks

Implementation and regression verification are complete within the documented browser/provider limits. No question-bank files were changed. The final checkpoint is the Git commit containing this tracker; resolve its exact SHA with `git log -1 --format=%H`. After pushing, `tmp/postpublication-push.json` stores the local verification receipt with exact local/remote SHAs (ignored by Git). The final user report also records the verified commit.

| Milestone | Status |
| --- | --- |
| Baseline protection | Complete: clean cfde6c5 matched GitHub; original 37 tests, 19 routes and all 91 Practice topic scopes passed. |
| Course-aware Practice fix | Complete: tested and pushed as `90c0968942c74db6e0d74578358fd0ece44a1ddc`; no unrelated Chemistry recommendation or zero-question Start Practice on empty courses. |
| Initial Krug collection | Complete: 103 directory entries, 102 unique IDs; all 102 verified/approved/published; 91 topics covered. One duplicate 9.8b alias remains pending as a separate lesson. |
| Video tabs | Complete: one selected player, accurate part labels, actual title/creator, count, previous/next, four-part and keyboard checks. No autoplay on selection. |
| Fullscreen | Implemented with native YouTube permission plus page shortcut/fallback. Desktop shortcut entry/exit and native entry/exit at 390px verified. Escape through the in-app browser did not exit provider fullscreen; native exit worked. Physical mobile platforms remain untested. |
| Watched tracking | Complete: manual Mark/Undo, local refresh/navigation persistence, resource+video identity. Separate from notes, bookmarks, topic completion and session scores. |
| Study Workspace | Complete: all 91 Chemistry workspaces include videos, counts, optional notes, scoped Practice and unit navigation. Other courses show honest empty states. |
| Notes | Existing keys/content preserved; hidden by default, Show/Hide, autosave/reload verified with temporary test text restored. Player remained mounted during toggles. |
| Video corrections | Complete: centralized catalog, visibility/order/part/provenance validation and VIDEO_EDIT_GUIDE.md. New URLs still need explicit approval. |
| Preview investigation | Complete investigation, root cause unconfirmed. One dev-server tree; separate outputs. Eighty concurrent-request regression passed during a production build without retries/new manifest errors. See PREVIEW_STABILITY.md. |
| Final regression | TypeScript, 41 unit tests, production build, scientific/hash preservation checks, 20-route smoke and all 91 Practice + 91 workspace routes passed on development and production. Temporary production server stopped; preview 3000 preserved. |

Browser verification also completed an integrated Topic 1.1 quiz: eleven correct answers yielded 11/11 (100%), followed by restart. Correct/incorrect explanations worked. Zero/one/multiple-video states, four-part Home/End navigation, tab/next controls, narrow notes and 390/768px width checks passed. Current captured app warnings/errors during browser checks: none. Light/dark styling and academic artwork remain in place; no redesign or new courses were generated.

Published question count: **1,001 unchanged / 91 topics / eleven each**. Question IDs, keys and explanations match frozen hashes. No videos were downloaded or rehosted. No public deployment, paid AI, authentication, admin UI, SAT platform or score analytics was added.

## Remaining issues and next exact task

- No missing implementation milestone blocks use of the initial collection. Normal future URL/resource approval remains required outside the recorded one-time collection.
- Topic 9.8b needs a distinct owner-approved URL if a separate Part B is desired. Current verified Part A is published once; no guess is substituted.
- Intermittent development-manifest parse warnings remain unproven: preserve precise logs/edit timing on recurrence. Do not claim a permanent fix, clear active outputs, or delete student data.
- Browser/provider/device fullscreen restrictions vary; use native exit or Watch on YouTube when needed. Physical iOS/Android fullscreen and universal playback across all 102 videos are not certified.
- Only pre-existing Topic 1.5 has detailed original overview/summary text. Other workspaces explicitly show a general study plan and an unavailable-summary notice, not an invented lecture summary.
- Next separate task: choose whether to supply a corrected 9.8b URL, investigate a reproducible preview warning, or implement the optional local score history proposal below. Do not regenerate Chemistry questions or silently expand resource approval.

## Score history evaluation (later milestone)

Practice answers and scores currently persist only within the active session. Scope changes, leaving Practice and refreshing reset them. Retries do not replace the first graded answer. No score history is saved.

A later optional local history could use a separate versioned key, e.g. `prepatlas:practice-history:v1`, containing `{version:1, attempts:[{id, completedAt, courseId, unitNumber?, topicId?, questionIds, correct, answered, total}]}`. Save one explicit finished attempt once, cap entries (for example 100), offer a clear-history control, handle storage failures and validate stored IDs/counts. Keep this independent of existing notes/completion and any future cloud sync. This is an evaluated proposal only; not implemented during the video milestone.

## Future roadmap

### Ratings and question reports completed

Added an optional footer rating dialog and a small current-question reporting flag shared by the Practice page and Study Workspace. Real server-side SQLite saves reviews/reports separately. Reviews are private by default, with opt-in and owner-only CLI moderation required for public excerpts. Reports attach stable IDs and canonical curriculum context and have new/reviewed/resolved status. Neither submission changes the question bank or student study data. Privacy, server limits, owner commands, storage/backup requirements and future hosting limits are documented in FEEDBACK.md. Full results are in VALIDATION.md (49 unit tests, build, live/production routes, isolated moderation checks and browser preservation checks). No genuine public reviews yet; no placeholder testimonials.

This completes the feedback milestone, not a public deployment. Practice scores remain session-only; the previous local-history proposal is still deferred. The 9.8b alias remains pending and the earlier intermittent preview root cause remains unproven. The next task should be chosen independently; do not regenerate the Chemistry bank or expand educational resource approval.

After the current learning experience is tested: independently reviewed question banks for another AP course, optional local score history, original SAT practice, and an optional tutor using authorized material if funding allows. No SAT platform, paid AI, authentication or analytics system is included here.
