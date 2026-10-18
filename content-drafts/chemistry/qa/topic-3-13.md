# Topic 3.13 — Beer-Lambert Law

Reviewed 2026-10-18. Eleven original questions; **human scientific review and owner approval pending**. Exact ID `topic-3-13`; not imported. All thirteen Unit 3 topics now have complete eleven-question draft files (143 questions), which is draft coverage rather than publication or completed human review.

Authority: [College Board CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), Fall 2024, accessed 2026-10-17, printed p.72 / PDF79. LO 3.13.A; EK .1 A=epsilon×b×c and meaning of each variable, .2 fixed path/wavelength proportionality and maximum-absorbance wavelength; suggested skill 2.E: experimental error. Molarity/dilution and graph slopes are prerequisites. No logarithmic transmittance derivation, multicomponent matrix inversion, chemical-equilibrium spectral model, or unprovided instrument-response law is required.

Python Decimal separately computed numerical products, slopes, dilution, path length, and epsilon ratio from the prompt data before checking explanations. A separate prompt/option pass produced B/D/A/C/B/A/D/C/A/D/C, matching keys; A/B/C/D = 3/2/3/3. The science script independently repeats the calculations and checks the extra-absorbance error direction. Every option and explanation reference was checked.

| Suffix | Independent result and alternative check |
| --- | --- |
| 001 | 150×2.00×.00300=.900, dimensionless. Wrong paths divide by b, omit b, or use mM number as M. |
| 002 | Both standard slopes equal 75.0 M−1; .225/75=.00300 M. Mismatched standard pairs give .00150/.00600; .300 is an absorbance entry, not c. |
| 003 | 1.20×10/50=.240. Reverse ratio, ignored dilution, and added-solvent volume 40 mL give the distractors. |
| 004 | c doubles/b halves → product unchanged. Wrong answers consider one factor or invert the path effect. |
| 005 | Sensitivity slope=epsilon b, so maximum epsilon gives greater deltaA per deltac. Not maximum transmission, zero analyte absorption, or universally shortest wavelength. |
| 006 | Specified fingerprint attenuation raises apparent A and target-only inferred c. Blank/calibration clean, extra light loss explicit; no unspecified scattering sign is assumed. |
| 007 | Blank should match solvent/non-analyte reagents without target. Not universally water/air or subtraction of a concentrated analyte reference. |
| 008 | b=slope/epsilon=220/110=2.00 cm. Inverse, raw slope as cm, and assumed 1-cm path fail. |
| 009 | Known second absorber makes a single target-only interpretation ambiguous without accounting/control. Target lambda-max is sensitivity, not guaranteed selectivity; absorption is not exclusive to one species. |
| 010 | Dilute stable species into validated range, determine diluted c, then restore known factor. Not unsupported extrapolation, a changed wavelength with old calibration, or arbitrary brightness manipulation. |
| 011 | Equal A/b, epsilonP=2epsilonQ → cP=cQ/2. Equal A does not alone imply equal c across species; a known ratio suffices without absolute epsilon values. |

Linearity, unchanged species on dilution, fixed wavelength/path where needed, units, final versus added volume, matched blank matrix, and measurement-range assumptions are explicit. The set varies forward calculation, calibration interpretation, dilution, compensating variables, wavelength sensitivity, optical contamination, blank design, slope/path information, interference/identifiability, validated range, and species-dependent absorptivity. No third-party questions consulted. Same-assistant separate checks are not independent human scientific approval.
