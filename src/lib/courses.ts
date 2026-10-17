export type Topic = { id: string; number: string; title: string; ready?: boolean };
export type Unit = { number: number; title: string; topics: Topic[] };
export type Course = {
  id: string; title: string; shortTitle: string; category: string;
  color: "teal" | "violet" | "peach" | "blue" | "rose" | "amber";
  icon: "flask" | "leaf" | "function" | "atom" | "book" | "globe";
  description: string; units: Unit[];
};

export const courses: Course[] = [
  {
    id: "chemistry", title: "AP Chemistry", shortTitle: "Chemistry", category: "Science", color: "teal", icon: "flask",
    description: "Make sense of the molecular world, one concept at a time.",
    units: [
      { number: 1, title: "Atomic Structure and Properties", topics: [
        { id: "moles", number: "1.1", title: "Moles and molar mass" },
        { id: "mass-spectra", number: "1.2", title: "Mass spectra of elements" },
        { id: "composition", number: "1.3", title: "Elemental composition of pure substances" },
        { id: "mixtures", number: "1.4", title: "Composition of mixtures" },
        { id: "electron-configuration", number: "1.5", title: "Atomic structure and electron configuration", ready: true },
        { id: "photoelectron-spectroscopy", number: "1.6", title: "Photoelectron spectroscopy" },
        { id: "periodic-trends", number: "1.7", title: "Periodic trends" },
        { id: "valence", number: "1.8", title: "Valence electrons and ionic compounds" },
      ] },
      { number: 2, title: "Compound Structure and Properties", topics: [{ id: "bonds", number: "2.1", title: "Types of chemical bonds" }, { id: "potential-energy", number: "2.2", title: "Intramolecular force and potential energy" }] },
      { number: 3, title: "Properties of Substances and Mixtures", topics: [{ id: "intermolecular-forces", number: "3.1", title: "Intermolecular and interparticle forces" }] },
      { number: 4, title: "Chemical Reactions", topics: [{ id: "reactions", number: "4.1", title: "Introduction to reactions" }] },
      { number: 5, title: "Kinetics", topics: [{ id: "rates", number: "5.1", title: "Reaction rates" }] },
      { number: 6, title: "Thermochemistry", topics: [{ id: "energy", number: "6.1", title: "Endothermic and exothermic processes" }] },
      { number: 7, title: "Equilibrium", topics: [{ id: "equilibrium", number: "7.1", title: "Introduction to equilibrium" }] },
      { number: 8, title: "Acids and Bases", topics: [{ id: "acids", number: "8.1", title: "Introduction to acids and bases" }] },
      { number: 9, title: "Thermodynamics and Electrochemistry", topics: [{ id: "entropy", number: "9.1", title: "Introduction to entropy" }] },
    ],
  },
  { id: "biology", title: "AP Biology", shortTitle: "Biology", category: "Science", color: "violet", icon: "leaf", description: "Explore the remarkable systems that make life possible.", units: [
    { number: 1, title: "Chemistry of Life", topics: [{ id: "water", number: "1.1", title: "Structure of water and hydrogen bonding" }] },
    { number: 2, title: "Cells", topics: [{ id: "cells", number: "2.1", title: "Cell structure and function" }] },
    { number: 3, title: "Cellular Energetics", topics: [{ id: "enzymes", number: "3.1", title: "Enzymes" }] },
    { number: 4, title: "Cell Communication and Cell Cycle", topics: [{ id: "communication", number: "4.1", title: "Cell communication" }] },
    { number: 5, title: "Heredity", topics: [{ id: "meiosis", number: "5.1", title: "Meiosis" }] },
    { number: 6, title: "Gene Expression and Regulation", topics: [{ id: "dna", number: "6.1", title: "DNA and RNA structure" }] },
    { number: 7, title: "Natural Selection", topics: [{ id: "selection", number: "7.1", title: "Natural selection" }] },
    { number: 8, title: "Ecology", topics: [{ id: "ecosystems", number: "8.1", title: "Responses to the environment" }] },
  ] },
  { id: "calculus-ab", title: "AP Calculus AB", shortTitle: "Calculus AB", category: "Mathematics", color: "peach", icon: "function", description: "Find your flow with limits, derivatives, and integrals.", units: [
    { number: 1, title: "Limits and Continuity", topics: [{ id: "limits", number: "1.1", title: "Introducing limits" }] },
    { number: 2, title: "Differentiation: Definition and Fundamental Properties", topics: [{ id: "derivatives", number: "2.1", title: "Defining the derivative" }] },
    { number: 3, title: "Differentiation: Composite, Implicit, and Inverse Functions", topics: [{ id: "chain-rule", number: "3.1", title: "The chain rule" }] },
    { number: 4, title: "Contextual Applications of Differentiation", topics: [{ id: "rates", number: "4.1", title: "Interpreting the derivative in context" }] },
    { number: 5, title: "Analytical Applications of Differentiation", topics: [{ id: "mean-value", number: "5.1", title: "The mean value theorem" }] },
    { number: 6, title: "Integration and Accumulation of Change", topics: [{ id: "integrals", number: "6.1", title: "Accumulation of change" }] },
    { number: 7, title: "Differential Equations", topics: [{ id: "equations", number: "7.1", title: "Modeling with differential equations" }] },
    { number: 8, title: "Applications of Integration", topics: [{ id: "average", number: "8.1", title: "Average value of a function" }] },
  ] },
  { id: "physics-1", title: "AP Physics 1", shortTitle: "Physics 1", category: "Science", color: "blue", icon: "atom", description: "Discover the principles behind how our world moves.", units: [{ number: 1, title: "Kinematics", topics: [{ id: "motion", number: "1.1", title: "Position, velocity, and acceleration" }] }] },
  { id: "english-language", title: "AP English Language", shortTitle: "English Language", category: "Humanities", color: "rose", icon: "book", description: "Read with intention. Write with confidence.", units: [{ number: 1, title: "Rhetorical Foundations", topics: [{ id: "rhetoric", number: "1.1", title: "Understanding rhetorical situations" }] }] },
  { id: "us-history", title: "AP U.S. History", shortTitle: "U.S. History", category: "Humanities", color: "amber", icon: "globe", description: "Connect the people, ideas, and events that shaped a nation.", units: [{ number: 1, title: "Period 1: 1491–1607", topics: [{ id: "context", number: "1.1", title: "Contextualizing Period 1" }] }] },
];

export const exampleTopic = courses[0].units[0].topics[4];
export const topicKey = (courseId: string, topicId: string) => `${courseId}/${topicId}`;
export const lessonHref = "/courses/chemistry/electron-configuration";
export const video = {
  id: "2AFPfg0Como", title: "Electron Configuration", creator: "Bozeman Science",
  source: "https://www.bozemanscience.com/ap-chem-005-electron-configuration",
  url: "https://www.youtube.com/watch?v=2AFPfg0Como",
};
export const resources = [
  { id: "openstax", title: "Electron configurations, explained", publisher: "OpenStax · Chemistry 2e", type: "Reading", description: "A deeper look at orbitals, filling order, and electron arrangements.", url: "https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations" },
  { id: "bozeman", title: "The companion lesson", publisher: "Bozeman Science", type: "Video & resources", description: "Visit the creator’s original lesson and supporting resource links.", url: video.source },
  { id: "periodic-table", title: "Interactive periodic table", publisher: "Royal Society of Chemistry", type: "Reference", description: "Explore elements and check their atomic numbers as you study.", url: "https://www.rsc.org/periodic-table" },
];
export function findTopic(courseId: string, topicId: string) {
  const course = courses.find((item) => item.id === courseId);
  const unit = course?.units.find((item) => item.topics.some((topic) => topic.id === topicId));
  const topic = unit?.topics.find((item) => item.id === topicId);
  return { course, unit, topic };
}
