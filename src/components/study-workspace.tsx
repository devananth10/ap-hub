"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight, CircleHelp, Lightbulb, List, Play, Sparkles, Target, StickyNote, X } from "lucide-react";
import { lessonHref, topicKey, type Course, type Topic, type Unit } from "@/lib/courses";
import type { Lesson } from "@/lib/lessons";
import { useStudy } from "./study-provider";
import { ResourceCard } from "./resource-card";
import { VideoLessons } from "./video-lessons";
import { PracticeSession } from "./practice-session";
import { practiceEntries, practiceHref } from "@/lib/practice";
import type { PublishedResource } from "@/lib/resource-policy";

type Tab = "resources" | "overview" | "practice";
export function StudyWorkspace({ course, unit, topic, lesson, resources }: { course: Course; unit: Unit; topic: Topic; lesson?: Lesson; resources: PublishedResource[] }) {
  const { notes, setNote, completed, toggleCompleted, storageError, ready, visitTopic } = useStudy();
  const key = topicKey(course.id, topic.id);
  const topicQuestions = practiceEntries({ courseId: course.id, unitNumber: unit.number, topicId: topic.id });
  const practiceCount = topicQuestions.length;
  const [tab, setTab] = useState<Tab>("resources");
  const [notesOpen, setNotesOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const videos = resources.filter((resource) => resource.kind === "video");
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(videos[0]?.id || null);
  const activeVideoId = videos.some((resource) => resource.id === selectedVideoId) ? selectedVideoId : videos[0]?.id || null;
  const practicePanel = useRef<HTMLDivElement>(null);
  const practiceRequested = useRef(false);
  useEffect(() => { if (tab === "practice" && practiceRequested.current) { practicePanel.current?.focus(); practicePanel.current?.scrollIntoView({ block: "start" }); practiceRequested.current = false; } }, [tab]);
  const startPractice = () => { practiceRequested.current = true; if (tab === "practice") { practicePanel.current?.focus(); practicePanel.current?.scrollIntoView({ block: "start" }); practiceRequested.current = false; } else setTab("practice"); };
  const notesInput = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (notesOpen && ready) notesInput.current?.focus(); }, [notesOpen, ready]);
  const complete = completed.includes(key);
  useEffect(() => {
    if (ready && topic.ready) visitTopic(key);
    if (window.location.hash === "#notes") setNotesOpen(true);
    // Recording a visit should happen once after local data is loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, key, topic.ready]);
  if (!topic.ready || !lesson) return <div className="page"><div className="breadcrumbs"><Link href="/courses">My courses</Link><ChevronRight size={14} /><Link href={`/courses/${course.id}`}>{course.title}</Link><ChevronRight size={14} /><span>Topic {topic.number}</span></div><div className="empty-state panel planned-topic"><span className="icon-tile"><BookOpen size={29} /></span><span className="badge">{practiceCount ? "PRACTICE AVAILABLE · LESSON PLANNED" : "OUTLINE PREVIEW"}</span><h1>{topic.title}</h1><p>{practiceCount ? `${practiceCount} MCQs are ready for this topic. Its lesson workspace and approved resources are still planned.` : "This topic is on the roadmap. Its lesson, resources, and practice haven’t been added yet."}</p><div className="flex-actions"><Link href={`/courses/${course.id}`} className="button secondary"><ArrowLeft size={16} /> Back to course</Link><Link href={practiceHref({ courseId: course.id, unitNumber: unit.number, topicId: topic.id })} className="button primary"><Target size={16} />Start Practice</Link><Link href={lessonHref} className="button secondary">Explore the ready topic<ArrowRight size={16} /></Link></div></div></div>;
  return <div className="page workspace-page">
    <div className="breadcrumbs"><Link href={`/courses/${course.id}`}>{course.title}</Link><ChevronRight size={14} /><Link href={`/courses/${course.id}`}>Unit {unit.number}</Link><ChevronRight size={14} /><span>Topic {topic.number}</span></div>
    <div className="workspace-heading"><div><span className="eyebrow">UNIT {unit.number} · {unit.title.toUpperCase()}</span><h1>{topic.title}</h1><p className="page-description">{lesson.tagline}</p></div><div className="workspace-heading-actions"><button className="button primary start-practice" onClick={startPractice}><Target size={17} />Start Practice</button><button className={`button complete-button ${complete ? "is-complete" : "secondary"}`} aria-pressed={complete} onClick={() => toggleCompleted(key)}>{complete ? <CheckCircle2 size={17} /> : <Check size={17} />}{complete ? "Completed" : "Mark complete"}</button></div></div>
    <div className={`workspace-grid ${notesOpen ? "with-notes" : ""}`}>
      <div className="lesson-main"><VideoLessons resources={videos} selectedId={activeVideoId} onSelect={setSelectedVideoId} courseTitle={course.title} topicNumber={topic.number} topicTitle={topic.title} posterHeading={lesson.posterHeading} artwork={course.artwork} />
      <div className="lesson-toolbar"><span><span className="green-dot" /> YOUR FOCUS ZONE</span><div><button className={`button small-button ${summaryOpen ? "soft-teal" : "secondary"}`} aria-expanded={summaryOpen} aria-controls="quick-summary" onClick={() => setSummaryOpen((open) => !open)}><Sparkles size={15} /> Quick AI summary<span className="demo-mini">DEMO</span></button><button className={`button small-button ${notesOpen ? "soft-teal" : "secondary"}`} aria-expanded={notesOpen} aria-controls="notes-panel" onClick={() => setNotesOpen((open) => !open)}><StickyNote size={15} /> My notes</button></div></div>
      {summaryOpen && <section id="quick-summary" className="summary-panel" aria-label="Quick AI summary placeholder"><div className="section-heading"><div className="inline-heading"><Sparkles size={20} /><h2>The big ideas, at a glance</h2></div><button className="icon-button" aria-label="Close summary" onClick={() => setSummaryOpen(false)}><X size={18} /></button></div><span className="badge">PLACEHOLDER · NOT AI-GENERATED</span><p>This is a six-bullet demonstration using original topic notes. No video has been analyzed and no AI backend is connected. Future summaries will require accessible, authorized transcripts or other approved material.</p><ul>{lesson.sampleRecap.map((point) => <li key={point}>{point}</li>)}</ul></section>}
      <section className="lesson-content panel"><div className="lesson-tabs" role="tablist" aria-label="Study materials">{(["resources", "overview", "practice"] as Tab[]).map((item, index) => <button key={item} id={`tab-${item}`} role="tab" aria-selected={tab === item} aria-controls={`panel-${item}`} tabIndex={tab === item ? 0 : -1} onClick={() => setTab(item)} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "Home" || event.key === "End") { event.preventDefault(); const tabs: Tab[] = ["resources", "overview", "practice"]; const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3; setTab(tabs[next]); document.getElementById(`tab-${tabs[next]}`)?.focus(); } }} className={`${tab === item ? "active" : ""} ${item === "practice" ? "practice-tab" : ""}`}>{item === "resources" ? <BookOpen size={16} /> : item === "overview" ? <List size={16} /> : <CircleHelp size={16} />}{item === "resources" ? "Resources" : item === "overview" ? "Topic overview" : "Practice"}{item === "resources" && <span>{resources.length}</span>}{item === "practice" && <span>{practiceCount}</span>}</button>)}</div>
      <div id="panel-resources" role="tabpanel" aria-labelledby="tab-resources" hidden={tab !== "resources"} tabIndex={0}>
        <div className="resource-list"><div className="resource-intro"><h3>A little extra clarity.</h3><p>Only owner-approved resources appear here. Video choices stay in this workspace; external links open in a new tab.</p></div>{resources.length ? resources.map((resource) => <ResourceCard key={resource.id} resource={resource} active={resource.kind === "video" && activeVideoId === resource.id} onSelect={resource.kind === "video" ? () => setSelectedVideoId(resource.id) : undefined} />) : <div className="resource-empty"><BookOpen size={25} /><h3>No approved resources yet</h3><p>The owner will choose the exact videos and study links for this topic. Notes and the topic overview are available now; practice appears after its question set is reviewed.</p></div>}</div>
</div><div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" hidden={tab !== "overview"} tabIndex={0}>        <div className="topic-overview"><span className="tiny-label">WHAT YOU’RE WORKING TOWARD</span><h2>{lesson.overview.heading}</h2><p>{lesson.overview.introduction}</p><ul className="objective-list">{lesson.overview.objectives.map((objective) => <li key={objective}><CheckCircle2 size={18} />{objective}</li>)}</ul><div className="concept-note"><Lightbulb size={20} /><p><strong>Try it as you study</strong>{lesson.overview.prompt}</p></div><p className="small muted">Original PrepAtlas prototype learning prompts. Official resources will be added only after owner approval.</p></div>

      </div><div ref={practicePanel} id="panel-practice" role="tabpanel" aria-labelledby="tab-practice" hidden={tab !== "practice"} tabIndex={0}><div className="workspace-practice-heading"><span><Target size={16} /> Topic practice</span><Link href={practiceHref({ courseId: course.id, unitNumber: unit.number, topicId: topic.id })} className="text-button">Open practice page<ArrowRight size={14} /></Link></div>{practiceCount ? <PracticeSession entries={topicQuestions} /> : <div className="resource-empty"><h3>No practice questions yet</h3><p>This topic’s question set is being prepared and reviewed. No demonstration question is included.</p></div>}</div></section>
      <div className="lesson-bottom-nav"><Link href={`/courses/${course.id}`} className="text-button"><ArrowLeft size={15} /> Back to course outline</Link><button className="text-button" onClick={() => toggleCompleted(key)}>{complete ? "Mark as incomplete" : "I’ve studied this topic"}<CheckCircle2 size={16} /></button></div>
      </div>
      <aside className="lesson-side">
        {notesOpen && <section className="panel notes-panel" id="notes-panel"><div className="section-heading"><div className="inline-heading"><StickyNote size={18} /><h2>My notes</h2></div><button className="icon-button" aria-label="Close notes" onClick={() => setNotesOpen(false)}><X size={18} /></button></div><p className="small muted">Your thinking. In your own words.</p><label className="sr-only" htmlFor="topic-notes">Personal notes for {topic.title}</label><textarea ref={notesInput} id="topic-notes" disabled={!ready} value={notes[key] || ""} onChange={(event) => setNote(key, event.target.value)} placeholder="Something clicked? Write it here.&#10;&#10;• Key ideas&#10;• Questions for later&#10;• Connections worth remembering" /><div className="notes-status" role="status"><span>{storageError ? "Not saved · copy your notes" : !ready ? "Loading notes…" : "Saved on this device"}</span><span>{(notes[key] || "").length} characters</span></div><p className="notes-privacy">Notes are optional and stored in this browser. Clearing browser data removes them.</p></section>}
        <section className="panel unit-navigation"><div className="side-card-heading"><span className="tiny-label">THE BIGGER PICTURE</span><h2>In this unit</h2><p>{unit.title}</p></div><div className="unit-nav-topics">{unit.topics.map((item) => <Link key={item.id} href={`/courses/${course.id}/${item.id}`} aria-current={item.id === topic.id ? "page" : undefined} className={item.id === topic.id ? "active" : ""}><span>{item.number}</span><span>{item.title}</span>{item.id === topic.id ? <Play size={12} fill="currentColor" /> : completed.includes(topicKey(course.id, item.id)) ? <Check size={13} /> : <span className="outline-dot" />}</Link>)}</div><Link href={`/courses/${course.id}`} className="unit-nav-footer">Full course outline<ArrowRight size={14} /></Link></section>
        {!notesOpen && <div className="notes-nudge"><StickyNote size={22} strokeWidth={1.5} /><h3>A thought worth keeping?</h3><p>There’s a little space for that.<br />Open notes whenever you need.</p><button className="text-button" onClick={() => setNotesOpen(true)}>Open my notes<PlusIcon /></button></div>}
      </aside>
    </div>
  </div>;
}
function PlusIcon() { return <span aria-hidden="true">+</span>; }
