# PrepAtlas AP Chemistry — recovered draft text (UNAUDITED)

Prepared October 17, 2026, from the returned history of **PrepAtlas AP Chemistry Bank**.

This companion preserves only text actually retrieved. It is not a complete archive of the prior conversation. These drafts have not been independently scientifically/curriculum verified, approved, or confirmed imported by this handoff task. Historical topicId values are unconfirmed against CONTENT_IMPORT_GUIDE.md. Preserve this archive as provenance; audit and correct separate working files before creating importable JSON.

Complete recovered sets: 1.4, 1.5, 1.8 (11 question objects each; syntax/count checked only). Truncated excerpts: 1.6, 1.7, 2.1. Full text for 1.2, 1.3, 2.2, and 2.3 was not returned. A content-reference marker did not expose the missing text. Request an export or paste of the full topic drafts; do not invent their endings or claim newly written material was recovered.

Follow **PrepAtlas_AP_Chemistry_Codex_Handoff.md** for exact standards, audit requirements, source verification, project preservation, and incremental import instructions.

## Topic 1.4 — complete retrieved draft; UNAUDITED

The full returned text parses as JSON and contains 11 questions. Scientific accuracy, curriculum alignment, authoritative IDs, answer balance, and import status have not been validated.

```json
{
  "courseId": "chemistry",
  "unitNumber": 1,
  "topicId": "composition-of-mixtures",
  "questions": [
    {
      "id": "chem-1-4-001",
      "prompt": "A laboratory analyzes two samples that are claimed to be the same pure compound containing only elements X and Y. Sample A contains 40.0% X by mass, while Sample B contains 55.0% X by mass. Assuming the measurements are accurate, which conclusion is best supported by the data?",
      "options": [
        "Both samples must be the same pure compound because they contain the same two elements.",
        "The difference in mass percentages can be explained solely by the samples having different total masses.",
        "The samples cannot both be the same pure compound because a pure compound has a fixed elemental composition by mass.",
        "Sample B must contain more atoms of X than Sample A, regardless of the total masses of the samples."
      ],
      "correctIndex": 2,
      "explanation": "C is correct. According to the law of definite proportions, a pure compound has a fixed elemental composition by mass, regardless of sample size. If Sample A contains 40.0% X and Sample B contains 55.0% X, the samples cannot both be accurately measured samples of the same pure compound. At least one sample may contain an impurity, or the samples may represent different compounds. A is incorrect because different compounds can contain the same elements in different proportions. B is incorrect because changing the total mass of a pure compound does not change its elemental mass percentages. D is incorrect because the percentage by mass alone does not establish the absolute number of atoms in a sample. The total sample masses would also be needed. The evidence establishes a difference in composition, not the specific cause of that difference."
    },
    {
      "id": "chem-1-4-002",
      "prompt": "A 10.0 g sample consists of pure NaCl mixed with sand that contains no chlorine. Elemental analysis shows that the sample contains 3.55 g of chlorine. What percentage of the original sample is NaCl by mass? Use atomic masses Na = 23.0 amu and Cl = 35.5 amu.",
      "options": [
        "58.5%",
        "35.5%",
        "60.7%",
        "41.5%"
      ],
      "correctIndex": 0,
      "explanation": "A is correct. The molar mass of NaCl is 23.0 + 35.5 = 58.5 g/mol. Chlorine accounts for 35.5/58.5 = 0.6068 of the mass of pure NaCl. Because all the chlorine in the sample comes from NaCl, the mass of NaCl is 3.55 g divided by 0.6068, giving 5.85 g. The percentage of NaCl in the original sample is (5.85 g/10.0 g) × 100% = 58.5%. B is incorrect because it treats the numerical mass of chlorine, 3.55 g, as though it directly represented 35.5% of the sample. C is incorrect because 60.7% is the percentage of chlorine within pure NaCl, not the percentage of NaCl in the mixture. D is incorrect because 41.5% is the percentage of sand in the mixture. Elemental analysis can determine the purity of a sample when the composition of the desired compound and the contribution of impurities are known."
    },
    {
      "id": "chem-1-4-003",
      "prompt": "A 12.00 g mixture contains only NaCl and KCl. Elemental analysis determines that the mixture contains 2.30 g of sodium. What is the mass of KCl in the mixture? Use atomic masses Na = 23.0 amu, K = 39.1 amu, and Cl = 35.5 amu.",
      "options": [
        "2.30 g",
        "5.85 g",
        "9.70 g",
        "6.15 g"
      ],
      "correctIndex": 3,
      "explanation": "D is correct. Sodium is present only in NaCl, so the measured sodium mass can be used to determine the amount of NaCl. The number of moles of sodium is 2.30 g/23.0 g/mol = 0.100 mol. Because each NaCl formula unit contains one sodium ion, the mixture contains 0.100 mol NaCl. The mass of NaCl is 0.100 mol × 58.5 g/mol = 5.85 g. The remaining mass must be KCl: 12.00 g - 5.85 g = 6.15 g. A is incorrect because 2.30 g is the measured mass of sodium alone, not the mass of KCl. B is incorrect because 5.85 g is the calculated mass of NaCl. C is incorrect because subtracting the sodium mass directly from the total mass ignores the chlorine associated with sodium in NaCl. This problem demonstrates how the measured mass of an element found in only one component can reveal the composition of a mixture."
    },
    {
      "id": "chem-1-4-004",
      "prompt": "A gaseous mixture contains 0.200 mol of CO and 0.200 mol of CO₂. What percentage of the total mass of the mixture is carbon? Use atomic masses C = 12.0 amu and O = 16.0 amu.",
      "options": [
        "27.3%",
        "33.3%",
        "42.9%",
        "50.0%"
      ],
      "correctIndex": 1,
      "explanation": "B is correct. The molar masses of CO and CO₂ are 28.0 g/mol and 44.0 g/mol, respectively. The mass of CO is 0.200 mol × 28.0 g/mol = 5.60 g, and the mass of CO₂ is 0.200 mol × 44.0 g/mol = 8.80 g. The total mixture mass is 14.40 g. Each molecule of CO and CO₂ contains one carbon atom, so the total amount of carbon is 0.400 mol. The carbon mass is 0.400 mol × 12.0 g/mol = 4.80 g. Therefore, the carbon mass percentage is (4.80/14.40) × 100% = 33.3%. A is incorrect because 27.3% is the carbon mass percentage in pure CO₂, not the mixture. C is incorrect because 42.9% is the carbon mass percentage in pure CO. D is incorrect because equal mole amounts of CO and CO₂ do not imply that carbon accounts for half the total mass. The elemental composition of a mixture depends on both the chemical formulas and the relative amounts of its components."
    },
    {
      "id": "chem-1-4-005",
      "prompt": "A particulate model represents two samples containing stable molecular substances A and B. Sample P contains 8 molecules of A and 4 molecules of B. Sample Q contains 4 molecules of A and 8 molecules of B. No chemical reaction occurs when A and B are combined. Which statement best describes the samples?",
      "options": [
        "Both samples are pure compounds because each contains only two types of molecules.",
        "Sample P has the chemical formula A₂B, while Sample Q has the chemical formula AB₂.",
        "Both samples are mixtures of the same two substances, but their relative compositions differ.",
        "The samples must contain different chemical elements because their numbers of A and B molecules differ."
      ],
      "correctIndex": 2,
      "explanation": "C is correct. A mixture contains two or more distinct substances whose relative proportions can vary. Sample P has an A:B molecular number ratio of 8:4, or 2:1. Sample Q has an A:B ratio of 4:8, or 1:2. Both samples contain the same two molecular substances, but their compositions differ. A is incorrect because a pure substance contains only one type of constituent particle; both samples contain two distinct types of molecules. B is incorrect because A₂B and AB₂ would represent chemical formulas describing atoms chemically combined within individual particles, whereas the model describes separate molecules of A and B. D is incorrect because changing the relative numbers of molecules does not change the chemical identities of A and B. This distinction explains why mixtures can have variable compositions while pure compounds have fixed chemical formulas."
    },
    {
      "id": "chem-1-4-006",
      "prompt": "A pure compound contains 40.0% carbon by mass. A 5.00 g laboratory sample contains the compound mixed with an impurity that contains no carbon. Elemental analysis shows that the laboratory sample contains 36.0% carbon by mass. What percentage of the laboratory sample is the pure compound?",
      "options": [
        "90.0%",
        "10.0%",
        "36.0%",
        "40.0%"
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Because the impurity contains no carbon, all the carbon measured in the laboratory sample must come from the pure compound. The mass of carbon in the 5.00 g sample is 5.00 g × 0.360 = 1.80 g. Since carbon represents 40.0% of the pure compound's mass, the mass of pure compound is 1.80 g/0.400 = 4.50 g. The percentage of pure compound in the laboratory sample is (4.50 g/5.00 g) × 100% = 90.0%. Equivalently, the purity can be calculated directly as 36.0%/40.0% = 0.900. B is incorrect because 10.0% is the impurity percentage, not the purity. C is incorrect because 36.0% is the carbon percentage of the entire laboratory sample. D is incorrect because 40.0% is the carbon percentage within the pure compound. This method works because the impurity is specified to contain none of the element used in the analysis."
    },
    {
      "id": "chem-1-4-007",
      "prompt": "Two samples each have a total mass of 4.00 g. Sample A contains pure NaCl, while Sample B contains pure KCl. Which statement correctly compares the masses of chlorine in the samples? Use atomic masses Na = 23.0 amu, K = 39.1 amu, and Cl = 35.5 amu.",
      "options": [
        "Both samples contain the same mass of chlorine because their total masses are equal.",
        "Sample A contains more chlorine by mass because chlorine represents a greater fraction of the mass of NaCl than of KCl.",
        "Sample B contains more chlorine by mass because potassium has a greater atomic mass than sodium.",
        "Neither sample contains chlorine atoms because chlorine is present as chloride ions."
      ],
      "correctIndex": 1,
      "explanation": "B is correct. The molar mass of NaCl is 58.5 g/mol, so its chlorine mass fraction is 35.5/58.5 = 0.6068. A 4.00 g sample of NaCl therefore contains approximately 2.43 g chlorine. The molar mass of KCl is 74.6 g/mol, so its chlorine mass fraction is 35.5/74.6 = 0.4759. A 4.00 g sample of KCl contains approximately 1.90 g chlorine. Sample A consequently contains more chlorine by mass. A is incorrect because equal total masses of different compounds do not necessarily contain equal masses of a particular element. C is incorrect because the greater atomic mass of potassium increases the fraction of the compound's mass contributed by potassium, decreasing the chlorine mass percentage. D is incorrect because chloride ions still contain chlorine atoms; gaining an electron changes the ionic charge but not the elemental identity. Elemental mass percentages depend on the formula and molar mass of each compound."
    },
    {
      "id": "chem-1-4-008",
      "prompt": "A gas mixture contains 2.20 g of CO₂ and 3.20 g of O₂. What percentage of the total mass of the mixture is oxygen? Use atomic masses C = 12.0 amu and O = 16.0 amu.",
      "options": [
        "59.3%",
        "29.6%",
        "40.7%",
        "88.9%"
      ],
      "correctIndex": 3,
      "explanation": "D is correct. Oxygen is present in both components of the mixture. The molar mass of CO₂ is 44.0 g/mol, of which 32.0 g/mol comes from oxygen. Therefore, the mass of oxygen contributed by CO₂ is 2.20 g × (32.0/44.0) = 1.60 g. Because O₂ contains only oxygen, the 3.20 g of O₂ contributes another 3.20 g of oxygen. The total oxygen mass is 1.60 g + 3.20 g = 4.80 g. The total mixture mass is 2.20 g + 3.20 g = 5.40 g. The oxygen mass percentage is (4.80/5.40) × 100% = 88.9%. A is incorrect because 59.3% counts only the oxygen from O₂ and ignores the oxygen in CO₂. B is incorrect because 29.6% counts only the oxygen contributed by CO₂. C is incorrect because 40.7% is the mass percentage of CO₂ in the mixture, not the percentage of oxygen. Elemental analysis of a mixture must account for an element's contribution from every component containing that element."
    },
    {
      "id": "chem-1-4-009",
      "prompt": "A 10.0 g solid mixture contains only CaCO₃ and SiO₂. Elemental analysis shows that the mixture contains 2.00 g of calcium. What percentage of the mixture is CaCO₃ by mass? Use atomic masses Ca = 40.0 amu, C = 12.0 amu, O = 16.0 amu, and Si = 28.1 amu.",
      "options": [
        "50.0%",
        "20.0%",
        "40.0%",
        "80.0%"
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Calcium is present only in CaCO₃, so the calcium mass can be used to determine the amount of CaCO₃ in the mixture. The molar mass of CaCO₃ is 40.0 + 12.0 + 3(16.0) = 100.0 g/mol. Calcium therefore accounts for 40.0/100.0 = 0.400 of the mass of pure CaCO₃. The mass of CaCO₃ in the mixture is 2.00 g/0.400 = 5.00 g. The percentage of CaCO₃ in the original sample is (5.00 g/10.0 g) × 100% = 50.0%. B is incorrect because 20.0% is the percentage of calcium in the entire mixture, not the percentage of CaCO₃. C is incorrect because 40.0% is the calcium mass percentage within pure CaCO₃. D is incorrect because it does not account correctly for the fact that calcium represents only 40.0% of the mass of CaCO₃. The remaining 5.00 g of the mixture is SiO₂. This calculation is possible because SiO₂ contains no calcium."
    },
    {
      "id": "chem-1-4-010",
      "prompt": "A pure sample of MgO contains approximately 39.7% oxygen by mass. A laboratory sample believed to contain MgO is found to contain only 30.0% oxygen by mass. Assuming the sample contains MgO mixed with exactly one of the substances listed below, which impurity could explain the lower measured oxygen percentage? Use atomic masses Mg = 24.3 amu, Si = 28.1 amu, H = 1.0 amu, and O = 16.0 amu.",
      "options": [
        "Pure O₂, which contains 100% oxygen by mass",
        "H₂O, which contains approximately 88.9% oxygen by mass",
        "Mg metal, which contains 0% oxygen by mass",
        "SiO₂, which contains approximately 53.3% oxygen by mass"
      ],
      "correctIndex": 2,
      "explanation": "C is correct. A mixture's elemental mass percentage is a mass-weighted average of the elemental mass percentages of its components. Pure MgO contains approximately 16.0/(24.3 + 16.0) × 100% = 39.7% oxygen. Mixing MgO with magnesium metal, which contains no oxygen, decreases the overall oxygen percentage. A sufficiently large amount of Mg metal could reduce the oxygen percentage to 30.0%. A is incorrect because adding pure O₂, which contains 100% oxygen by mass, would increase the oxygen percentage above 39.7%. B is incorrect because water contains approximately 88.9% oxygen by mass, so adding water would also increase the oxygen percentage. D is incorrect because SiO₂ contains approximately 53.3% oxygen by mass, greater than the oxygen percentage of MgO, so adding SiO₂ would increase rather than decrease the mixture's oxygen percentage. The measured composition of a mixture must lie between the corresponding elemental mass percentages of its components."
    },
    {
      "id": "chem-1-4-011",
      "prompt": "A student analyzes a homogeneous aqueous NaCl solution that is known to contain 15.0% NaCl by mass. The student places 20.0 g of the solution in an evaporating dish and heats it to remove the water. The student then measures 3.50 g of solid residue, even though the expected mass of NaCl is 3.00 g. Which experimental error would best explain the unexpectedly high measured residue mass?",
      "options": [
        "Some NaCl was accidentally spilled from the evaporating dish before the final mass was measured.",
        "Some water remained in the evaporating dish with the NaCl when the residue was weighed.",
        "The original solution contained less than 15.0% NaCl by mass.",
        "Some NaCl was lost through splattering during the heating process."
      ],
      "correctIndex": 1,
      "explanation": "B is correct. A 20.0 g sample of a solution containing 15.0% NaCl by mass should contain 20.0 g × 0.150 = 3.00 g NaCl. If the water is completely removed without losing any NaCl, the final dry residue should have a mass of 3.00 g. A measured residue mass of 3.50 g is greater than expected. If some water remained in the evaporating dish, the measured mass would include both NaCl and residual water, producing an artificially high result. A is incorrect because spilling NaCl would decrease the measured residue mass. C is incorrect because a lower initial NaCl concentration would produce less than 3.00 g of NaCl in a 20.0 g sample, not more. D is incorrect because losing NaCl through splattering would also decrease the measured residue mass. This experiment illustrates how the composition of a mixture can be determined through mass measurements and how incomplete separation can introduce systematic error."
    }
  ]
}
```

## Topic 1.5 — complete retrieved draft; UNAUDITED

The full returned text parses as JSON and contains 11 questions. Scientific accuracy, curriculum alignment, authoritative IDs, answer balance, and import status have not been validated.

```json
{
  "courseId": "chemistry",
  "unitNumber": 1,
  "topicId": "electron-configuration",
  "questions": [
    {
      "id": "chem-1-5-001",
      "prompt": "A neutral phosphorus atom has an atomic number of 15. Which electron configuration correctly represents phosphorus in its ground state?",
      "options": [
        "[Ne] 3s² 3p²",
        "[Ne] 3s² 3p³",
        "[Ne] 3s² 3p⁴",
        "[Ne] 3s¹ 3p⁴"
      ],
      "correctIndex": 1,
      "explanation": "B is correct. A neutral phosphorus atom contains 15 electrons. The neon core represents 10 electrons, leaving five electrons to occupy the third energy level. According to the Aufbau principle, the lower-energy 3s subshell fills before the 3p subshell. Two electrons occupy 3s, and the remaining three occupy 3p, producing [Ne] 3s² 3p³. A is incorrect because it represents only 14 electrons, corresponding to neutral silicon. C is incorrect because it represents 16 electrons, corresponding to neutral sulfur. D is incorrect because it contains 15 electrons but does not represent the ground state: an electron has been placed in the higher-energy 3p subshell while the lower-energy 3s subshell remains incompletely filled. A correct ground-state electron configuration must satisfy both the electron count and the expected filling order."
    },
    {
      "id": "chem-1-5-002",
      "prompt": "A neutral nitrogen atom has the electron configuration 1s² 2s² 2p³. Which orbital diagram correctly represents the three electrons in its 2p subshell in the ground state? Each pair of brackets represents one orbital.",
      "options": [
        "[↑↓] [↑] [ ]",
        "[↑↓] [↑↓] [↑]",
        "[↑] [↑] [ ]",
        "[↑] [↑] [↑]"
      ],
      "correctIndex": 3,
      "explanation": "D is correct. The 2p subshell contains three orbitals of equal energy. According to Hund's rule, electrons occupy these orbitals individually with parallel spins before any pairing occurs. Nitrogen has three 2p electrons, so its ground-state orbital diagram is [↑] [↑] [↑]. A is incorrect because it pairs two electrons in one orbital while another orbital remains empty, violating Hund's rule for the ground state. B is incorrect because it represents five electrons in the 2p subshell rather than the three electrons present in nitrogen. C is incorrect because it represents only two 2p electrons. The correct diagram must show the appropriate number of electrons distributed according to the Aufbau principle, Hund's rule, and the Pauli exclusion principle."
    },
    {
      "id": "chem-1-5-003",
      "prompt": "A neutral oxygen atom has eight protons and eight electrons. When the atom gains two electrons to form O²⁻, which electron configuration represents the resulting ion in its ground state?",
      "options": [
        "1s² 2s² 2p⁶",
        "1s² 2s² 2p⁴",
        "1s² 2s² 2p⁵",
        "1s² 2s² 2p⁸"
      ],
      "correctIndex": 0,
      "explanation": "A is correct. A neutral oxygen atom has eight electrons and the configuration 1s² 2s² 2p⁴. Forming O²⁻ requires gaining two electrons, increasing the total electron count to ten. Both additional electrons enter the 2p subshell, producing 1s² 2s² 2p⁶. This is the same electron configuration as neutral neon. B is incorrect because it represents neutral oxygen before the two electrons are gained. C is incorrect because it contains nine electrons and corresponds to O⁻ rather than O²⁻. D is incorrect because a p subshell can accommodate a maximum of six electrons, not eight. The formation of an anion changes the number of electrons but does not change the number of protons in the nucleus."
    },
    {
      "id": "chem-1-5-004",
      "prompt": "Neutral sodium and magnesium atoms have the ground-state electron configurations [Ne] 3s¹ and [Ne] 3s², respectively. The first ionization energy of magnesium is greater than that of sodium. Which explanation best accounts for this difference?",
      "options": [
        "The outermost electron of sodium is more strongly attracted to the nucleus because sodium has fewer protons.",
        "Both atoms have electrons in the 3s subshell, so their first ionization energies must be identical.",
        "Magnesium has a greater nuclear charge with similar core-electron shielding, resulting in a stronger net attraction for its 3s electrons.",
        "Magnesium has a lower first ionization energy because electron-electron repulsion in its filled 3s subshell completely cancels the additional nuclear attraction."
      ],
      "correctIndex": 2,
      "explanation": "C is correct. Sodium has 11 protons, while magnesium has 12. Both atoms contain the same neon-like core of ten electrons, and their outermost electrons occupy the 3s subshell. Because magnesium has a greater nuclear charge while experiencing broadly similar core-electron shielding, its 3s electrons experience a stronger effective nuclear attraction. Consequently, more energy is required to remove the first electron from magnesium. A is incorrect because sodium's smaller nuclear charge generally produces weaker attraction for an electron in the same subshell when shielding is comparable. B is incorrect because electrons occupying the same subshell in different elements can experience different effective nuclear charges. D is incorrect because although electron-electron repulsion influences electron energies, it does not completely cancel magnesium's greater nuclear attraction. The experimentally observed first ionization energy of magnesium is higher than that of sodium. This comparison illustrates the qualitative application of Coulomb's law to electron binding."
    },
    {
      "id": "chem-1-5-005",
      "prompt": "A neutral sulfur atom has an atomic number of 16 and a ground-state electron configuration of 1s² 2s² 2p⁶ 3s² 3p⁴. How many core electrons and valence electrons does the atom contain, respectively?",
      "options": [
        "12 core electrons and 4 valence electrons",
        "10 core electrons and 6 valence electrons",
        "6 core electrons and 10 valence electrons",
        "0 core electrons and 16 valence electrons"
      ],
      "correctIndex": 1,
      "explanation": "B is correct. For a main-group atom, valence electrons occupy the outermost principal energy level. Sulfur's highest occupied principal energy level is n = 3, containing two electrons in 3s and four in 3p. Sulfur therefore has six valence electrons. The remaining ten electrons occupy the inner 1s, 2s, and 2p subshells and are classified as core electrons. A is incorrect because it counts only the four 3p electrons as valence electrons and incorrectly includes the two 3s electrons among the core electrons. C is incorrect because it reverses the correct numbers of core and valence electrons. D is incorrect because not all electrons in an atom are valence electrons; electrons occupying lower principal energy levels are generally classified as core electrons. Distinguishing core and valence electrons is important because the outer electrons are most directly involved in chemical bonding and reactions."
    },
    {
      "id": "chem-1-5-006",
      "prompt": "A student is determining the ground-state electron configuration of a neutral potassium atom, which has atomic number 19. After accounting for the first 18 electrons, the student must place one additional electron. Which configuration correctly represents the ground state of potassium?",
      "options": [
        "[Ar] 4s¹",
        "[Ar] 3d¹",
        "[Ar] 4s²",
        "[Ar] 4p¹"
      ],
      "correctIndex": 0,
      "explanation": "A is correct. A neutral potassium atom contains 19 electrons. The argon core accounts for 18 electrons. According to the Aufbau principle, the next electron occupies the 4s subshell because 4s is lower in energy than 3d for the ground-state filling of neutral potassium. The configuration is therefore [Ar] 4s¹. B is incorrect because it places the nineteenth electron in 3d before occupying the lower-energy 4s subshell. C is incorrect because [Ar] 4s² contains 20 electrons and represents the ground-state configuration of neutral calcium. D is incorrect because it places the nineteenth electron in 4p while the lower-energy 4s subshell remains empty. The principal quantum number alone does not determine the order in which subshells fill; the relative energies of the subshells must also be considered."
    },
    {
      "id": "chem-1-5-007",
      "prompt": "A neutral iron atom has atomic number 26 and the ground-state electron configuration [Ar] 4s² 3d⁶. When iron forms Fe³⁺, three electrons are removed. Which configuration correctly represents Fe³⁺ in its ground state?",
      "options": [
        "[Ar] 4s² 3d³",
        "[Ar] 3d³",
        "[Ar] 4s¹ 3d⁴",
        "[Ar] 3d⁵"
      ],
      "correctIndex": 3,
      "explanation": "D is correct. Neutral iron has 26 electrons, while Fe³⁺ has 23 electrons. Although the 4s subshell fills before the 3d subshell in neutral iron, electrons are removed from 4s before 3d when forming iron cations. Removing the two 4s electrons from [Ar] 4s² 3d⁶ produces Fe²⁺ with the configuration [Ar] 3d⁶. Removing one additional 3d electron produces Fe³⁺ with the configuration [Ar] 3d⁵. A is incorrect because it removes three electrons from 3d while leaving the 4s electrons in place, which does not give the ground-state configuration of Fe³⁺. B is incorrect because [Ar] 3d³ contains only 21 electrons rather than the required 23. C is incorrect because it leaves an electron in 4s while removing additional electrons from 3d; this is not the ground-state arrangement of Fe³⁺. The order in which electrons are removed from transition-metal atoms is not necessarily the reverse of the order in which the subshells were initially filled."
    },
    {
      "id": "chem-1-5-008",
      "prompt": "In a simplified electrostatic model, an electron experiences an attractive force of magnitude F from a positively charged nucleus. In a second hypothetical system, the positive nuclear charge is doubled, but the electron is located twice as far from the nucleus. Assuming the charges can be treated as point charges and all other conditions remain unchanged, what is the magnitude of the attractive force in the second system?",
      "options": [
        "2F",
        "F",
        "F/2",
        "F/4"
      ],
      "correctIndex": 2,
      "explanation": "C is correct. According to Coulomb's law, the magnitude of the electrostatic force between two charged particles is proportional to the product of the magnitudes of their charges divided by the square of their separation: F ∝ |q₁q₂|/r². Doubling the positive nuclear charge increases the force by a factor of two, while doubling the separation decreases it by a factor of four. The combined change is 2/4 = 1/2, so the new force is F/2. A is incorrect because it considers only the doubled nuclear charge and ignores the increase in separation. B is incorrect because it effectively assumes that doubling the charge and doubling the distance cancel directly, overlooking the inverse-square dependence on distance. D is incorrect because it accounts for the doubled distance but ignores the doubled nuclear charge. This idealized model demonstrates how nuclear charge and electron-nucleus distance influence electrostatic attraction. In real multielectron atoms, shielding and electron distributions must also be considered."
    },
    {
      "id": "chem-1-5-009",
      "prompt": "A researcher examines an ion containing 17 protons, 18 neutrons, and 18 electrons. Which identification of the ion is correct?",
      "options": [
        "A chlorine-35 ion with a charge of −1",
        "A neutral argon-35 atom",
        "A neutral chlorine-35 atom",
        "A chlorine-36 ion with a charge of −1"
      ],
      "correctIndex": 0,
      "explanation": "A is correct. The number of protons determines the identity of an element. An atom or ion containing 17 protons is chlorine. The mass number equals the number of protons plus the number of neutrons: 17 + 18 = 35. The species is therefore chlorine-35. Because it contains 18 electrons but only 17 protons, it has one additional negative charge and is represented as ³⁵Cl⁻. B is incorrect because argon has 18 protons, whereas the given species has only 17. C is incorrect because a neutral chlorine atom would contain 17 electrons, not 18. D is incorrect because chlorine-36 would contain 19 neutrons rather than the specified 18. The proton count determines elemental identity, the neutron count determines the isotope, and the difference between proton and electron counts determines the ionic charge."
    },
    {
      "id": "chem-1-5-010",
      "prompt": "In a neutral sulfur atom, electrons occupy both the 3s and 3p subshells. Which statement best explains why a 3s electron generally requires more energy to remove than a 3p electron from the same atom?",
      "options": [
        "A 3p electron is more strongly attracted to the nucleus because the 3p subshell contains more electrons than the 3s subshell.",
        "A 3s electron has greater penetration toward the nucleus and experiences a stronger effective nuclear attraction than a 3p electron.",
        "Electrons in the 3s and 3p subshells must have identical binding energies because both subshells belong to the third principal energy level.",
        "A 3s electron is easier to remove because the 3s subshell can hold fewer electrons than the 3p subshell."
      ],
      "correctIndex": 1,
      "explanation": "B is correct. Although the 3s and 3p subshells belong to the same principal energy level, their electrons have different spatial distributions. A 3s electron has greater penetration toward the nucleus than a 3p electron, meaning it has a greater probability of being found relatively close to the nucleus. As a result, 3s electrons generally experience stronger effective nuclear attraction and have lower energy than 3p electrons in the same multielectron atom. More energy is therefore required to remove a 3s electron. A is incorrect because the number of electrons in a subshell does not by itself determine the strength of attraction between an electron and the nucleus. C is incorrect because subshells with the same principal energy level can have different energies in multielectron atoms due to penetration, shielding, and electron-electron interactions. D is incorrect because the maximum electron capacity of a subshell does not directly determine how strongly its electrons are bound. This comparison demonstrates why subshell energies depend on more than the principal energy level."
    },
    {
      "id": "chem-1-5-011",
      "prompt": "An unknown main-group element X forms a stable X²⁺ ion with the ground-state electron configuration [Ne] 3s² 3p⁶. Which element is X?",
      "options": [
        "Argon, Ar",
        "Sulfur, S",
        "Calcium, Ca",
        "Potassium, K"
      ],
      "correctIndex": 2,
      "explanation": "C is correct. The configuration [Ne] 3s² 3p⁶ contains 10 + 2 + 6 = 18 electrons. Because the ion has a charge of +2, its neutral parent atom must have contained two additional electrons, giving a total of 20 electrons. A neutral atom with 20 electrons has 20 protons and is calcium. Neutral calcium has the ground-state configuration [Ar] 4s². Removing its two 4s electrons produces Ca²⁺ with the configuration [Ar], equivalent to [Ne] 3s² 3p⁶. A is incorrect because neutral argon already contains 18 electrons, so Ar²⁺ would contain only 16 electrons. B is incorrect because sulfur has atomic number 16, and S²⁺ would contain 14 electrons rather than 18. D is incorrect because potassium has atomic number 19, so K²⁺ would contain 17 electrons. Identifying an element from an ionic electron configuration requires accounting for the ionic charge before determining the atomic number."
    }
  ]
}
```

## Topic 1.6 — TRUNCATED excerpt; NOT IMPORTABLE

The returned text is cut off. Do not repair by guessing, parse/import it as a complete bank, or assume that every visible question ID has a complete question body. Obtain the full original source before finalizing this topic.

```text
{
  "courseId": "chemistry",
  "unitNumber": 1,
  "topicId": "photoelectron-spectroscopy",
  "questions": [
    {
      "id": "chem-1-6-001",
      "prompt": "The photoelectron spectrum (PES) of an unknown neutral atom contains four peaks. In order of decreasing binding energy, the peaks have relative heights of 2, 2, 6, and 1. Assume that each peak corresponds to a different occupied subshell and that peak height is proportional to the number of electrons in that subshell. Which ground-state electron configuration is most consistent with the spectrum?",
      "options": [
        "1s² 2s² 2p⁶ 3s²",
        "1s² 2s² 2p⁶",
        "1s² 2s² 2p⁶ 3s¹",
        "1s² 2s² 2p⁶ 3p¹"
      ],
      "correctIndex": 2,
      "explanation": "C is correct. In an idealized PES spectrum, the relative height of each peak is proportional to the number of electrons occupying the corresponding subshell. The four peaks indicate electron populations of 2, 2, 6, and 1. Electrons in inner subshells generally have greater binding energies than electrons in outer subshells. Therefore, the peaks correspond to 1s², 2s², 2p⁶, and 3s¹, giving a total of 11 electrons. This is the ground-state electron configuration of neutral sodium. A is incorrect because it represents 12 electrons and would produce a final 3s peak with a relative height of 2 rather than 1. B is incorrect because it represents only 10 electrons and would produce three occupied-subshell peaks rather than four. D is incorrect because it places the eleventh electron in the higher-energy 3p subshell while the lower-energy 3s subshell remains empty. That arrangement is not the ground state of a neutral 11-electron atom. The spectrum provides experimental evidence for both the number of electrons in occupied subshells and their relative binding energies."
    },
    {
      "id": "chem-1-6-002",
      "prompt": "A researcher obtains the complete photoelectron spectrum of a neutral oxygen atom in its ground state. The spectrum contains peaks corresponding to the 1s, 2s, and 2p subshells. Which subshell produces the peak at the greatest binding energy?",
      "options": [
        "The 1s subshell, because its electrons are, on average, closest to the nucleus and experience strong electrostatic attraction.",
        "The 2p subshell, because it contains more electrons than either the 1s or 2s subshell.",
        "The 2s subshell, because its electrons have greater binding energies than electrons in the 1s subshell.",
        "All three subshells produce peaks at the same binding energy because their electrons are attracted to the same nucleus."
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Binding energy is the energy required to remove an electron from an atom or ion. The 1s electrons are, on average, much closer to the positively charged nucleus than the electrons in the second principal energy level. According to Coulomb's law, electrostatic attraction becomes stronger as the distance between opposite charges decreases. The 1s electrons also experience relatively little shielding by other electrons. Consequently, the 1s peak occurs at the greatest binding energy. B is incorrect because the number of electrons occupying a subshell determines its ideal relative peak height, not necessarily its binding energy. The four 2p electrons in oxygen are less tightly bound than the two 1s electrons. C is incorrect because 2s electrons are generally farther from the nucleus and more shielded than 1s electrons, so they have lower binding energies. D is incorrect because electrons in different subshells experience different effective nuclear attractions and therefore have different binding energies. PES distinguishes occupied subshells through these differences."
    },
    {
      "id": "chem-1-6-003",
      "prompt": "A scientist compares the photoelectron spectra of neutral sodium and magnesium atoms. Both atoms contain two electrons in the 2p subshell? No. Both atoms contain six electrons in the 2p subshell. The scientist observes that the 2p peak of magnesium occurs at a greater binding energy than the corresponding peak of sodium. Which explanation best accounts for this observation?",
      "options": [
        "Sodium has a lower 2p binding energy because its 2p subshell contains fewer electrons than magnesium's 2p subshell.",
        "The 2p binding energies should be identical because both atoms have six electrons in that subshell.",
        "Magnesium has a lower effective nuclear charge than sodium because magnesium contains more electrons.",
        "Magnesium has a greater nuclear charge while the 2p electrons experience broadly similar core-electron shielding, resulting in stronger electron-nucleus attraction."
      ],
      "correctIndex": 3,
      "explanation": "D is correct. Sodium has 11 protons, while magnesium has 12. Both neutral atoms contain six electrons in the 2p subshell and have the same number of electrons in the inner 1s and 2s subshells. Magnesium's greater nuclear charge produces a stronger effective attraction for its 2p electrons. As a result, more energy is required to remove a 2p electron from magnesium than from sodium. A is incorrect because both atoms contain six 2p electrons; their different binding energies cannot be explained by different 2p electron counts. B is incorrect because identical subshell populations do not guarantee identical binding energies. Nuclear charge and shielding must also be considered. C is incorrect because adding a proton while maintaining similar inner-electron shielding generally increases the effective nuclear attraction experienced by corresponding electrons. The shift in peak position demonstrates that PES provides information about electron-nucleus interactions in addition to electron counts."
    },
    {
      "id": "chem-1-6-004",
      "prompt": "An idealized photoelectron spectrum of an unknown neutral main-group atom contains five peaks. In order of decreasing binding energy, their relative heights are 2, 2, 6, 2, and 5. Assuming the atom is in its ground state, how many valence electrons does it contain?",
      "options": [
        "5",
        "7",
        "12",
        "17"
      ],
      "correctIndex": 1,
      "explanation": "B is correct. The five peaks correspond to the occupied subshells 1s², 2s², 2p⁶, 3s², and 3p⁵. The total number of electrons is 2 + 2 + 6 + 2 + 5 = 17, identifying the neutral atom as chlorine. For a main-group element, valence electrons occupy the outermost principal energy level. Chlorine's outermost occupied level is n = 3, which contains two 3s electrons and five 3p electrons. Therefore, chlorine has seven valence electrons. A is incorrect because it counts only the five electrons in 3p and omits the two valence electrons in 3s. C is incorrect because it does not correctly distinguish electrons in the outermost principal energy level from core electrons. D is incorrect because 17 is the total electron count, including both core and valence electrons. PES peak heights can be used to reconstruct the electron configuration and identify the number of valence electrons."
    },
    {
      "id": "chem-1-6-005",
      "prompt": "A researcher compares the photoelectron spectra of neutral nitrogen and oxygen atoms in their ground states. Nitrogen has the configuration 1s² 2s² 2p³, while oxygen has the configuration 1s² 2s² 2p⁴. Assuming ideal spectra in which peak height is proportional to the number of electrons in each subshell, which comparison is correct?",
      "options": [
        "Oxygen's 2p peak should be twice as tall as nitrogen's 2p peak because oxygen contains one additional electron.",
        "Nitrogen's 2p peak should be taller than oxygen's 2p peak because nitrogen has a half-filled 2p subshell.",
        "Oxygen's 2p peak should be four-thirds as tall as nitrogen's 2p peak, while their 2s peaks should have equal heights.",
        "Oxygen's 1s peak should be twice as tall as nitrogen's 1s peak because oxygen has a greater nuclear charge."
      ],
      "correctIndex": 2,
      "explanation": "C is correct. Nitrogen contains three electrons in its 2p subshell, while oxygen contains four. Because ideal PES peak height is proportional to the number of electrons occupying the subshell, the oxygen-to-nitrogen 2p peak-height ratio is 4/3. Both atoms contain two electrons in their 2s subshells, so their ideal 2s peak heights should be equal when measured using the same normalization. A is incorrect because oxygen has four 2p electrons compared with nitrogen's three, not twice as many. B is incorrect because the half-filled arrangement of nitrogen's 2p subshell does not increase its electron count or ideal peak height above that of oxygen. D is incorrect because both atoms contain two 1s electrons. Greater nuclear charge can affect the position of a PES peak by changing electron binding energy, but it does not double the number of electrons represented by that peak. This comparison illustrates the distinction between peak height, which reflects electron population, and peak position, which reflects binding energy."
    },
    {
      "id": "chem-1-6-006",
      "prompt": "A scientist obtains idealized photoelectron spectra of neutral calcium atoms and Ca²⁺ ions, both in their ground states. Neutral calcium has the electron configuration [Ar] 4s². Which change is expected when comparing the spectrum of Ca²⁺ with that of neutral calcium?",
      "options": [
        "The peak corresponding to the 4s subshell disappears because the two 4s electrons have been removed, while the peaks for the occupied inner subshells remain.",
        "The peak corresponding to the 3p subshell disappears because calcium loses its highest-energy core electrons when forming Ca²⁺.",
        "Every peak decreases in height by two units because the ion contains two fewer electrons than the neutral atom.",
        "The 4s peak remains unchanged because removing electrons to form a cation affects only the nucleus."
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Neutral calcium has 20 electrons and the ground-state configuration [Ar] 4s². When calcium forms Ca²⁺, it loses its two outermost 4s electrons, producing the configuration [Ar], which contains 18 electrons. Therefore, the Ca²⁺ spectrum no longer contains a peak corresponding to occupied 4s electrons. Peaks corresponding to the occupied 1s, 2s, 2p, 3s, and 3p subshells remain, although their binding energies may change because the ion has a different electron distribution and effective electron-nucleus interactions. B is incorrect because calcium loses electrons from 4s rather than 3p when forming Ca²⁺. C is incorrect because the two electrons are removed from one occupied subshell, not distributed as a loss of two electrons from every subshell. D is incorrect because ion formation changes the electron configuration even though the number of protons remains constant. Comparing PES spectra of atoms and their ions provides experimental evidence for which electrons are removed during ion formation."
    },
    {
      "id": "chem-1-6-007",
      "prompt": "A student examines an idealized PES spectrum of neutral silicon. The two peaks with the lowest binding energies each have a relative height of 2. One occurs at a binding energy of 1.8 MJ/mol, and the other occurs at 0.8 MJ/mol. The student assigns the 1.8 MJ/mol peak to the 3p subshell and the 0.8 MJ/mol peak to the 3s subshell. Which evaluation of the student's assignments is most appropriate?",
      "options": [
        "The assignments are correct because 3p electrons always have greater binding energies than 3s electrons.",
        "The assignments should be reversed because 3s electrons generally experience stronger effective nuclear attraction and have greater binding energies than 3p electrons in the same atom.",
        "Both peaks must correspond to the 3p subshell because the two peaks have equal heights.",
        "One of the peaks must correspond to the 2p subshell because the 3s and 3p subshells cannot each contain two electrons."
      ],
      "correctIndex": 1,
      "explanation": "B is correct. Neutral silicon has the ground-state electron configuration 1s² 2s² 2p⁶ 3s² 3p². Its two outermost occupied subshells each contain two electrons, so their ideal PES peaks can have equal heights. However, the 3s and 3p electrons have different binding energies. The 3s electrons have greater penetration toward the nucleus and generally experience stronger effective nuclear attraction than the 3p electrons. Therefore, the 3s peak should occur at the greater binding energy, 1.8 MJ/mol, while the 3p peak should occur at the lower binding energy, 0.8 MJ/mol. A is incorrect because it reverses the expected relative binding energies of 3s and 3p electrons. C is incorrect because different subshells can contain equal numbers of electrons and therefore produce peaks of equal height. D is incorrect because silicon's configuration contains two electrons in both 3s and 3p, so both peaks are consistent with those subshell populations. Peak height alone does not identify a subshell; relative binding energy and electron configuration must also be considered."
    },
    {
      "id": "chem-1-6-008",
      "prompt": "In a photoelectron spectroscopy experiment, atoms are irradiated with photons having an energy of 60 eV per photon. Electrons emitted from one particular subshell are measured to have a kinetic energy of 18 eV per electron. Assuming negligible additional energy losses and using the relationship photon energy = electron binding energy + emitted electron kinetic energy, what is the binding energy of electrons in that subshell?",
      "options": [
        "78 eV",
        "18 eV",
        "3.33 eV",
        "42 eV"
      ],
      "correctIndex": 3,
      "explanation": "D is correct. Conservation of energy requires that the energy supplied by an absorbed photon be divided between the energy needed to remove the electron and the kinetic energy of the emitted electron. Using the relationship provided in the prompt, binding energy = photon energy - kinetic energy = 60 eV - 18 eV = 42 eV. A is incorrect because adding the photon energy and kinetic energy gives 78 eV, but the kinetic energy is part of the supplied photon energy rather than an additional energy input. B is incorrect because 18 eV is the measured kinetic energy of the emitted electron, not its binding energy. C is incorrect because dividing 60 eV by 18 eV does not represent the energy balance and produces a dimensionless ratio rather than an energy. The calculation demonstrates how experimental measurements of emitted photoelectrons can be used to determine electron binding energies. Under the stated assumptions, the result is 42 eV per electron."
    },
    {
      "id": "chem-1-6-009",
      "prompt": "A researcher compares the idealized photoelectron spectra of neutral magnesium and aluminum atoms in their ground states. Magnesium has the configuration [Ne] 3s², while aluminum has the configuration [Ne] 3s² 3p¹. Which statement correctly predicts differences between their spectra?",
      "options": [
        "Aluminum should have an additional low-binding-energy peak corresponding to its 3p electron, and its 3s peak should occur at a greater binding energy than magnesium's 3s peak.",
        "Aluminum and magnesium should have the same number of peaks because both atoms contain electrons in the third principal energy level.",
        "Aluminum should have no 3s peak because its additional electron occupies the 3p subshell.",
        "Aluminum's 1s peak should occur at a lower binding energy than magnesium's 1s peak because aluminum has a greater nuclear charge."
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Magnesium has occupied 1s, 2s, 2p, and 3s subshells, giving four peaks in an idealized complete PES spectrum. Aluminum has an additional electron in the 3p subshell, producing a fifth peak at a binding energy lower than that of its 3s electrons. Aluminum also has 13 protons compared with magnesium's 12. Because corresponding 3s electrons experience broadly similar inner-electron shielding, aluminum's greater nuclear charge results in stronger effective attraction and a greater 3s binding energy. B is incorrect because the number of occupied subshells, not merely the number of occupied principal energy levels, determines the number of idealized PES peaks. C is incorrect because aluminum retains two electrons in 3s; adding an electron to 3p does not empty the 3s subshell. D is incorrect because aluminum's greater nuclear charge produces stronger attraction for its inner electrons, so its 1s binding energy is greater rather than smaller. The comparison shows how PES reveals both the occupation of an additional subshell and changes in electron binding energy across a period."
    },
    {
      "id": "chem-1-6-010",
      "prompt": "An unknown singly charged negative ion, X⁻, produces an idealized photoelectron spectrum with five peaks. In order of decreasing binding energy, the relative peak heights are 2, 2, 6, 2, and 6. Assuming the ion is in its ground state, which element is X?",
      "options": [
        "Sulfur, S",
        "Argon, Ar",
        "Chlorine, Cl",
        "Potassium, K"
      ],
      "correctIndex": 2,
      "explanation": "C is correct. The relative peak heights indicate the electron configuration 1s² 2s² 2p⁶ 3s² 3p⁶. Adding the electron populations gives 2 + 2 + 6 + 2 + 6 = 18 electrons. Because the species is X⁻, it contains one more electron than protons. Therefore, the nucleus contains 18 - 1 = 17 protons. Atomic number 17 corresponds to chlorine, so the ion is Cl⁻. A is incorrect because sulfur has 16 protons. A singly charged sulfur ion, S⁻, would contain 17 electrons rather than 18; S²⁻ would contain 18 electrons but has a different charge from the specified ion. B is incorrect because argon has 18 protons, so Ar⁻ would contain 19 electrons. D is incorrect because potassium has 19 protons, so K⁻ would contain 20 electrons. The problem demonstrates how PES data and ionic charge can be combined to determine the identity of an element."
    },
    {
      "id": "chem-1-6-011",
      "prompt": "A scientist compares the complete photoelectron spectra of neutral neon atoms and Mg²⁺ ions, both in their ground states. Both species have the electron configuration 1s² 2s² 2p⁶. Which statement best predicts the relationship between their spectra?",
      "options": [
        "The spectra must have identical peak positions because both species have the same electron configuration.",
        "The Mg²⁺ peaks should generally occur at greater binding energies because its 12-proton nucleus attracts the electrons more strongly than neon's 10-proton nucleus.",
        "The neon peaks should occur at greater binding energies because neon has fewer protons and therefore experiences less electron-electron repulsion.",
        "The Mg²⁺ spectrum should have a taller 2p peak because its positive charge increases the number of electrons occupying the 2p subshell."
      ],
      "correctIndex": 1,
      "explanation": "B is correct. Neon and Mg²⁺ are isoelectronic species, meaning they contain the same number of electrons and have the same electron configuration. Both contain ten electrons distributed as 1s² 2s² 2p⁶. However, neon has ten protons, while Mg²⁺ has twelve. Because the two species have the same electron count and similar patterns of electron shielding, the greater nuclear charge of Mg²⁺ produces stronger effective attraction for its electrons. Consequently, corresponding electrons in Mg²⁺ generally have greater binding energies than those in neon, so the PES peaks of Mg²⁺ occur at greater binding energies. A is incorrect because identical electron configurations do not guarantee identical binding energies when nuclear charges differ. C is incorrect 
```

**End of retrieved excerpt. Missing text has not been supplied or reconstructed.**

## Topic 1.7 — TRUNCATED excerpt; NOT IMPORTABLE

The returned text is cut off. Do not repair by guessing, parse/import it as a complete bank, or assume that every visible question ID has a complete question body. Obtain the full original source before finalizing this topic.

```text
{
  "courseId": "chemistry",
  "unitNumber": 1,
  "topicId": "periodic-trends",
  "questions": [
    {
      "id": "chem-1-7-001",
      "prompt": "Three neutral atoms, Na, Mg, and Al, are located consecutively in Period 3 of the periodic table. Which ordering correctly represents their atomic radii from largest to smallest, and why?",
      "options": [
        "Al > Mg > Na, because atomic radius increases as the number of protons increases across a period.",
        "Mg > Na > Al, because magnesium has a completely filled 3s subshell.",
        "Na > Mg > Al, because increasing nuclear charge across the period attracts the valence electrons more strongly while the number of occupied principal energy levels remains the same.",
        "Na > Al > Mg, because aluminum's additional 3p electron causes its atomic radius to exceed magnesium's."
      ],
      "correctIndex": 2,
      "explanation": "C is correct. Sodium, magnesium, and aluminum all have valence electrons in the third principal energy level. Moving from Na to Mg to Al, the number of protons increases from 11 to 12 to 13. Although electrons are also added, they enter the same principal energy level, so the additional shielding does not completely offset the increasing nuclear charge. The effective nuclear attraction experienced by the valence electrons generally increases, drawing the electron cloud closer to the nucleus. Therefore, the atomic radii decrease in the order Na > Mg > Al. A is incorrect because increasing nuclear charge across a period generally decreases, rather than increases, atomic radius. B is incorrect because a filled 3s subshell does not make magnesium larger than sodium; the increasing effective nuclear charge remains important. D is incorrect because adding an electron to aluminum's 3p subshell does not cause its atomic radius to exceed magnesium's. This trend illustrates how nuclear charge and shielding jointly determine atomic size."
    },
    {
      "id": "chem-1-7-002",
      "prompt": "The ions O²⁻, F⁻, Na⁺, and Mg²⁺ are isoelectronic, meaning each contains ten electrons. Which ion has the largest ionic radius?",
      "options": [
        "O²⁻, because it has the smallest nuclear charge and therefore attracts the shared ten-electron configuration least strongly.",
        "Mg²⁺, because its greater positive charge causes the electron cloud to expand.",
        "Na⁺, because sodium has more protons than oxygen and fluorine.",
        "F⁻, because fluorine has the greatest electronegativity among the four elements."
      ],
      "correctIndex": 0,
      "explanation": "A is correct. All four ions contain ten electrons with the configuration 1s² 2s² 2p⁶. However, their nuclear charges differ: oxygen has 8 protons, fluorine has 9, sodium has 11, and magnesium has 12. Because the electron configurations are identical, the ion with the smallest nuclear charge experiences the weakest electron-nucleus attraction and has the largest radius. The ionic radii therefore decrease in the order O²⁻ > F⁻ > Na⁺ > Mg²⁺. B is incorrect because magnesium's greater nuclear charge pulls its ten electrons more strongly toward the nucleus, making Mg²⁺ the smallest ion in this series. C is incorrect because sodium's greater nuclear charge makes Na⁺ smaller than O²⁻ and F⁻, not larger. D is incorrect because electronegativity describes an atom's tendency to attract shared electrons in a chemical bond and does not make F⁻ the largest of these isoelectronic ions. Comparing isoelectronic species demonstrates the importance of nuclear charge when electron count and electron configuration are held constant."
    },
    {
      "id": "chem-1-7-003",
      "prompt": "The first ionization energy of magnesium is approximately 738 kJ/mol, while that of aluminum is approximately 578 kJ/mol. This is an exception to the general increase in first ionization energy across a period. Which explanation best accounts for the lower first ionization energy of aluminum?",
      "options": [
        "Aluminum has fewer protons than magnesium, so its valence electrons experience weaker nuclear attraction.",
        "Magnesium has a larger atomic radius than aluminum, making its electrons easier to remove.",
        "Aluminum's first electron is removed from the 2p subshell, which is farther from the nucleus than magnesium's 3s subshell.",
        "Aluminum's first electron is removed from the higher-energy 3p subshell, whereas magnesium's first electron is removed from the lower-energy 3s subshell."
      ],
      "correctIndex": 3,
      "explanation": "D is correct. Magnesium has the ground-state electron configuration [Ne] 3s², while aluminum has [Ne] 3s² 3p¹. The first electron removed from magnesium comes from its filled 3s subshell. The first electron removed from aluminum comes from its higher-energy 3p subshell. Because the 3p electron is less penetrating and generally experiences weaker effective nuclear attraction than a 3s electron in the same atom, it is easier to remove despite aluminum's greater nuclear charge. Consequently, aluminum has a lower first ionization energy than magnesium. A is incorrect because aluminum has 13 protons, one more than magnesium's 12. B is incorrect because magnesium does have a larger atomic radius, but that observation alone would suggest weaker attraction in magnesium and does not explain why its first ionization energy is higher. C is incorrect because aluminum's outermost electron occupies the 3p subshell, not 2p. This exception shows that ionization energy depends on subshell energies and electron configurations, not merely on the number of protons."
    },
    {
      "id": "chem-1-7-004",
      "prompt": "Nitrogen has a first ionization energy of approximately 1402 kJ/mol, while oxygen has a first ionization energy of approximately 1314 kJ/mol. Why is nitrogen's first ionization energy greater even though oxygen has a higher nuclear charge?",
      "options": [
        "Nitrogen's valence electrons occupy a principal energy level closer to the nucleus than oxygen's valence electrons.",
        "Nitrogen has a half-filled 2p subshell with three unpaired electrons, while oxygen has one pair of 2p electrons whose repulsion makes an electron easier to remove.",
        "Oxygen has fewer protons than nitrogen, resulting in weaker attraction for its valence electrons.",
        "Nitrogen has more core electrons than oxygen, resulting in greater shielding and stronger electron binding."
      ],
      "correctIndex": 1,
      "explanation": "B is correct. Nitrogen has the configuration 1s² 2s² 2p³, with one electron occupying each of the three 2p orbitals. Oxygen has the configuration 1s² 2s² 2p⁴, requiring two electrons to occupy one 2p orbital. The paired electrons in oxygen experience additional electron-electron repulsion, making removal of one of them relatively favorable. Nitrogen's half-filled 2p arrangement is comparatively stable, so removing an electron requires more energy. This effect outweighs the increase in nuclear charge from nitrogen to oxygen, producing the observed exception to the general periodic trend. A is incorrect because both elements have valence electrons in the second principal energy level. C is incorrect because oxygen has eight protons, while nitrogen has seven. D is incorrect because both atoms have two 1s core electrons, so nitrogen does not have more core-electron shielding than oxygen. The comparison demonstrates that electron pairing and subshell occupancy can modify otherwise predictable ionization-energy trends."
    },
    {
      "id": "chem-1-7-005",
      "prompt": "A researcher measures the successive ionization energies of an unknown main-group element X. The results are shown below. First ionization energy: 590 kJ/mol; second: 1145 kJ/mol; third: 4912 kJ/mol; fourth: 6490 kJ/mol. Based on the data, which group of the periodic table most likely contains X?",
      "options": [
        "Group 1, because the first electron is removed with the least energy.",
        "Group 13, because the third ionization energy is much greater than the second.",
        "Group 2, because the large increase between the second and third ionization energies indicates that two valence electrons are removed before a core electron must be removed.",
        "Group 17, because the large ionization energies indicate that the atom has seven valence electrons."
      ],
      "correctIndex": 2,
      "explanation": "C is correct. Successive ionization energies increase because removing each electron leaves a more positively charged species that attracts its remaining electrons more strongly. However, an especially large increase occurs when removal begins from an inner electron shell rather than the valence shell. The first two ionization energies are 590 and 1145 kJ/mol, while the third jumps to 4912 kJ/mol. This large increase indicates that the atom has two valence electrons and that the third electron would be removed from a more strongly bound core subshell. Main-group elements with two valence electrons belong to Group 2. A is incorrect because a Group 1 element would show its largest initial jump between the first and second ionization energies. B is incorrect because a Group 13 element would typically show a large jump between the third and fourth ionization energies after losing three valence electrons. D is incorrect because a Group 17 element has seven valence electrons and would not show this characteristic large jump after removing only two electrons. The numerical data are consistent with calcium, a Group 2 element."
    },
    {
      "id": "chem-1-7-006",
      "prompt": "Lithium, sodium, and potassium are all Group 1 elements. Which ordering correctly represents their first ionization energies from greatest to least?",
      "options": [
        "K > Na > Li, because nuclear charge increases down the group.",
        "Na > Li > K, because sodium has more occupied electron shells than lithium.",
        "Li > K > Na, because potassium has more protons than sodium.",
        "Li > Na > K, because additional occupied electron shells and increased shielding generally weaken the attraction between the nucleus and the outermost electron down the group."
      ],
      "correctIndex": 3,
      "explanation": "D is correct. Lithium has the configuration [He] 2s¹, sodium has [Ne] 3s¹, and potassium has [Ar] 4s¹. Moving down Group 1, the valence electron occupies a principal energy level farther from the nucleus. Additional inner electron shells also increase shielding. Although nuclear charge increases, the greater electron-nucleus distance and increased shielding generally reduce the effective attraction experienced by the outermost electron. Consequently, less energy is required to remove that electron, giving the order Li > Na > K. A is incorrect because it considers increasing nuclear charge without accounting for the larger distance and greater shielding of the valence electron. B is incorrect because sodium's additional occupied shell makes its outermost electron easier to remove than lithium's, not harder. C is incorrect because potassium's greater proton count does not overcome the effects of its larger electron-nucleus distance and additional shielding. The first ionization energy generally decreases down a group."
    },
    {
      "id": "chem-1-7-007",
      "prompt": "Four elements in Period 2 are carbon, nitrogen, oxygen, and fluorine. Which ordering correctly represents their electronegativities from greatest to least?",
      "options": [
        "F > O > N > C",
        "C > N > O > F",
        "O > F > N > C",
        "F > N > O > C"
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Electronegativity describes the tendency of an atom to attract shared electrons in a chemical bond. Across Period 2, electronegativity generally increases from left to right because nuclear charge increases while the valence electrons remain in the same principal energy level. The increasing effective nuclear attraction strengthens the ability of the atoms to attract bonding electrons. Therefore, the order is F > O > N > C. B is incorrect because it reverses the general electronegativity trend across the period. C is incorrect because fluorine is more electronegative than oxygen. D is incorrect because oxygen is more electronegative than nitrogen. Unlike first ionization energy, which exhibits an exception between nitrogen and oxygen due to electron pairing, the electronegativity values of these elements follow the stated increasing trend. Fluorine has the greatest electronegativity of all elements on the commonly used Pauling scale."
    },
    {
      "id": "chem-1-7-008",
      "prompt": "A scientist compares the addition of one electron to an isolated gaseous chlorine atom and an isolated gaseous argon atom. The electron-addition process is represented by X(g) + e⁻ → X⁻(g). Which statement best predicts the relative energy changes for these processes?",
      "options": [
        "Adding an electron to argon is more energetically favorable because argon has a greater nuclear charge than chlorine.",
        "Adding an electron to chlorine is more energetically favorable because the added electron completes its partially filled 3p subshell, whereas an electron added to argon must occupy a higher-energy shell.",
        "Adding an electron to chlorine and argon produces approximately equal energy changes because both atoms are in Period 3.",
        "Adding an electron to argon is more energetically favorable because its completely filled valence shell creates additional available space for an electron."
      ],
      "correctIndex": 1,
      "explanation": "B is correct. Chlorine has the ground-state configuration [Ne] 3s² 3p⁵. Adding an electron completes its 3p subshell, producing the stable closed-shell configuration [Ar]. This process is energetically favorable and releases energy. Argon already has the closed-shell configuration [Ne] 3s² 3p⁶. An additional electron would have to occupy a higher-energy orbital outside its filled valence shell, so forming a stable isolated Ar⁻ ion is not energetically favorable under ordinary gas-phase conditions. A is incorrect because greater nuclear charge alone does not determine electron affinity; the energy and occupancy of the orbital receiving the electron are also important. C is incorrect because elements in the same period can have substantially different electron affinities due to their electron configurations. D is incorrect because a completely filled valence shell does not provide an additional low-energy orbital for an electron. Electron affinity reflects the energy change associated with electron addition and is strongly influenced by subshell occupancy and effective nuclear attraction."
    },
    {
      "id": "chem-1-7-009",
      "prompt": "A researcher compares the ionic radii of Fe²⁺ and Fe³⁺ ions. Both ions contain 26 protons, but Fe²⁺ contains 24 electrons while Fe³⁺ contains 23 electrons. Which statement correctly predicts their relative sizes?",
      "options": [
        "Fe³⁺ is larger because its greater positive charge causes the electron cloud to expand.",
        "Both ions have identical radii because their nuclei contain the same number of protons.",
        "Fe²⁺ is smaller because its additional electron increases the attractive force exerted by the nucleus on every electron.",
        "Fe³⁺ is smaller because removing an additional electron reduces electron-electron repulsion and allows the remaining electrons to experience stronger effective nuclear attraction."
      ],
      "correctIndex": 3,
      "explanation": "D is correct. Both ions contain the same nucleus with 26 protons, but Fe³⁺ has one fewer electron than Fe²⁺. The ground-state configurations are approximately [Ar] 3d⁶ for Fe²⁺ and [Ar] 3d⁵ for Fe³⁺. Removing an additional electron decreases electron-electron repulsion and shielding among the remaining electrons. The positively charged nucleus therefore attracts the remaining electron cloud more strongly, resulting in a smaller ionic radius for Fe³⁺. A is incorrect because a greater positive ionic charge does not cause the electron cloud to expand when comparing ions of the same element; the more positively charged ion is generally smaller. B is incorrect because ionic radius depends on both nuclear charge and the number and arrangement of electrons. C is incorrect because the additional electron in Fe²⁺ increases electron-electron repulsion rather than making the ion smaller. This comparison illustrates why higher oxidation states of the same metal generally correspond to smaller ionic radii."
    },
    {
      "id": "chem-1-7-010",
      "prompt": "A student measures the first ionization energies of three consecutive Group 1 elements and obtains the following values: Li = 520 kJ/mol, Na = 496 kJ/mol, and K = 419 kJ/mol. Based on these data and the periodic trend, which value is the most reasonable estimate for the first ionization energy of rubidium, Rb, the next element below potassium in Group 1?",
      "options": [
        "Approximately 800 kJ/mol",
        "Approximately 520 kJ/mol",
        "Approximately 400 kJ/mol",
        "Approximately 100 kJ/mol"
      ],
      "correctIndex": 2,
      "explanation": "C is correct. The first ionization energy generally decreases down Group 1 because each successive element has an additional occupied principal energy level. The valence electron is farther from the nucleus and experiences greater shielding from inner electrons. The measured values decrease from 520 kJ/mol for lithium to 496 kJ/mol for sodium and 419 kJ/mol for potassium. Rubidium is below potassium, so its first ionization energy should be somewhat lower than 419 kJ/mol. Approximately 400 kJ/mol is the most reasonable estimate among the choices and is close to rubidium's experimentally measured value of about 403 kJ/mol. A is incorrect because 800 kJ/mol would represent a large increase rather than the expected decrease down the group. B is incorrect because 520 kJ/mol is lithium's value and does not account for rubidium's additional occupied electron shells. D is incorrect because 100 kJ/mol is far below the observed progression and would imply an unusually large decrease not supported by the data. Periodic trends can be used to make reasonable estimates when exact experimental values are unavailable."
    },
    {
      "id": "chem-1-7-011",
      "prompt": "The addition of an electron to an isolated gaseous chlorine atom releases approximately 349 kJ/mol, while adding an electron to an isolated gaseous fluorine atom releases approximately 328 kJ/mol. Chlorine therefore has a slightly more exothermic electron affinity than fluorine, despite fluorine's greater electronegativity. Which explanation best accounts for this observation?",
      "options": [
        "Fluorine's compact 2p subshell produces relatively strong electron-electron repulsion when an additional electron enters it, whereas chlorine's larger 3p subshell allows the added electron to experience less repulsion.",
        "Chlorine has a greater nuclear charge than fluorine, so every electron in chlorine must be more strongly attracted to its nucleus than a corresponding electron in fluorine.",
        "Fluorine has a lower electronegativity than chlorine, making electron addition to fluorine less favorable.",
        "Chlorine already has a completely filled 3p subshell before the electron is added, making it easier to accommodate another electron."
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Fluorine has the configuration 1s² 2s² 2p⁵, while chlorine has [Ne] 3s² 3p⁵. In both atoms, adding one electron completes the outer p subshell. Fluorine has a smaller atomic radius, so its valence electrons occupy a relatively compact 2p region. The incoming electron experiences substantial repulsion from
```

**End of retrieved excerpt. Missing text has not been supplied or reconstructed.**

## Topic 1.8 — complete retrieved draft; UNAUDITED

The full returned text parses as JSON and contains 11 questions. Scientific accuracy, curriculum alignment, authoritative IDs, answer balance, and import status have not been validated.

```json
{
  "courseId": "chemistry",
  "unitNumber": 1,
  "topicId": "valence-electrons-and-ionic-compounds",
  "questions": [
    {
      "id": "chem-1-8-001",
      "prompt": "A neutral main-group element X has the ground-state electron configuration [Ne] 3s² 3p⁴. When X forms a binary ionic compound with lithium, which empirical formula is most likely?",
      "options": [
        "LiX",
        "LiX₂",
        "Li₂X",
        "Li₂X₃"
      ],
      "correctIndex": 2,
      "explanation": "C is correct. The electron configuration [Ne] 3s² 3p⁴ indicates that X has six valence electrons and belongs to Group 16. Main-group elements in Group 16 typically gain two electrons when forming simple monatomic anions, producing X²⁻. Lithium belongs to Group 1 and typically loses one valence electron to form Li⁺. Two Li⁺ ions are required to balance the charge of one X²⁻ ion, giving the empirical formula Li₂X. A is incorrect because a 1:1 ratio of Li⁺ to X²⁻ would produce a net charge of −1. B is incorrect because one Li⁺ ion and two X²⁻ ions would produce a net charge of −3. D is incorrect because two Li⁺ ions and three X²⁻ ions would produce a net charge of −4. The empirical formula of an ionic compound represents the simplest whole-number ratio of ions that produces electrical neutrality. The configuration identifies X as sulfur, so the corresponding compound is Li₂S."
    },
    {
      "id": "chem-1-8-002",
      "prompt": "A particulate model of a pure ionic solid shows 12 ions of M²⁺ and 8 ions of N³⁻ in a representative portion of the crystal. Which empirical formula correctly represents the compound?",
      "options": [
        "M₃N₂",
        "M₂N₃",
        "M₁₂N₈",
        "MN"
      ],
      "correctIndex": 0,
      "explanation": "A is correct. The particulate model contains 12 M²⁺ ions and 8 N³⁻ ions. The ratio of M ions to N ions is 12:8, which simplifies to 3:2. Therefore, the empirical formula is M₃N₂. This formula also satisfies electrical neutrality because three M²⁺ ions contribute a total charge of +6, while two N³⁻ ions contribute a total charge of −6. B is incorrect because M₂N₃ represents a 2:3 ion ratio, which does not match the model and would produce a net charge of 2(+2) + 3(−3) = −5. C is incorrect because M₁₂N₈ describes the actual particle counts in the representative portion but does not express the simplest whole-number ratio. D is incorrect because a 1:1 ratio of M²⁺ to N³⁻ would produce a net charge of −1. Ionic compounds are represented by empirical formulas rather than formulas describing discrete molecules. The ion ratio must be reduced to the smallest whole numbers while maintaining electrical neutrality."
    },
    {
      "id": "chem-1-8-003",
      "prompt": "Calcium forms the ionic compound CaF₂ with fluorine. A student predicts that strontium will form a chemically analogous compound with fluorine because calcium and strontium belong to the same group of the periodic table. Which formula and explanation best support the student's prediction?",
      "options": [
        "Sr₂F, because strontium has twice as many valence electrons as fluorine.",
        "SrF, because all metals and nonmetals combine in a 1:1 ion ratio.",
        "Sr₂F₃, because strontium has more occupied electron shells than calcium.",
        "SrF₂, because calcium and strontium each have two valence electrons and typically form ions with a charge of +2."
      ],
      "correctIndex": 3,
      "explanation": "D is correct. Calcium and strontium are both Group 2 elements. Their neutral atoms have two valence electrons, which they typically lose when forming simple monatomic cations. Calcium forms Ca²⁺, and strontium forms Sr²⁺. Fluorine is a Group 17 element that typically gains one electron to form F⁻. Two fluoride ions are required to balance the +2 charge of one strontium ion, producing SrF₂. A is incorrect because strontium does not have twice as many valence electrons as fluorine; strontium has two valence electrons, while fluorine has seven. The proposed Sr₂F formula would also have a net positive charge. B is incorrect because ionic compounds do not necessarily contain equal numbers of cations and anions. Their ion ratios depend on charge balance. C is incorrect because the additional occupied electron shells in strontium affect properties such as atomic radius but do not change its typical +2 ionic charge. Elements in the same periodic-table group tend to form analogous compounds because they have similar valence-electron configurations."
    },
    {
      "id": "chem-1-8-004",
      "prompt": "Two unknown main-group elements, Q and R, form simple monatomic ions in ionic compounds. Element Q forms the compound QBr with bromine, while element R forms the compound MgR with magnesium. Assuming bromine forms Br⁻ and magnesium forms Mg²⁺, which empirical formula is most likely when Q and R form a binary ionic compound?",
      "options": [
        "QR",
        "Q₂R",
        "QR₂",
        "Q₂R₃"
      ],
      "correctIndex": 1,
      "explanation": "B is correct. The formula QBr indicates that Q forms a +1 ion because bromide has a charge of −1 and the compound is electrically neutral. Therefore, Q forms Q⁺. The formula MgR indicates that R forms a −2 ion because magnesium has a charge of +2 and the compound contains one magnesium ion for every R ion. Therefore, R forms R²⁻. When Q⁺ and R²⁻ combine, two Q⁺ ions are required to balance the charge of one R²⁻ ion. The resulting empirical formula is Q₂R. A is incorrect because one Q⁺ ion and one R²⁻ ion would produce a net charge of −1. C is incorrect because one Q⁺ ion and two R²⁻ ions would produce a net charge of −3. D is incorrect because two Q⁺ ions and three R²⁻ ions would produce a net charge of −4. This question demonstrates how the formulas of known ionic compounds can provide evidence about the typical ionic charges of unknown elements."
    },
    {
      "id": "chem-1-8-005",
      "prompt": "A neutral aluminum atom has the ground-state electron configuration [Ne] 3s² 3p¹. Which electron configuration correctly represents the aluminum ion most commonly found in simple ionic compounds, and why?",
      "options": [
        "[Ne], because aluminum typically loses its three valence electrons to form Al³⁺.",
        "[Ne] 3s², because aluminum typically loses only its 3p electron to form Al⁺.",
        "[Ne] 3s¹, because aluminum typically loses two valence electrons to form Al²⁺.",
        "[Ne] 3s² 3p⁶, because aluminum typically gains five electrons to complete its third principal energy level."
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Aluminum belongs to Group 13 and has three valence electrons: two in the 3s subshell and one in the 3p subshell. In simple ionic compounds, aluminum typically forms Al³⁺ by losing these three electrons. The resulting ion contains ten electrons and has the electron configuration [Ne], which is a filled-shell configuration. B is incorrect because removing only the 3p electron would produce Al⁺ with the configuration [Ne] 3s², but +1 is not aluminum's typical charge in simple ionic compounds. C is incorrect because removing two electrons would produce Al²⁺ with the configuration [Ne] 3s¹, which is not the typical aluminum ion. D is incorrect because gaining five electrons would produce Al⁵⁻, which is not the typical ionic behavior of aluminum. For a main-group metal with three valence electrons, losing those electrons generally produces a more characteristic ionic charge than gaining enough electrons to fill the outer shell. The typical +3 charge of aluminum can be predicted from its position in Group 13."
    },
    {
      "id": "chem-1-8-006",
      "prompt": "Sodium and chlorine react to form solid NaCl. Which particulate-level explanation best describes why the resulting ions form a stable ionic compound?",
      "options": [
        "A proton transfers from the sodium nucleus to the chlorine nucleus, producing two neutral atoms with filled valence shells.",
        "Sodium gains an electron from chlorine, producing Na⁻ and Cl⁺ ions that attract one another.",
        "Sodium loses its valence electron, chlorine gains an electron, and the resulting Na⁺ and Cl⁻ ions are held together by electrostatic attractions in an extended ionic structure.",
        "Sodium and chlorine each lose one electron, producing two positively charged ions that attract one another."
      ],
      "correctIndex": 2,
      "explanation": "C is correct. A neutral sodium atom has one valence electron, while a neutral chlorine atom has seven. In the formation of solid NaCl, sodium is oxidized to Na⁺, and chlorine is reduced to Cl⁻. Sodium's resulting electron configuration is [Ne], while chloride has the configuration [Ar]. The oppositely charged ions experience strong electrostatic attractions and form an extended ionic crystal. The stability of the solid is associated with the favorable interactions among many cations and anions in the lattice. A is incorrect because ordinary chemical bonding involves valence electrons rather than the transfer of protons between atomic nuclei. B is incorrect because sodium typically loses an electron, while chlorine gains one; the proposed Na⁻ and Cl⁺ ions do not represent the ions in sodium chloride. D is incorrect because two positively charged ions would repel one another rather than attract. The formation of ionic compounds is governed by interactions involving valence electrons and the electrostatic attractions between the resulting ions."
    },
    {
      "id": "chem-1-8-007",
      "prompt": "A researcher identifies two ions in a pure ionic compound. Ion P contains 13 protons and 10 electrons. Ion Q contains 16 protons and 18 electrons. Assuming the compound contains only these two types of ions, which empirical formula is consistent with their charges?",
      "options": [
        "P₃Q₂",
        "P₂Q₃",
        "PQ",
        "PQ₂"
      ],
      "correctIndex": 1,
      "explanation": "B is correct. The charge of an ion is determined by the difference between its number of protons and electrons. Ion P contains 13 protons and 10 electrons, giving a net charge of +3. Ion Q contains 16 protons and 18 electrons, giving a net charge of −2. To produce an electrically neutral compound, two P³⁺ ions contribute a total charge of +6, while three Q²⁻ ions contribute a total charge of −6. The empirical formula is therefore P₂Q₃. A is incorrect because three P³⁺ ions and two Q²⁻ ions would produce a net charge of +5. C is incorrect because one P³⁺ ion and one Q²⁻ ion would produce a net charge of +1. D is incorrect because one P³⁺ ion and two Q²⁻ ions would produce a net charge of −1. The proton counts identify P as aluminum and Q as sulfur, so the actual compound is Al₂S₃. This example connects atomic structure, ionic charge, and the composition of an ionic compound."
    },
    {
      "id": "chem-1-8-008",
      "prompt": "A student compares the formulas of calcium fluoride, CaF₂, and a hypothetical compound formed by calcium and oxygen. The student predicts that replacing fluorine with oxygen will produce CaO rather than CaO₂. Which explanation best supports this prediction?",
      "options": [
        "Oxygen has fewer protons than fluorine, so calcium can bond with only one oxygen atom.",
        "Calcium changes its typical ionic charge from +2 in CaF₂ to +1 when it combines with oxygen.",
        "Fluorine forms F²⁻ ions, while oxygen forms O⁻ ions, causing the number of anions required to decrease.",
        "Oxygen typically forms O²⁻ ions, whereas fluorine forms F⁻ ions, so one oxide ion balances the charge of one Ca²⁺ ion."
      ],
      "correctIndex": 3,
      "explanation": "D is correct. Calcium belongs to Group 2 and typically forms Ca²⁺ by losing two valence electrons. Fluorine belongs to Group 17 and typically forms F⁻ by gaining one electron. Therefore, two fluoride ions are required to balance one calcium ion, giving CaF₂. Oxygen belongs to Group 16 and typically forms O²⁻ by gaining two electrons. One O²⁻ ion balances the +2 charge of one Ca²⁺ ion, giving CaO. A is incorrect because the number of protons in oxygen and fluorine does not directly determine the number of ions required for electrical neutrality. Their typical ionic charges are the relevant quantities. B is incorrect because calcium retains its typical +2 charge in both compounds. C is incorrect because it reverses the typical charges of fluoride and oxide ions. The difference between CaF₂ and CaO illustrates how the number of valence electrons and the resulting ionic charges determine the empirical formulas of ionic compounds."
    },
    {
      "id": "chem-1-8-009",
      "prompt": "A laboratory investigates three unknown main-group metals, M, N, and P. Each metal forms a pure binary ionic compound with chlorine. Elemental analysis establishes the empirical formulas MCl, NCl₂, and PCl. Assuming chlorine forms Cl⁻ in all three compounds, which conclusion is best supported by the data?",
      "options": [
        "M and N most likely belong to the same group because both form compounds containing chlorine.",
        "N and P most likely belong to the same group because their compounds contain different numbers of chlorine ions.",
        "M and P most likely belong to the same group because both typically form +1 ions and therefore have analogous ionic behavior.",
        "None of the metals can belong to the same group because all three compounds have different elemental compositions."
      ],
      "correctIndex": 2,
      "explanation": "C is correct. Chlorine typically forms Cl⁻ in simple binary ionic compounds. The formulas MCl and PCl therefore indicate that M and P each form ions with a charge of +1. The formula NCl₂ indicates that N forms an ion with a charge of +2. Main-group metals that typically form +1 ions commonly belong to Group 1, while metals that typically form +2 ions commonly belong to Group 2. Consequently, M and P are the strongest candidates for elements in the same periodic-table group. A is incorrect because the presence of chlorine in both compounds does not establish that M and N have the same valence-electron configurations; their different chloride formulas indicate different typical charges. B is incorrect because N and P form ions with different charges, +2 and +1, respectively. D is incorrect because MCl and PCl have the same cation-to-anion ratio even though M and P are different elements. The experiment provides evidence of analogous chemical behavior, although ionic formulas alone do not conclusively establish periodic-table group membership."
    },
    {
      "id": "chem-1-8-010",
      "prompt": "Under ordinary conditions, sodium readily forms the ionic compound NaCl with chlorine, but it does not form a comparable stable simple ionic compound with argon. Which explanation best accounts for this difference?",
      "options": [
        "Chlorine has seven valence electrons and can gain one electron to form Cl⁻, whereas argon already has a filled valence shell and does not readily form a stable monatomic anion.",
        "Argon has fewer valence electrons than chlorine, so it cannot accept an electron from sodium.",
        "Chlorine and sodium have the same number of occupied principal energy levels, so they must form an ionic compound.",
        "Argon has a greater nuclear charge than chlorine, so an electron transferred from sodium would experience no attraction to argon's nucleus."
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Chlorine has the electron configuration [Ne] 3s² 3p⁵, giving it seven valence electrons. Gaining one electron produces Cl⁻ with a filled third principal energy level. Sodium typically loses its single 3s valence electron to form Na⁺. The resulting oppositely charged ions can form a stable ionic solid. Argon, however, already has the filled-shell configuration [Ne] 3s² 3p⁶. Adding an electron to an isolated argon atom would require placing it in a higher-energy orbital, so argon does not readily form a stable simple monatomic anion under ordinary conditions. B is incorrect because argon has eight valence electrons, one more than chlorine, not fewer. C is incorrect because occupying the same number of principal energy levels does not guarantee that two elements will form an ionic compound. Their valence-electron configurations and the energetics of the interactions are more important. D is incorrect because argon's nucleus still attracts negatively charged electrons; the problem is not an absence of electrostatic attraction. Instead, argon's filled valence shell makes the formation of a stable simple anion energetically unfavorable. This comparison illustrates how periodic patterns in valence-electron configurations help explain differences in chemical reactivity."
    },
    {
      "id": "chem-1-8-011",
      "prompt": "A student is constructing a particulate model of a pure sample of magnesium fluoride, MgF₂. The model must contain 0.250 mol of Mg²⁺ ions. How many moles of F⁻ ions must the student represent to maintain the correct composition and electrical neutrality of the compound?",
      "options": [
        "0.125 mol",
        "0.500 mol",
        "0.250 mol",
        "0.750 mol"
      ],
      "correctIndex": 1,
      "explanation": "B is correct. Magnesium fluoride has the empirical formula MgF₂ because magnesium typically forms Mg²⁺ ions and fluorine typically forms F⁻ ions. Each Mg²⁺ ion contributes a charge of +2, so two F⁻ ions are required to balance its charge. Therefore, the number of fluoride ions must be twice the number of magnesium ions. The required amount is 0.250 mol Mg²⁺ × (2 mol F⁻/1 mol Mg²⁺) = 0.500 mol F⁻. A is incorrect because 0.125 mol F⁻ would provide only half as many fluoride ions as magnesium ions, producing a large excess of positive charge. C is incorrect because 0.250 mol F⁻ would give a 1:1 ion ratio rather than the required 1:2 ratio. D is incorrect because 0.750 mol F⁻ would give a 1:3 ratio, resulting in excess negative charge. The correct model must represent the fixed ion ratio of the pure ionic compound. This ratio applies regardless of whether the sample is described using individual ions, formula units, or moles."
    }
  ]
}
```

## Topic 2.1 — TRUNCATED excerpt; NOT IMPORTABLE

The returned text is cut off. Do not repair by guessing, parse/import it as a complete bank, or assume that every visible question ID has a complete question body. Obtain the full original source before finalizing this topic.

```text
{
  "courseId": "chemistry",
  "unitNumber": 2,
  "topicId": "types-of-chemical-bonds",
  "questions": [
    {
      "id": "chem-2-1-001",
      "prompt": "A researcher compares four single covalent bonds: H–F, H–Cl, H–Br, and H–I. The electronegativity values of the atoms are H = 2.1, F = 4.0, Cl = 3.0, Br = 2.8, and I = 2.5. Based on these values, which bond is expected to have the greatest bond dipole?",
      "options": [
        "H–Br, because bromine has a larger atomic radius than fluorine.",
        "H–I, because iodine has more occupied electron shells than the other halogens.",
        "H–F, because it has the greatest electronegativity difference between the bonded atoms.",
        "H–Cl, because chlorine has a greater nuclear charge than fluorine."
      ],
      "correctIndex": 2,
      "explanation": "C is correct. For the single bonds being compared, a greater electronegativity difference generally produces greater unequal sharing of bonding electrons and a greater bond dipole. The electronegativity differences are H–F: |4.0 − 2.1| = 1.9; H–Cl: |3.0 − 2.1| = 0.9; H–Br: |2.8 − 2.1| = 0.7; and H–I: |2.5 − 2.1| = 0.4. H–F has the greatest difference and is expected to have the greatest bond dipole. A is incorrect because bromine's larger atomic radius does not make H–Br more polar than H–F; its electronegativity difference is smaller. B is incorrect because iodine's additional occupied electron shells do not make H–I the most polar bond. Iodine attracts shared electrons less strongly than fluorine. D is incorrect because chlorine has fewer protons than fluorine's atomic number? Chlorine actually has more protons than fluorine, but nuclear charge alone does not determine electronegativity. Chlorine's greater shielding and larger atomic radius result in a lower electronegativity than fluorine. Therefore, H–Cl has a smaller electronegativity difference than H–F."
    },
    {
      "id": "chem-2-1-002",
      "prompt": "A molecule contains a polar covalent bond between nitrogen and oxygen. The electronegativity of nitrogen is 3.0, while that of oxygen is 3.5. Which description most accurately represents the distribution of bonding electrons and partial charges in the bond?",
      "options": [
        "The bonding electrons are shared unequally, with oxygen having a partial negative charge and nitrogen having a partial positive charge.",
        "The bonding electrons are shared equally because nitrogen and oxygen are both nonmetals.",
        "The bonding electrons are shared unequally, with nitrogen having a partial negative charge because it has fewer protons than oxygen.",
        "The bonding electrons are completely transferred from nitrogen to oxygen, producing N⁺ and O⁻ ions in every nitrogen–oxygen bond."
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Oxygen has a greater electronegativity than nitrogen, meaning oxygen attracts the shared bonding electrons more strongly. Consequently, the electron density in the bond is shifted toward oxygen. Oxygen develops a partial negative charge, represented by δ−, while nitrogen develops a partial positive charge, represented by δ+. This unequal sharing characterizes a polar covalent bond. B is incorrect because two nonmetals do not necessarily have equal electronegativities. Bonds between different nonmetals are frequently polar covalent. C is incorrect because the direction of bond polarity is determined by relative electronegativity, not simply by comparing proton counts. Oxygen is more electronegative and therefore develops the partial negative charge. D is incorrect because polar covalent bonding involves unequal sharing rather than complete electron transfer. Partial charges do not indicate that the bonded atoms have become separate ions with full integer charges. The distinction between partial and full charges is important when comparing covalent and ionic bonding."
    },
    {
      "id": "chem-2-1-003",
      "prompt": "A scientist investigates an unknown pure solid and records the following observations: The solid has a relatively high melting point, does not conduct electricity in the solid state, and conducts electricity when completely melted. Which bonding classification is most strongly supported by these observations?",
      "options": [
        "Nonpolar molecular covalent bonding, because neutral molecules generally contain electrons that can move freely between molecules.",
        "Metallic bonding, because metals conduct electricity only after their particles become mobile in the liquid state.",
        "Polar molecular covalent bonding, because unequal sharing of electrons always produces freely moving ions when a substance melts.",
        "Predominantly ionic bonding, because the solid contains charged particles that become mobile when the substance melts."
      ],
      "correctIndex": 3,
      "explanation": "D is correct. The observations are characteristic of many ionic compounds. In a solid ionic compound, positively and negatively charged ions are held in relatively fixed positions by electrostatic attractions. Because the ions cannot move freely through the solid, the material generally does not conduct electricity in the solid state. When the compound melts, the ions become mobile and can transport electrical charge, allowing the liquid to conduct electricity. The relatively high melting point is also consistent with strong electrostatic attractions in an ionic solid. A is incorrect because nonpolar molecular substances generally consist of neutral molecules and do not acquire freely moving charged particles simply by melting. B is incorrect because metallic solids typically conduct electricity before melting due to their delocalized electrons. C is incorrect because polar covalent molecules contain partial charges, but unequal electron sharing does not automatically produce mobile ions upon melting. Although no single observation establishes bonding type with absolute certainty, the combination of properties strongly supports predominantly ionic bonding."
    },
    {
      "id": "chem-2-1-004",
      "prompt": "A sample of pure copper metal conducts electricity when a voltage is applied across it, even though the copper atoms remain in an ordered solid structure. Which explanation best accounts for this observation?",
      "options": [
        "Copper atoms transfer all their electrons to neighboring atoms, producing alternating Cu⁺ and Cu⁻ ions.",
        "Valence electrons in the metallic solid are delocalized and can move through the structure, allowing electrical charge to be transported.",
        "Copper atoms form separate neutral molecules whose electrons remain localized between pairs of atoms.",
        "Copper conducts electricity because its positively charged atomic nuclei move through the solid when a voltage is applied."
      ],
      "correctIndex": 1,
      "explanation": "B is correct. Metallic bonding is characterized by delocalized valence electrons that are not associated exclusively with individual atoms or individual pairs of atoms. In solid copper, the positively charged atomic cores occupy positions in a metallic structure, while mobile electronic charge carriers can respond to an applied electric field. This electron mobility allows copper to conduct electricity without requiring the atomic nuclei to move through the solid. A is incorrect because metallic copper is not accurately represented as an alternating arrangement of Cu⁺ and Cu⁻ ions formed through complete electron transfer between neighboring atoms. C is incorrect because metallic copper does not consist of separate neutral molecules with electrons localized between individual pairs of atoms. That description is more consistent with localized covalent bonding. D is incorrect because the atomic nuclei remain associated with their positions in the solid structure during ordinary electrical conduction. The movement of electronic charge, rather than the movement of nuclei, accounts for the conductivity of solid copper."
    },
    {
      "id": "chem-2-1-005",
      "prompt": "A student claims that every chemical bond can be classified as either completely ionic or completely covalent using one exact electronegativity-difference cutoff. Which response best evaluates the student's claim?",
      "options": [
        "The claim is incorrect because ionic and covalent bonding represent a continuum, and experimental properties should also be considered when characterizing bonding.",
        "The claim is correct because all bonds with unequal electronegativities involve complete electron transfer.",
        "The claim is correct because every bond between two different elements must be either 100% ionic or 100% covalent.",
        "The claim is incorrect because electronegativity has no relationship to bond polarity or ionic character."
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Ionic and covalent bonding are useful models for describing how electrons are distributed between atoms, but real chemical bonds do not fall into two perfectly separated categories. A polar covalent bond has some ionic character because the bonding electrons are attracted more strongly toward one atom. As the electronegativity difference generally increases, the ionic character of a bond tends to increase. However, no single universal numerical cutoff perfectly distinguishes ionic from covalent bonding in every substance. The physical properties and electronic structure of a compound provide additional evidence for its bonding classification. B is incorrect because unequal electronegativity generally causes unequal electron sharing, not necessarily complete electron transfer. C is incorrect because real bonds can exhibit intermediate degrees of ionic and covalent character. D is incorrect because electronegativity is directly related to the distribution of shared electrons and is useful for predicting bond polarity. The important distinction is that electronegativity difference is informative but not sufficient by itself to classify every bond definitively."
    },
    {
      "id": "chem-2-1-006",
      "prompt": "Fluorine, chlorine, bromine, and iodine are all Group 17 elements. Their electronegativities generally decrease in the order F > Cl > Br > I. Which explanation best accounts for this trend?",
      "options": [
        "The number of protons decreases from fluorine to iodine, causing progressively weaker attraction for shared electrons.",
        "The number of valence electrons decreases down the group, reducing the ability of each atom to form covalent bonds.",
        "Additional occupied electron shells increase the distance and shielding between the nucleus and bonding electrons, generally weakening the attraction for shared electrons down the group.",
        "The nuclear charge increases down the group, causing the atoms to attract shared electrons more strongly and therefore become less electronegative."
      ],
      "correctIndex": 2,
      "explanation": "C is correct. Electronegativity describes an atom's tendency to attract shared electrons in a chemical bond. Moving down Group 17, atoms have additional occupied principal energy levels. Their valence regions are generally farther from the nucleus, and inner electrons provide increased shielding. According to Coulomb's law, electrostatic attraction decreases as the distance between charged particles increases. Although nuclear charge increases down the group, the effects of greater distance and shielding generally cause electronegativity to decrease. Therefore, fluorine is more electronegative than chlorine, bromine, and iodine. A is incorrect because the number of protons increases rather than decreases down the group. B is incorrect because all four halogens have seven valence electrons; their different electronegativities are not caused by decreasing valence-electron counts. D is incorrect because increasing nuclear charge alone would tend to strengthen electron attraction, not explain decreasing electronegativity. The observed trend requires consideration of nuclear charge, electron shielding, and the distance of the bonding electrons from the nucleus."
    },
    {
      "id": "chem-2-1-007",
      "prompt": "A researcher examines four pure substances: H₂, HF, NaF, and Al(s). Which substance contains bonds best described by unequal sharing of valence electrons between two nonmetal atoms?",
      "options": [
        "H₂, because the two hydrogen atoms attract the shared electrons with different strengths.",
        "HF, because fluorine attracts the shared bonding electrons more strongly than hydrogen does.",
        "NaF, because sodium and fluorine share their valence electrons equally.",
        "Al(s), because metallic bonding consists of localized electron pairs shared between individual aluminum atoms."
      ],
      "correctIndex": 1,
      "explanation": "B is correct. Hydrogen and fluorine are both nonmetals, so the bond in HF is predominantly covalent. However, fluorine is significantly more electronegative than hydrogen and attracts the shared bonding electrons more strongly. The resulting unequal electron distribution makes the H–F bond polar covalent. A is incorrect because the two atoms in H₂ are identical and have equal electronegativities. Their bonding electrons are shared equally on average, producing a nonpolar covalent bond. C is incorrect because NaF is predominantly ionic. Sodium typically forms Na⁺, while fluorine forms F⁻, and electrostatic attractions between the resulting ions characterize the bonding. The description of equal electron sharing is inconsistent with NaF. D is incorrect because metallic aluminum contains delocalized valence electrons rather than electron pairs localized between individual pairs of atoms. The four substances illustrate nonpolar covalent, polar covalent, ionic, and metallic bonding, respectively."
    },
    {
      "id": "chem-2-1-008",
      "prompt": "A student compares the C–H and N–H single bonds using electronegativity values of C = 2.5, H = 2.1, and N = 3.0. Which conclusion is best supported by these values?",
      "options": [
        "The C–H bond is more polar because carbon has a lower electronegativity than nitrogen.",
        "Both bonds must have identical polarity because they each contain one hydrogen atom.",
        "The C–H bond is ionic, while the N–H bond is nonpolar covalent.",
        "The N–H bond is more polar because its electronegativity difference is greater, while the C–H bond is commonly treated as effectively nonpolar."
      ],
      "correctIndex": 3,
      "explanation": "D is correct. The electronegativity difference for C–H is |2.5 − 2.1| = 0.4, while the difference for N–H is |3.0 − 2.1| = 0.9. The N–H bond therefore exhibits greater unequal sharing of bonding electrons and is expected to have a greater bond dipole. Carbon–hydrogen bonds are commonly treated as effectively nonpolar in introductory and AP Chemistry, even though carbon is slightly more electronegative than hydrogen. A is incorrect because carbon's lower electronegativity compared with nitrogen results in a smaller electronegativity difference with hydrogen, not a larger one. B is incorrect because bond polarity depends on the electronegativities of both bonded atoms; sharing one element does not guarantee identical polarity. C is incorrect because C–H is not predominantly ionic, and N–H is polar rather than nonpolar. The calculation demonstrates that bond polarity can be compared quantitatively using electronegativity differences while recognizing that the classification of a weakly polar bond is approximate."
    },
    {
      "id": "chem-2-1-009",
      "prompt": "A researcher studies an unknown pure binary compound containing a metal and a nonmetal. The compound has a relatively low melting point, does not conduct electricity as a solid, and remains essentially nonconductive when melted. Which conclusion is most scientifically justified?",
      "options": [
        "The observations suggest that the compound may be predominantly molecular covalent despite containing a metal and a nonmetal, because experimental properties provide important evidence about bonding type.",
        "The compound must be ionic because every combination of a metal and a nonmetal involves complete electron transfer.",
        "The compound must be metallic because the presence of a metal guarantees delocalized electrons throughout the solid.",
        "The compound must contain nonpolar covalent bonds because every substance that fails to conduct electricity has equal sharing of bonding electrons."
      ],
      "correctIndex": 0,
      "explanation": "A is correct. Compounds containing metals and nonmetals are often predominantly ionic, but the identities of the elements alone do not guarantee a particular bonding classification. The relatively low melting point and absence of significant electrical conductivity in both the solid and molten states are more consistent with a molecular covalent substance than with a typical ionic solid. Molecular covalent substances generally contain neutral molecules and do not necessarily produce mobile charged particles when melted. Some compounds containing metals and nonmetals have substantial covalent character, so experimental evidence must be considered. B is incorrect because the metal–nonmetal classification is a useful generalization rather than an absolute rule. C is incorrect because a compound containing a metal does not necessarily exhibit metallic bonding; metallic bonding is characteristic of metallic substances with delocalized electrons. D is incorrect because electrical nonconductivity does not establish that bonds are nonpolar. Polar molecular substances can also be poor electrical conductors. The evidence supports a predominantly covalent classification, although additional structural measurements would strengthen the conclusion."
    },
    {
      "id": "chem-2-1-010",
      "prompt": "Three hypothetical single bonds, A–B, C–D, and E–F, have electronegativity differences of 0.3, 1.1, and 2.4, respectively. Assume that the electronegativity differences are the primary factor being compared and that no additional experimental evidence is available. Which prediction is most reasonable?",
      "options": [
        "A–B has the greatest ionic character because its atoms have the most similar electronegativities.",
        "All three bonds must have exactly the same ionic character because each involves two bonded atoms.",
        "The ionic character generally increases in the order A–B < C–D < E–F, although the differences alone do not establish an absolute bonding classification.",
        "C–D must be completely ionic because every bond with a nonzero electronegativity difference involves complete electron transfer."
      ],
      "correctIndex": 2,
      "explanation": "C is correct. Electronegativity difference provides a useful qualitative indication of the degree to which bonding electrons are shared unequally. A–B has the smallest difference, 0.3, so it is expected to have relatively little ionic character. C–D has an intermediate difference of 1.1, suggesting greater bond polarity. E–F has the largest difference, 2.4, and is expected to have the greatest ionic character of the three. Therefore, the predicted order is A–B < C–D < E–F. A is incorrect because atoms with similar electronegativities generally share electrons more equally, producing bonds with less ionic character. B is incorrect because differences in electronegativity influence electron distribution and therefore affect bond character. D is incorrect because a nonzero electronegativity difference does not imply complete electron transfer. Many polar covalent bonds have nonzero electronegativity differences. Importantly, the numerical values alone do not provide a universal cu
```

**End of retrieved excerpt. Missing text has not been supplied or reconstructed.**
