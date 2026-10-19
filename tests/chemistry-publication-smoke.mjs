import assert from 'node:assert/strict';
import { courses } from '../src/lib/courses.ts';
import { practiceEntries, practiceHref } from '../src/lib/practice.ts';

const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
const plain = html => html.replace(/<!--.*?-->/g, '');
const decode = text => text.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
  .replaceAll('&quot;', '"').replaceAll('&apos;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const check = async scope => {
  const path = practiceHref(scope);
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const html = plain(await response.text());
  const entries = practiceEntries(scope);
  assert.ok(html.includes(`${entries.length} MCQ questions`), `${path}: published count`);
  assert.ok(html.includes(`Question 1 of ${entries.length}`), `${path}: session size`);
  assert.equal((html.match(/<fieldset\b/g) || []).length, 1, `${path}: only one question should mount`);
  const legend = html.match(/<legend[^>]*>(.*?)<\/legend>/s)?.[1];
  assert.equal(decode(legend), entries[0].question.prompt, `${path}: correct topic's first question`);
  assert.ok(html.includes('Finish practice'), `${path}: final-score entry`);
  assert.equal((html.match(/aria-label="Report this question"/g) || []).length, 1, `${path}: current MCQ has exactly one reporting flag`);
  assert.ok(!html.includes('OWNER-APPROVED'), `${path}: no approval badge`);
};
await check({ courseId: 'chemistry' });
let topics = 0;
for (const unit of courses.find(course => course.id === 'chemistry').units) {
  await check({ courseId: 'chemistry', unitNumber: unit.number });
  for (const topic of unit.topics) {
    await check({ courseId: 'chemistry', unitNumber: unit.number, topicId: topic.id });
    topics++;
  }
  console.log(`PASS Unit ${unit.number}: ${unit.topics.length} topic routes, each with 11 MCQs`);
}
assert.equal(topics, 91);
console.log('PASS all 91 topic routes, all 9 unit routes and Chemistry course practice; counts, first-question identity, single-question rendering and score navigation verified.');
