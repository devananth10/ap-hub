# Topic 2.5 — Lewis Diagrams

Status: eleven original questions; structural checks and a separate same-assistant solution pass completed. **Pending human scientific review and publication approval.** Registered topicId `topic-2-5`. No app import.

Authority: [College Board CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), Fall 2024, accessed 2026-10-17, printed p.49 / PDF56. LO 2.5.A and EK 2.5.A.1: represent molecules using established Lewis-diagram principles; suggested skill 3.B. Apply valence-electron accounting, ion charges, hydrogen duets, local octets, bonds, and lone pairs. BF3 is explicitly introduced as the usual electron-deficient Lewis model, rather than testing an unstated universal octet assumption. Avoid making formal-charge ranking/resonance (2.6), geometry/hybridization (2.7), or bond energy (2.2) the central task.

Prompts/options were reread without keys after authoring. Each candidate was checked for total electrons, atoms, and local occupancy; the saved explanations were checked afterward. Derived choices D/A/C/B/D/B/A/C/B/A/C match the bank, with A/B/C/D distribution 3/3/3/2.

| Suffix | Independent bookkeeping and alternatives |
| --- | --- |
| 001 | NH4+: 5+4−1=8 electrons, four bonds. Other counts omit H, ignore charge, or add instead of subtracting an electron. |
| 002 | H–C≡N plus one N lone pair: 2+6+2=10 electrons; occupancies H2/C8/N8. B leaves C4; C gives H4; D leaves C6. |
| 003 | H2O2: 14 electrons, three single bonds use 6; four lone pairs remain, two on each O. One pair per O is deficient; three is excess; H already has its duet. |
| 004 | CO2: two double bonds plus four O lone pairs use 16. Single-bond-only C has four surrounding electrons; excess O lone pairs give 20 total/ten around O; mixed bond option uses 14/incomplete octets. |
| 005 | CF4: 32 electrons; 8 in bonds and 24 in F lone pairs. Adding to C exceeds its octet; four double bonds give C16; removing F lone pairs leaves incomplete octets. |
| 006 | PH3: 8 electrons; 6 in bonds, 2 in a P lone pair. Other choices exceed budget, change formula, or exceed H's duet. |
| 007 | H3O+: 8 electrons, three bonds and one O lone pair. Two pairs give ten electrons; omitted H changes species; no pair leaves six. |
| 008 | C2H4: 12 electrons, four C–H singles and one C=C. A uses 10; B uses 14; D uses 14 and gives each C ten surrounding electrons. |
| 009 | Both C2H6O connectivities use 20 electrons; C has four bonds, O two bonds/two lone pairs, H one bond. Same molecular formula need not uniquely determine connectivity. These are not resonance contributors; no resonance-ranking task is required. |
| 010 | N2H4: 14 electrons = 10 in five single bonds + 4 in two lone pairs. B omits 4; C uses 16/N10; D uses 14 but N10, illustrating why total count alone is insufficient. |
| 011 | BF3: 3+3×7=24 electrons, 6 in bonds/18 nonbonding. B has six surrounding electrons, F eight. Octet is not universal for boron; bonding pairs count for F. |

The graph-based routine in `scripts/check-chemistry-science.mjs` reconstructs all valid structures from independent atom/edge/lone-pair inputs and asserts total budget, local duet/octet (explicit B6 exception), and net formal-charge sum. That bookkeeping supports this topic without asking students to calculate formal charges. It does not validate every chemical property or substitute for human review. The set varies total-count decisions, incomplete-diagram repair, local-versus-global validity, connectivity, multiple bonds, polyatomic ions, and an electron-deficient example; no experimental or numerical exercise was forced into an unrelated context. No third-party practice questions were consulted.
