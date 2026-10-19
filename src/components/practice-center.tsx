"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Target } from "lucide-react";
import { courses } from "@/lib/courses";
import { practiceCount, practiceHref, type PracticeScope } from "@/lib/practice-scope";
import type { PracticeEntry } from "@/lib/practice";
import { PracticeSession } from "./practice-session";
import { AcademicArt } from "./academic-art";

export function PracticeCenter({ scope, entries }: { scope: PracticeScope; entries: PracticeEntry[] }) {
  const router = useRouter();
  const course = courses.find((item) => item.id === scope.courseId);
  const unit = course?.units.find((item) => item.number === scope.unitNumber);
  const topic = unit?.topics.find((item) => item.id === scope.topicId);
  const label = topic ? `Topic ${topic.number} · ${topic.title}` : unit ? `Unit ${unit.number} · ${unit.title}` : course ? course.title : "All courses";
  const courseHasPractice = !!course && practiceCount({ courseId: course.id }) > 0;
  const emptyTitle = course ? `${course.title} practice questions are coming soon.` : "Practice questions are coming soon.";
  return (
    <div className="page practice-page">
      <div className="eyebrow"><Target size={13} /> PUT YOUR UNDERSTANDING TO WORK</div>
      <h1>Practice with purpose.</h1>
      <p className="page-description">Choose your focus. Build understanding, one question at a time.</p>
      <section className="practice-focus panel" aria-label="Practice scope">
        <div className="practice-focus-copy"><span className="tiny-label">YOUR FOCUS</span><h2>{label}</h2><p>{entries.length} MCQ {entries.length === 1 ? "question" : "questions"} available in this scope.</p></div>
        <div className="practice-focus-art"><AcademicArt theme={course?.artwork || "calculus"} compact /></div>
      </section>
      <div className="practice-filters">
        <label>Course<select aria-label="Practice course" value={course?.id || ""} onChange={(event) => router.push(practiceHref(event.target.value ? { courseId: event.target.value } : {}))}><option value="">All courses</option>{courses.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label>Unit<select aria-label="Practice unit" disabled={!course} value={unit?.number || ""} onChange={(event) => router.push(practiceHref({ courseId: course?.id, ...(event.target.value ? { unitNumber: Number(event.target.value) } : {}) }))}><option value="">All units</option>{course?.units.map((item) => <option key={item.number} value={item.number}>Unit {item.number} · {item.title}</option>)}</select></label>
        <label>Topic<select aria-label="Practice topic" disabled={!unit} value={topic?.id || ""} onChange={(event) => router.push(practiceHref({ courseId: course?.id, unitNumber: unit?.number, ...(event.target.value ? { topicId: event.target.value } : {}) }))}><option value="">All topics</option>{unit?.topics.map((item) => <option key={item.id} value={item.id}>{item.number} · {item.title}</option>)}</select></label>
      </div>
      <section className="panel practice-session" aria-label="Practice session">
        <div className="practice-mode-row"><div className="practice-modes" role="group" aria-label="Practice format"><button className="selected" aria-pressed="true">MCQs <span>PRACTICE</span></button><button disabled>FRQs <span>COMING SOON</span></button><button disabled>Mixed <span>COMING SOON</span></button></div><span className="small muted">Session score · resets on reload</span></div>
        {entries.length ? <PracticeSession key={practiceHref(scope)} entries={entries} /> : <div className="empty-state practice-empty"><Target size={32} /><h2>{courseHasPractice ? `Practice questions for ${course?.title} ${label} are coming soon.` : emptyTitle}</h2><p>{courseHasPractice ? "Explore the published questions elsewhere in this course, or return to your topic." : "There are no published questions in this course yet. Your selected study context stays available below."}</p>{courseHasPractice && <Link className="button primary" href={practiceHref({ courseId: course!.id })}>Explore available {course!.title} practice<ArrowRight size={15} /></Link>}<Link className="button secondary" href={topic ? `/courses/${course!.id}/${topic.id}` : course ? `/courses/${course.id}` : "/courses"}>{topic ? "Back to topic" : course ? `Back to ${course.title}` : "Browse courses"}<ArrowRight size={15} /></Link></div>}
      </section>
      <div className="lesson-bottom-nav"><Link className="text-button" href={course ? `/courses/${course.id}` : "/courses"}><ArrowLeft size={15} />{course ? `Back to ${course.title}` : "Browse courses"}</Link><span className="small muted">FRQs and mixed sessions are not available yet.</span></div>
    </div>
  );
}
