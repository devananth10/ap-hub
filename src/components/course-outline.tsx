"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, ChevronRight, Play, Plus, Target } from "lucide-react";
import { lessonHref, topicKey, type Course } from "@/lib/courses";
import { practiceEntries, practiceHref } from "@/lib/practice";
import { useStudy } from "./study-provider";
import { CourseIcon } from "./ui";
import { AcademicArt } from "./academic-art";
import { academicThemes } from "@/lib/artwork";

export function CourseOutline({ course }: { course: Course }) {
  const { selected, toggleCourse, completed } = useStudy();
  const available = course.units.flatMap((unit) => unit.topics).filter((topic) => topic.ready);
  const practiceCount = practiceEntries({ courseId: course.id }).length;
  return (
    <div className="page outline-page">
      <div className="breadcrumbs"><Link href="/courses">My courses</Link><ChevronRight size={14} /><span>{course.title}</span></div>
      <div className="course-page-heading">
        <CourseIcon course={course} size={31} />
        <div><span className="eyebrow">YOUR COURSE, ONE TOPIC AT A TIME</span><h1>{course.title}</h1><p className="muted">{course.description}</p></div>
        <div className="course-heading-actions"><Link href={practiceHref({ courseId: course.id })} className="button primary"><Target size={16} />Start Practice</Link><button className="button secondary" aria-pressed={selected.includes(course.id)} onClick={() => toggleCourse(course.id)}>{selected.includes(course.id) ? <><Check size={16} />Added to my courses</> : <><Plus size={16} />Add to my courses</>}</button></div>
      </div>
      <div className="course-art-banner" data-course-art={course.artwork}>
        <div><span className="hero-eyebrow">{course.title.toUpperCase()}</span><h2>{academicThemes.find((theme) => theme.id === course.artwork)?.label}.</h2><p>Explore the ideas. Practice the connections.</p></div>
        <AcademicArt theme={course.artwork} compact />
      </div>
      <div className="outline-layout">
        <section>
          <div className="section-heading"><h2>Course outline</h2><span className="small muted">{course.units.length} units in this preview</span></div>
          <div className="units-list">{course.units.map((unit, index) => {
            const unitScope = { courseId: course.id, unitNumber: unit.number };
            const count = practiceEntries(unitScope).length;
            return (
              <details key={unit.number} className="unit panel" open={index === 0}>
                <summary><span className={`unit-number ${course.color}`}>{unit.number.toString().padStart(2, "0")}</span><span><span className="tiny-label">UNIT {unit.number}</span><strong>{unit.title}</strong></span><span className="unit-topic-count">{unit.topics.length} topics</span><ChevronDown size={18} /></summary>
                <div className="unit-practice-row"><span>{count ? `${count} original MCQ demo` : "Questions coming soon"}</span><Link href={practiceHref(unitScope)} className="text-button" aria-label={`Start Practice for ${course.title} Unit ${unit.number}`}><Target size={14} />Start Practice<ArrowRight size={13} /></Link></div>
                <div className="topic-list">{unit.topics.map((topic) => (
                  <div key={topic.id} className={`topic-row topic-row-with-practice ${topic.ready ? "ready" : ""}`}>
                    <Link className="topic-study-link" href={`/courses/${course.id}/${topic.id}`}><span className="topic-number">{topic.number}</span><span>{topic.title}</span>{completed.includes(topicKey(course.id, topic.id)) ? <CheckCircle2 size={18} className="text-teal" /> : topic.ready ? <span className="topic-status"><Play size={12} />Study topic</span> : <span className="planned-label">Coming soon</span>}<ChevronRight size={15} /></Link>
                    <Link href={practiceHref({ ...unitScope, topicId: topic.id })} className="topic-practice-link" aria-label={`Practice ${course.title} Topic ${topic.number}`}><Target size={14} /><span>Practice</span></Link>
                  </div>
                ))}</div>
              </details>
            );
          })}</div>
        </section>
        <aside className="outline-aside">
          <div className="panel outline-info"><span className="icon-tile"><Target size={22} /></span><h3>Make understanding stick.</h3><p>{practiceCount ? "Try the original Chemistry MCQ demo and check your reasoning." : "Practice for this course is planned. Browse its scope and see what is available."}</p><Link href={practiceHref({ courseId: course.id })} className="button primary">Start Practice<ArrowRight size={16} /></Link><hr /><strong>{available.length} study {available.length === 1 ? "workspace is" : "workspaces are"} ready</strong><p className="small">Lessons are added only after owner approval. Other topics are outline previews.</p><Link href={lessonHref} className="text-button">Explore the Chemistry workspace<ChevronRight size={15} /></Link></div>
          <p className="outline-disclaimer">Practice currently includes one original MCQ demo. FRQs and mixed sessions are planned. This independent prototype is not affiliated with College Board.</p>
        </aside>
      </div>
    </div>
  );
}
