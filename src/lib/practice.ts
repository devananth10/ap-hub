import { courses, type Course, type Topic, type Unit } from "./courses.ts";
import { questionBatches, type BankQuestion } from "./practice-bank.ts";

export type PracticeScope = { courseId?: string; unitNumber?: number; topicId?: string };
export type PracticeEntry = { id: string; course: Course; unit: Unit; topic: Topic; question: BankQuestion };

export function practiceHref(scope: PracticeScope = {}) {
  const params = new URLSearchParams();
  if (scope.courseId) params.set("course", scope.courseId);
  if (scope.unitNumber !== undefined) params.set("unit", String(scope.unitNumber));
  if (scope.topicId) params.set("topic", scope.topicId);
  return `/practice${params.size ? `?${params}` : ""}`;
}
export function validPracticeScope(scope: PracticeScope): boolean {
  if (!scope.courseId) return scope.unitNumber === undefined && !scope.topicId;
  const course = courses.find((item) => item.id === scope.courseId);
  if (!course) return false;
  if (scope.unitNumber === undefined) return !scope.topicId;
  const unit = course.units.find((item) => item.number === scope.unitNumber);
  return !!unit && (!scope.topicId || unit.topics.some((topic) => topic.id === scope.topicId));
}
export function practiceEntries(scope: PracticeScope = {}): PracticeEntry[] {
  if (!validPracticeScope(scope)) return [];
  return courses.flatMap((course) => course.units.flatMap((unit) => unit.topics.flatMap((topic) => {
    if (scope.courseId && course.id !== scope.courseId || scope.unitNumber !== undefined && unit.number !== scope.unitNumber || scope.topicId && topic.id !== scope.topicId) return [];
    return questionBatches.filter((batch) => batch.courseId === course.id && batch.unitNumber === unit.number && batch.topicId === topic.id).flatMap((batch) => batch.questions.map((question) => ({ id: question.id, course, unit, topic, question })));
  })));
}
