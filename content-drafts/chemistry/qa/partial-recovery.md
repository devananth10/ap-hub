# Partial recovered banks — not importable

Recovered and inspected 2026-10-17. Ten complete question objects are available for 1.6, ten for 1.7, and nine for 2.1. Their remaining text is truncated. There are **no complete eleven-question banks here**, and none count toward completed-topic totals. The entire retrieved fragment is preserved in the unchanged source archive; parsed question objects are in `recovered/fragment-*.json` and corrected working copies in `partial/`.

## Scope references

[College Board CED](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf), Fall 2024, accessed 2026-10-17:

- 1.6, printed p.36 / PDF43, LO 1.6.A, EK 1.6.A.1, suggested skill 4.B: connect peak positions/populations with electron configurations and attraction. Ideal peak height proportionality is explicitly an ideal model, not a blanket claim about all measured intensities.
- 1.7, printed p.37 / PDF44, LO 1.7.A, EK 1.7.A.1–3, skill 4.A: ionization energy, atomic/ionic radii, electron affinity, electronegativity and estimates from trends. Writing anomalous Aufbau configurations is explicitly excluded. The recovered Cl/Ar electron-addition comparison is within listed electron affinity scope, not an unsupported exclusion based on its name.
- 2.1, printed pp.44–45 / PDF51–52, LO 2.1.A, EK 2.1.A.1–5, skill 6.A: electronegativity, shared electrons/partial charges, continuum of bonding, properties as evidence, and metallic delocalization. The properties-based 003 and 009 and metallic 004 are supported by explicit EKs; they need not be removed merely because later topics develop these ideas further.

## Separate solve results

The complete recovered prompts/options were solved before explanations/keys were read, then each explanation was inspected. Keys matched the derived answers:

- 1.6 (001–010): C/A/D/B/C/A/B/D/A/C. Electron sums identify Na (11), Cl valence 7, and Cl− (18 electrons/17 protons); peak count equals occupied subshell count in the ideal model. N/O 2p ratio 4/3 with common normalization. Ca2+ loses its 4s peak but retains occupied inner-subshell peaks, which may shift. 3s is more tightly bound than 3p in Si; Al adds a 3p peak and binds corresponding inner electrons more strongly than Mg. Energy balance 60−18=42 eV is arithmetically correct.
- 1.7 (001–010): C/A/D/B/C/D/A/B/D/C. Across-period radii decrease; ten-electron isoelectronic radii decrease as Z rises 8/9/11/12; Mg/Al subshell and N/O pairing account for given ionization exceptions. Largest early successive-ionization jump after electron 2 indicates Group 2. Group 1 ionization energies decrease; electronegativity F>O>N>C; Cl accepts an electron more favorably than closed-shell Ar. Fe3+ is smaller than Fe2+ under comparable environments. Rb about 400 kJ/mol is a reasonable estimate among the provided choices, not a value derived exactly from a trend.
- 2.1 (001–009): C/A/D/B/A/C/B/D/A. EN differences 1.9/0.9/0.7/0.4 support the qualitative H–F polarity choice; oxygen is partial negative in N–O. Mobile ions explain molten-only conduction; delocalized electrons explain metallic conduction. No exact universal EN cutoff; halogen EN decreases down a group; HF is polar covalent. N–H difference .9 versus C–H .4; low-melting nonconducting metal/nonmetal compounds can have substantial covalent character.

## Working-copy corrections and remaining concerns

| ID | Correction or status |
| --- | --- |
| chem-1-6-003 | Removed editing residue “Both atoms contain two electrons in the 2p subshell? No.” Both Na and Mg have 2p6, with 11/12 protons and the same four inner 1s/2s electrons. Mg's greater binding is consistent with greater net attraction, not a different 2p population. All four options checked. |
| chem-1-6-005 | Added common per-electron intensity normalization explicitly; cross-spectrum peak heights otherwise need not directly compare populations. |
| chem-1-6-008 | Arithmetic and alternatives correct, but central photon-energy calculation overlaps later spectroscopy (3.11–3.12); retain as unapproved recovered work, flag for replacement or stronger 1.6 alignment during whole-bank review. No replacement created while full source remains unavailable. |
| chem-1-7-009 | Added comparable coordination environments/spin states; ionic radii depend on context. Remaining qualitative comparison is appropriate under that assumption. |
| chem-1-7-010 | Existing 006 and 010 both address down-group first ionization energy. Flag variety review when the missing end is recovered; do not count a complete bank yet. |
| chem-2-1-001 | Replaced contradictory proton self-correction with coherent 17-versus-9 statement; both numbers verified. Prompt now explicitly uses a qualitative polarity model. EN alone does not numerically determine a dipole moment, which also depends on charge separation distance. All four options checked. |
| chem-2-1-007/008 | Conceptually valid but overlap other polarity comparisons; review whole-bank variety after complete retrieval. |

Working IDs are explicitly mapped to `photoelectron-spectroscopy`, `periodic-trends`, and `bonds` from the established import guide. All corrections remain unpublished. The original archive was compared byte-for-byte to the recovered source and matches its recorded SHA-256. These checks do not constitute independent human scientific review. Resume by obtaining the unavailable endings/full sets; never fabricate them or silently call partial work complete.

## October18 completion continuation

The owner later explicitly authorized completing earlier gaps after Unit9. The original archive, recovered fragments and partial working files remain unchanged. Complete pending banks now retain all29 corrected working objects exactly, with new1.6-011,1.7-011,2.1-010 and2.1-011. These additions are new work, not recovered truncated endings. Earlier scope/variety flags remain for human review; no valid question was discarded. Per-topic QA records distinguish the retained content from additions.
