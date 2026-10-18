# Topic 5.2 — Introduction to Rate Law

Reviewed 2026-10-18. Eleven original questions; **human scientific review and owner approval pending**. Exact ID `topic-5-2`; not imported.

Authority: [College Board CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), Fall 2024, accessed 2026-10-17, printed p.95 / PDF102. LO5.2.A, EK .1–.5: experimental monitoring, concentration-power law, individual/overall order, temperature-dependent k and units, initial-rate comparisons. Suggested skill5.C. No integrated time law/linearized plots, Arrhenius fitting, mechanism inference from overall stoichiometry, or unsupported assumption that every exponent equals a balanced coefficient. Supplied absorbance calibration uses prerequisite3.13. Rate convention in010 is explicitly defined to prevent normalization ambiguity.

Python Decimal separately computed k3.00 M−1s−1, factor8, calibrated rate .000200 M/s/k .00400 s−1, and normalized k .750 M−1s−1. A separate ratio/dimension/identifiability pass produced C/B/D/A/C/D/B/A/D/C/B; positions2/3/3/3. Science script evaluates table predictions for every proposed law, scaling factors, units exponents, alternative exponent allocations and numerical cases.

| Suffix | Separate solve and competing-answer check |
| --- | --- |
| 001 | A doubling/B fixed→4×, B doubling/A fixed→2×; A2B. All alternate laws fail at least one matched comparison. |
| 002 | .180/(.300×.200)=3.00, units M−1s−1. Wrong product, decimal place and omitted reactant checked. |
| 003 | 3^0×(.5)^2=.25. Zero order is a tested regime, not proof A never participates. |
| 004 | k exponent1−n=−2→n3; units do not uniquely allocate individual orders. |
| 005 | 4^n≈1→n≈0 over tested range/precision. Not universal zero dependence at arbitrary conditions. |
| 006 | Overall1+2=3; doubling both gives2×4=8, not6. |
| 007 | 2^(m+n)=4 fixes onlysum2. At least(2,0),(1,1),(0,2) fit. |
| 008 | .0120/60=.000200 M/s; /.0500=.00400 s−1; positive disappearance. |
| 009 | DifferentT can change k, so cannot isolate exponent. Balanced overall equation does not supply general rate law. |
| 010 | r=.0300, divide[A]^2=.0400→k.750; not unnormalized1.50 or first-order division. |
| 011 | Aorder1 with Bfixed; Bexponent hidden in constant factor, not demonstrated zero. Distinct from simultaneous-change ambiguity in007. |

No third-party questions consulted. Same-assistant separate calculation/solve passes are not independent human scientific approval.
