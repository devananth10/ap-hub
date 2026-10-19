// Validates the explicitly authorized publication, never discovers/imports new drafts.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { questionBatches, validateQuestionBatches } from '../src/lib/practice-bank.ts';
import { practiceEntries, practiceCount } from '../src/lib/practice.ts';
import { courses } from '../src/lib/courses.ts';
import publishedIndex from '../src/config/published-practice-index.json' with { type: 'json' };

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const canonical = value => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const root = 'content-drafts/chemistry';
const snapshot = read(`${root}/BANK_AUDIT.json`);
const review = read(`${root}/PUBLICATION_REVIEW.json`);
assert.equal(review.authorization.approvedBy, 'owner');
assert.equal(review.authorization.mode, 'bulk-publication-after-automated-checks');
assert.equal(review.authorization.humanScientificReviewPerformed, false);
assert.equal(review.publishedQuestions, 1001);
assert.deepEqual(review.withheldQuestionIds, []);
validateQuestionBatches(questionBatches);
const chemistryBatches = questionBatches.filter(batch => batch.courseId === 'chemistry');
assert.equal(chemistryBatches.length, 91);
assert.equal(practiceEntries({courseId:'chemistry'}).length, 1001);
assert.equal(practiceCount({courseId:'chemistry'}), 1001);
const expectedIndex = [];
const questions = new Map();
const prompts = new Set();
for (const unit of courses.find(course => course.id === 'chemistry').units) {
  assert.equal(practiceEntries({ courseId: 'chemistry', unitNumber: unit.number }).length, unit.topics.length * 11);
  for (const topic of unit.topics) {
    const scope = { courseId: 'chemistry', unitNumber: unit.number, topicId: topic.id };
    const batch = chemistryBatches.find(item => item.topicId === topic.id);
    const original = snapshot.inventory.find(item => item.topicId === topic.id);
    assert.ok(batch && original);
    assert.equal(hash(batch), original.semanticSha256, `Question content changed since authorized snapshot: ${topic.number}`);
    assert.deepEqual(read(`src/content/practice/chemistry-${topic.number.replace('.', '-')}.json`), batch);
    assert.equal(practiceEntries(scope).length, 11);
    assert.equal(practiceCount(scope), 11);
    expectedIndex.push({ ...scope, count: 11 });
    batch.questions.forEach((question, index) => {
      assert.equal(question.id, `chem-${topic.number.replace('.', '-')}-${String(index + 1).padStart(3, '0')}`);
      assert.ok(!questions.has(question.id));
      const prompt = question.prompt.normalize('NFKC').replace(/\s+/g, ' ').trim();
      assert.ok(!prompts.has(prompt));
      prompts.add(prompt);
      questions.set(question.id, question);
    });
  }
}
assert.deepEqual(publishedIndex.filter(batch => batch.courseId === 'chemistry'), expectedIndex, 'Chemistry client counts must match its actual published registry');
assert.equal(questions.size, 1001);
assert.equal(practiceEntries({ courseId: 'biology' }).length, 0);

// Bind the flagged calculations to actual published answer choices, not only constants.
const onlyNumericalAnswer = (id, expected) => {
  const question = questions.get(id);
  const matches = question.options.map(option => Math.abs(Number.parseFloat(option) - expected) < Math.max(1e-10, Math.abs(expected) * 1e-7));
  assert.equal(matches.filter(Boolean).length, 1, `${id}: multiple/no matching numerical choices`);
  assert.equal(matches.indexOf(true), question.correctIndex, `${id}: wrong numerical key`);
};
onlyNumericalAnswer('chem-1-6-008', 60 - 18);
onlyNumericalAnswer('chem-5-9-008', .300 * (4 * .100 * .0500) * .200);
onlyNumericalAnswer('chem-5-9-009', .500 * (.300 * 2 / (1 + 2)) * .100);
const rootQuestion = questions.get('chem-5-9-004');
assert.deepEqual(rootQuestion.options, ['r = k2Kd[A2][B]', 'r = k2 sqrt(Kd[A2]) [B]', 'r = k2[A2][B]/Kd', 'r = k2Kd[A2]^2[B]']);
const rootModels = [(k, d, b) => k*d*b, (k, d, b) => Math.sqrt(k*d)*b, (k, d, b) => d*b/k, (k, d, b) => k*d*d*b];
const inverseQuestion = questions.get('chem-5-9-007');
assert.deepEqual(inverseQuestion.options, ['r = k2K[A][B][C]', 'r = k2K[A][C]/[B]', 'r = k2[A][B]/(K[C])', 'r = k2K[B][C]/[A]']);
const inverseModels = [(k,a,b,c)=>k*a*b*c, (k,a,b,c)=>k*a*c/b, (k,a,b,c)=>a*b/(k*c), (k,a,b,c)=>k*b*c/a];
for (const [kd, dimer, b] of [[.04,.25,.3],[.09,.16,.2],[.02,.32,.4]]) {
  const expected = Math.sqrt(kd*dimer)*b;
  const matches = rootModels.map(model => Math.abs(model(kd,dimer,b)-expected)<1e-10);
  assert.equal(matches.filter(Boolean).length, 1);
  assert.equal(matches.indexOf(true), rootQuestion.correctIndex);
}
for (const [k,a,b,c] of [[4,.1,.05,.2],[2,.3,.12,.4],[3,.2,.08,.15]]) {
  const expected = (k*a/b)*c;
  const matches = inverseModels.map(model => Math.abs(model(k,a,b,c)-expected)<1e-10);
  assert.equal(matches.filter(Boolean).length, 1);
  assert.equal(matches.indexOf(true), inverseQuestion.correctIndex);
}
assert.equal(questions.get('chem-5-9-010').options[questions.get('chem-5-9-010').correctIndex], 'M^-2·s^-1');
console.log('PUBLICATION PASS: all 1,001 unchanged MCQs published in 91 correctly scoped topics; 0 withheld. Counts, authorization, preservation and flagged numerical/approximation cases passed. No human review or deployment claimed.');
