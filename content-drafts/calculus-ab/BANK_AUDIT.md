# AP Calculus AB complete-bank audit

Audit date: 2026-10-19. This records automated checks and assistant mathematical review, not independent human approval or a guarantee that every question is error-free.

## Coverage and publication

**891 original MCQs are validated, registered and published across all 81 official AP Calculus AB topics: exactly 11 per topic. Missing topics: 0. Withheld questions: 0. Known unresolved mathematical errors or multiple-correct-answer questions: 0.** PROGRESS.json contains every stable topic ID, route, file and count. The permanent October 19 automatic-MCQ policy authorizes publication inside Practice; it does not authorize public deployment.

| Unit | Topics | Published MCQs |
| --- | ---: | ---: |
| 1 | 16 | 176 |
| 2 | 10 | 110 |
| 3 | 6 | 66 |
| 4 | 7 | 77 |
| 5 | 12 | 132 |
| 6 | 11 | 121 |
| 7 | 7 | 77 |
| 8 | 12 | 132 |
| Total | 81 | 891 |

The inventory and display names match the current College Board course framework and the verified internal registry. Sources and fall-2026 clarification notes are in CURRICULUM_AUDIT.md and research/official-topics.json. The current [College Board CED](https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf) was consulted again for Units 7–8. BC-only 6.11–6.13, 7.5, 7.9, 8.13 and Units 9–10 are excluded. No shells, Euler steps, logistic modeling or BC-only assessed method is required. Logarithmic primitives used in area questions are verified by differentiation rather than requiring integration by parts.

## Mathematical and structural validation

Every canonical question has four distinct options, a stable unique ID, a valid zero-based key and detailed A/B/C/D explanations. The scope registry and count index match the actual files. Every topic has hash-bound QA with scope, variety and repetition reviews; diagrams and tables are separately bound to their reviews.

All 891 questions pass the complete structural/math suite: **508 programmatic corroborations and 383 recorded reasoning reviews**. Methods include original-function derivative differences, definite-integral quadrature, factor/root/domain partitions, theorem hypotheses, actual graph/table data, complete extrema candidates, implicit derivatives, differential residuals, varied-constant separated families, calibrated exponential models, slope segments, clipped signed/unsigned areas and cross-sectional geometry. See MATH_VALIDATION.json for per-question methods.

Exact reasoning separately checks equations, coefficients, signs, units, endpoints, domains, real branches, constant solutions lost during division, interval-wide boundary ordering, all relevant intersections, radius/diameter and leg/hypotenuse factors. Programmatic models corroborate independently transcribed mathematical data; they are not a general prose parser or symbolic proof service. Finite sampling and Simpson quadrature are not universal proofs. A specific 0.0001 tolerance is documented for the nonsmooth square-root endpoint in 8.4-010; its exact primitive establishes the result.

Mutation tests reject wrong keys, equivalent competing answers, stale graphs/tables, changed inputs, missing initial conditions, lost area normalization, incorrect domains, root multiplicities, reversed radii, squared thickness in place of squared-radius subtraction and insufficient varied family constants. An encountered parser shortcut for a leading scalar in a symbolic option was corrected with an explicit expression model and regression protection. Draft distractor arithmetic/rationale mismatches were corrected and revalidated before checkpoints; existing baseline keys were preserved.

## Originality, repetition and difficulty limitations

Exact duplicate prompt checks are empty. The number-normalized report retains one pair, calc-ab-6-10-002 and calc-ab-6-10-006: x-weighted polynomial-division remainder leads to a logarithm, while a constant remainder leads to a scaled inverse tangent. Their algebra and method choices differ, so both are retained with this recorded review.

Per-topic sets mix interpretation, direct calculations, data/graph work, applications, error diagnosis and more involved domain/parameter reasoning. Related official topics intentionally revisit common skills and sometimes share a base geometry to test different cross-sectional shapes. No automated check guarantees perfect originality, absence of all semantic similarity or calibrated AP exam difficulty. These are original assistant-authored questions; no independent human review or College Board endorsement is claimed. Further human mathematical/editorial review remains valuable.

## Rendering and Practice verification

The bank has **60 original local SVG sidecars and 57 structured table sidecars**, with accessible descriptions and stable question IDs. The renderer supports actual finite slope-field segments, curve/region titles and captions, and existing explicit graph endpoints. Slope segments preserve coordinate dy/dx under unequal screen scales. Two-curve models form actual gaps and split crossings before taking magnitudes. Known-section models square the actual piecewise-linear width before integration. No third-party diagrams or unsupported raw TeX were introduced; notation uses readable Unicode/plain-text integrals and bounds.

Every newly completed topic 7.3–8.12 (17 official topics) passed a full eleven-question browser session: correct answers, individual A/B/C/D explanations, navigation and final 11/11 scores. Several were tested at 390×844, including the final 8.12 set; viewport was reset. Representative first questions in every Unit 1–8 passed grading, all four explanations and checked-answer retention through Next/Previous navigation. Mobile error/retry/finish checks correctly rejected a wrong answer, retained its first-grade result after retry, graded a selected unchecked final question at finish and ended 10/11 as expected.

Testing reproduced a pre-hydration radio selection appearing checked before controlled state was ready. Practice now disables answers until its React handlers are mounted; initial HTML readiness is checked by HTTP smoke. Immediate selection then passed across all eight units. This addresses the reproduced first-selection race, not every possible preview failure.

Scores remain active-session only and reset on reload. No score-history persistence was added.

## Application and preservation checks

The final checkpoint passes:

- Full Calculus structural and mathematical validation, all 81 topic counts and registry scopes.
- All **109 automated unit tests**, including Practice sessions, question-bank mutations, resource policies, video state and local feedback.
- TypeScript and the production build, with development output isolated from production output.
- Standard 20 routes, compiled CSS, seven invalid-route cases, fixed subject art and fresh-home artwork rotation.
- All 81 Calculus Practice and topic routes, eight unit scopes and the full 891-question course scope.
- Frozen Chemistry publication checks: all **1,001 questions unchanged and published**, all 91 topic scopes, nine units and course scope.
- All 91 Chemistry topic/video/optional-note/tab/Practice workspace checks.
- Eighty preview requests across eight routes at concurrency three, with no retries or new manifest parse errors.

All 1,705 baseline question objects at a2f9c28 (704 Calculus plus 1,001 Chemistry), previous diagram/table entries and all official resource records are preserved. The 102 Jeremy Krug videos, video tabs/fullscreen/watched controls, legacy storage keys, notes, bookmarks, topic completion and feedback systems remain intact. No student browser storage was cleared or committed, and no feedback submissions were created by these checks.

The historical intermittent Next manifest failure did not recur in final stability checks; no permanent fix for that distinct issue is claimed. The live preview remains on port 3000. No public deployment, authentication, payment, paid AI or production database was added.

## Next authorized phase

First commit and verify this complete-bank milestone on devananth10/ap-hub. Then proceed automatically to the user's Flipped Math Version 1 AB video assignment. Do not regenerate or republish this completed bank. The October 19 attached master prompt grants one-time approval of the initial verified Version 1 collection only; future URLs, other creators/resources and public deployment remain outside that exception. Research official lesson mappings and provider metadata, exclude BC-only material, keep uncertain entries pending, preserve all Krug records and reuse the existing player. Record exact URL provenance and counts before publication. The question-bank audit does not certify any not-yet-researched videos.
