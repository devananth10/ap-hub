# Topic 1.1 addition and demo removal — 2026-10-17

Status: the owner explicitly authorized exactly one additional question after validation and removal (not relocation) of the Topic 1.5 demo. Existing questions 001–010 remain byte-equivalent as parsed objects to the original supplied batch. Their IDs, options, correct indexes, and explanations were not edited.

Scope: official CED effective Fall 2024, applicable to 2026–27, printed p.30 / PDF p.37, Topic 1.1, LO 1.1.A and its mass/mole relationships. Skill 5.F: a quantitative pathway with units and precision. The weighing-boat scenario adds experimental error reasoning to the original set without requiring gas laws, reaction stoichiometry, mixtures, isotope abundances, or later-unit equations.

## Question chem-1-1-011

The new scenario concerns an untared 0.250 g boat. Total displayed mass is 6.350 g. Copper molar mass is supplied as 63.50 g/mol. Desired amount is 0.1000 mol. No sample loss or balance error is allowed by the prompt.

Separate solve pass (same assistant, not independent human review):

- Copper mass = 6.350 − 0.250 = 6.100 g.
- Copper amount = 6.100 / 63.50 = 0.096062992125984… mol → 0.09606 mol, four significant figures.
- Desired copper mass = 0.1000 × 63.50 = 6.350 g.
- Required addition = 6.350 − 6.100 = 0.250 g.
- A has the correct amount but the wrong adjustment direction. B includes the boat in the copper mass. C adds the boat mass instead of subtracting it. Only D gives both correct results.

The calculation was rerun using Python Decimal from the prompt inputs, without consulting the drafted explanation. All four options were checked. The first ten approved question objects were compared with the original supplied batch using object equality: passed.

QC: 11 total questions; globally unique IDs 001–011; four distinct options each; indexes 0–3; answer counts A/B/C/D = 3/2/3/3; no repeating key cycle. New question has one defensible answer under the stated assumptions, a complete explanation of every option, and valid UTF-8 JSON. Originality: newly authored balance/tare scenario; unlike the existing ten, it requires evaluating an experimental mass-reading error and its correction.

Human scientific review: not performed or claimed. Publication authorization for this one addition is the owner's explicit instruction in this chat; it does not authorize publishing the remaining pending topic drafts.

Topic 1.5: its demo question was deleted from lesson data and the practice registry. Its route, lesson overview, notes, summary, completion key, and video/resource workspace remain. Its practice count is zero until a proper set is reviewed and approved. No demo was moved into Topic 1.1.

Source: https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf (accessed 2026-10-17).

## Preserved ten-question audit

Read every original prompt, option, key, and explanation without editing them. Recalculation confirms: 001 equal representative-particle counts but differing mass/atom counts; 002 1.2044×10^23 CO2 molecules; 003 3.011×10^23 chloride ions; 004 14.0 g N2; 005 smallest molar mass gives the most molecules at equal mass; 006 2.4088×10^24 oxygen atoms; 007 29.22 g NaCl; 008 approximately 30.97 g per mole of P atoms; 009 Ca:Zn atom ratio 65.4/40.1≈1.63; 010 1.2044×10^22 atoms. All keys and explanations match those results. Programmatic checks now cover the numerical values.

Potential future editorial review only: 002/010 use the same mass-to-particle pathway, and 005/009 both compare equal-mass samples. These are preserved approved questions, not permission to regenerate them. Their different particle representations and comparison forms remain usable; no content correction is proposed as necessary for scientific correctness. The new 011 adds an experimental tare-error application rather than another direct conversion.
