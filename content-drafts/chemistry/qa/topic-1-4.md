# Topic 1.4 — Composition of Mixtures

Status: revised draft; structural validation and a separate same-assistant science pass completed; **human scientific review and publication approval pending**.

## Scope

Authority: [College Board Chemistry CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), effective Fall 2024, accessed 2026-10-17, printed page 33 (PDF page 40). LO 1.4.A concerns elemental composition of mixtures from representations and quantitative data; EK 1.4.A.1–2 distinguishes variable mixture composition from fixed compound composition and connects elemental analysis to purity. Suggested mathematical routine: science practice 5.A. Representative sampling and separation error are experimental applications of determining mixture composition, rather than a claim of separate named EKs here.

Use formula mass and mole-to-mass conversion as prerequisite tools. Exclude empirical-formula determination as the main task (1.3), solution equilibrium, and chemical-reaction stoichiometry as the main task.

## Provenance and changes

The untouched recovered archive and source JSON are in `../recovered/`. The historical ID `composition-of-mixtures` is explicitly mapped to the preserved application ID `mixtures` using official number 1.4. Nothing is imported into the application.

| ID suffix | Decision | Reason |
| --- | --- | --- |
| 001 | Replace | Original centrally tested pure-compound fixed composition (1.3). New item tests whether an elemental measurement can distinguish mixture proportions. |
| 002 | Retain | Chlorine marker determines NaCl purity; independently recalculated. |
| 003 | Replace | Original repeated the marker calculation in 002. New item tests representative aliquot composition and correct denominators. |
| 004 | Retain | Converts equal component mole amounts into elemental mass percentage. |
| 005 | Retain | Particle counts show variable proportions without new molecular formulas. |
| 006 | Retain | Purity from elemental percentage relative to a carbon-free impurity. |
| 007 | Replace | Original compared two pure salts, primarily 1.3. New particle-to-component mass-fraction item applies directly to a mixture. |
| 008 | Retain | Accounts for oxygen from both mixture components. |
| 009 | Replace | Original repeated 002's marker calculation. New item distinguishes representative sampling from repeated biased sampling. |
| 010 | Retain | Weighted-average bounds identify a possible impurity. |
| 011 | Retain | Incomplete evaporation biases the recovered salt mass high. |

## Separate solve and distractor audit

The recovered prompts/options were solved before consulting their answer keys and explanations. All source keys matched the independent derivation, but scope and repetition required four replacements. The revised working file was then read in full in a second pass; each explanation accounts for all four choices.

1. Carbon fraction = (0.4mP + 0.4mQ)/(mP + mQ) = 0.4 for every ratio: C. Neither inequality nor equality is identifiable.
2. 3.55 g Cl × 58.5/35.5 = 5.85 g NaCl, or 58.5%: A. Other choices are chlorine percentage, chlorine fraction in pure salt, and sand percentage.
3. Remaining salt = 16.0 − 5.00 = 11.0 g; remaining powder = 55.0 g; 20.0%: D. Distractors use original salt or the wrong denominator.
4. Carbon = 4.80 g; total = 14.40 g; 33.3%: B. Pure-component fractions and equal-mole/equal-mass confusion fail.
5. Separate molecule types retain identities, with ratios 2:1 and 1:2: C. No fixed combined formula or change in elements follows.
6. 36.0/40.0 = 90.0% purity: A. Remaining choices confuse impurity, sample carbon percentage, and pure-compound carbon percentage.
7. Equal molecular counts imply equal moles, so Q mass fraction = 60/(20+60) = 75%: B. Absolute count cancels; mass fractions are not count fractions.
8. Oxygen = 1.60 + 3.20 = 4.80 g of 5.40 g; 88.9%: D. Each distractor omits a contribution or reports a component fraction.
9. Top-layer result does not establish bulk composition: A. Compound composition does not fix mixture ratio; mass fraction is not mole fraction; repeating biased sampling does not remove bias.
10. Only Mg has an oxygen fraction below 30%, allowing a weighted average of 30% with MgO (39.7%): C. O2, water, and silica all increase oxygen fraction.
11. Expected salt from the dry mixture = 20.0 × 0.150 = 3.00 g; residual water can raise residue to 3.50 g: B. Salt loss or a lower starting concentration lowers the result.

Calculations are also exercised by `scripts/check-chemistry-science.mjs`. Answer counts A/B/C/D = 3/3/3/2. Distinct purposes were checked across all eleven; 002 and 006 share purity as an intended central skill but use formula-based marker mass versus percentage-ratio reasoning. Numerical precision is sufficient to distinguish every option. No external question bank was used to write replacements. This is not an independent human review or a guarantee against accidental similarity.

## Cross-topic exclusion correction — 2026-10-18

The explicit 3.8 exclusion (CED printed p.67 / PDF74) says solution molality, percent-by-mass, and percent-by-volume calculations are not assessed. Question 003 was revised from an aqueous solution to a representative dry-powder mixture; 011 now begins with a dry NaCl/sand mixture and tests recovery/drying error. Neither calculates solution mass-percent concentration. Calculations, keys, and IDs remain the same. The 011 provenance decision above is superseded from “retain” to “revise context for scope”; its correct error direction is preserved. Recovered originals remain unchanged. No approved/live question was edited.
