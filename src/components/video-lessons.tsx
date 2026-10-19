"use client";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, Maximize, Minimize, Play, ShieldCheck } from "lucide-react";
import { watchedVideoKey, youtubeVideoId, type PublishedResource } from "@/lib/resource-policy";
import { AcademicArt } from "./academic-art";
import type { AcademicTheme } from "@/lib/artwork";
import { useStudy } from "./study-provider";

export function VideoLessons({ resources, selectedId, onSelect, topicNumber, topicTitle, artwork }: {
  resources: PublishedResource[]; selectedId: string | null; onSelect: (id: string) => void;
  topicNumber: string; topicTitle: string; artwork: AcademicTheme;
}) {
  const { watchedVideos } = useStudy();
  const index = Math.max(0, resources.findIndex(resource => resource.id === selectedId));
  const resource = resources[index];
  const watchedCount = resources.filter(item => watchedVideos.includes(watchedVideoKey(item) || "")).length;
  if (!resource) return <section className="video-card panel" aria-label="Video lessons awaiting approval">
    <div className="video-stage video-empty"><div className="video-empty-copy"><span className="hero-eyebrow"><ShieldCheck size={15} /> CURATED LEARNING</span><h2>Your next lesson<br />starts here.</h2><p>No approved videos yet.</p><span>Lessons for this topic are coming soon. Your notes and available practice are ready below.</span></div><AcademicArt theme={artwork} compact /></div>
    <div className="video-info"><h2>Video lessons coming soon</h2></div>
  </section>;
  const select = (next: number, focus = false) => {
    if (next < 0 || next >= resources.length) return;
    onSelect(resources[next].id);
    if (focus) document.getElementById("video-tab-" + resources[next].id)?.focus();
  };
  return <section className="video-card panel" aria-label="Approved video lessons">
    {resources.length > 1 && <div className="video-tabs" role="tablist" aria-label="Video lessons">{resources.map((item, position) => <button
      key={item.id} id={"video-tab-" + item.id} role="tab" aria-selected={position === index} aria-controls="selected-video-panel" tabIndex={position === index ? 0 : -1}
      title={item.title} onClick={() => select(position)} onKeyDown={event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault(); select(event.key === "Home" ? 0 : event.key === "End" ? resources.length - 1 : (position + (event.key === "ArrowRight" ? 1 : resources.length - 1)) % resources.length, true);
      }}><span>{item.part ? "Part " + item.part : "Lesson " + (position + 1)}</span>{watchedVideos.includes(watchedVideoKey(item) || "") && <CheckCircle2 size={14} aria-label="Watched" />}</button>)}</div>}
    <div className="video-sequence"><span>Video {index + 1} of {resources.length}</span><span>{watchedCount} of {resources.length} marked watched</span></div>
    <div id="selected-video-panel" role={resources.length > 1 ? "tabpanel" : undefined} aria-labelledby={resources.length > 1 ? "video-tab-" + resource.id : undefined}>
      <VideoPlayer key={resource.id + ":" + youtubeVideoId(resource.url)} resource={resource} topicNumber={topicNumber} topicTitle={topicTitle} artwork={artwork} />
    </div>
    {resources.length > 1 && <div className="video-navigation"><button className="button secondary small-button" disabled={index === 0} onClick={() => select(index - 1)}><ChevronLeft size={15} />Previous video</button><button className="button secondary small-button" disabled={index === resources.length - 1} onClick={() => select(index + 1)}>Next video<ChevronRight size={15} /></button></div>}
  </section>;
}
function VideoPlayer({ resource, topicNumber, topicTitle, artwork }: { resource: PublishedResource; topicNumber: string; topicTitle: string; artwork: AcademicTheme }) {
  const [started, setStarted] = useState(false);
  const [origin, setOrigin] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const stage = useRef<HTMLDivElement>(null);
  const { watchedVideos, toggleWatchedVideo, ready } = useStudy();
  const videoId = youtubeVideoId(resource.url);
  const canEmbed = resource.video?.embedPolicy === "allowed" && !!videoId;
  const watchedKey = watchedVideoKey(resource);
  const watched = !!watchedKey && watchedVideos.includes(watchedKey);
  useEffect(() => {
    const changed = () => setFullscreen(document.fullscreenElement === stage.current);
    document.addEventListener("fullscreenchange", changed);
    return () => document.removeEventListener("fullscreenchange", changed);
  }, []);
  const toggleFullscreen = async () => {
    setFullscreenError("");
    try {
      if (document.fullscreenElement === stage.current) await document.exitFullscreen();
      else if (stage.current?.requestFullscreen) await stage.current.requestFullscreen();
      else throw new Error("Fullscreen unavailable");
    } catch { setFullscreenError("Fullscreen is restricted here. Try the player's fullscreen control or Watch on YouTube."); }
  };
  return <div className="approved-video-player" data-resource-id={resource.id}>
    <div className="video-stage" ref={stage}>
      {started && canEmbed ? <iframe src={"https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=1&rel=0&fs=1&playsinline=1&origin=" + encodeURIComponent(origin)}
        title={resource.title + " by " + resource.publisher} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
      /> : <div className="video-poster">
        <span className="poster-top">TOPIC {topicNumber}<span>{resource.publisher}</span></span>
        <div className="poster-content"><div><span className="hero-eyebrow">VIDEO LESSON</span><h2>{topicTitle}</h2></div><AcademicArt theme={artwork} compact /></div>
        {canEmbed && <button className="video-play" aria-label={"Play " + resource.title + " video"} onClick={() => { setOrigin(window.location.origin); setStarted(true); }}><Play size={23} fill="currentColor" /></button>}
        <span className="poster-bottom">{canEmbed ? "Select Play when you're ready" : "Open the original to watch"}</span>
      </div>}
      {fullscreen && <button className="button secondary fullscreen-exit" onClick={toggleFullscreen}><Minimize size={16} />Exit fullscreen</button>}
    </div>
    <div className="video-info"><div><h2>{resource.title}</h2><span className="small muted">{resource.publisher}</span></div><a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-button">Watch on YouTube<ExternalLink size={14} /><span className="sr-only"> (opens in a new tab)</span></a></div>
    <div className="video-actions"><button className={"button secondary small-button " + (watched ? "is-complete" : "")} disabled={!ready || !watchedKey} aria-pressed={watched} onClick={() => watchedKey && toggleWatchedVideo(watchedKey)}><CheckCircle2 size={16} />{watched ? "Watched · Undo" : "Mark as Watched"}</button>{started && canEmbed && <button className="button secondary small-button" onClick={toggleFullscreen}><Maximize size={15} />Fullscreen</button>}</div>
    <p className="video-fallback player-fallback" role={fullscreenError ? "status" : undefined}>{fullscreenError || (canEmbed ? "If playback or fullscreen is restricted, use Watch on YouTube. Watched status is set only by you." : "This lesson is available by link. Open Watch on YouTube to view it.")}</p>
  </div>;
}
