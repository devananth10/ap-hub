"use client";

import { useRef, useState, type FormEvent } from "react";
import { Flag, Star } from "lucide-react";
import { reportReasons, validFeedbackId } from "@/lib/feedback";
import type { PracticeEntry } from "@/lib/practice";
import { Dialog } from "./ui";

export function QuestionReport({ entry, displayedNumber }: { entry: PracticeEntry; displayedNumber: number }) {
  const [open,setOpen] = useState(false);
  return <span className="question-report"><button className="icon-button report-trigger" aria-label="Report this question" onClick={() => setOpen(true)}><Flag size={17} strokeWidth={1.7} /><span className="report-tooltip">Report Question</span></button>{open && <FeedbackDialog onClose={() => setOpen(false)} question={{id:entry.id,number:displayedNumber,label:`${entry.course.title} · Topic ${entry.topic.number} · Question ${displayedNumber}`}} />}</span>;
}

type Question = {id:string;number:number;label:string};
export function FeedbackDialog({ onClose, question }: {onClose:() => void;question?:Question}) {
  const [rating,setRating] = useState(0), [hover,setHover] = useState(0);
  const [text,setText] = useState(""), [publicOptIn,setPublicOptIn] = useState(false), [category,setCategory] = useState("");
  const [busy,setBusy] = useState(false), [error,setError] = useState(""), [success,setSuccess] = useState(false);
  const receipt = useRef({body:"",id:""});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    const payload = question ? {kind:"question-report",questionId:question.id,displayedNumber:question.number,category,comment:text,website:String(data.get("website") || "")} : {kind:"review",rating,text,publicOptIn,website:String(data.get("website") || "")};
    const body = JSON.stringify(payload);
    if (receipt.current.body !== body) receipt.current = {body,id:crypto.randomUUID()};
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(),15000);
    try {
      const session = await fetch("/api/feedback/session",{credentials:"same-origin",cache:"no-store",signal:controller.signal});
      if (!session.ok) throw new Error("Feedback is temporarily unavailable. Please try again later.");
      const response = await fetch("/api/feedback",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({...payload,submissionId:receipt.current.id}),signal:controller.signal});
      const result = await response.json();
      if (!response.ok || result.accepted !== true || !validFeedbackId(result.id)) throw new Error(typeof result.error === "string" ? result.error : "We could not confirm your submission. Please retry.");
      setSuccess(true);
    } catch (failure) {
      setError(failure instanceof Error && failure.name !== "AbortError" ? failure.message : "We could not confirm your submission. Please retry; a confirmed submission will not be saved twice.");
    } finally { clearTimeout(timer); setBusy(false); }
  }
  return <Dialog title={question ? "Report a Question" : "Rate Your PrepAtlas Experience"} onClose={onClose} className="feedback-dialog">
    {success ? <div className="feedback-success"><p role="status">{question ? "Report submitted. Thank you for helping improve PrepAtlas!" : "Thank you! Your feedback has been saved privately for review."}</p><button className="button primary" onClick={onClose}>Back to studying</button></div> : <form className="feedback-form" onSubmit={submit} aria-busy={busy}>
      <p>{question ? "What's wrong with this question?" : "How helpful has PrepAtlas been for your studying?"}</p>
      {question ? <><p className="small muted">{question.label}</p><fieldset disabled={busy} className="report-reasons"><legend className="sr-only">Report reason (required)</legend>{reportReasons.map(reason => <label key={reason.value}><input type="radio" name="reason" value={reason.value} required checked={category === reason.value} onChange={() => setCategory(reason.value)} /><span>{reason.label}</span></label>)}</fieldset></> : <fieldset className="star-rating" disabled={busy} onMouseLeave={() => setHover(0)}><legend className="sr-only">Rating (required)</legend>{[1,2,3,4,5].map(value => <label key={value} onMouseEnter={() => setHover(value)} className={value <= (hover || rating) ? "selected" : ""}><input className="sr-only" type="radio" name="rating" required value={value} checked={rating === value} onChange={() => setRating(value)} /><Star size={30} aria-hidden="true" /><span className="sr-only">{value} {value === 1 ? "star" : "stars"}</span></label>)}<span className="small muted rating-value" aria-live="polite">{rating ? `${rating} of 5 stars` : "Select a rating"}</span></fieldset>}
      <label className="feedback-text-label">{question ? "Tell us more about the issue (optional)." : "Written feedback (optional)"}<textarea name="comment" maxLength={500} rows={4} disabled={busy} value={text} onChange={event => setText(event.target.value)} placeholder={question ? "What should we look at?" : "What do you like about PrepAtlas? What could we improve?"} aria-describedby="feedback-privacy feedback-count" /></label>
      <div className="feedback-meta"><span id="feedback-privacy">Please don’t include names, schools, or contact details.</span><span id="feedback-count">{text.length}/500</span></div>
      {!question && <><label className="feedback-opt-in"><input type="checkbox" checked={publicOptIn} disabled={busy} onChange={event => setPublicOptIn(event.target.checked)} /><span>Allow my review to appear publicly on PrepAtlas.</span></label><p className="small muted">Private by default. Public reviews also require moderation and appear as “PrepAtlas student.”</p></>}
      <label className="feedback-honeypot" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {error && <p className="feedback-error" role="alert">{error}</p>}
      <div className="feedback-actions"><button className="button secondary" type="button" onClick={onClose}>Cancel</button><button className="button primary" type="submit" disabled={busy || (question ? !category : !rating)}>{busy ? "Saving…" : question ? "Submit Report" : "Submit Feedback"}</button></div>
    </form>}
  </Dialog>;
}
