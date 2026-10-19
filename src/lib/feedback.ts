export const reportReasons = [
  { value: "incorrect-answer", label: "Incorrect answer" },
  { value: "multiple-answers", label: "Multiple answers seem correct" },
  { value: "explanation", label: "Incorrect or confusing explanation" },
  { value: "formatting", label: "Typo or formatting issue" },
  { value: "other", label: "Other" },
] as const;
export type ReportReason = typeof reportReasons[number]["value"];
export type FeedbackInput =
  | { kind: "review"; submissionId: string; rating: number; text: string; publicOptIn: boolean }
  | { kind: "question-report"; submissionId: string; questionId: string; displayedNumber: number; category: ReportReason; comment: string };
export type QuestionReference = { questionId: string; courseId: string; courseName: string; unitNumber: number; topicId: string; topicNumber: string; displayedNumber: number };
export class FeedbackError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function validFeedbackId(value: unknown): value is string { return typeof value === "string" && uuid.test(value); }
function text(value: unknown): string {
  if (typeof value !== "string" || value.length > 500 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new FeedbackError("Please keep comments to 500 characters without control characters.");
  return value.trim();
}
export function validateFeedback(value: unknown): FeedbackInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new FeedbackError("Invalid feedback form.");
  const data = value as Record<string, unknown>;
  const fields = data.kind === "review" ? ["kind", "submissionId", "rating", "text", "publicOptIn", "website"] : ["kind", "submissionId", "questionId", "displayedNumber", "category", "comment", "website"];
  if (Object.keys(data).some(key => !fields.includes(key)) || !validFeedbackId(data.submissionId) || data.website !== "") throw new FeedbackError("Please reopen the form and try again.");
  if (data.kind === "review") {
    if (!Number.isInteger(data.rating) || Number(data.rating) < 1 || Number(data.rating) > 5 || typeof data.publicOptIn !== "boolean") throw new FeedbackError("Choose a rating from 1 to 5 stars.");
    return { kind: "review", submissionId: data.submissionId, rating: Number(data.rating), text: text(data.text), publicOptIn: data.publicOptIn };
  }
  if (data.kind !== "question-report" || typeof data.questionId !== "string" || data.questionId.length > 100 || !Number.isInteger(data.displayedNumber) || Number(data.displayedNumber) < 1 || Number(data.displayedNumber) > 10000 || !reportReasons.some(reason => reason.value === data.category)) throw new FeedbackError("Choose a report reason and a valid question.");
  return { kind: "question-report", submissionId: data.submissionId, questionId: data.questionId, displayedNumber: Number(data.displayedNumber), category: data.category as ReportReason, comment: text(data.comment) };
}

// A second human privacy check is still required; these catch common accidental identifiers.
export function validatePublicText(value: unknown) {
  const result = text(value);
  if (/@|https?:\/\/|www\.|\b\d[\d\s()+.-]{7,}\d\b/i.test(result)) throw new FeedbackError("Remove contact details and links from the public excerpt.");
  return result;
}
