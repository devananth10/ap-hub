# Topic 3.4 — Ideal Gas Law

Reviewed 2026-10-18. Status: eleven original questions; **human scientific review and owner approval pending**. Exact ID `topic-3-4`; no app import.

Authority: [College Board CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), Fall 2024, source accessed 2026-10-17, printed p.63 / PDF70. LO 3.4.A; EK .1 PV=nRT, .2 Dalton/mole fractions, .3 graphs; suggested skill 5.C. Mole/mass conversion and measurement precision are prerequisites. No reaction stoichiometry, real-gas corrections, kinetic-energy distribution, or adiabatic-compression equation is required. In 011 the warmer gas is an observed condition, not something students must derive thermodynamically.

Separate solutions were calculated with Python Decimal from the prompt data without reading the saved explanation. Prompts/options were then read separately and all alternatives checked. Derived keys C/D/A/B/C/A/D/C/D/A/B match the bank; A/B/C/D = 3/2/3/3. The reusable JavaScript science script independently repeats the numerical checks.

| Suffix | Calculation/concept and distractors |
| --- | --- |
| 001 | P2=1.20×(2/3)×(450/300)=1.20 atm. Other options omit T, omit V, or invert the V ratio. Temperatures explicitly 300.0/450.0 K remove significant-figure ambiguity. |
| 002 | Equal n/T/V gives equal P for ideal He/CO2. Molar mass, speed alone, and number of atoms within a molecule do not replace gas-particle mole amount. |
| 003 | Fraction lost=1−.750/1.00=.250, or 25.0%. 75% is remaining; 33.3% uses the final denominator; fixed T does not imply fixed n. |
| 004 | .982−.0313=.9507→.951 atm at .001-atm precision. Alternatives add water pressure, report water only, or ignore it. |
| 005 | n=.0203103420… mol; M=.820/n=40.37352→40.4 g/mol. Halved/doubled values arise from incorrect V; .0404 has the wrong thousandfold scale for g/mol. R units cancel with atm/L/K. |
| 006 | XHe=.200/.500=.400; PHe=1.00 atm; PN2=1.50 atm. Equal fractions and assigning the whole pressure to He fail. |
| 007 | N2 partial pressure stays 1.20 atm, final total 2.40. Added ideal gas does not remove accessible volume or change the existing species' nRT/V. A component's reduced mole fraction must be applied to the new total. |
| 008 | P versus Kelvin T is a positive straight line through the ideal-model origin, not through Celsius zero, inverse, or horizontal. The zero-T extension is mathematical, not a real-gas phase claim. |
| 009 | 400.15/300.15=1.333166749958…→1.33. Celsius ratios 127/27, 100/27, and inverse Kelvin ratio fail. |
| 010 | Pfinal=(2×1+1×3)/4=1.25 atm. Contributions .500+.750; unweighted mean, initial-pressure sum, and omission of He give the distractors. |
| 011 | ncalc/ntrue=Tactual/Troom>1. A smaller denominator overestimates n; sealing preserves true n but does not validate an incorrect temperature input. Gas identity/molar mass are unnecessary. |

Checked assumptions: ideal/nonreacting gas where specified, absolute T, fixed variables, no leak except 003, negligible valve volume, common temperature in connected bulbs, intact species count, and independent partial pressures. Each numerical option is separated from the correct result by much more than rounding uncertainty. The set varies combined changes, identity independence, leak evidence, wet collection, molar mass, mole fraction, inert addition, graphs, Celsius conversion, connected volumes, and experimental bias. No third-party question bank was consulted. Same-assistant separate calculation and model review is not independent human approval.
