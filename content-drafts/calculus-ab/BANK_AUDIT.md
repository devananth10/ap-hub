# Calculus AB bank audit — Unit 1 and Topics 2.1–2.2 checkpoint

Audit date: 2026-10-19. **Partial course bank; not a final full-bank certification.**

## Coverage and publication

The verified current College Board AB inventory is **81 topics across eight units**, giving **891 MCQs at eleven per topic**. The current CED and fall-2026 clarification sources are listed in CURRICULUM_AUDIT.md and research/official-topics.json. Exam-format updates do not expand course content. BC-only topics and official numbering gaps remain excluded.

All **sixteen Unit 1 topics (1.1–1.16) and Topics 2.1–2.2 are complete and published: 198 original MCQs in 18 topics**. There are no additional unpublished question copies or withheld questions in these completed sets. **63 topics and 693 MCQs remain**, starting at **2.3 — Estimating Derivatives of a Function at a Point**, stable ID `topic-2-3`. The full per-topic count/status/route/file ledger is PROGRESS.json. Unfinished topics remain honestly empty in Practice. Unit 1 is complete; Unit 2 is partial.

Publication follows the owner's permanent automatic-MCQ policy of 2026-10-19, superseding the old master prompt's draft-only phase. No independent human review is claimed. This policy does not approve external resources, FRQs or public deployment.

## Validation and answer quality

- Every saved set has eleven unique stable IDs, the existing schema, four distinct options, a valid answer index and a solution with individual A/B/C/D reasons. Actual publication registration and scope counts match the canonical JSON files.
- All 198 questions pass structural validation and hash-bound QA. There are **111 programmatic mathematical/graph/table/domain/theorem-model checks** and **87 separately recorded conceptual reasoning reviews**. MATH_VALIDATION.json distinguishes these methods. Hashes protect against stale edits; they do not independently prove mathematical truth. Derivative-function models corroborate exact algebra with centered differences of the original functions at multiple reviewed inputs; sampling is not a universal symbolic proof.
- Numerical options are compared as values, including supported fractions, radicals and infinity notation. Mutation tests catch alternate equivalent answers, wrong keys, changed inputs, stale diagrams/tables, incorrect domains, root multiplicities, infinite-limit signs, interval brackets and theorem conclusions.
- Exact and number-normalized duplicate prompt reports are empty. This is not proof of zero semantic repetition: common limit/continuity skills intentionally recur in successive official topics. Per-topic QA records scope and variety review. Sets mix foundational work with standard applications and harder cases such as transformed graphs, uncertain finite data, damped oscillation, two joins, domain intersections, negative-end radicals and IVT on an interior subinterval. Difficulty is a qualitative assistant judgment, not student-calibrated AP scoring.
- During development, detected explanation arithmetic mistakes and graph metadata omissions were corrected and revalidated. No known unresolved mathematical error or multiple-correct-answer item remains in these published sets. Automated checks and assistant review cannot guarantee all conceptual claims, originality or difficulty; independent scientific/mathematical review remains valuable.

## Rendering and usability

Original local SVG graph and semantic HTML table sidecars use stable question IDs; no third-party image dependencies were introduced. Graphs include accessible descriptions and explicit endpoints; tables include all paired data. Diagram/table hashes bind them to QA. Mobile graph/table sessions passed at 390×844, and the viewport was reset afterward.

Notation uses conventional Unicode and clear plain text in the existing renderer: parenthesized quotients, superscripts, radicals, limit arrows and intervals. There is no general TeX typesetter or symbolic proof service. Future derivative/integral/slope-field sets must provide compatible notation and actual representations before publication; never insert raw unsupported TeX or refer to missing images.

Completed browser sessions exercised correct grading, all four option explanations, question navigation and 11/11 final scores for the topic sets; the deterministic automated session tests additionally check grading/retries/completion behavior. Scores still persist only for the active session and reset on reload.

## Preservation and application checks

The frozen Chemistry publication check confirms **all 1,001 questions unchanged and published** in their 91 scopes. All existing Krug videos and pending-resource status, video controls, stored notes/bookmarks/watched/completion keys and feedback records were preserved. The new rendering components return nothing for Chemistry questions without sidecars. No student browser storage was cleared or committed.

All **66 unit tests**, TypeScript, the production build, standard route/CSS/artwork smoke and all 81 Calculus Practice/workspace routes and scope counts pass at 198 questions. All 91 Chemistry Practice/workspace routes, video/optional-notes checks, a temporary production-server route check and the 80-request preview stability check also passed at the Unit 1 checkpoint; Chemistry's frozen hashes and all unit tests were rechecked after adding 2.1–2.2. No preview manifest failure recurred in this run; this does not establish a permanent fix for the historical intermittent error. The user's port-3000 preview remains available. Both new Unit 2 browser sessions passed all eleven answers/explanations and final 11/11 scores, including 2.2 at 390×844.

Reviews/reports have a working local SQLite destination. Future public hosting, durable remote persistence and backup configuration remain separately documented in docs/FEEDBACK.md; no hosting readiness is inferred from local success. No feedback rows or public website deployment were created for this bank task.

## Resume

Inspect Git status/log, CHECKPOINTS.md, PROGRESS.json, the CED's Topic 2.3 scope and any newly supplied drafts. Preserve valid completed files. Generate only the missing slots, solve independently, validate each topic, publish passing original MCQs, run appropriate application checks and save verified ordinary GitHub checkpoints. Do not change Chemistry or unapproved resources. Continue the remaining topics in Units 2–8 before claiming the 891-question bank complete or running a final full-course audit.
