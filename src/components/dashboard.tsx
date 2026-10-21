"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowRight, BookOpen, Check, ChevronRight, CircleCheck, Layers3, Play, Plus, Target, Sparkles, StickyNote } from "lucide-react";
import { courses, lessonHref, topicKey, findTopic, type Course } from "@/lib/courses";
import { useStudy } from "./study-provider";
import { CourseIcon } from "./ui";
import { CoursePicker } from "./course-picker";
import { CourseCardArt } from "./course-card-art";
import { AcademicArt } from "./academic-art";
import type { AcademicTheme } from "@/lib/artwork";
import { practiceCount, practiceHref } from "@/lib/practice-scope";
import { courseWithResources, resourcesForTopic, type PublishedResource } from "@/lib/resource-policy";
import { useAuth } from "./auth-provider";

export function CourseCard({ course }: { course: Course }) {
  const { completed } = useStudy();
  const available = course.units.flatMap((unit) => unit.topics).filter((topic) => topic.ready || topic.workspaceReady);
  const count = available.filter((topic) => completed.includes(topicKey(course.id, topic.id))).length;
  return <article className={`course-card ${course.color}`}><Link className="course-card-main" href={`/courses/${course.id}`}>
    <div className={`course-card-art ${course.color}`}><CourseIcon course={course} size={36} /><span className="subject-category">{course.category}</span><CourseCardArt theme={course.artwork} /></div>
    <div className="course-card-content"><div className="course-title-row"><h3>{course.title}</h3><ChevronRight size={19} /></div><p>{course.description}</p><div className="course-meta"><span><Layers3 size={14} />{course.units.length} {course.units.length === 1 ? "sample unit" : "units"}</span><span className={available.length ? "available-label" : "muted"}>{available.length ? `${available.length} topic${available.length === 1 ? "" : "s"} available` : "Outline preview"}</span></div><div className="progress-track"><span style={{ width: `${available.length ? count / available.length * 100 : 0}%` }} /></div><span className="small muted">{available.length ? `${count} of ${available.length} available topic completed` : "Lessons coming soon"}</span></div>
  </Link><Link className="course-card-practice" href={practiceHref({ courseId: course.id })} aria-label={`${practiceCount({ courseId: course.id }) ? "Start Practice" : "Practice availability"} for ${course.title}`}><Target size={15} />{practiceCount({ courseId: course.id }) ? "Start Practice" : "Practice coming soon"}<ArrowRight size={14} /></Link></article>;
}

export function Dashboard({ library = false, approvedResources, illustration = "chemistry" }: { library?: boolean; approvedResources: PublishedResource[]; illustration?: AcademicTheme }) {
  const auth=useAuth();
  const { selected, completed, notes, lastTopic } = useStudy();
  const [pickerOpen, setPickerOpen] = useState(false);
  const selectedCourses = courses.filter((course) => selected.includes(course.id)).map(course => courseWithResources(course, approvedResources));
  const recent = lastTopic ? findTopic(...lastTopic.split("/") as [string, string]) : findTopic("chemistry", "electron-configuration");
  const resume = recent.topic && (recent.topic.ready || recent.topic.workspaceReady || resourcesForTopic(approvedResources, recent.course!.id, recent.unit!.number, recent.topic.id).length) ? recent : findTopic("chemistry", "electron-configuration");
  const resourceCount = resourcesForTopic(approvedResources, resume.course!.id, resume.unit!.number, resume.topic!.id).length;
  const resumeHref = `/courses/${resume.course!.id}/${resume.topic!.id}`;
  const noteCount = Object.values(notes).filter((note) => note.trim()).length;
  return <div className="page dashboard-page">
    <div className="page-title-row"><div><div className="eyebrow"><span className="green-dot" /> YOUR LEARNING, ALL TOGETHER</div><h1>{library ? "My courses" : "Your space to understand."}</h1><p className="page-description">{library ? "Follow your curiosity. Build your understanding, topic by topic." : "Less tab switching. More lightbulb moments."}</p></div><span className="prototype-pill"><span /> EARLY PREVIEW</span></div>
    {!library && <section className="welcome-banner" aria-label="Welcome"><div className="welcome-copy"><span className="hero-eyebrow"><span /> A FRESH START, EVERY SESSION</span><h2>Big ideas.<br />One focused space.</h2><p>Your videos, resources, and notes.<br />Everything you need to make it click.</p><div className="hero-actions"><Link href={practiceHref()} className="button hero-button"><Target size={16} />Start Practice<ArrowRight size={16} /></Link><Link href={lessonHref} className="hero-study-link">Open a topic<ArrowRight size={14} /></Link></div><span className="hero-practice-disclosure">Topic MCQ practice · FRQs &amp; mixed practice coming soon</span></div><div className="hero-art-wrap" data-dashboard-art={illustration}><span className="floating-label"><Sparkles size={15} /> A little curiosity goes a long way.</span><AcademicArt theme={illustration} /><span className="art-caption">CONNECT THE DOTS.</span></div></section>}
    <section className="courses-section" aria-labelledby="courses-title"><div className="section-heading"><div className="inline-heading"><h2 id="courses-title">Your courses</h2><span className="count-badge">{selectedCourses.length}</span></div><button className="text-button" onClick={() => setPickerOpen(true)}><Plus size={17} /> Manage courses</button></div>
      {selectedCourses.length ? <div className="course-grid">{selectedCourses.map((course) => <CourseCard key={course.id} course={course} />)}</div> : <div className="empty-state panel"><BookOpen size={32} /><h3>Your next chapter starts here.</h3><p>Choose your AP courses to create a study space that feels like yours.</p><button className="button primary" onClick={() => setPickerOpen(true)}><Plus size={17} /> Choose courses</button></div>}
    </section>
    {!library && <div className="dashboard-lower"><section aria-labelledby="jump-title"><div className="section-heading"><h2 id="jump-title">{lastTopic ? "Pick up where you left off" : "A good place to start"}</h2><span className="small muted">ONE TOPIC AT A TIME</span></div><Link href={resumeHref} className="start-lesson panel"><span className="lesson-thumbnail"><AcademicArt theme={resume.course!.artwork} compact /><span className="mini-play"><Play size={15} fill="currentColor" /></span></span><div className="start-lesson-copy"><span className="tiny-label">{resume.course!.title.toUpperCase()} <span> / </span> UNIT {resume.unit!.number}</span><h3>{resume.topic!.title}</h3><div className="lesson-details"><span><BookOpen size={14} /> {resourceCount} resources</span></div></div><span className="circle-arrow"><ArrowRight size={19} /></span></Link></section>
    <section className="session-card panel"><div className="session-card-title"><span className="icon-tile"><Sparkles size={19} /></span><h3>Small steps add up.</h3></div><p>A little progress is still progress.<br />Make this session count.</p><div className="session-stats"><div><strong>{completed.length.toString().padStart(2, "0")}</strong><span><CircleCheck size={13} /> Topics completed</span></div><div><strong>{noteCount.toString().padStart(2, "0")}</strong><span><StickyNote size={13} /> Personal notes</span></div></div><Link href="/progress" className="session-footnote"><Check size={13} /> {auth.user?"View your account progress":"Your progress stays on this device"}</Link></section></div>}
    {!library && <div className="dashboard-tip"><span className="tip-icon"><BookOpen size={19} /></span><p><strong>Study your way.</strong> Watch a lesson, open a resource, or jot down a thought. Keep everything in one place.</p><ArrowDown size={16} /></div>}
    <p className="outline-disclaimer"><Link className="text-button" href="/progress">View my progress and completed Practice scores →</Link> · {auth.user?"Signed-in progress syncs to your account; check saving status in Account.":"Guest work stays in this browser. Sign in after account setup to sync across devices."}</p>
    {library && <p className="outline-disclaimer">Chemistry, Calculus AB and Human Geography include lessons, Topic Summaries and published MCQs. Other outlines may be partial.</p>}
    {pickerOpen && <CoursePicker onClose={() => setPickerOpen(false)} />}
  </div>;
}
