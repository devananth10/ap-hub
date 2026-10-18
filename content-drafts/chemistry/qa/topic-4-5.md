# Topic 4.5 — Stoichiometry

Reviewed 2026-10-18. Eleven original questions; **human scientific review and owner approval pending**. Exact ID `topic-4-5`; not imported.

Authority: [College Board CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), Fall 2024, accessed 2026-10-17, printed p.82 / PDF89. LO 4.5.A and EK .1–.3: reactant/product amounts from conserved atoms, coefficient/mole proportionality, and combinations with ideal gas law/molarity. Suggested skill 5.C variable relationships. Prerequisites include solid-mixture mass fraction, molar mass, total versus partial gas pressure, yield interpretation and liter conversion. No equilibrium residuals, nonideal gas model, thermochemical yield or titration-curve analysis. All reaction identities, masses and needed constants are supplied.

Python Decimal solved each numerical prompt independently before the explanations were written. A separate limiting-reagent/units/key pass gives D/B/A/C/D/A/C/B/A/D/C, A/B/C/D = 3/2/3/3. JavaScript repeats the input-based arithmetic, selected wrong ratios, and atom conservation for the supplied equations. Assumed quantitative precipitation/no later phosphate equilibria/dry gas or wet-gas correction are stated explicitly.

| Suffix | Independently computed result and distractors |
| --- | --- |
| 001 | Extents .200 vs .150; Cl2 limits, .300 product/.100 Al left. Other options ignore limiting reagent or coefficient two. |
| 002 | 25×.800/100.1×44.01=8.79320679 g. Wrong options omit/double purity or equate different substance masses. |
| 003 | .1000 mol chlorate → .1500 mol O2; V=3.6927 L. Wrong ratios 1, 2/3, 3 rather than 3/2. |
| 004 | .0600−3(.0100)=.0300 mol OH−; /.250=.120 M. No later-equilibrium inference. |
| 005 | .00300 Ag vs .00240 Cl; product .00240×143.32=.343968 g. Wrong choices use excess, sum, or leftover ions. |
| 006 | .100 mol Fe requires .150 mol CO=4.20 g. Reverse/omit coefficient ratios give alternatives. |
| 007 | Theoretical Cu=7.98868636 g; 6.80/theory×100=85.1203777%. Explanation rounds theory to 7.989. Theoretical oxide mass fraction is not measured yield. |
| 008 | Changes −1.00 O2,+.600 CO2,+.800 H2O. Amount changes distinguished from final totals. |
| 009 | Pure product max4.03g, apparent104.218%; unaccounted inert mass can inflate it. Other isolated errors lower recovery. |
| 010 | Oxygen limits both, 1.50 mol water each; extra hydrogen changes leftover amount, not theoretical product. |
| 011 | Dry PH2=.9700 atm; nH2=.0197010 mol; mAl=.354355891 g. Omitting vapor, using1:1 or reversing ratio gives the three wrong values. |

The first script run caught a mistyped high-precision expected value for the question 011 no-vapor-correction distractor. Python Decimal gives .365315351910526 g; the assertion was corrected and rerun successfully. The rounded .365 g option and the correct .354 g answer were unchanged.

Significant figures follow the prompt data; constants are supplied and no unnecessary periodic-table precision is assumed. No third-party questions consulted. Same-assistant separate calculation/solve passes are not independent human scientific approval.
