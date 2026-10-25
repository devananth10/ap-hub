"use client";

import { useEffect, useId, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { BankQuestion } from "@/lib/practice-bank";
import type { PracticeAnswer } from "@/lib/practice-session";
import { PracticeFigure } from "./practice-figure";
import { PracticeTable } from "./practice-table";
import { GeographyStimulus } from "./geography-stimulus";
import { geographyStimuli } from "@/lib/geography-stimuli";

export function PracticeQuestion({ practice, answer, onSelect, onCheck, onRetry, disabled = false }: { practice: BankQuestion; answer: PracticeAnswer; onSelect: (index: number) => void; onCheck: () => void; onRetry: () => void; disabled?: boolean }) {
  const groupName = useId();
  // Do not let an early native radio click precede React's controlled state.
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const { selected, checked } = answer;
  const { options, prompt, correctIndex, explanation } = practice;
  const stimulus = geographyStimuli[practice.id];
  const splitSuitable = stimulus && (stimulus.kind === "map" || stimulus.kind === "model" || stimulus.kind === "pyramid" || stimulus.kind === "chart" && stimulus.categories.length <= 4 || stimulus.kind === "table" && stimulus.headers.length <= 3);
  return (
    <div className="practice-preview">
      <h2 className="sr-only">Practice question</h2>
      <p className="muted small practice-source-note">Original PrepAtlas question. This is not an official College Board question.</p>
      <div className={`practice-task-layout ${splitSuitable ? "can-split" : ""}`}>
      <GeographyStimulus key={practice.id} questionId={practice.id} />
      <div className="practice-answer-pane">
      <fieldset disabled={checked || !ready || disabled} aria-busy={!ready || disabled}>
        <legend>{prompt}</legend>
        <PracticeFigure questionId={practice.id} />
        <PracticeTable questionId={practice.id} />
        <div className="practice-options">{options.map((option, index) => (
          <label key={option} className={`${selected === index ? "selected" : ""} ${checked && index === correctIndex ? "correct" : ""} ${checked && selected === index && index !== correctIndex ? "incorrect" : ""}`}>
            <input type="radio" name={groupName} value={String(index)} checked={selected === index} onChange={() => onSelect(index)} />
            <span>{String.fromCharCode(65 + index)}</span><span className="answer-text">{option}</span>
            {checked && index === correctIndex && <small className="answer-state">{selected === index ? "Your answer · Correct" : "Correct answer"}</small>}
            {checked && selected === index && index !== correctIndex && <small className="answer-state">Your answer · Incorrect</small>}
          </label>
        ))}</div>
      </fieldset>
      {checked ? (
        <div role="status" className="practice-feedback">
          <strong>{selected === correctIndex ? "That’s it." : "Not quite. Review the explanation."}</strong>
          <p>{explanation}</p>
          <button className="text-button" disabled={disabled} onClick={onRetry}><RotateCcw size={14} />Try again</button>
        </div>
      ) : <button className="button primary" disabled={!ready || disabled || selected === null} onClick={onCheck}>Check answer<ArrowRight size={15} /></button>}
      </div></div>
    </div>
  );
}
