"use client";
import Link from "next/link";
import { ArrowRight, Bookmark, StickyNote } from "lucide-react";
import { findTopic, lessonHref } from "@/lib/courses";
import { useStudy } from "./study-provider";
import { ResourceCard } from "./resource-card";
import type { PublishedResource } from "@/lib/resource-policy";
export function ResourcesPage({ resources }: { resources: PublishedResource[] }) {
  const { saved } = useStudy();
  const items = resources.filter((resource) => saved.includes(resource.id));
  const unavailable = saved.filter((id) => !resources.some((resource) => resource.id === id));
  return <div className="page">
    <div className="eyebrow">KEEP THE GOOD STUFF CLOSE</div>
    <h1>Saved resources</h1>
    <p className="page-description">Your saved references from the PrepAtlas library.</p>
    {items.length ? <div className="panel saved-resource-list">{items.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div> : <div className="empty-state panel"><Bookmark size={34} /><h2>A home for your lightbulb moments.</h2><p>Resources will appear here when you bookmark them. Explore a study workspace to find videos and study links.</p><Link className="button primary" href={lessonHref}>Explore the study workspace<ArrowRight size={17} /></Link></div>}
    {unavailable.length > 0 && <div className="panel saved-unavailable" role="status"><h2>Saved references preserved</h2><p>{unavailable.length} saved {unavailable.length === 1 ? "reference is" : "references are"} no longer available in the library. Their IDs remain saved on this device, but unavailable links cannot be opened.</p></div>}
    <div className="private-bookmark-notice"><h2>Personal bookmarks · planned</h2><p>Student-added private links will have a separate collection. Saving a personal link will never publish it to the official library.</p></div>
  </div>;
}
export function NotesPage() {
  const { notes } = useStudy();
  const items = Object.entries(notes).filter(([, note]) => note.trim());
  return <div className="page"><div className="eyebrow">IN YOUR OWN WORDS</div><h1>My notes</h1><p className="page-description">A few thoughts, a useful connection, a question for later. All yours.</p>{items.length ? <div className="notes-grid">{items.map(([key, note]) => { const [courseId, topicId] = key.split("/"); const { course, topic } = findTopic(courseId, topicId); return <article key={key} className="panel note-preview"><span className="tiny-label">{course?.title || "Personal note"} · {topic?.number}</span><h2>{topic?.title || "Study note"}</h2><p>{note}</p><Link href={`/courses/${key}#notes`} className="text-button">Continue writing<ArrowRight size={16} /></Link></article>; })}</div> : <div className="empty-state panel"><StickyNote size={34} /><h2>Room for your own thinking.</h2><p>Notes are always optional. Open “My notes” inside a topic when something clicks.</p><Link className="button primary" href={lessonHref}>Open the study workspace<ArrowRight size={17} /></Link></div>}<p className="outline-disclaimer">Notes are saved in this browser on this device. Clearing browser data removes them.</p></div>;
}
