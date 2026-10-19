"use client";
import { Bookmark, BookOpen, ExternalLink, FileText, Play } from "lucide-react";
import type { PublishedResource } from "@/lib/resource-policy";
import { useStudy } from "./study-provider";

export function ResourceCard({ resource, onSelect, active = false }: {
  resource: PublishedResource;
  onSelect?: () => void;
  active?: boolean;
}) {
  const { saved, toggleSaved } = useStudy();
  const savedAlready = saved.includes(resource.id);
  const Icon = resource.kind === "video" ? Play : resource.kind === "guide" ? FileText : BookOpen;
  return (
    <article className={`resource-card ${active ? "active-resource" : ""}`}>
      <span className="resource-icon"><Icon size={21} strokeWidth={1.6} /></span>
      <div>
        <span className="tiny-label">{resource.kind}</span>
        {onSelect ? (
          <button className="resource-link" aria-pressed={active} onClick={onSelect}>{resource.title}<Play size={13} /></button>
        ) : (
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">{resource.title}<ExternalLink size={14} /><span className="sr-only"> (opens in a new tab)</span></a>
        )}
        <span className="small muted">{resource.publisher}</span>
        <p>{resource.description}</p>
        {onSelect && <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-button resource-original">Open original<ExternalLink size={12} /><span className="sr-only"> (opens in a new tab)</span></a>}
      </div>
      <button className={`icon-button bookmark-button ${savedAlready ? "saved" : ""}`} aria-label={`${savedAlready ? "Unsave" : "Save"} ${resource.title}`} aria-pressed={savedAlready} onClick={() => toggleSaved(resource.id)}><Bookmark size={18} fill={savedAlready ? "currentColor" : "none"} /></button>
    </article>
  );
}
