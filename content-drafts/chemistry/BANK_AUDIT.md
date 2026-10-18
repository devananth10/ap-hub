# Complete AP Chemistry draft-bank audit

> Historical prepublication snapshot at `627b7e2`. The eleven-live/990-pending figures and review flags below describe that checkpoint. On October 18 the owner authorized bulk publication; **all 1,001 are now published, zero withheld**. Read [PUBLICATION_REVIEW.md](PUBLICATION_REVIEW.md) for current status and dispositions of every flagged concern, and [PROGRESS.md](PROGRESS.md) for current counts. The frozen `BANK_AUDIT.json` and source hashes remain unchanged; no human scientific approval is claimed.

Completed October 18, 2026. **91 topics × 11 questions = 1,001 complete questions.** Eleven Topic 1.1 questions are live; **990 questions in 90 sets remain unpublished and pending human scientific review and owner approval**. Draft completion is not publication or independent scientific certification.

## Coverage

| Unit | Topics | Questions | Live | Unpublished |
| --- | ---: | ---: | ---: | ---: |
| 1 | 8 | 88 | 11 | 77 |
| 2 | 7 | 77 | 0 | 77 |
| 3 | 13 | 143 | 0 | 143 |
| 4 | 9 | 99 | 0 | 99 |
| 5 | 11 | 121 | 0 | 121 |
| 6 | 9 | 99 | 0 | 99 |
| 7 | 12 | 132 | 0 | 132 |
| 8 | 11 | 121 | 0 | 121 |
| 9 | 11 | 121 | 0 | 121 |
| **Total** | **91** | **1,001** | **11** | **990** |

Names and topic inventory match the verified [College Board Chemistry CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), effective Fall 2024, applicable to 2026–27 under the checked course-change overview. Exact internal IDs remain in the root import guide. No topic routes or student-storage IDs were renamed.

## Preservation and new work

- Unit 6 was saved as commit `34fb9df` before continuation. All 49 complete pending sets at that checkpoint are still equal as parsed objects: no existing question, answer, explanation or ID changed.
- The original ten approved Topic 1.1 objects were compared with the owner's supplied file and remain equal. Its authorized eleventh question is unchanged. No demonstration question counts toward the target.
- All 29 corrected working objects from the recovered partial sets are preserved by deep equality: ten in 1.6, ten in 1.7 and nine in 2.1. Only four new questions were added to finish those sets. The historical partial files and raw archive remain unchanged.
- The recovery archive SHA-256 remains `e05fb3a700830cdd48396b9b8cba86a01e0e4855628840df5ac8d913e38ba9a3`.
- Units 7–9 contribute 374 newly written questions. Earlier unavailable-source topics 1.2, 1.3, 2.2 and 2.3 contribute 44 newly written replacement questions, not allegedly recovered originals. Those old sources remain unavailable and can be compared if supplied later.
- Complete-topic coverage increased from 550 to 1,001 by adding 422 newly written questions and retaining 29 previously partial objects in complete sets. No valid recovered object was replaced to inflate coverage.
- Final editorial review replaced seven weak distractors with closer conceptual misconceptions, with changes logged in each affected QA file. Correct answers and IDs did not change.

## Checks passed

The reproducible scripts check all approved and complete pending sets together:

```text
node --experimental-strip-types scripts/check-question-drafts.mjs
node scripts/check-chemistry-science.mjs
node --experimental-strip-types scripts/audit-chemistry-bank.mjs
```

- Exact schema, four distinct options, one index 0–3, ordered unique IDs 001–011, exactly eleven per topic, matching registered scope and all 91 official names.
- No normalized exact duplicate prompts. Each topic's A/B/C/D answer counts are two or three each. All explanations contain discussion markers for all four options, with no mismatch between a leading correct-answer label and its key.
- Every topic has a separate scope/solve record. Numerical questions were re-solved and implemented arithmetic, conservation, charge, rate, equilibrium, logarithm and electrochemistry checks pass. These tests cover the supplied models; they are not a general chemistry theorem prover.
- Full inventory and semantic SHA-256 values are saved in `BANK_AUDIT.json`. Default audit checks them. `--write` intentionally refreshes the inventory only after reviewed changes; it does not grant approval.
- TypeScript and all 31 existing unit tests pass. A fresh production build passes. Production smoke checks pass: 19 routes, CSS, seven friendly 404s, six fixed course themes, and six artwork themes across twelve fresh home responses. Development checks also pass at the final checkpoint as recorded in `VALIDATION.md`.

Relevant curriculum exclusions were checked in each scope record. They include single-element/singly charged monatomic mass spectra; no anomalous Aufbau configuration writing, specific crystal memorization, solution mass-percent or colligative calculations; no quantitative Arrhenius or intermediate-data collection; no Kc/Kp conversion or dissolved-gas equilibrium calculations; no full polyprotic species computation, buffer pH-change calculation, Henderson–Hasselbalch derivation, or numerical solubility as a function of pH; no electrode-polarity labels or numerical Nernst drills.

## Remaining review items

No missing topics, count defects, ID/schema defects, exact duplicate prompts or failing implemented scientific calculations remain in this checkpoint. The following review limits are explicit:

- **Independent human scientific and pedagogical review remains pending for the drafts.** A separate pass by the same assistant is not independent human review. Automated checks do not prove that every concept is unambiguous or every distractor has the desired difficulty.
- Preserve valid recovered items while considering variety: 1.6-008 uses supplied photon-minus-electron energy to interpret a PES binding energy and overlaps later spectroscopy arithmetic; 1.7-006/010 share a down-group ionization theme; several 2.1 items discuss polarity. None was silently discarded.
- Topic 5.9 supplied fractional/inverse apparent-order examples need human difficulty calibration. Broader semantic similarity, repeated reasoning patterns, reading level and answer-length cues should be reviewed across topics before publication. Exact duplicate checking is not a semantic-originality certificate.
- Four historical full sources remain unavailable even though their topics now have complete new replacements. If those sources are recovered, reconcile them rather than registering duplicate questions.
- The development preview has intermittently returned a generated-manifest error. It recovered and passing checks are recorded, but the exact path/root cause and a permanent fix remain unconfirmed. No question content was changed to conceal this issue.

## Application and approval boundaries

The application code, saved-data keys, notes, completion behavior, Practice registry and resource catalog were preserved during this continuation. The official external-resource catalog remains empty with SHA-256 `3544ceb6d9770ba4a72e429a8a73eec3313c482365c4b8c35784f3709e4a0571`. All 103 researched video URLs remain suggestions, not approved lessons.

No pending bank was registered, automatically published or deployed. No redesign, video integration, fullscreen work, paid AI service, authentication or database was introduced. Git commits and a normal backup push under the owner's current milestone workflow do not change these publication boundaries.
