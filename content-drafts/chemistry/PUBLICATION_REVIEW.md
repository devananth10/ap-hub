# AP Chemistry publication review — October 18, 2026

**Published: 1,001 MCQs across all 91 topics, exactly eleven per topic. Withheld: zero.** This makes the questions available inside PrepAtlas Practice. No website deployment was performed.

The owner's message, “PREPATLAS — PUBLISH THE COMPLETE AP CHEMISTRY QUESTION BANK,” explicitly authorized bulk publication after the required checks and overrode individual manual approval for this completed bank. This is owner authorization, not a claim of human scientific review. Future questions and external educational resources still require their own authorization. Machine-readable decisions are in `PUBLICATION_REVIEW.json`.

## Integrity and provenance

All 1,001 published question objects are unchanged from commit `627b7e2ae77c6a162d01425379e88eda504f0507`. Each published batch matches its frozen semantic SHA-256 in `BANK_AUDIT.json`; IDs, prompts, four choices, keys and explanations remain intact. The original ten Topic 1.1 questions, its authorized eleventh question, all 49 Unit 6 baseline sets and all 29 corrected recovered partial objects are preserved. No demonstration question was reinstated.

The live registry is `src/lib/practice-bank.ts`, with 91 explicit imports from `src/content/practice/`. `src/config/published-practice-index.json` supplies lightweight counts to client components and is checked against that registry. Nothing scans a drafts folder to publish future content. Ninety files in `content-drafts/chemistry/pending/` remain as historical source snapshots, not 990 additional active questions or current unpublished work. Recovered archives and per-topic QA remain unchanged. Unavailable earlier full sources remain unavailable; the four replacement sets keep their documented provenance.

## Disposition of documented concerns

The frozen audit and per-topic solve records were read before publication. Flagged cases were re-solved from the supplied information and alternatives, then retained for the following reasons:

| Questions | Decision and reasoning |
| --- | --- |
| `chem-1-6-008` | Publish. The supplied PES energy balance gives 60 − 18 = 42 eV binding energy, with one matching option. This interprets a PES measurement; overlap with later photon arithmetic does not require an unstated formula. |
| `chem-1-7-006`, `010` | Publish. Qualitative down-group ranking/explanation and numerical data-based estimation apply the same principle through different tasks. |
| `chem-2-1-001`, `002`, `007`, `008` | Publish. Relative polarity, partial-charge direction, bonding classification and the effectively nonpolar C–H convention are distinct targets. Supplied electronegativities do not imply a universal ionic cutoff or exact dipole magnitude. |
| `chem-5-9-004`, `007` | Publish as upper-difficulty applications. Root and inverse-concentration relations are supplied, and slow-step substitution gives unique forms in the explicitly restricted pre-equilibrium regime. Students do not need to memorize an advanced mechanism, derive differential equations, use fractional molecularity or extrapolate to zero concentration. |
| `chem-5-9-008`–`010` | Publish. Separate free-concentration/pool-balance calculations give 0.00120 and 0.0100 M/s; the third-order effective constant has units M^-2 s^-1. Keys and all numerical alternatives were rechecked against the actual published choices. |

The official [College Board Chemistry CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), printed page 103 (PDF page 110), defines Topic 5.9 pre-equilibrium substitution. The flagged harder questions provide the needed relations and remain within algebraic application of that learning objective. Difficulty is not a scientific defect; no unresolved wrong key or multiple defensible correct answer was identified in this review.

A within-topic TF-IDF prompt-similarity pass identified twelve pairs above cosine 0.62. Every flagged pair was inspected; none was an exact duplicate or the same numerical exercise with only names changed. Retained distinctions:

| Pair (same prefix on both IDs) | Different operation or case |
| --- | --- |
| 9.10-001/002 | Reaction-quotient numerator versus denominator changes |
| 7.4-001/005 | Direct equilibrium calculation versus inferring stoichiometry |
| 1.4-004/008 | Atom fractions from different mixture data representations |
| 8.4-001/011 | Gross acid excess versus near cancellation and the pH-averaging trap |
| 9.5-006/011 | Positive versus negative exponential/logarithm and unit cases |
| 7.12-003/004 | Common anion versus common cation and different solubility powers |
| 7.6-001/002 | Reversing versus scaling an equilibrium equation |
| 3.12-003/011 | Photon energy versus number of photons in a beam |
| 7.6-004/005 | Adding equations versus reversing a constituent equation |
| 3.12-002/006 | Frequency to energy versus energy to wavelength |
| 1.2-003/007 | Isotopic abundance versus mean mass not being an individual atom's mass |
| 1.6-004/010 | Valence-electron count versus identifying ion charge |

Similarity is a triage method, not proof of semantic originality. Some conceptual correct choices are longer than distractors, and future editorial calibration could reduce cues. These are recorded quality limitations, not known scientific errors requiring withholding. Automated checks and a separate pass by the same assistant are not independent human scientific review and cannot guarantee every question is error-free.

## Practice behavior

- Students can select course, unit or topic; each Chemistry topic offers eleven questions, and the full course offers 1,001.
- One question is rendered at a time. Previous/Next preserve selections and feedback, with first/last boundaries disabled.
- Check answer grades the selected option and displays the existing explanation of all four options. Try again is for learning; the first graded answer continues to count toward the session score.
- Finish practice also grades selections not yet checked. Unanswered questions count as incorrect. Results show correct/total, rounded percent and unanswered count, with Review answers and Start again. This is a session percentage, not an AP exam score prediction.
- Scope changes, leaving Practice and reloading reset the session. Restart clears only quiz state. Existing notes, course selections, resource bookmarks, completion, theme and legacy browser-storage keys were not migrated or cleared.
- FRQs and mixed practice remain disabled. Official resource catalog remains empty; all 103 video suggestions remain unpublished.

## Verification

Passed after publication:

- Frozen source schema/ID/count/explanation/duplicate-prompt checks, full-bank hash and preservation audit, and the full existing numerical/scientific-model suite.
- New publication audit: 91 registered batches, 1,001 unique unchanged objects, eleven per correct scope, matching client count index, and data-bound checks for the flagged numerical/root/inverse cases.
- TypeScript and all 37 unit tests, including all four choices for each of the 1,001 keys, navigation state, retries, incomplete sessions, restart and a complete 1,001/1,001 score calculation.
- Fresh production build. Development and temporary production servers each passed the 19-route smoke suite, CSS, seven invalid routes, six fixed course themes and homepage rotation.
- Development and production each passed all 91 topic routes, all nine unit routes and full-course scope, checking counts, correct first-question identity and single-question rendering.
- Browser: completed Topic 9.11, intentionally answered the first question incorrectly, retried correctly and answered ten others correctly. Final result was **10/11 (91%)**, preserving the first attempt. Checked and unchecked selections persisted across navigation; boundaries, all-option feedback, review and restart worked. Finishing with one selected but unchecked correct answer gave **1/11 (9%)**, ten unanswered.
- Browser scope change reset the session and showed Unit 7's 132 questions, then Topic 7.1's eleven. Reload reset answers. At 390 pixels wide, feedback and navigation remained usable with no horizontal overflow. No captured browser warnings or errors occurred during this verification.

The live development preview remains at port 3000; production verification used a separate temporary server at port 3100, stopped afterward. No public deployment, external-resource publication or major redesign is part of this milestone. Git commit/push evidence is reported after the final checkpoint; this document does not invent a future commit ID.
