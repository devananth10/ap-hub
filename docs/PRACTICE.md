# PrepAtlas practice questions

## Current published content

On 2026-10-18 the owner explicitly authorized bulk publication of the completed AP Chemistry bank after automated checks, overriding earlier individual manual-approval requirements for these existing questions. **All 91 topics now have eleven published MCQs: 1,001 total, zero withheld.** No human scientific approval is claimed. See [PUBLICATION_REVIEW.md](../content-drafts/chemistry/PUBLICATION_REVIEW.md) for authorization, decisions on flagged concerns, checks and limitations. No public deployment was performed.

Topic 1.1 — Moles and Molar Mass — contains exactly eleven MCQs. The owner supplied and approved 001–010 on 2026-10-17, then explicitly requested one separately validated original addition, 011. The original ten questions, answers, explanations, and IDs are preserved. Only the incoming historical topicId `moles-and-molar-mass` was translated to the existing `moles` route. See `content-drafts/chemistry/qa/topic-1-1.md`.

The Topic 1.5 demonstration remains removed, not relocated. Its proper eleven-question set is now published. Its topic page, Study Workspace, notes, overview, summary, completion state and resource approval controls remain.

## Names, IDs, and unavailable source files

All 91 Chemistry topic display names and nine units were reconciled with the official [College Board CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), Fall 2024 edition applicable to 2026–27, accessed 2026-10-17. June 2026 clarifications do not change the topic inventory. Unit counts are 8/7/13/9/11/9/12/11/11. Other course outlines have not been audited here.

The canonical mapping is [CONTENT_IMPORT_GUIDE.md](../CONTENT_IMPORT_GUIDE.md), created from the actual repository rather than presented as a recovered historical guide. Seventeen existing IDs remain stable; 74 newly registered topics receive documented number-based IDs. Do not assume that unavailable older drafts used these new IDs. Match official numbers and record conversions explicitly.

All 1,001 published objects match the authorized completion snapshot `627b7e2`. All 29 corrected recovered partial objects were preserved; four new questions completed those sets. Four unavailable-source sets were newly written and labeled as replacements. The ninety files in `pending/` are now preserved historical source snapshots, not additional questions or current unpublished work. See [the frozen prepublication audit](../content-drafts/chemistry/BANK_AUDIT.md) and current publication review.

See [the progress ledger](../content-drafts/chemistry/PROGRESS.md) for unavailable full sets and recovered fragments. Missing files are not evidence that work never existed. Preserve recovered originals; correct working copies with an audit log. Never invent a truncated question's ending.

## Draft, validate, review, then publish

1. Read the official topic scope, learning objectives, essential knowledge, skills, and exclusions. Do not use another topic's central skill merely because it requires related prior knowledge.
2. Save one complete JSON object under `content-drafts/chemistry/pending/`. Exactly eleven original questions per topic; four distinct choices, one correct index 0–3, full explanation of every option, unique IDs following the guide. Do not add metadata fields to question JSON.
3. Solve separately before consulting drafted keys, check all alternatives, recalculate numerical results, and record limitations and changes in `content-drafts/chemistry/qa/`. A separate pass by the same assistant is not independent human review.
4. Run `node --experimental-strip-types scripts/check-question-drafts.mjs` and `node scripts/check-chemistry-science.mjs`. The former checks schema, IDs, counts, scope, duplicate IDs, normalized exact prompt duplicates, answer distribution, and the presence of a per-topic QA record. It does not detect all semantic repetition. Neither script proves all scientific claims, originality, or human approval. Update the progress report after every batch.
5. Obtain the owner's explicit publication approval and follow its review requirements. Independent human scientific review is recommended; never claim it occurred when it did not. The October 18 bulk authorization covers the existing completed 1,001 questions only. Pasted drafts, preferred creators and successful validators alone are not approval for future content.
6. Only then add the approved JSON under `src/content/practice/`, import it in `src/lib/practice-bank.ts`, and register it with a concrete approval-reference comment. This explicit registry is the publication gate; there is no automatic importer or public draft dashboard.
7. Keep `src/config/published-practice-index.json` in sync with the registry; client components use these counts instead of importing the full bank. Run TypeScript, unit tests, production build, publication and smoke/browser checks. Save scoped milestone commits and normal pushes to the existing upstream under the owner's standing milestone workflow. A GitHub push is not a public website deployment; deployment needs separate authorization.

The bank validator rejects extra fields, invalid scopes, counts other than eleven, duplicate IDs, missing text, duplicate/invalid options, and invalid indexes. External-resource URL approval is a separate gate; question approval never approves a video.

## Student behavior

- One question at a time, with Previous/Next, disabled end boundaries, feedback, and Try again. Approval badges have been removed for current and future questions.
- Answers remain while moving within a session. First graded answers count once; Try again cannot inflate the score. Finish practice grades remaining selections and counts unanswered questions as incorrect. Results show correct/total, rounded percent and unanswered count, with Review answers and Start again. This percentage is not an AP score prediction.
- Scope changes, leaving practice and refresh reset the session. Scores are session-only; no results are saved. Start again clears only the quiz state.
- Practice availability is independent of lesson readiness. Topic 1.1 offers practice while its video/notes lesson workspace remains planned.
- FRQs and mixed sessions are disabled and honestly labeled coming soon.
- Local notes, courses, saved resource IDs, completion, themes, and legacy storage keys retain their existing behavior.
- PrepAtlas questions are original practice, not official College Board or AP Classroom questions.

## Publication checks

`pnpm test:publication` checks the explicit registry, counts, frozen content hashes, flagged calculations and every Chemistry topic/unit/course HTTP scope against a running server (port 3000 by default, or `BASE_URL`). `pnpm test:unit` includes scoring/navigation checks covering all 1,001 keys. The historical draft and bank-audit scripts intentionally verify the preserved prepublication source snapshot; they do not double-count its copies or publish anything.
