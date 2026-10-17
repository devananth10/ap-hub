"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { PracticeDemo } from "@/lib/lessons";

export function PracticeQuestion({ practice }: { practice: PracticeDemo }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const { options, prompt, correctIndex, explanation } = practice;
  return (
    <div className="practice-preview">
      <span className="badge">ORIGINAL MCQ · DEMO</span>
      <h2>A quick check for understanding.</h2>
      <p className="muted small">One original, unscored demo question. It is not an official AP question. A full MCQ bank, FRQs, and mixed practice are planned.</p>
      <fieldset disabled={checked}>
        <legend>{prompt}</legend>
        <div className="practice-options">{options.map((option, index) => (
          <label key={option} className={`${answer === option ? "selected" : ""} ${checked && index === correctIndex ? "correct" : ""}`}>
            <input type="radio" name="practice-answer" value={option} checked={answer === option} onChange={() => setAnswer(option)} />
            <span>{String.fromCharCode(65 + index)}</span>{option}
          </label>
        ))}</div>
      </fieldset>
      {checked ? (
        <div role="status" className="practice-feedback">
          <strong>{answer === options[correctIndex] ? "That’s it." : "Take another look at the electron count."}</strong>
          <p>{explanation}</p>
          <button className="text-button" onClick={() => { setChecked(false); setAnswer(null); }}><RotateCcw size={14} />Try again</button>
        </div>
      ) : <button className="button primary" disabled={!answer} onClick={() => setChecked(true)}>Check demo answer<ArrowRight size={15} /></button>}
    </div>
  );
}
