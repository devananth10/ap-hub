"use client";
import { humanGeographyInstructors, instructorAvailability, type InstructorId } from "@/lib/video-instructors";
import type { PublishedResource } from "@/lib/resource-policy";

export function InstructorSelector({ resources, preferred, onChange, ready }: {
  resources: PublishedResource[]; preferred: InstructorId; onChange: (id: InstructorId) => void; ready: boolean;
}) {
  const { available, active, preferredUnavailable } = instructorAvailability(resources, preferred);
  if (!active) return null;
  const preferredName = humanGeographyInstructors.find(item => item.id === preferred)!.label;
  return <section className="instructor-selection" aria-label="Lesson instructor">
    {available.length > 1 ? <fieldset disabled={!ready}>
      <legend>Choose Your Instructor</legend>
      <div className="instructor-options">{available.map(instructor => { const count = resources.filter(resource => resource.instructorId === instructor.id && resource.kind === "video" && resource.approval.status === "approved" && resource.visibility !== "hidden").length; return <label key={instructor.id} className={active.id === instructor.id ? "selected" : ""}>
        <input type="radio" name="lesson-instructor" value={instructor.id} checked={active.id === instructor.id} onChange={() => onChange(instructor.id)} />
        <span>{instructor.label}<small>{count} {count === 1 ? "video" : "videos"}</small></span>
      </label>; })}</div>
    </fieldset> : <p className="small"><strong>{active.label}</strong> · Lesson instructor</p>}
    <p className="small muted" role="status">{preferredUnavailable
      ? `${preferredName} has no available lesson for this topic. Showing ${active.label}; your preference is saved.`
      : available.length === 1 ? `Only ${active.label} has an available lesson for this topic.` : "Your choice is remembered across Human Geography topics."}</p>
  </section>;
}
