# Topic 6.4 — Heat Capacity and Calorimetry

Reviewed 2026-10-18. Eleven original questions; **human scientific review and owner approval pending**. Exact ID `topic-6-4`; not imported.

Authority: [College Board CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), Fall 2024, accessed 2026-10-17, printed pp.115–116 / PDF122–123. LO6.4.A, EK .1–.7: q=mcΔT, conservation, different specific heats, warming/cooling, molar versus mass capacity, distinct phase/reaction/heating contributions and dissolution sign. Suggested skill2.D lab-data precision. No phase-transition calculation, pressure-volume work, reaction enthalpy per mole, Hess law, or temperature-dependent heat-capacity integration. Constant capacities, relevant thermal mass, negligible losses/work or the specified controlled error are explicit.

Python Decimal independently computed q2510.4J,−750.75J, ΔT90K, c.750, reaction−2250J, mixing60°C, dissolution+1757.28J, C200J/K and c1.50/q60J. Separate units/boundary/error pass produced C/A/D/B/C/D/A/B/D/C/B; positions2/3/3/3. Science script repeats calculations, mixing energy cancellation and molar/mass consistency. Numerical verification is not human scientific approval.

| Suffix | Separate solve and alternatives |
| --- | --- |
| 001 | 50×4.184×12=2510.4J positive; wrongfactor10/sign/finalT rejected. |
| 002 | 30×.385×(25−90)=−750.75J; initial/finalabsoluteT notΔT. |
| 003 | .250×24=6J/K;540/6=90K. Mustcombine molarcapacitywithmoles. |
| 004 | 225/(15×20)=.750J/gK. Totalcapacity11.25J/K distinct. |
| 005 | Solution2000+hardware250=2250Jabsorbed, reaction−2250J. Sharedtemperaturechange explicit. |
| 006 | 200(T−80)+100(T−20)=0→60°C; samec cancels. Unweighted50requires equalthermalmasses. |
| 007 | Equalq/m givesΔTA/ΔTB=cB/cA=2. |
| 008 | Mixture−1757.28J; dissolutionopposite+1757.28J. Finalmixturemass/cprovided. |
| 009 | 1200/(16−10)=200J/K, totalnotmass-specific. |
| 010 | Heatleak reducesobservedrise andinferredexomagnitude, notnecessarily reversingsign. Finalabovestart explicit. |
| 011 | Cm/M=1.50,10×1.50×4=60J; nCmΔT agrees. |

No third-party questions consulted. Same-assistant separate calculation/solve passes are not independent human scientific approval.
