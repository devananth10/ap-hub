# Calculus AB validation and continuation notes

The live progress/count ledger is PROGRESS.json / PROGRESS.md. The official inventory is research/official-topics.json (81 topics, 891-question target). Chemistry content is not part of this generation task and remains frozen.

Structural coverage is recorded separately in VALIDATION.json. MATH_VALIDATION.json lists the questions checked by programmatic models versus recorded conceptual reasoning, with explicit limitations. Both are partial-bank records until every topic is complete; neither is a claim of independent human review.

## Checks and honest limits

- `pnpm test:calculus`: exact schemas, eleven per complete topic, official scope/IDs, answer positions, exact duplicate prompts, complete A/B/C/D explanations, missing dependencies/raw unsupported LaTeX, and per-topic QA semantic hashes. It never treats missing sets as completed questions.
- `scripts/check-calculus-math.mjs`: recomputes supported numerical models from separately transcribed/reviewed prompt data and compares all four actual answer choices for uniqueness. Implicit coefficients 0/±1 need not appear literally. Nontrivial input literals must appear in the prompt. This is not a general symbolic theorem prover or proof that transcribed models always match their prose.
- Conceptual checks are separately reasoned in each QA record, with counterexamples/hypothesis checks where appropriate, and bound to the current question/answer through hashes. Expected-answer matching detects stale changes but is **not** independent mathematical proof. The assistant reviewed all four choices; no independent human reviewer is claimed.
- Each topic QA records scope, variety and repetition review. Exact duplicate detection is automatic; semantic repetition and AP difficulty require judgment. Reusing a core skill within its own topic is intentional, but eleven parameter-swapped clones are not acceptable.
- Conventional Unicode/plain-text math is used in the existing text renderer: division parentheses, superscripts, signs, `lim(x→a)` and fully specified descriptions. No raw TeX commands, missing image references or unsupported graph dependencies are allowed. Topic 1.3 includes actual original, responsive SVG graphs with accessible geometric descriptions in a sidecar keyed by stable question ID (`src/content/practice-figures/calculus-ab.json`). The question schema is unchanged. All graph keys are separately recomputed from the plotted segment data; graph hashes bind each QA record to its original diagram. Tables must give explicit paired data. A general TeX renderer or symbolic proof service is not claimed.
- Publishing means explicit registration in calculus-ab-bank.ts plus the shared count index, after checks under the permanent October 19 policy. No external resource or public website deployment is covered. Reports remain available through the existing flag.

## First checkpoint (Topic 1.1)

Eleven original MCQs were written after confirming CED CHA-1.A scope. Five numerical checks independently recompute secant/local-line or quadratic rates; six reasoning checks examine estimation, zero denominators, units, opposing local rates and limited interval data. Every distractor has an explanation. No preexisting Calculus question/draft file was found in the repository; this does not deny unavailable work elsewhere.

Baseline: clean `5e4f611`, 49 original tests and production build passed; the feedback destination was read back successfully with the existing private verification records intact. Its local SQLite destination is configured and working; future hosting/backup limits remain as documented in docs/FEEDBACK.md. No feedback row was created or edited during this Calculus audit.

After integration: 52 unit tests passed, including curriculum, multibank scoping/counts, numerical-verifier mutation failures and unchanged Chemistry checks. Development smoke checks cover the new Calculus Practice scope plus all 91 Chemistry workspaces and Practice routes. Browser Topic 1.1: every correct answer graded correctly, every explanation contained all four option labels, navigation worked and final score was 11/11 (100%). Existing original tabs and student data were preserved. Build/typecheck results and final GitHub receipt are verified at each milestone; use git log for actual commit IDs.

Continue numerically from the PROGRESS.json nextTopic field. Do not regenerate valid completed files. Correct an error by stable question ID, recompute its QA hash only after reviewing the change, rerun checks and publish the correction normally.

## Topic 1.2 and 1.3 checkpoints

Topic 1.2 adds eleven distinct notation/interpretation questions. Reasoning reviews use explicit counterexamples and domain-side checks, including an endpoint question framed one-sided to avoid differing two-sided-limit conventions. Its checkpoint `3f36c6b` was pushed and remote-verified. All 81 Practice routes and 81 workspace routes, eight unit scopes and the course scope passed their real published counts and honest missing-set states.

Topic 1.3 adds eleven original SVG graphs and eleven limit questions. The separate verifier calculates one-/two-sided heights directly from the plotted piecewise segments, including jumps, holes, domain endpoints, reflection, shifted inputs and a multiple-location task. A graph hash mismatch or changed key fails the check. All eleven graphs rendered and all eleven correct choices graded correctly in a 390×844 browser run, ending 11/11 (100%); desktop layout was visually checked. Axis labels were increased for mobile readability. The coordinate system is checked to include a genuine origin, and accessible descriptions state the full local geometry. This is original question imagery, not an added external resource.

At this checkpoint: 33/891 questions published, 3/81 topics complete, 16 numerical/graph-model checks plus 17 recorded reasoning reviews, no exact duplicate prompts or number-normalized repeated prompt patterns detected. Semantic similarity and difficulty remain reviewed judgments. Fifty-three unit tests, production build/typecheck, preview route/CSS smoke, all Calculus routes and frozen Chemistry publication checks passed. This is a partial-course checkpoint; no full-bank completion is claimed.

## Topic 1.4 checks

Eleven questions include actual accessible HTML tables, scoped row/column headers and original numerical data. Eight estimates are checked by recomputing from the actual nearest paired values and specified side, including a transformed quotient. The checker tests a unique option within the stated QA tolerance, not a theorem that finite samples determine an exact limit. Questions explicitly describe estimates/trend assumptions. Three reasoning items cover formula-backed unbounded growth, rounded-data limitations and lack of data near a distant target (two explicit countermodels). All table sidecars are hashed against QA, so stale data/keys fail checks. No external table/image dependency or question-schema change is introduced.

All eleven tables and questions were exercised in a 390×844 browser session: each rendered its table, every expected choice graded correctly and the final score was 11/11 (100%). The viewport was reset afterward. At 44 questions the unit suite has 54 passing tests; build/typecheck and all Calculus route/count checks passed. Existing reviews/reports and all Chemistry content remain unchanged.
