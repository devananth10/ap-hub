import type { BankQuestion } from "./practice-bank.ts";

export type PracticeAnswer = { selected: number | null; checked: boolean; firstAnswer?: number };
export type SessionState = { index: number; answers: Record<string, PracticeAnswer>; finished: boolean };
export const emptyAnswer: PracticeAnswer = { selected: null, checked: false };
export const initialSession: SessionState = { index: 0, answers: {}, finished: false };
type SessionAction =
  | { type: "select"; id: string; selected: number }
  | { type: "check" | "retry"; id: string }
  | { type: "move"; index: number; total: number }
  | { type: "finish" }
  | { type: "review" }
  | { type: "restart" };

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  if (action.type === "restart") return initialSession;
  if (action.type === "finish") {
    const answers = Object.fromEntries(Object.entries(state.answers).map(([id, answer]) => [id,
      answer.selected === null ? answer : { ...answer, checked: true, firstAnswer: answer.firstAnswer ?? answer.selected },
    ]));
    return { ...state, answers, finished: true };
  }
  if (action.type === "review") return { ...state, finished: false };
  if (action.type === "move") {
    if (!Number.isInteger(action.index) || !Number.isInteger(action.total) || action.total < 1) return state;
    return { ...state, index: Math.max(0, Math.min(action.total - 1, action.index)) };
  }
  const answer = state.answers[action.id] || emptyAnswer;
  let next: PracticeAnswer;
  if (action.type === "select") {
    if (answer.checked || !Number.isInteger(action.selected) || action.selected < 0 || action.selected > 3) return state;
    next = { ...answer, selected: action.selected };
  } else if (action.type === "check") {
    if (answer.checked || answer.selected === null) return state;
    next = { ...answer, checked: true, firstAnswer: answer.firstAnswer ?? answer.selected };
  } else next = { ...answer, selected: null, checked: false };
  return { ...state, answers: { ...state.answers, [action.id]: next } };
}

// First graded answers count once. Reviewing/retrying never inflates the score.
export function sessionScore(questions: Pick<BankQuestion, "id" | "correctIndex">[], answers: SessionState["answers"]) {
  let correct = 0;
  let answered = 0;
  for (const question of questions) {
    const answer = answers[question.id]?.firstAnswer;
    if (answer !== undefined) {
      answered++;
      if (answer === question.correctIndex) correct++;
    }
  }
  return { correct, answered, total: questions.length, percent: questions.length ? Math.round(correct / questions.length * 100) : 0 };
}
