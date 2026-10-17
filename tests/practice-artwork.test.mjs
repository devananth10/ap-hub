import assert from "node:assert/strict";
import test from "node:test";
import { courses } from "../src/lib/courses.ts";
import { academicThemes, dashboardThemeAt } from "../src/lib/artwork.ts";
import { practiceEntries, practiceHref, validPracticeScope } from "../src/lib/practice.ts";

test("practice links preserve course, unit, and topic scope", () => {
  assert.equal(practiceHref(), "/practice");
  assert.equal(practiceHref({ courseId: "chemistry", unitNumber: 1, topicId: "electron-configuration" }), "/practice?course=chemistry&unit=1&topic=electron-configuration");
});
test("every catalog course, unit, and topic is a valid practice destination", () => {
  for (const course of courses) {
    assert.ok(validPracticeScope({ courseId: course.id }));
    for (const unit of course.units) {
      assert.ok(validPracticeScope({ courseId: course.id, unitNumber: unit.number }));
      for (const topic of unit.topics) assert.ok(validPracticeScope({ courseId: course.id, unitNumber: unit.number, topicId: topic.id }));
    }
  }
});
test("invalid or mismatched practice scopes cannot leak unrelated questions", () => {
  for (const scope of [{ unitNumber: 1 }, { courseId: "missing" }, { courseId: "chemistry", unitNumber: 999 }, { courseId: "biology", unitNumber: 1, topicId: "electron-configuration" }, { courseId: "chemistry", topicId: "electron-configuration" }, { courseId: "chemistry", unitNumber: NaN }]) {
    assert.equal(validPracticeScope(scope), false);
    assert.deepEqual(practiceEntries(scope), []);
  }
});
test("existing original MCQ is available only within matching scopes", () => {
  assert.equal(practiceEntries().length, 1);
  const scope = { courseId: "chemistry", unitNumber: 1, topicId: "electron-configuration" };
  assert.equal(practiceEntries(scope).length, 1);
  assert.equal(practiceEntries({ courseId: "biology" }).length, 0);
  assert.equal(practiceEntries({ courseId: "chemistry", unitNumber: 1, topicId: "moles" }).length, 0);
  const question = practiceEntries(scope)[0].question;
  assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length);
});
test("dashboard artwork pool contains distinct academic subjects", () => {
  assert.deepEqual(academicThemes.map((theme, index) => dashboardThemeAt(index)), academicThemes.map((theme) => theme.id));
  assert.equal(new Set(academicThemes.map((theme) => theme.id)).size, 8);
  for (const invalid of [-1, 8, 1.5, NaN]) assert.throws(() => dashboardThemeAt(invalid));
});
test("existing courses use stable relevant subject art without adding courses", () => {
  assert.deepEqual(Object.fromEntries(courses.map((course) => [course.id, course.artwork])), {
    chemistry: "chemistry", biology: "biology", "calculus-ab": "calculus", "physics-1": "physics", "english-language": "literature", "us-history": "history",
  });
});
