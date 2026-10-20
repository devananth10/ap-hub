# PrepAtlas content import guide

Created 2026-10-17 from the actual project and the official 2026–27 Chemistry framework. This is the project mapping registry, not a recovered historical guide.

The existing 17 topic IDs are preserved. The other 74 topics were not registered before this audit: their new canonical IDs are explicitly assigned as `topic-<unit>-<topic>`. These assignments do not assert that older unavailable drafts used those IDs. Translate an old draft only after matching its official number and recording the conversion.

## Question files and publication

Video links use a separate official resource catalog and approval system; see `VIDEO_EDIT_GUIDE.md`. Editing video metadata must not regenerate or reimport the published question files below.

- Approved application banks: `src/content/practice/`; publication registry: `src/lib/practice-bank.ts`.
- Historical source snapshots: `content-drafts/chemistry/pending/`; all ninety completed sets were copied into the live bank under the October 18 bulk authorization. Keep these source copies for provenance and never import this directory into application components or count them twice. Future unregistered drafts remain unpublished.
- One JSON object per file: only `courseId`, `unitNumber`, `topicId`, `questions`.
- Question fields: only `id`, `prompt`, `options`, `correctIndex`, `explanation`.
- IDs: `chem-<unit>-<topic>-001` through `011`; four distinct options; answer index 0–3. Every new complete set has exactly eleven questions.
- The owner explicitly authorized the existing completed 1,001-question Chemistry bank for bulk publication after checks on 2026-10-18; all 91 sets are registered. From 2026-10-19, the permanent MCQ policy authorizes automatic topic-by-topic publication of completed, validated original questions for all AP courses, additions and corrections without individual approval. Unresolved errors remain unpublished; no independent human review is claimed. Resource approval and public deployment remain separate. See `AGENTS.md` and `docs/PRACTICE.md`.
- The owner separately authorized one validated addition to the preserved ten Topic 1.1 questions and removal of the Topic 1.5 demo on 2026-10-17.
- No general upload/import dashboard exists. Draft validation is a dry run; registration in the approved module is the publication operation.
- The lightweight `src/config/published-practice-index.json` must match every registered course/unit/topic count. Run `pnpm test:publication` after publication changes; use the frozen audit hashes to detect unintended question edits.

## Exact Chemistry mappings

Calculus AB uses course ID `calculus-ab`, stable question IDs `calc-ab-<unit>-<topic>-001` through `011`, canonical files `src/content/practice/calculus-ab-<unit>-<topic>.json` and explicit imports in `src/lib/calculus-ab-bank.ts`. The eight original course-topic IDs are preserved; all 81 official mappings, routes and scope exclusions are in `content-drafts/calculus-ab/research/official-topics.json` and `CURRICULUM_AUDIT.md`. QA lives in `content-drafts/calculus-ab/qa/`; PROGRESS.json lists completed/missing topics. `pnpm test:calculus` verifies the saved sets. After validation, `node --experimental-strip-types scripts/publish-calculus-topics.mjs` registers completed sets and updates the client counts/progress. This does not publish unreviewed filesystem drafts or external resources.

| Topic | Official name | topicId | Mapping origin |
| --- | --- | --- | --- |
| 1.1 | Moles and Molar Mass | `moles` | preserved existing ID |
| 1.2 | Mass Spectra of Elements | `mass-spectra` | preserved existing ID |
| 1.3 | Elemental Composition of Pure Substances | `composition` | preserved existing ID |
| 1.4 | Composition of Mixtures | `mixtures` | preserved existing ID |
| 1.5 | Atomic Structure and Electron Configuration | `electron-configuration` | preserved existing ID |
| 1.6 | Photoelectron Spectroscopy | `photoelectron-spectroscopy` | preserved existing ID |
| 1.7 | Periodic Trends | `periodic-trends` | preserved existing ID |
| 1.8 | Valence Electrons and Ionic Compounds | `valence` | preserved existing ID |
| 2.1 | Types of Chemical Bonds | `bonds` | preserved existing ID |
| 2.2 | Intramolecular Force and Potential Energy | `potential-energy` | preserved existing ID |
| 2.3 | Structure of Ionic Solids | `topic-2-3` | new canonical assignment |
| 2.4 | Structure of Metals and Alloys | `topic-2-4` | new canonical assignment |
| 2.5 | Lewis Diagrams | `topic-2-5` | new canonical assignment |
| 2.6 | Resonance and Formal Charge | `topic-2-6` | new canonical assignment |
| 2.7 | VSEPR and Hybridization | `topic-2-7` | new canonical assignment |
| 3.1 | Intermolecular and Interparticle Forces | `intermolecular-forces` | preserved existing ID |
| 3.2 | Properties of Solids | `topic-3-2` | new canonical assignment |
| 3.3 | Solids, Liquids, and Gases | `topic-3-3` | new canonical assignment |
| 3.4 | Ideal Gas Law | `topic-3-4` | new canonical assignment |
| 3.5 | Kinetic Molecular Theory | `topic-3-5` | new canonical assignment |
| 3.6 | Deviation from Ideal Gas Law | `topic-3-6` | new canonical assignment |
| 3.7 | Solutions and Mixtures | `topic-3-7` | new canonical assignment |
| 3.8 | Representations of Solutions | `topic-3-8` | new canonical assignment |
| 3.9 | Separation of Solutions and Mixtures | `topic-3-9` | new canonical assignment |
| 3.10 | Solubility | `topic-3-10` | new canonical assignment |
| 3.11 | Spectroscopy and the Electromagnetic Spectrum | `topic-3-11` | new canonical assignment |
| 3.12 | Properties of Photons | `topic-3-12` | new canonical assignment |
| 3.13 | Beer-Lambert Law | `topic-3-13` | new canonical assignment |
| 4.1 | Introduction for Reactions | `reactions` | preserved existing ID |
| 4.2 | Net Ionic Equations | `topic-4-2` | new canonical assignment |
| 4.3 | Representations of Reactions | `topic-4-3` | new canonical assignment |
| 4.4 | Physical and Chemical Changes | `topic-4-4` | new canonical assignment |
| 4.5 | Stoichiometry | `topic-4-5` | new canonical assignment |
| 4.6 | Introduction to Titration | `topic-4-6` | new canonical assignment |
| 4.7 | Types of Chemical Reactions | `topic-4-7` | new canonical assignment |
| 4.8 | Introduction to Acid-Base Reactions | `topic-4-8` | new canonical assignment |
| 4.9 | Oxidation-Reduction (Redox) Reactions | `topic-4-9` | new canonical assignment |
| 5.1 | Reaction Rates | `rates` | preserved existing ID |
| 5.2 | Introduction to Rate Law | `topic-5-2` | new canonical assignment |
| 5.3 | Concentration Changes Over Time | `topic-5-3` | new canonical assignment |
| 5.4 | Elementary Reactions | `topic-5-4` | new canonical assignment |
| 5.5 | Collision Model | `topic-5-5` | new canonical assignment |
| 5.6 | Reaction Energy Profile | `topic-5-6` | new canonical assignment |
| 5.7 | Introduction to Reaction Mechanisms | `topic-5-7` | new canonical assignment |
| 5.8 | Reaction Mechanism and Rate Law | `topic-5-8` | new canonical assignment |
| 5.9 | Pre-Equilibrium Approximation | `topic-5-9` | new canonical assignment |
| 5.10 | Multistep Reaction Energy Profile | `topic-5-10` | new canonical assignment |
| 5.11 | Catalysis | `topic-5-11` | new canonical assignment |
| 6.1 | Endothermic and Exothermic Processes | `energy` | preserved existing ID |
| 6.2 | Energy Diagrams | `topic-6-2` | new canonical assignment |
| 6.3 | Heat Transfer and Thermal Equilibrium | `topic-6-3` | new canonical assignment |
| 6.4 | Heat Capacity and Calorimetry | `topic-6-4` | new canonical assignment |
| 6.5 | Energy of Phase Changes | `topic-6-5` | new canonical assignment |
| 6.6 | Introduction to Enthalpy of Reaction | `topic-6-6` | new canonical assignment |
| 6.7 | Bond Enthalpies | `topic-6-7` | new canonical assignment |
| 6.8 | Enthalpy of Formation | `topic-6-8` | new canonical assignment |
| 6.9 | Hess’s Law | `topic-6-9` | new canonical assignment |
| 7.1 | Introduction to Equilibrium | `equilibrium` | preserved existing ID |
| 7.2 | Direction of Reversible Reactions | `topic-7-2` | new canonical assignment |
| 7.3 | Reaction Quotient and Equilibrium Constant | `topic-7-3` | new canonical assignment |
| 7.4 | Calculating the Equilibrium Constant | `topic-7-4` | new canonical assignment |
| 7.5 | Magnitude of the Equilibrium Constant | `topic-7-5` | new canonical assignment |
| 7.6 | Properties of the Equilibrium Constant | `topic-7-6` | new canonical assignment |
| 7.7 | Calculating Equilibrium Concentrations | `topic-7-7` | new canonical assignment |
| 7.8 | Representations of Equilibrium | `topic-7-8` | new canonical assignment |
| 7.9 | Introduction to Le Châtelier’s Principle | `topic-7-9` | new canonical assignment |
| 7.10 | Reaction Quotient and Le Châtelier’s Principle | `topic-7-10` | new canonical assignment |
| 7.11 | Introduction to Solubility Equilibria | `topic-7-11` | new canonical assignment |
| 7.12 | Common-Ion Effect | `topic-7-12` | new canonical assignment |
| 8.1 | Introduction to Acids and Bases | `acids` | preserved existing ID |
| 8.2 | pH and pOH of Strong Acids and Bases | `topic-8-2` | new canonical assignment |
| 8.3 | Weak Acid and Base Equilibria | `topic-8-3` | new canonical assignment |
| 8.4 | Acid-Base Reactions and Buffers | `topic-8-4` | new canonical assignment |
| 8.5 | Acid-Base Titrations | `topic-8-5` | new canonical assignment |
| 8.6 | Molecular Structure of Acids and Bases | `topic-8-6` | new canonical assignment |
| 8.7 | pH and pKa | `topic-8-7` | new canonical assignment |
| 8.8 | Properties of Buffers | `topic-8-8` | new canonical assignment |
| 8.9 | Henderson-Hasselbalch Equation | `topic-8-9` | new canonical assignment |
| 8.10 | Buffer Capacity | `topic-8-10` | new canonical assignment |
| 8.11 | pH and Solubility | `topic-8-11` | new canonical assignment |
| 9.1 | Introduction to Entropy | `entropy` | preserved existing ID |
| 9.2 | Absolute Entropy and Entropy Change | `topic-9-2` | new canonical assignment |
| 9.3 | Gibbs Free Energy and Thermodynamic Favorability | `topic-9-3` | new canonical assignment |
| 9.4 | Thermodynamic and Kinetic Control | `topic-9-4` | new canonical assignment |
| 9.5 | Free Energy and Equilibrium | `topic-9-5` | new canonical assignment |
| 9.6 | Free Energy of Dissolution | `topic-9-6` | new canonical assignment |
| 9.7 | Coupled Reactions | `topic-9-7` | new canonical assignment |
| 9.8 | Galvanic (Voltaic) and Electrolytic Cells | `topic-9-8` | new canonical assignment |
| 9.9 | Cell Potential and Free Energy | `topic-9-9` | new canonical assignment |
| 9.10 | Cell Potential Under Nonstandard Conditions | `topic-9-10` | new canonical assignment |
| 9.11 | Electrolysis and Faraday’s Law | `topic-9-11` | new canonical assignment |

## Curriculum sources

- https://apcentral.collegeboard.org/courses/how-ap-develops-courses-and-exams/course-changes-overview
- https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf
- https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description-clarifications.pdf

Accessed 2026-10-17. Fall 2024 CED applies in 2026–27. June 2026 clarifications concern front matter, resource references, and Progress Check wording; they do not introduce a different Chemistry topic inventory.

## Human Geography continuation

The verified 68-topic registry is content-drafts/human-geography/research/official-topics.json, with courseId human-geography, unitNumber 1–7 and canonical IDs topic-<unit>-<topic>. Use src/config/human-geography-curriculum.json for runtime names. Question target: eleven original MCQs per topic, 748 total, no placeholders counted. Follow the subsequent visual-question master prompt and permanent validated automatic-publication policy. Question work must preserve all 136 verified video mappings, instructor preferences, notes and watched progress. Track actual completed/published counts in the Human Geography progress file.

Human Geography MCQs now use the existing five-field question schema with IDs hug-u-t-001 through 011. Store stimulus data separately by stable question ID in src/content/practice-stimuli/human-geography.json and skill/difficulty/verification in content-drafts/human-geography/qa/. See docs/GEOGRAPHY_STIMULI.md for schemas, exact validation/publication commands and limits. Never append unsupported fields to existing MCQ JSON.
