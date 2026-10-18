# Topic 1.8 — Valence Electrons and Ionic Compounds

Status: revised recovered draft; **human scientific review and owner approval pending**. No student-facing import.

Authority: [College Board CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), Fall 2024, accessed 2026-10-17, printed page 38 (PDF 45). LO 1.8.A connects reactivity and periodicity; EK 1.8.A.1–3 covers valence/nuclear interactions, analogous compounds in a group, and typical ionic charges from position. Suggested skill 4.C. Electron configuration, charge counting, and ionization trends are prerequisites. Exclude detailed lattice-energy calculations, molecular polarity, redox balancing, and crystallographic coordination numbers as central tasks.

## Changes from immutable source

- Explicit mapping: historical `valence-electrons-and-ionic-compounds` → existing `valence`, verified by official number 1.8 in the import guide.
- 007 replaced: original repeated charge-balancing from ion counts. New item tests the distinction between total neutrality and charged constituent ions.
- 008 replaced: original inferred CaO rather than CaO2 without excluding peroxide (CaO2 exists), and repeated formula reasoning. New item connects a stated Group 1 reactivity observation to shells/shielding and easier electron removal. It explicitly does not treat ionization energy alone as a full rate/energetics explanation.
- 006 explanation: unnecessary later-unit oxidation/reduction terminology changed to electron loss/gain.
- 010 explanation: “filled third principal energy level” corrected to “filled 3s/3p valence shell”; the entire n=3 level also contains 3d orbitals.

## Separate solve

Recovered prompts/options were solved before source explanations were read; all source keys matched the charge/model derivations. The two replacements were then checked against each alternative, as were all revised explanations. Answers C/A/D/B/A/C/B/D/C/A/B; A/B/C/D counts 3/3/3/2.

| Suffix | Correct reasoning and why alternatives fail |
| --- | --- |
| 001 | Six-valence-electron X forms X2−; two Li+ balance it: Li2X. Other ratios carry −1, −3, or −4 net charge. |
| 002 | 12:8 reduces to 3:2 and balances +24/−24. Reversed/unreduced/1:1 formulas fail empirical-ratio or neutrality requirements. |
| 003 | Ca and Sr are Group 2 with typical +2 charges; SrF2. Shell count does not change the usual charge; 1:1 and proposed 2:1 ratios fail neutrality. |
| 004 | QBr → Q+; MgR → R2−; Q2R. Other ratios retain −1/−3/−4 total charge. This reverses known formulas before predicting a new one. |
| 005 | Al loses three valence electrons, giving [Ne], unlike partial-loss or five-electron-gain proposals. |
| 006 | Electron transfer gives Na+/Cl− and electrostatic stabilization. Protons do not transfer in ordinary bonding; reversed charges and two cations do not describe NaCl. No claim that isolated electron removal releases energy. |
| 007 | Overall neutrality is a charge sum; constituent Mg2+/F− remain charged. Proton transfer, electron regain, and swapped typical charge magnitudes fail. |
| 008 | Li/Na/K have one valence electron, increasingly high shells and shielding; easier removal is consistent with the given trend. Nuclear charge increases, not decreases; valence count stays one and shell number rises. |
| 009 | MCl/PCl support similar +1 ionic behavior; NCl2 implies +2. The claim is explicitly most likely, not a proof of group membership from a formula alone. |
| 010 | Cl can form Cl−; Ar has a closed valence shell and does not readily form a stable isolated simple anion under ordinary conditions. Same shell count does not guarantee reaction; nuclear attraction is not zero. |
| 011 | 0.250 mol Mg2+ requires 0.500 mol F−. Ratios 1:0.5, 1:1, and 1:3 leave nonzero charge. |

Formula prediction remains central to this narrow topic, but tasks distinguish configuration inference, ratio reduction, analogous group behavior, inverse formula inference, atomic versus bulk neutrality, reactivity, and mole-scale representation. Numerical/charge checks are in `scripts/check-chemistry-science.mjs`. No third-party practice questions were used to author replacements. This is a same-assistant separate pass, not independent human approval.
