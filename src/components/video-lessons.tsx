"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, FlaskConical, Play, ShieldCheck } from "lucide-react";
import { youtubeVideoId, type PublishedResource } from "@/lib/resource-policy";
import { OrbitArt } from "./ui";

export function VideoLessons({ resources, selectedId, onSelect, courseTitle, topicNumber, topicTitle, posterHeading }: {
  resources: PublishedResource[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  courseTitle: string;
  topicNumber: string;
  topicTitle: string;
  posterHeading: string;
}) {
  if (!resources.length) return (
    <section className="video-card panel" aria-label="Video lessons awaiting approval">
      <div className="video-stage video-empty">
        <div className="video-empty-copy">
          <span className="hero-eyebrow"><ShieldCheck size={15} /> OWNER-CURATED LEARNING</span>
          <h2>Your next lesson<br />starts here.</h2>
          <p>No approved videos yet.</p>
          <span>Video lessons will appear after the PrepAtlas owner approves exact URLs for this topic.</span>
        </div>
        <OrbitArt compact />
      </div>
      <div className="video-info"><div><h2>Awaiting approved videos</h2><span className="small muted">Your study tools are ready below.</span></div><ShieldCheck size={21} className="text-teal" /></div>
    </section>
  );
  return (
    <section className="video-card panel" aria-label="Approved video lessons">
      {resources.length > 1 && <label className="video-picker">Approved lesson<select aria-label="Choose approved video" value={selectedId || resources[0].id} onChange={(event) => onSelect(event.target.value)}>{resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.title} · {resource.publisher}</option>)}</select></label>}
      {resources.map((resource) => (
        <VideoPlayer key={resource.id} resource={resource} active={resource.id === selectedId} courseTitle={courseTitle} topicNumber={topicNumber} topicTitle={topicTitle} posterHeading={posterHeading} />
      ))}
    </section>
  );
}

function VideoPlayer({ resource, active, courseTitle, topicNumber, topicTitle, posterHeading }: {
  resource: PublishedResource; active: boolean; courseTitle: string; topicNumber: string; topicTitle: string; posterHeading: string;
}) {
  const [started, setStarted] = useState(false);
  const [origin, setOrigin] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);
  const videoId = youtubeVideoId(resource.url);
  const canEmbed = resource.video?.embedPolicy === "allowed" && !!videoId;
  useEffect(() => {
    // Switching videos pauses the previous player without destroying its position.
    // Notes, summaries, and material tabs never change `active` or remount the frame.
    if (!active) frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "https://www.youtube-nocookie.com");
  }, [active]);
  return (
    <div hidden={!active} className="approved-video-player" data-resource-id={resource.id}>
      <div className="video-stage">
        {started && canEmbed ? (
          <iframe ref={frame} src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(origin)}`} title={`${resource.title} by ${resource.publisher}`} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        ) : (
          <div className="video-poster">
            <span className="poster-top"><FlaskConical size={17} />{courseTitle.toUpperCase()}<span>TOPIC {topicNumber}</span></span>
            <div className="poster-content"><div><span className="hero-eyebrow">APPROVED FOR THIS TOPIC</span><h2 style={{ whiteSpace: "pre-line" }}>{posterHeading}</h2><span className="poster-subtitle">{topicTitle}</span></div><OrbitArt compact /></div>
            {canEmbed && <button className="video-play" aria-label={`Play ${resource.title} video`} onClick={() => { setOrigin(window.location.origin); setStarted(true); }}><Play size={23} fill="currentColor" /></button>}
            <span className="poster-bottom">{resource.publisher}<span>{canEmbed ? "WATCH & UNDERSTAND" : "OPEN ORIGINAL TO WATCH"}</span></span>
          </div>
        )}
      </div>
      <div className="video-info"><div><h2>{resource.title}</h2><span className="small muted">{resource.publisher} · Owner-approved</span></div><a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-button">Watch on YouTube<ExternalLink size={14} /><span className="sr-only"> (opens in a new tab)</span></a></div>
      <p className="video-fallback player-fallback">{canEmbed ? "If the provider blocks playback, use “Watch on YouTube.”" : "This approved video is available by link. Open the original to watch."}</p>
    </div>
  );
}
