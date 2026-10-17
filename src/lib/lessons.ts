import { resources, topicKey, video } from "./courses";

export type PracticeDemo = { prompt: string; options: string[]; correctIndex: number; explanation: string };
export type Lesson = {
  tagline: string;
  posterHeading: string;
  video: typeof video;
  resources: typeof resources;
  overview: { heading: string; introduction: string; objectives: string[]; prompt: string };
  sampleRecap: string[];
  practice: PracticeDemo;
};

/** Original lesson metadata. External teaching content is linked, never copied. */
export const lessons: Record<string, Lesson> = {
  [topicKey("chemistry", "electron-configuration")]: {
    tagline: "Small particles. A bigger understanding of how matter works.",
    posterHeading: "It all starts\nwith electrons.",
    video,
    resources,
    overview: {
      heading: "Understand the arrangement.",
      introduction: "Explore how electrons are organized into shells, subshells, and orbitals, then connect that arrangement to an element’s place in the periodic table.",
      objectives: [
        "Distinguish a shell, a subshell, and an orbital.",
        "Write a ground-state electron configuration for a main-group atom.",
        "Identify core and valence electrons.",
      ],
      prompt: "Pause and count the electrons in each configuration. Does the total match the atomic number?",
    },
    sampleRecap: [
      "Electron configurations describe how electrons occupy atomic orbitals.",
      "Each orbital holds up to two electrons with opposite spins.",
      "For a neutral atom, the total number of electrons equals its atomic number.",
    ],
    practice: {
      prompt: "Which is the ground-state electron configuration of a neutral oxygen atom (atomic number 8)?",
      options: ["1s² 2s² 2p⁴", "1s² 2s² 2p⁶", "1s² 2s¹ 2p⁵", "1s² 2s² 2p³"],
      correctIndex: 0,
      explanation: "Oxygen has 8 electrons: 2 fill 1s, 2 fill 2s, and the remaining 4 occupy 2p. The answer is A: 1s² 2s² 2p⁴.",
    },
  },
};
