import assert from "node:assert/strict";
import test from "node:test";
import { courses } from "../src/lib/courses.ts";
import { academicThemes, dashboardThemeAt } from "../src/lib/artwork.ts";
import { practiceEntries, practiceHref, validPracticeScope, practiceCount } from "../src/lib/practice.ts";
import { questionBatches, validateQuestionBatches } from "../src/lib/practice-bank.ts";
import { readFileSync } from "node:fs";
import { lessons } from "../src/lib/lessons.ts";

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
test("approved practice stays scoped and the removed demo is not counted", () => {
  assert.equal(practiceEntries({courseId:'chemistry'}).length, 1001);
  const scope = { courseId: "chemistry", unitNumber: 1, topicId: "electron-configuration" };
  assert.equal(practiceEntries(scope).length, 11);
  assert.equal(practiceEntries({ courseId: "biology" }).length, 0);
  assert.equal(practiceEntries({ courseId: "chemistry", unitNumber: 1, topicId: "moles" }).length, 11);
  assert.equal(practiceEntries({ courseId: "chemistry", unitNumber: 2 }).length, 77);
  assert.equal(practiceEntries({ courseId: "chemistry", unitNumber: 1, topicId: "mass-spectra" }).length, 11);
  const question = practiceEntries({courseId:"chemistry",unitNumber:1,topicId:"moles"})[0].question;
  assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length);
});

test("owner-approved Topic 1.1 questions work independently of lesson readiness", () => {
  const entries = practiceEntries({ courseId: "chemistry", unitNumber: 1, topicId: "moles" });
  assert.equal(entries.length, 11);
  assert.equal(new Set(entries.map((entry) => entry.id)).size, 11);
  assert.ok(entries.every((entry) => !entry.topic.ready));
  assert.deepEqual(entries.map((entry) => entry.question.correctIndex), [1,2,0,3,1,2,3,0,2,0,3]);
  assert.equal(entries[6].question.options[entries[6].question.correctIndex], "29.22 g");
  assert.match(entries[1].question.options[entries[1].question.correctIndex], /1.20 × 10²³/);
});

test("batches reject invalid scopes, duplicate IDs, and malformed questions", () => {
  const original = questionBatches[0];
  const fixture = () => structuredClone(original);
  for (const scope of [{courseId:"missing"}, {unitNumber:2}, {topicId:"moles-and-molar-mass"}, {questions:[]}]) {
    assert.throws(() => validateQuestionBatches([{...fixture(), ...scope}]));
  }
  assert.throws(() => validateQuestionBatches([fixture(), fixture()]), /duplicate/);
  assert.throws(() => validateQuestionBatches([{...fixture(), extra: true}]), /Unexpected batch fields/);
  const short = fixture(); short.questions.pop();
  assert.throws(() => validateQuestionBatches([short]), /eleven/);
  const extra = fixture(); extra.questions[0].source = "unapproved";
  assert.throws(() => validateQuestionBatches([extra]), /Unexpected question fields/);
  for (const patch of [{correctIndex:-1}, {correctIndex:4}, {correctIndex:1.5}, {prompt:""}, {explanation:""}, {options:["A","B","C"]}, {options:["A","A","C","D"]}, {options:["A","B","C",null]}]) {
    const batch = fixture(); batch.questions[0] = {...batch.questions[0], ...patch};
    assert.throws(() => validateQuestionBatches([batch]));
  }
});

test("all 91 Chemistry topics match the verified official inventory and retain stable mappings", () => {
  const chemistry = courses.find(course => course.id === "chemistry");
  const official = JSON.parse(readFileSync(new URL("../content-drafts/chemistry/research/official-topics.json", import.meta.url), "utf8"));
  const topics = chemistry.units.flatMap(unit => unit.topics);
  assert.deepEqual(chemistry.units.map(unit => unit.topics.length), [8,7,13,9,11,9,12,11,11]);
  assert.equal(new Set(topics.map(topic => topic.id)).size, 91);
  assert.deepEqual(topics.map(({number,title}) => ({number,title})), official.topics.map(({number,title}) => ({number,title})));
  const stable = {"1.1":"moles","1.2":"mass-spectra","1.3":"composition","1.4":"mixtures","1.5":"electron-configuration","1.6":"photoelectron-spectroscopy","1.7":"periodic-trends","1.8":"valence","2.1":"bonds","2.2":"potential-energy","3.1":"intermolecular-forces","4.1":"reactions","5.1":"rates","6.1":"energy","7.1":"equilibrium","8.1":"acids","9.1":"entropy"};
  for (const [number,id] of Object.entries(stable)) assert.equal(topics.find(topic => topic.number === number).id, id);
  assert.equal(topics.find(topic => topic.number === "2.3").id, "topic-2-3");
  assert.ok(topics.find(topic => topic.id === "electron-configuration").ready);
  assert.ok(lessons["chemistry/electron-configuration"]);
});

test("bulk-authorized publication covers every Chemistry topic exactly once without leaking other subjects", () => {
  const chemistry = courses.find(course => course.id === "chemistry");
  const chemistryBatches = questionBatches.filter(batch => batch.courseId === 'chemistry');
  assert.equal(chemistryBatches.length, 91);
  assert.equal(new Set(chemistryBatches.map(batch => batch.topicId)).size, 91);
  const publishedIds = new Set();
  for (const unit of chemistry.units) {
    assert.equal(practiceEntries({ courseId: "chemistry", unitNumber: unit.number }).length, unit.topics.length * 11);
    for (const topic of unit.topics) {
      const scope = { courseId: "chemistry", unitNumber: unit.number, topicId: topic.id };
      const entries = practiceEntries(scope);
      assert.equal(entries.length, 11);
      assert.equal(practiceCount(scope), entries.length);
      for (const entry of entries) {
        assert.equal(entry.topic.id, topic.id);
        assert.equal(entry.unit.number, unit.number);
        assert.ok(!publishedIds.has(entry.id));
        publishedIds.add(entry.id);
      }
    }
  }
  assert.equal(publishedIds.size, 1001);
  for (const course of courses.filter(course => !["chemistry","calculus-ab"].includes(course.id))) {
    assert.equal(practiceCount({ courseId: course.id }), 0);
    assert.equal(practiceEntries({ courseId: course.id }).length, 0);
  }
});

test("Chemistry titles use verified College Board names while preserving storage IDs", () => {
  const chemistry = courses.find((course) => course.id === "chemistry");
  assert.equal(chemistry.units[0].title, "Atomic Structure and Properties");
  assert.equal(chemistry.units[0].topics[0].id, "moles");
  assert.equal(chemistry.units[0].topics[0].title, "Moles and Molar Mass");
  assert.equal(chemistry.units[0].topics[4].id, "electron-configuration");
  assert.equal(chemistry.units[0].topics[4].title, "Atomic Structure and Electron Configuration");
  assert.equal(chemistry.units[3].topics[0].title, "Introduction for Reactions");
});
test("dashboard artwork pool contains distinct academic subjects", () => {
  assert.deepEqual(academicThemes.map((theme, index) => dashboardThemeAt(index)), academicThemes.map((theme) => theme.id));
  assert.equal(new Set(academicThemes.map((theme) => theme.id)).size, 8);
  for (const invalid of [-1, 8, 1.5, NaN]) assert.throws(() => dashboardThemeAt(invalid));
});
test("registered courses use fixed relevant subject art, including Human Geography", () => {
  assert.deepEqual(Object.fromEntries(courses.map((course) => [course.id, course.artwork])), {
    chemistry: "chemistry", biology: "biology", "calculus-ab": "calculus", "physics-1": "physics", "english-language": "literature", "us-history": "history", "human-geography": "geography",
  });
});
