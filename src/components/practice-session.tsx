"use client";

import Link from "next/link";
import { useEffect, useReducer, useRef } from "react";
import { ArrowLeft, ArrowRight, BookOpen, RotateCcw } from "lucide-react";
import type { PracticeEntry } from "@/lib/practice";
import { emptyAnswer, initialSession, sessionReducer, sessionScore } from "@/lib/practice-session";
import { PracticeQuestion } from "./practice-question";

export function PracticeSession({ entries }: { entries: PracticeEntry[] }) {
  const [state, dispatch] = useReducer(sessionReducer, initialSession);
  const panel = useRef<HTMLDivElement>(null);
  const navigating = useRef(false);
  useEffect(() => {
    if (navigating.current) {
      panel.current?.focus({ preventScroll: true });
      panel.current?.scrollIntoView({ block: "nearest" });
      navigating.current = false;
    }
  }, [state.index, state.finished]);
  const score = sessionScore(entries.map(entry => entry.question), state.answers);
  const entry = entries[state.index];
  if (!entry) return null;
  const move = (index: number) => {
    navigating.current = true;
    dispatch({ type: "move", index, total: entries.length });
  };
  if (state.finished) return <div ref={panel} tabIndex={-1} className="practice-result practice-question-frame" aria-label="Practice results">
    <span className="tiny-label">PRACTICE COMPLETE</span>
    <h2>Your session results</h2>
    <p className="practice-result-score" role="status">Score: {score.correct} of {score.total} ({score.percent}%)</p>
    <p>{score.answered} of {score.total} questions answered. {score.total - score.answered} unanswered questions counted as incorrect.</p>
    <p className="small muted">Your first graded answer counts toward the score. Retries are for learning. Results stay in this session and reset on reload.</p>
    <div className="flex-actions"><button className="button secondary" onClick={() => { move(0); dispatch({ type: "review" }); }}>Review answers</button><button className="button primary" onClick={() => { navigating.current = true; dispatch({ type: "restart" }); }}><RotateCcw size={15} />Start again</button></div>
  </div>;
  return <>
    <div className="practice-position"><span role="status">Question {state.index + 1} of {entries.length}</span><span>{score.answered} checked · Answers are kept while you move between questions.</span></div>
    <p className="practice-score-policy small muted">Your first graded answer counts. Finishing also grades remaining selections; unanswered questions count as incorrect. Retries are for learning.</p>
    <div className="progress-track practice-progress" aria-hidden="true"><span style={{ width: `${(state.index + 1) / entries.length * 100}%` }} /></div>
    <div ref={panel} role="group" tabIndex={-1} className="practice-question-frame" aria-label={`Question ${state.index + 1} of ${entries.length}`}>
      <div className="practice-context"><BookOpen size={15} /><span>{entry.course.title} · Topic {entry.topic.number}: {entry.topic.title}</span><Link href={`/courses/${entry.course.id}/${entry.topic.id}`}>{entry.topic.ready ? "Open study workspace" : "Open topic"}<ArrowRight size={13} /></Link></div>
      <PracticeQuestion key={entry.id} practice={entry.question} answer={state.answers[entry.id] || emptyAnswer} onSelect={selected => dispatch({ type: "select", id: entry.id, selected })} onCheck={() => dispatch({ type: "check", id: entry.id })} onRetry={() => dispatch({ type: "retry", id: entry.id })} />
    </div>
    <div className="practice-navigation"><button className="button secondary" disabled={state.index === 0} onClick={() => move(state.index - 1)}><ArrowLeft size={15} />Previous</button><div className="practice-navigation-actions"><button className="button secondary" onClick={() => { navigating.current = true; dispatch({ type: "finish" }); }}>Finish practice</button><button className="button primary" disabled={state.index === entries.length - 1} onClick={() => move(state.index + 1)}>Next question<ArrowRight size={15} /></button></div></div>
  </>;
}
