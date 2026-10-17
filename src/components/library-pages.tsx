"use client";
import Link from "next/link";
import { ArrowRight, Bookmark, StickyNote } from "lucide-react";
import { findTopic, lessonHref, resources } from "@/lib/courses";
import { useStudy } from "./study-provider";
import { ResourceCard } from "./resource-card";
export function ResourcesPage() {
  const { saved } = useStudy();
  const items = resources.filter((resource) => saved.includes(resource.id));
  return <div className="page"><div className="eyebrow">KEEP THE GOOD STUFF CLOSE</div><h1>Saved resources</h1><p className="page-description">Your personal collection of useful links, ready when you are.</p>{items.length ? <div className="panel saved-resource-list">{items.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div> : <div className="empty-state panel"><Bookmark size={34} /><h2>A home for your lightbulb moments.</h2><p>Use the bookmark icon beside a lesson resource to save it here.</p><Link className="button primary" href={lessonHref}>Explore lesson resources<ArrowRight size={17} /></Link></div>}</div>;
}
export function NotesPage() {
  const { notes } = useStudy();
  const items = Object.entries(notes).filter(([, note]) => note.trim());
  return <div className="page"><div className="eyebrow">IN YOUR OWN WORDS</div><h1>My notes</h1><p className="page-description">A few thoughts, a useful connection, a question for later. All yours.</p>{items.length ? <div className="notes-grid">{items.map(([key, note]) => { const [courseId, topicId] = key.split("/"); const { course, topic } = findTopic(courseId, topicId); return <article key={key} className="panel note-preview"><span className="tiny-label">{course?.title || "Personal note"} · {topic?.number}</span><h2>{topic?.title || "Study note"}</h2><p>{note}</p><Link href={`/courses/${key}#notes`} className="text-button">Continue writing<ArrowRight size={16} /></Link></article>; })}</div> : <div className="empty-state panel"><StickyNote size={34} /><h2>Room for your own thinking.</h2><p>Notes are always optional. Open “My notes” inside a topic when something clicks.</p><Link className="button primary" href={lessonHref}>Open the study workspace<ArrowRight size={17} /></Link></div>}<p className="outline-disclaimer">Notes are saved in this browser on this device. Clearing browser data removes them.</p></div>;
}
