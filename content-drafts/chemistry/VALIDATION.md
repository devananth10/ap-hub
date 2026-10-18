# Chemistry checkpoint validation — 2026-10-18

Snapshot at completion of the Unit 4 draft batch. Consult `PROGRESS.md` for later counts and the next task.

## Saved content

- 30 complete topic files in the active approved/draft workflow: **330 questions toward the 1,001 target**. Only the eleven Topic 1.1 questions are live; 319 in twenty-nine pending sets require human scientific review and owner approval. Sixty-one topics still lack complete working sets, including the unavailable earlier sources; the remaining complete-set target is 671 questions.
- All nine Unit 4 topics are drafted, exactly eleven each (99 pending questions). All thirteen Unit 3 topics have 143 pending questions. New Unit 2 drafts cover 2.4–2.7 (44 questions). Three recovered complete sets were audited into working copies (33 questions).
- Twenty-nine complete objects from truncated 1.6/1.7/2.1 sources are preserved as partial work. They are not complete banks and are excluded from these totals. Earlier full 1.2/1.3/2.2/2.3 sources remain unavailable, not assumed nonexistent.
- Next new topic: **5.1 — Reaction Rates**, preserved internal ID `rates`. Read its official scope before writing. Earlier source gaps still require reconciliation if supplied.

## Verification performed

- All approved and pending complete batches validate together: exactly eleven questions per set, unique IDs, correct canonical topic scope, exact JSON fields, four distinct options, valid answer indexes, complete nonempty text. Draft IDs are ordered 001–011. Each pending set has a scope/QA document. Normalized exact duplicate prompts are rejected; semantic variety still requires review.
- Separate same-assistant prompt/option and explanation passes are recorded per topic. Numerical cases were independently recalculated, with Python Decimal where appropriate and reproducible JavaScript arithmetic/model checks. Photon checks use relative tolerances that reject zero for tiny expected energies.
- Unit 4 checks additionally cover atom/charge conservation, excess particle inventories, limiting quantities, gas/solution stoichiometry, yields, titration-error direction, one-proton conjugate differences, and acidic/basic half-reaction balance with electron cancellation. The limited formula parser handles these supplied formulas; it does not certify chemical feasibility or speciation. Qualitative classifications were separately reviewed, including the CED salt-dissolution qualification and explicit solubility/agent-term exclusions.
- Recovered source remains unchanged, with path/hash in `recovered/index.json`. Corrections were made only in working files and logged. Solution mass-percent exclusions discovered on CED p.67 prompted explicit solid-mixture revisions to pending 1.4 questions 003/011.
- Original approved Topic 1.1 questions 001–010 were compared as parsed objects with the supplied source: preserved. Question 011 alone was added after separate calculation under the owner's explicit instruction. No demo was relocated into that bank.
- Official resources remain empty and unchanged: SHA-256 `3544CEB6D9770BA4A72E429A8A73EEC3313C482365C4B8C35784F3709E4A0571`. All 103 video suggestions remain pending; metadata is not playback/embed or human lesson-alignment verification.

## Application checks

- `pnpm typecheck`: passed.
- `pnpm test:unit`: all 31 passed.
- `pnpm build`: passed with Next.js 16.4.2/Webpack.
- Development and production smoke checks: 19 routes, compiled CSS, seven friendly 404 cases, six fixed course-art mappings, and home-art rotation passed. Latest development run observed five themes and production seven across twelve fresh responses each.
- Temporary production verification server at 3100 (PID4968) was stopped after checks; preview listener PID14024 on 3000 was preserved, with HTTP200 afterward. The visible home tab remains open. Earlier in the session the preview was restored as a hidden background server after an interrupted process.
- Browser: Unit 4 practice shows **zero** and all nine topic options, confirming its 99 new drafts remain unpublished. Following its Topic 1.1 link shows eleven questions, one at a time, without the removed owner-approval badge. Earlier mobile 390-pixel course outline with Units3/9 expanded showed no horizontal overflow (375-pixel document width); long names wrap and the viewport override was reset. Earlier browser console checks showed no warnings/errors.
- Earlier same-milestone browser checks verified correct/incorrect feedback, Try again, Previous/Next answer retention, first/last boundaries, refresh reset, optional notes, demonstration summary disclosure, and preserved Topic 1.5 workspace with Practice 0. No notes/completion values were edited.

These are structural, calculation, model, and application checks, **not independent human scientific review**. No guarantee is made that an automated check proves conceptual correctness, pedagogical quality, absence of accidental similarity, or publication approval. All remaining topic drafts must follow the same scope/solve/review workflow. No pending material has been published, deployed, or pushed; the current handoff limits this work to local checkpoints.
