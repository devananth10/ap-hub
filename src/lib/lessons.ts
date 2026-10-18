import { topicKey } from "./courses.ts";

export type Lesson = {
  tagline: string;
  posterHeading: string;
  overview: { heading: string; introduction: string; objectives: string[]; prompt: string };
  sampleRecap: string[];
};

/** Original lesson metadata. External teaching content is linked, never copied. */
export const lessons: Record<string, Lesson> = {
  [topicKey("chemistry", "electron-configuration")]: {
    tagline: "Small particles. A bigger understanding of how matter works.",
    posterHeading: "It all starts\nwith electrons.",
    overview: {
      heading: "Understand the arrangement.",
      introduction: "Explore how electrons are organized into shells, subshells, and orbitals, then connect that arrangement to an element’s place in the periodic table.",
      objectives: [
        "Distinguish a shell, a subshell, and an orbital.",
        "Write a ground-state electron configuration for a main-group atom.",
        "Identify core and valence electrons.",
      ],
      prompt: "Count the electrons in each configuration you write. Does the total match the atomic number?",
    },
    sampleRecap: [
      "Electron configurations describe how electrons occupy atomic orbitals.",
      "Each orbital holds up to two electrons with opposite spins.",
      "For a neutral atom, the total number of electrons equals its atomic number.",
      "The s and p subshells can hold up to 2 and 6 electrons, respectively.",
      "Ground-state arrangements occupy lower-energy orbitals first, with exceptions for some elements.",
      "Valence electrons help explain bonding patterns and periodic trends.",
    ],
  },
};
