# AP Human Geography — completed bank audit

Checked October 20, 2026. **748 original MCQs are published across all 68 topics, exactly eleven per topic. Zero withheld; no identified unresolved question errors.** This is assistant/automated validation, not independent human scientific review or an official College Board endorsement.

## Inventory and publication

The seven official units contain 7, 12, 8, 10, 12, 11 and 8 topics; published unit totals are **77, 132, 88, 110, 132, 121 and 88**. Stable topic IDs, question IDs, canonical names and route mappings match the verified inventory in `research/official-topics.json`. Its 68 heading matches and CED SHA256 were checked against the retained source PDF; the fall-2020 framework and June-2026 clarifications were reviewed in this development run.

`pnpm test:geography-complete` is a separate completion gate. It checks all 748 source objects against actual published Practice entries, eleven entries in every topic, all unit/course counts, unique global IDs and the unchanged Chemistry/Calculus totals. All **2,640** questions across the three courses remain available: Chemistry1,001, Calculus891, Geography748. Incremental `test:geography-bank` remains available for future corrections.

## Content and evidence

- JSON structure, four distinct options, one stored answer key, detailed A/B/C/D explanations, current semantic hashes and scope/difficulty/skill/repetition records pass for all 748 items. The session tests exercise all four options of every published question against its stored key; this verifies grading implementation, not the scientific truth of a key by itself.
- **289** explicit numerical, evidence-field or geometry models are corroborated programmatically. The other **459** have recorded conceptual reasoning reviews. Checks include actual denominators, units, totals, directed flows, model assumptions and rendering coordinates. Mutation tests change evidence and refresh its hash, then require the independent evidence checks still to reject it.
- **272 meaningful stimuli (36.36%)**: 123 tables, 51 charts, 18 models, three pyramids and 77 maps (21 choropleth, nine dot, one isoline, 31 reference, 13 flow, two proportional). Every completed topic has four assessed stimuli. All statistics and diagrams are original and explicitly hypothetical; no source image or copyrighted exam question was copied.
- All stimuli render through the real shared renderer in automated checks, with accessible descriptions/equivalent data and axis/legend/geometry checks. Mobile inspection was performed as topic batches were completed; the final eight stimuli and revised material-recovery item were inspected again. Representative desktop light/dark views, keyboard zoom200/reset100, pan/close and retained Practice answers passed.
- Exact normalized stems are unique. A separate lexical Jaccard scan (at least nine distinct stem tokens, threshold0.72, numbers normalized) found no candidate pairs. This is not a semantic-originality guarantee. Scope and repetition reviews also compare the actual task, evidence and explanation rather than relying on that scan alone.
- Final repetition review found the new7.8 aquifer-stock problem too close to1.5. Only the new item was replaced with an industrial virgin/recovered-input substitution task; the original1.5 content was preserved. Its quantities,40% reduction, choices, hashes, explanation and browser grading were revalidated. Earlier browser QA corrected an unconnected station-plan path (6.8) and a split numeric table (7.3); the affected figures were rechecked before checkpointing.
- Answer positions are A196, B183, C184, D185. Keys vary within topics. Difficulty labels are editorial estimates; the bank has not been psychometrically calibrated against an AP exam population. Some foundational conceptual items are deliberately easier than multistep stimulus questions.

## Application and preservation checks

All **195 automated unit tests**, TypeScript and the production build passed. All68 Geography topic pages and topic Practice routes, seven unit scopes and course scope passed. The existing172 Chemistry/Calculus lessons and full91-topic/nine-unit Chemistry publication/Practice regression passed; read-only Calculus structure and mathematical validators also passed all891 questions.

The final two complete browser sessions scored11/11. A separate scoring regression verified wrong-answer feedback, retry without overwriting the first graded answer, Previous/Next selection retention, automatic grading of an unchecked selection on Finish, and unanswered items: the deliberately mixed session scored1/11. The corrected final topic subsequently scored11/11. Course/Unit7 counts748/88 were also verified in the browser.

Semantic preservation against the user's517-question checkpoint `7ed2430` passed for all219 existing question files (including the full Chemistry/Calculus banks),188 prior stimuli and the complete approved resource catalog. Incremental preservation checks also passed each subsequent checkpoint. No notes, watched status, bookmarks, feedback records, course selections or other student storage were edited. Scores remain session-only. The port3000 preview remains available; no public deployment occurred.

## Remaining limits and next phase

No question is currently withheld for a known error or multiple defensible answers. Automated and assistant reasoning cannot guarantee an error-free bank; report corrections using stable `hug-unit-topic-number` IDs. Independent subject review and empirical difficulty testing remain valuable future quality work, not claimed completed here.

The intermittent Next development-preview JSON parse problem remains unresolved. It recurred during Unit6 regression, recovered without restart/data deletion, and is documented in `docs/PREVIEW_STABILITY.md`. The final bounded80-request preview check is recorded separately in `docs/VALIDATION.md`; a successful bounded run does not prove permanent resolution. This is a development-server limitation, not a known question-data error.

After this bank checkpoint is pushed and verified, continue the already-authorized UI/UX and240-topic-summary work in `docs/NEXT_DEVELOPMENT_PHASE.md`. Do not regenerate completed questions, alter approved videos or deploy publicly.
