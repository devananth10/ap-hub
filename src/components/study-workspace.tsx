"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight, CircleHelp, Lightbulb, List, Play, Target, StickyNote, X } from "lucide-react";
import { topicKey, type Course, type Topic, type Unit } from "@/lib/courses";
import type { Lesson } from "@/lib/lessons";
import { useStudy } from "./study-provider";
import { ResourceCard } from "./resource-card";
import { VideoLessons } from "./video-lessons";
import { InstructorSelector } from "./instructor-selector";
import { defaultInstructor, instructorLessons } from "@/lib/video-instructors";
import { PracticeSession } from "./practice-session";
import { practiceHref } from "@/lib/practice-scope";
import type { PracticeEntry } from "@/lib/practice";
import { TopicSummary } from "./topic-summary";
import type { TopicSummary as Summary } from "@/lib/topic-summary-policy";
import type { PublishedResource } from "@/lib/resource-policy";
import { SyncStatus } from "./account-menu";
import { useAuth } from "./auth-provider";

type Tab = "resources" | "overview" | "practice";
export function StudyWorkspace({ course, unit, topic, lesson, resources, topicQuestions, summary }: { course: Course; unit: Unit; topic: Topic; lesson?: Lesson; resources: PublishedResource[]; topicQuestions: PracticeEntry[]; summary?: Summary }) {
  const { notes, setNote, completed, toggleCompleted, storageError, ready, visitTopic, preferredInstructors, setPreferredInstructor } = useStudy();
  const auth=useAuth();
  const key = topicKey(course.id, topic.id);
  const practiceCount = topicQuestions.length;
  const content: Lesson = lesson || {
    tagline: "Watch the lesson, keep optional notes, and practice at your own pace.", posterHeading: topic.title,
    overview: { heading: `Your study plan for Topic ${topic.number}`, introduction: "Use the lesson and study tools on this page. Detailed original topic notes are not available here yet.", objectives: ["Choose an available lesson above.", "Keep questions or observations in optional personal notes.", "Use published practice to check your understanding."], prompt: "After the lesson, explain one idea in your own words before starting practice." },
    sampleRecap: [],
  };
  const [tab, setTab] = useState<Tab>("resources");
  const [notesOpen, setNotesOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const summaryButton = useRef<HTMLButtonElement>(null);
  const closeSummary = () => { setSummaryOpen(false); summaryButton.current?.focus(); };
  const allVideos = resources.filter((resource) => resource.kind === "video");
  const hasInstructors = course.id === "human-geography";
  const preferredInstructor = preferredInstructors?.[course.id] || defaultInstructor;
  const instructor = hasInstructors ? instructorLessons(resources, preferredInstructor) : null;
  const videos = instructor ? instructor.videos : allVideos;
  const visibleResources = instructor ? instructor.resources : resources;
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
    if (ready) visitTopic(key);
    if (window.location.hash === "#notes") setNotesOpen(true);
    // Recording a visit should happen once after local data is loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, key, topic.ready]);
  return <div className="page workspace-page">
    <nav className="breadcrumbs" aria-label="Topic breadcrumbs"><Link href={`/courses/${course.id}`}>{course.title}</Link><ChevronRight size={14} aria-hidden="true" /><Link href={`/courses/${course.id}#unit-${unit.number}`}>Unit {unit.number}</Link><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">Topic {topic.number}</span></nav>
    <div className="workspace-heading"><div><span className="eyebrow">{unit.title}</span><h1>{topic.title}</h1><p className="page-description">{videos.length} {videos.length === 1 ? "video" : "videos"}{hasInstructors && instructor?.active ? ` from ${instructor.active.label} · ${allVideos.length} total across instructors` : ""} · {practiceCount} MCQs available</p></div><div className="workspace-heading-actions"><button className="button primary start-practice" disabled={!practiceCount || !ready} onClick={startPractice}><Target size={17} />{practiceCount ? "Start Practice" : "Practice coming soon"}</button><button className={`button complete-button ${complete ? "is-complete" : "secondary"}`} disabled={!ready} aria-pressed={complete} onClick={() => toggleCompleted(key)}>{complete ? <CheckCircle2 size={17} /> : <Check size={17} />}{complete ? "Topic completed" : "Mark topic complete"}</button><p className="topic-progress-note">Your topic checklist is separate from watched videos and Practice scores.</p></div></div>
    <div className={`workspace-grid ${notesOpen ? "with-notes" : ""}`}>
      <div className="lesson-main">{hasInstructors && <InstructorSelector resources={allVideos} preferred={preferredInstructor} onChange={id => setPreferredInstructor(course.id, id)} ready={ready} />}<VideoLessons resources={videos} selectedId={activeVideoId} onSelect={setSelectedVideoId} topicNumber={topic.number} topicTitle={topic.title} artwork={course.artwork} />
      <div className="lesson-toolbar"><span><span className="green-dot" /> YOUR FOCUS ZONE</span><div><button ref={summaryButton} disabled={!ready} className={`button small-button ${summaryOpen ? "soft-teal" : "secondary"}`} aria-expanded={summaryOpen} aria-controls="topic-summary" onClick={() => setSummaryOpen((open) => !open)}><BookOpen size={15} />Topic Summary</button><button className={`button small-button ${notesOpen ? "soft-teal" : "secondary"}`} aria-expanded={notesOpen} aria-controls="notes-panel" onClick={() => setNotesOpen((open) => !open)}><StickyNote size={15} />{notesOpen ? "Hide Notes" : "Show Notes"}</button></div></div>
      {summaryOpen && <TopicSummary summary={summary} onClose={closeSummary} />}
      <section className="lesson-content panel"><div className="lesson-tabs" role="tablist" aria-label="Study materials">{(["resources", "overview", "practice"] as Tab[]).map((item, index) => <button key={item} id={`tab-${item}`} role="tab" aria-selected={tab === item} aria-controls={`panel-${item}`} tabIndex={tab === item ? 0 : -1} onClick={() => setTab(item)} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "Home" || event.key === "End") { event.preventDefault(); const tabs: Tab[] = ["resources", "overview", "practice"]; const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3; setTab(tabs[next]); document.getElementById(`tab-${tabs[next]}`)?.focus(); } }} className={`${tab === item ? "active" : ""} ${item === "practice" ? "practice-tab" : ""}`}>{item === "resources" ? <BookOpen size={16} /> : item === "overview" ? <List size={16} /> : <CircleHelp size={16} />}{item === "resources" ? "Resources" : item === "overview" ? "Topic overview" : "Practice"}{item === "resources" && <span>{visibleResources.length}</span>}{item === "practice" && <span>{practiceCount}</span>}</button>)}</div>
      <div id="panel-resources" role="tabpanel" aria-labelledby="tab-resources" hidden={tab !== "resources"} tabIndex={0}>
        <div className="resource-list"><div className="resource-intro"><h3>Resources for this topic</h3><p>{hasInstructors && instructor?.active ? `Showing ${instructor.active.label}’s lessons. ` : ""}Select a video to watch here, or open its original page in a new tab.</p></div>{visibleResources.length ? visibleResources.map((resource) => <ResourceCard key={resource.id} resource={resource} active={resource.kind === "video" && activeVideoId === resource.id} onSelect={resource.kind === "video" ? () => setSelectedVideoId(resource.id) : undefined} />) : <div className="resource-empty"><BookOpen size={25} /><h3>No resources yet</h3><p>Videos and study links for this topic are coming soon. Notes and the study plan are available now. Practice availability is shown for this topic.</p></div>}</div>
</div><div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" hidden={tab !== "overview"} tabIndex={0}>        <div className="topic-overview"><span className="tiny-label">WHAT YOU’RE WORKING TOWARD</span><h2>{content.overview.heading}</h2><p>{content.overview.introduction}</p><ul className="objective-list">{content.overview.objectives.map((objective) => <li key={objective}><CheckCircle2 size={18} />{objective}</li>)}</ul><div className="concept-note"><Lightbulb size={20} /><p><strong>Try it as you study</strong>{content.overview.prompt}</p></div><p className="small muted">Original PrepAtlas prototype learning prompts.</p></div>

      </div><div ref={practicePanel} id="panel-practice" role="tabpanel" aria-labelledby="tab-practice" hidden={tab !== "practice"} tabIndex={0}><div className="workspace-practice-heading"><span><Target size={16} /> Practice here, with your lesson above</span><Link href={practiceHref({ courseId: course.id, unitNumber: unit.number, topicId: topic.id })} className="text-button">Separate practice page<ArrowRight size={14} /></Link></div>{practiceCount ? <PracticeSession entries={topicQuestions} /> : <div className="resource-empty"><h3>No practice questions yet</h3><p>This topic’s question set is being prepared and reviewed. No demonstration question is included.</p></div>}</div></section>
      <div className="lesson-bottom-nav"><Link href={`/courses/${course.id}`} className="text-button"><ArrowLeft size={15} /> Back to course outline</Link></div>
      </div>
      <aside className="lesson-side">
        {notesOpen && <section className="panel notes-panel" id="notes-panel"><div className="section-heading"><div className="inline-heading"><StickyNote size={18} /><h2>My notes</h2></div><button className="icon-button" aria-label="Close notes" onClick={() => setNotesOpen(false)}><X size={18} /></button></div><p className="small muted">Your thinking. In your own words.</p><label className="sr-only" htmlFor="topic-notes">Personal notes for {topic.title}</label><textarea ref={notesInput} id="topic-notes" disabled={!ready} maxLength={auth.user?50000:undefined} value={notes[key] || ""} onChange={(event) => setNote(key, event.target.value)} placeholder="Something clicked? Write it here.&#10;&#10;• Key ideas&#10;• Questions for later&#10;• Connections worth remembering" /><div className="notes-status"><span>{storageError ? "Not saved · copy your notes" : !ready ? "Loading notes…" : <SyncStatus/>}</span><span>{(notes[key] || "").length} characters</span></div><p className="notes-privacy">{auth.user?"Notes autosave to your private account. Conflicting device edits are kept for review in Account.":"Notes are optional and stored in this browser. Clearing browser data removes them."}</p></section>}
        <section className="panel unit-navigation"><div className="side-card-heading"><span className="tiny-label">THE BIGGER PICTURE</span><h2>In this unit</h2><p>{unit.title}</p></div><div className="unit-nav-topics">{unit.topics.map((item) => <Link key={item.id} href={`/courses/${course.id}/${item.id}`} aria-current={item.id === topic.id ? "page" : undefined} className={item.id === topic.id ? "active" : ""}><span>{item.number}</span><span>{item.title}</span>{item.id === topic.id ? <Play size={12} fill="currentColor" /> : completed.includes(topicKey(course.id, item.id)) ? <Check size={13} /> : <span className="outline-dot" />}</Link>)}</div><Link href={`/courses/${course.id}`} className="unit-nav-footer">Full course outline<ArrowRight size={14} /></Link></section>
        {!notesOpen && <div className="notes-nudge"><StickyNote size={22} strokeWidth={1.5} /><h3>A thought worth keeping?</h3><p>There’s a little space for that.<br />Open notes whenever you need.</p><button className="text-button" onClick={() => setNotesOpen(true)}>Open my notes<PlusIcon /></button></div>}
      </aside>
    </div>
  </div>;
}
function PlusIcon() { return <span aria-hidden="true">+</span>; }
