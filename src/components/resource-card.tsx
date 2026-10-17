"use client";
import { Bookmark, BookOpen, ExternalLink, FileText, Table2 } from "lucide-react";
import { resources } from "@/lib/courses";
import { useStudy } from "./study-provider";
export function ResourceCard({ resource }: { resource: typeof resources[number] }) {
  const { saved, toggleSaved } = useStudy();
  const savedAlready = saved.includes(resource.id);
  const Icon = resource.id === "periodic-table" ? Table2 : resource.id === "bozeman" ? FileText : BookOpen;
  return <article className="resource-card"><span className="resource-icon"><Icon size={21} strokeWidth={1.6} /></span><div><span className="tiny-label">{resource.type}</span><a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">{resource.title}<ExternalLink size={14} /><span className="sr-only"> (opens in a new tab)</span></a><span className="small muted">{resource.publisher}</span><p>{resource.description}</p></div><button className={`icon-button bookmark-button ${savedAlready ? "saved" : ""}`} aria-label={`${savedAlready ? "Unsave" : "Save"} ${resource.title}`} aria-pressed={savedAlready} onClick={() => toggleSaved(resource.id)}><Bookmark size={18} fill={savedAlready ? "currentColor" : "none"} /></button></article>;
}
