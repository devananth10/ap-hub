"use client";

import { useId, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { BankQuestion } from "@/lib/practice-bank";

export function PracticeQuestion({ practice }: { practice: BankQuestion }) {
  const groupName = useId();
  const [answer, setAnswer] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const { options, prompt, correctIndex, explanation } = practice;
  return (
    <div className="practice-preview">
      <h2>A quick check for understanding.</h2>
      <p className="muted small">This is not an official College Board question. Answers stay in this session and reset on reload.</p>
      <fieldset disabled={checked}>
        <legend>{prompt}</legend>
        <div className="practice-options">{options.map((option, index) => (
          <label key={option} className={`${answer === option ? "selected" : ""} ${checked && index === correctIndex ? "correct" : ""}`}>
            <input type="radio" name={groupName} value={option} checked={answer === option} onChange={() => setAnswer(option)} />
            <span>{String.fromCharCode(65 + index)}</span>{option}
          </label>
        ))}</div>
      </fieldset>
      {checked ? (
        <div role="status" className="practice-feedback">
          <strong>{answer === options[correctIndex] ? "That’s it." : "Not quite. Review the explanation."}</strong>
          <p>{explanation}</p>
          <button className="text-button" onClick={() => { setChecked(false); setAnswer(null); }}><RotateCcw size={14} />Try again</button>
        </div>
      ) : <button className="button primary" disabled={!answer} onClick={() => setChecked(true)}>Check answer<ArrowRight size={15} /></button>}
    </div>
  );
}
