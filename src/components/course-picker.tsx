"use client";

import { Check, Plus } from "lucide-react";
import { courses } from "@/lib/courses";
import { useStudy } from "./study-provider";
import { CourseIcon, Dialog } from "./ui";

export function CoursePicker({ onClose }: { onClose: () => void }) {
  const { selected, toggleCourse } = useStudy();
  return <Dialog title="Make this space yours" onClose={onClose}>
    <p className="muted dialog-intro">Choose the courses you’re taking. You can change these anytime.</p>
    <div className="picker-list">{courses.map((course) => <button key={course.id} className={`picker-row ${selected.includes(course.id) ? "selected" : ""}`} aria-pressed={selected.includes(course.id)} onClick={() => toggleCourse(course.id)}>
      <CourseIcon course={course} /><span><strong>{course.title}</strong><small>{course.id === "chemistry" ? "1 topic ready to explore" : "Course outline · lessons coming soon"}</small></span><span className="picker-check">{selected.includes(course.id) ? <Check size={17} /> : <Plus size={17} />}</span>
    </button>)}</div>
    <div className="dialog-footer"><span className="muted small">{selected.length} courses selected</span><button className="button primary" onClick={onClose}>Done</button></div>
  </Dialog>;
}
