import moles from "../content/practice/chemistry-1-1.json" with { type: "json" };
import { findTopic } from "./courses.ts";

export type BankQuestion = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
export type QuestionBatch = { courseId: string; unitNumber: number; topicId: string; questions: BankQuestion[] };

/** Validate hand-reviewed batches before publishing them through the registry below. */
export function validateQuestionBatches(input: unknown[]): QuestionBatch[] {
  const ids = new Set<string>();
  const exactFields = (value: object, fields: string[]) => Object.keys(value).sort().join(",") === [...fields].sort().join(",");
  return input.map((raw) => {
    if (!raw || typeof raw !== "object") throw new Error("Invalid question batch");
    const batch = raw as QuestionBatch;
    if (!exactFields(batch, ["courseId", "unitNumber", "topicId", "questions"])) throw new Error("Unexpected batch fields");
    const { unit, topic } = findTopic(batch.courseId, batch.topicId);
    if (!unit || !topic || unit.number !== batch.unitNumber || !Array.isArray(batch.questions) || batch.questions.length !== 11) throw new Error("Invalid question scope or expected eleven questions");
    for (const question of batch.questions) {
      if (!question || typeof question.id !== "string" || !question.id.trim() || ids.has(question.id)) throw new Error("Missing or duplicate question ID");
      if (!exactFields(question, ["id", "prompt", "options", "correctIndex", "explanation"])) throw new Error(`Unexpected question fields: ${question.id}`);
      ids.add(question.id);
      if (typeof question.prompt !== "string" || !question.prompt.trim() || typeof question.explanation !== "string" || !question.explanation.trim()) throw new Error(`Missing question text: ${question.id}`);
      if (!Array.isArray(question.options) || question.options.length !== 4 || !question.options.every((option) => typeof option === "string" && option.trim()) || new Set(question.options.map((option) => option.trim())).size !== 4) throw new Error(`Invalid options: ${question.id}`);
      if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex >= 4) throw new Error(`Invalid answer index: ${question.id}`);
    }
    return batch;
  });
}

// Owner preserved questions 001–010 and authorized one validated addition (011)
// in chat on 2026-10-17. See content-drafts/chemistry/qa/topic-1-1.md.
// New batches must be reviewed and explicitly approved before adding them here.
export const questionBatches = validateQuestionBatches([moles]);
