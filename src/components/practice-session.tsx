"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import type { PracticeEntry } from "@/lib/practice";
import { PracticeQuestion } from "./practice-question";

export function PracticeSession({ entries }: { entries: PracticeEntry[] }) {
  const [index, setIndex] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const navigating = useRef(false);
  useEffect(() => {
    if (navigating.current) {
      panel.current?.focus({ preventScroll: true });
      panel.current?.scrollIntoView({ block: "nearest" });
      navigating.current = false;
    }
  }, [index]);
  const move = (direction: number) => {
    navigating.current = true;
    setIndex((current) => Math.max(0, Math.min(entries.length - 1, current + direction)));
  };
  return <>
    <div className="practice-position"><span role="status">Question {index + 1} of {entries.length}</span><span>Answers are kept while you move between questions.</span></div>
    <div className="progress-track practice-progress" aria-hidden="true"><span style={{ width: `${(index + 1) / entries.length * 100}%` }} /></div>
    <div ref={panel} role="group" tabIndex={-1} className="practice-question-frame" aria-label={`Question ${index + 1} of ${entries.length}`}>
      {entries.map((entry, questionIndex) => <div key={entry.id} hidden={index !== questionIndex}>
        <div className="practice-context"><BookOpen size={15} /><span>{entry.course.title} · Topic {entry.topic.number}: {entry.topic.title}</span><Link href={`/courses/${entry.course.id}/${entry.topic.id}`}>{entry.topic.ready ? "Open study workspace" : "Open topic"}<ArrowRight size={13} /></Link></div>
        <PracticeQuestion practice={entry.question} />
      </div>)}
    </div>
    <div className="practice-navigation"><button className="button secondary" disabled={index === 0} onClick={() => move(-1)}><ArrowLeft size={15} />Previous</button><span className="small muted">{index === entries.length - 1 ? "End of this question set" : "Work at your own pace"}</span><button className="button primary" disabled={index === entries.length - 1} onClick={() => move(1)}>Next question<ArrowRight size={15} /></button></div>
  </>;
}
