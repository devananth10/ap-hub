import type { Course } from "./courses.ts";

// These existing keys are deliberately retained across the PrepAtlas rename.
export const STORAGE_KEY = "ap-hub:v1";
export const THEME_KEY = "ap-hub:theme";
export type StudyData = {
  selected: string[];
  notes: Record<string, string>;
  completed: string[];
  /** Personal selections of official resource IDs, never a source for the official catalog. */
  saved: string[];
  lastTopic: string | null;
};
export const defaultStudyData: StudyData = {
  selected: ["chemistry", "biology", "calculus-ab"],
  notes: {}, completed: [], saved: [], lastTopic: null,
};
function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
export function parseStudyData(parsed: unknown, courses: Course[]): StudyData {
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid saved data");
  const value = parsed as Partial<StudyData>;
  if (!stringArray(value.selected) || !stringArray(value.completed) || !stringArray(value.saved) || !value.notes || typeof value.notes !== "object" || Array.isArray(value.notes) || !Object.values(value.notes).every((note) => typeof note === "string")) throw new Error("Invalid saved data");
  return {
    selected: value.selected.filter((id) => courses.some((course) => course.id === id)),
    completed: value.completed,
    // Preserve removed resource IDs without republishing their links.
    saved: value.saved,
    notes: value.notes,
    lastTopic: typeof value.lastTopic === "string" ? value.lastTopic : null,
  };
}
