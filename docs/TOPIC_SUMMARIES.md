# Original Topic Summaries

The Topic Summary button beside optional notes opens an original, pre-written review. It does not analyze a video, fetch a transcript, call an AI service or change the selected player. The user authorized validated original summaries to publish automatically. This permission does not approve new third-party resources or public deployment.

## Storage and correction

`src/content/topic-summaries/{courseId}.json` holds structured records. Match the exact course ID, stable topic ID, topic number, unit and title in the canonical curriculum JSON. Never change route or browser-storage IDs to fit new content. The target is Chemistry 91 + Calculus AB 81 + Human Geography 68 = 240.

Each review has a 150–250-word body: overview, 3–5 key concepts, an original worked example with steps, misconception and AP application reminder. Optional accessible tables supplement text. Use readable Unicode notation and clear units; do not paste raw LaTeX, HTML or external resource links. Figures/tables must be original and explained in text.

Validate topic scope, scientific/geographic reasoning, mathematical conditions, all numerical statements, ambiguity and originality before publication. A calculation record recomputes an operation using independently supplied operands and expected result, with evidence present in the displayed review. These narrow numerical checks do not prove all prose correct. Store specific reasoning-review notes for conceptual conclusions as well. No independent human review or measured reading-time accuracy is claimed.

After substantive review, set `validation.status` to `validated`, use a truthful check date and seal that exact revision with `summaryHash` from `src/lib/topic-summaries.ts`. Its SHA-256 covers content, mapping, publication state and validation evidence except the hash itself. The seal detects later edits; it is not proof of scientific accuracy. Any edit requires review and a new seal. Draft, pending, duplicate, malformed or changed/unsealed entries are withheld by `getTopicSummary`; unavailable topics show an honest preparation message.

Run `pnpm test:summaries` to validate and update `content-drafts/topic-summaries/PROGRESS.json`. Run the unit tests, TypeScript, build and preview smoke checks before a checkpoint. `node --experimental-strip-types scripts/check-topic-summaries.mjs --complete` intentionally fails until all 240 exist. Never lower the target or mark missing reviews complete.

## Scope verification

Canonical inventories were verified in the existing course audits. The official CEDs were consulted again on 2026-10-21 for scope, not copied for lesson prose:

- [Chemistry](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf)
- [Calculus AB/BC](https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf): use the AB inventory only, excluding BC-only material.
- [Human Geography](https://apcentral.collegeboard.org/media/pdf/ap-human-geography-course-and-exam-description.pdf)

Original summaries are separate from the approved video catalog and all 2,640 published MCQs. Preserve notes, watched identities, selected instructors, saved resources and session scoring. Current counts and next missing topics are recorded in the progress file; work continues in checked batches.
