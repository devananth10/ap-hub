# PrepAtlas post-publication development

Updated October 18, 2026. Baseline: `cfde6c5`, verified on GitHub main. Clean working tree before this milestone. All 1,001 published Chemistry MCQs remain unchanged; no generation or reimport is needed.

## Baseline and milestones

- Baseline: all 37 unit tests, 19-route smoke checks and all 91 topic Practice routes / nine units / full-course publication checks passed. Existing grading, explanations and session scoring were tested at cfde6c5. Storage keys and notes were not reset.
- Current: course-aware Practice empty states; remove unrelated Chemistry links and misleading Start Practice labels on empty courses.
- Next: verify initial Jeremy Krug directory collection using the owner's one-time authorization, preserve uncertain entries as pending, then video tabs/fullscreen/watched state and full topic workspaces.
- Remaining: video catalog and edit guide; selected-player tabs; native fullscreen and fallback verification; local manual watched status; responsive workspace; preview investigation; comprehensive regression and verified GitHub checkpoints.
- Resource baseline: 103 directory entries, 102 unique video IDs, 91 covered topic numbers, 103 previous successful metadata checks. No videos published at the baseline. New verification counts will be recorded after the directory audit.
- Summaries stay honestly labeled demos; no paid AI, new course question banks or public deployment.

## Score history evaluation (later milestone)

Practice answers and scores currently persist only within the active session. Scope changes, leaving Practice and refreshing reset them. Retries do not replace the first graded answer. No score history is saved.

A later optional local history could use a separate versioned key, e.g. `prepatlas:practice-history:v1`, containing `{version:1, attempts:[{id, completedAt, courseId, unitNumber?, topicId?, questionIds, correct, answered, total}]}`. Save one explicit finished attempt once, cap entries (for example 100), offer a clear-history control, handle storage failures and validate stored IDs/counts. Keep this independent of existing notes/completion and any future cloud sync. This is an evaluated proposal only; not implemented during the video milestone.

## Future roadmap

After the current learning experience is tested: independently reviewed question banks for another AP course, optional local score history, original SAT practice, and an optional tutor using authorized material if funding allows. No SAT platform, paid AI, authentication or analytics system is included here.
