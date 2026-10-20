import type { PublishedResource } from "./resource-policy.ts";

export const humanGeographyInstructors = [
  { id: "mr-sinn", label: "Mr. Sinn", publisher: "Mr. Sinn" },
  { id: "heimler", label: "Heimler", publisher: "Heimler's History" },
] as const;
export type InstructorId = typeof humanGeographyInstructors[number]["id"];
export const defaultInstructor: InstructorId = "mr-sinn";
export function isInstructorId(value: unknown): value is InstructorId {
  return humanGeographyInstructors.some(instructor => instructor.id === value);
}

/** Availability never rewrites the saved preference. Only live, approved lessons count. */
export function instructorAvailability(resources: PublishedResource[], preferred: InstructorId = defaultInstructor) {
  const available = humanGeographyInstructors.filter(instructor => resources.some(resource =>
    resource.courseId === "human-geography" && resource.kind === "video" && resource.instructorId === instructor.id &&
    resource.approval.status === "approved" && resource.visibility !== "hidden"));
  const active = available.find(instructor => instructor.id === preferred) || available[0] || null;
  return { available, active, preferredUnavailable: !!active && active.id !== preferred };
}

export function instructorLessons(resources: PublishedResource[], preferred: InstructorId = defaultInstructor) {
  const choice = instructorAvailability(resources, preferred);
  const visibleResources = resources.filter(resource => resource.kind !== "video" || (
    resource.instructorId === choice.active?.id && resource.approval.status === "approved" && resource.visibility !== "hidden"));
  return { ...choice, resources: visibleResources, videos: visibleResources.filter(resource => resource.kind === "video") };
}
