import calculusABUnits from "../config/calculus-ab-curriculum.json" with { type: "json" };
import chemistryUnits from "../config/chemistry-curriculum.json" with { type: "json" };
import humanGeographyUnits from "../config/human-geography-curriculum.json" with { type: "json" };
import type { AcademicTheme } from "./artwork.ts";

export type Topic = { id: string; number: string; title: string; ready?: boolean; workspaceReady?: boolean };
export type Unit = { number: number; title: string; topics: Topic[] };
export type Course = {
  id: string; title: string; shortTitle: string; category: string;
  color: "teal" | "violet" | "peach" | "blue" | "rose" | "amber";
  icon: "flask" | "leaf" | "function" | "atom" | "book" | "globe";
  description: string; units: Unit[]; artwork: AcademicTheme;
};

export const courses: Course[] = [
  {
    id: "chemistry", artwork: "chemistry", title: "AP Chemistry", shortTitle: "Chemistry", category: "Science", color: "teal", icon: "flask",
    description: "Make sense of the molecular world, one concept at a time.",
    units: chemistryUnits,
  },
  { id: "biology", artwork: "biology", title: "AP Biology", shortTitle: "Biology", category: "Science", color: "violet", icon: "leaf", description: "Explore the remarkable systems that make life possible.", units: [
    { number: 1, title: "Chemistry of Life", topics: [{ id: "water", number: "1.1", title: "Structure of water and hydrogen bonding" }] },
    { number: 2, title: "Cells", topics: [{ id: "cells", number: "2.1", title: "Cell structure and function" }] },
    { number: 3, title: "Cellular Energetics", topics: [{ id: "enzymes", number: "3.1", title: "Enzymes" }] },
    { number: 4, title: "Cell Communication and Cell Cycle", topics: [{ id: "communication", number: "4.1", title: "Cell communication" }] },
    { number: 5, title: "Heredity", topics: [{ id: "meiosis", number: "5.1", title: "Meiosis" }] },
    { number: 6, title: "Gene Expression and Regulation", topics: [{ id: "dna", number: "6.1", title: "DNA and RNA structure" }] },
    { number: 7, title: "Natural Selection", topics: [{ id: "selection", number: "7.1", title: "Natural selection" }] },
    { number: 8, title: "Ecology", topics: [{ id: "ecosystems", number: "8.1", title: "Responses to the environment" }] },
  ] },
  { id: "calculus-ab", artwork: "calculus", title: "AP Calculus AB", shortTitle: "Calculus AB", category: "Mathematics", color: "peach", icon: "function", description: "Find your flow with limits, derivatives, and integrals.", units: calculusABUnits },
  { id: "physics-1", artwork: "physics", title: "AP Physics 1", shortTitle: "Physics 1", category: "Science", color: "blue", icon: "atom", description: "Discover the principles behind how our world moves.", units: [{ number: 1, title: "Kinematics", topics: [{ id: "motion", number: "1.1", title: "Position, velocity, and acceleration" }] }] },
  { id: "english-language", artwork: "literature", title: "AP English Language", shortTitle: "English Language", category: "Humanities", color: "rose", icon: "book", description: "Read with intention. Write with confidence.", units: [{ number: 1, title: "Rhetorical Foundations", topics: [{ id: "rhetoric", number: "1.1", title: "Understanding rhetorical situations" }] }] },
  { id: "us-history", artwork: "history", title: "AP U.S. History", shortTitle: "U.S. History", category: "Humanities", color: "amber", icon: "globe", description: "Connect the people, ideas, and events that shaped a nation.", units: [{ number: 1, title: "Period 1: 1491–1607", topics: [{ id: "context", number: "1.1", title: "Contextualizing Period 1" }] }] },
  { id: "human-geography", artwork: "geography", title: "AP Human Geography", shortTitle: "Human Geography", category: "Social Science", color: "teal", icon: "globe", description: "Explore the patterns connecting people, places, and our changing world.", units: humanGeographyUnits },
];

export const exampleTopic = courses[0].units[0].topics[4];
export const topicKey = (courseId: string, topicId: string) => `${courseId}/${topicId}`;
export const lessonHref = "/courses/chemistry/electron-configuration";
export function findTopic(courseId: string, topicId: string) {
  const course = courses.find((item) => item.id === courseId);
  const unit = course?.units.find((item) => item.topics.some((topic) => topic.id === topicId));
  const topic = unit?.topics.find((item) => item.id === topicId);
  return { course, unit, topic };
}
