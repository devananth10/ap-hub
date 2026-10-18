import { courses, type Course, type Topic, type Unit } from "./courses.ts";
import { questionBatches, type BankQuestion } from "./practice-bank.ts";
import { validPracticeScope, type PracticeScope } from "./practice-scope.ts";
export { practiceHref, validPracticeScope, practiceCount, type PracticeScope } from "./practice-scope.ts";

export type PracticeEntry = { id: string; course: Course; unit: Unit; topic: Topic; question: BankQuestion };
export function practiceEntries(scope: PracticeScope = {}): PracticeEntry[] {
  if (!validPracticeScope(scope)) return [];
  return courses.flatMap((course) => course.units.flatMap((unit) => unit.topics.flatMap((topic) => {
    if (scope.courseId && course.id !== scope.courseId || scope.unitNumber !== undefined && unit.number !== scope.unitNumber || scope.topicId && topic.id !== scope.topicId) return [];
    return questionBatches.filter((batch) => batch.courseId === course.id && batch.unitNumber === unit.number && batch.topicId === topic.id).flatMap((batch) => batch.questions.map((question) => ({ id: question.id, course, unit, topic, question })));
  })));
}
