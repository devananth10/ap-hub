# Topic 5.3 — Concentration Changes Over Time

Reviewed 2026-10-18. Eleven original questions; **human scientific review and owner approval pending**. Exact ID `topic-5-3`; not imported.

Authority: [College Board CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), Fall 2024, accessed 2026-10-17, printed pp.96–97 / PDF103–104. LO5.3.A and EK .1–.6: concentration-time plots, natural-log first-order and reciprocal second-order linearity, integrated-law slopes/k, first-order half-life and radioactive decay. Suggested skill5.B. Second-order half-life expression is supplied as an application of the integrated law, not assumed memorized. No multireactant integrated derivation, calculus solution, radioactive nuclear reaction/radiation-risk assessment, or Arrhenius equation is required. Differential rate conventions and logarithm reference concentration are explicit where needed.

Python Decimal independently computed zero-order .300M at100s, second-order k.100, .100M after three half-lives, reciprocal prediction .142857M, ln5/.0400=40.2359478s, and second-order half-lives10/5s. Separate plot/model/units pass produced B/D/C/A/C/B/D/A/D/C/B; distribution2/3/3/3. Science script repeats values, contrasting half-life trends and the known blank-offset effect on a simulated first-order log plot.

| Suffix | Separate solve and alternatives |
| --- | --- |
| 001 | Linearln slope−.0200 gives first-order k+.0200 s−1; not negative k or another transformed axis. |
| 002 | k=.300/60=.00500M/s; [A]100=.800−.500=.300M, before depletion. Wrong choices omit extrapolation or apply inappropriate losses. |
| 003 | (10−5)/50=.100 M−1s−1. Zero-order difference, first-order logarithm and reciprocal sum all wrong. |
| 004 | Three30s half-lives, .800/8=.100M, not linear exhaustion. |
| 005 | Activity64→32→16→8: three8h periods=24h. Closed sample and proportional activity explicitly supplied. |
| 006 | 1/[A]=4+.0250×120=7M−1, concentration1/7=.143M. Must include intercept and invert. |
| 007 | Narrow/noisy range can leave multiple models unresolved; more controlled data needed, not arbitrary exact order. |
| 008 | ln5/.0400=40.2359478s. Not difference/k, one half-life, or raw ratio/k. |
| 009 | .400/20=.200/10=.0200M/s; zero order with halving times20 then10. First constant; second halving times lengthen as concentration falls. |
| 010 | 1/(.500×.200)=10s; doubled initial gives5s. Supplied law avoids hidden coefficient convention. |
| 011 | Additive blank must be removed before logarithmic concentration test; constant multiplier affects only intercept. Does not claim data necessarily prove first order. |

No third-party questions consulted. Same-assistant separate calculation/solve passes are not independent human scientific approval.
