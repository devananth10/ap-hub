import { courses } from "./courses.ts";
import published from "../config/published-practice-index.json" with { type: "json" };

export type PracticeScope = { courseId?: string; unitNumber?: number; topicId?: string };

export function practiceHref(scope: PracticeScope = {}) {
  const params = new URLSearchParams();
  if (scope.courseId) params.set("course", scope.courseId);
  if (scope.unitNumber !== undefined) params.set("unit", String(scope.unitNumber));
  if (scope.topicId) params.set("topic", scope.topicId);
  return `/practice${params.size ? `?${params}` : ""}`;
}

export function validPracticeScope(scope: PracticeScope): boolean {
  if (!scope.courseId) return scope.unitNumber === undefined && !scope.topicId;
  const course = courses.find(item => item.id === scope.courseId);
  if (!course) return false;
  if (scope.unitNumber === undefined) return !scope.topicId;
  const unit = course.units.find(item => item.number === scope.unitNumber);
  return !!unit && (!scope.topicId || unit.topics.some(topic => topic.id === scope.topicId));
}

// Client navigation needs counts, not the complete question/explanation bank.
export function practiceCount(scope: PracticeScope = {}): number {
  if (!validPracticeScope(scope)) return 0;
  return published.filter(batch => (!scope.courseId || batch.courseId === scope.courseId)
    && (scope.unitNumber === undefined || batch.unitNumber === scope.unitNumber)
    && (!scope.topicId || batch.topicId === scope.topicId))
    .reduce((total, batch) => total + batch.count, 0);
}
