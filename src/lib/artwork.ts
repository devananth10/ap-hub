export const academicThemes = [
  { id: "chemistry", label: "Molecular connections" },
  { id: "biology", label: "Patterns of life" },
  { id: "calculus", label: "A curve of possibility" },
  { id: "physics", label: "Motion in balance" },
  { id: "computer-science", label: "Ideas in a network" },
  { id: "history", label: "Connections across time" },
  { id: "geography", label: "A world of connections" },
  { id: "literature", label: "Between the lines" },
] as const;
export type AcademicTheme = typeof academicThemes[number]["id"];

/** The caller supplies a server-side draw; this module never randomizes course art. */
export function dashboardThemeAt(index: number): AcademicTheme {
  if (!Number.isInteger(index) || index < 0 || index >= academicThemes.length) throw new Error("Invalid artwork index");
  return academicThemes[index].id;
}
