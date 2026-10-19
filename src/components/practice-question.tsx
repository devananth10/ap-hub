"use client";

import { useId } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { BankQuestion } from "@/lib/practice-bank";
import type { PracticeAnswer } from "@/lib/practice-session";
import { PracticeFigure } from "./practice-figure";

export function PracticeQuestion({ practice, answer, onSelect, onCheck, onRetry }: { practice: BankQuestion; answer: PracticeAnswer; onSelect: (index: number) => void; onCheck: () => void; onRetry: () => void }) {
  const groupName = useId();
  const { selected, checked } = answer;
  const { options, prompt, correctIndex, explanation } = practice;
  return (
    <div className="practice-preview">
      <h2>A quick check for understanding.</h2>
      <p className="muted small">This is not an official College Board question. Answers stay in this session and reset on reload.</p>
      <fieldset disabled={checked}>
        <legend>{prompt}</legend>
        <PracticeFigure questionId={practice.id} />
        <div className="practice-options">{options.map((option, index) => (
          <label key={option} className={`${selected === index ? "selected" : ""} ${checked && index === correctIndex ? "correct" : ""}`}>
            <input type="radio" name={groupName} value={String(index)} checked={selected === index} onChange={() => onSelect(index)} />
            <span>{String.fromCharCode(65 + index)}</span>{option}
          </label>
        ))}</div>
      </fieldset>
      {checked ? (
        <div role="status" className="practice-feedback">
          <strong>{selected === correctIndex ? "That’s it." : "Not quite. Review the explanation."}</strong>
          <p>{explanation}</p>
          <button className="text-button" onClick={onRetry}><RotateCcw size={14} />Try again</button>
        </div>
      ) : <button className="button primary" disabled={selected === null} onClick={onCheck}>Check answer<ArrowRight size={15} /></button>}
    </div>
  );
}
