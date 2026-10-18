// Full-bank dry run. This script never imports drafts into the application.
// Use --write only after reviewing intentional content changes to refresh the inventory.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { questionBatches, validateQuestionBatches } from '../src/lib/practice-bank.ts';
import curriculum from '../src/config/chemistry-curriculum.json' with { type: 'json' };

const root = 'content-drafts/chemistry';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const canonical = value => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const fileHash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const pendingFiles = readdirSync(`${root}/pending`).filter(name => name.endsWith('.json'));
const pending = pendingFiles.map(name => read(`${root}/pending/${name}`));
const batches = validateQuestionBatches([...questionBatches, ...pending]);
const topics = curriculum.flatMap(unit => unit.topics.map(topic => ({ ...topic, unitNumber: unit.number })));
const official = read(`${root}/research/official-topics.json`).topics;
assert.equal(topics.length, 91);
assert.deepEqual(topics.map(({ number, title }) => ({ number, title })), official.map(({ number, title }) => ({ number, title })));
assert.equal(batches.length, 91);
assert.equal(new Set(batches.map(batch => batch.topicId)).size, 91, 'One and only one active complete set per topic');
assert.equal(questionBatches.length, 1, 'No automatic publication');
assert.equal(questionBatches[0].topicId, 'moles');
assert.equal(pending.length, 90);
assert.equal(batches.reduce((sum, batch) => sum + batch.questions.length, 0), 1001);

const prompts = new Set();
const inventory = topics.map(topic => {
  const batch = batches.find(item => item.topicId === topic.id);
  assert.ok(batch, `Missing ${topic.number}`);
  assert.equal(batch.unitNumber, topic.unitNumber);
  const prefix = `chem-${topic.number.replace('.', '-')}-`;
  const distribution = [0, 0, 0, 0];
  batch.questions.forEach((question, i) => {
    assert.equal(question.id, `${prefix}${String(i + 1).padStart(3, '0')}`);
    const prompt = question.prompt.normalize('NFKC').replace(/\s+/g, ' ').trim();
    assert.ok(!prompts.has(prompt), `Duplicate prompt ${question.id}`);
    prompts.add(prompt);
    // Text markers check editorial completeness, not scientific truth.
    for (const letter of 'ABCD') assert.match(question.explanation, new RegExp(`\\b${letter}\\b`), `${question.id}: missing ${letter} explanation marker`);
    const leadingLabel = question.explanation.match(/^([A-D]) is correct/);
    if (leadingLabel) assert.equal('ABCD'.indexOf(leadingLabel[1]), question.correctIndex, `${question.id}: answer-label mismatch`);
    distribution[question.correctIndex]++;
  });
  assert.ok(distribution.every(count => count >= 2 && count <= 3));
  assert.ok(existsSync(`${root}/qa/topic-${topic.number.replace('.', '-')}.md`));
  const live = questionBatches.includes(batch);
  return {
    number: topic.number, title: topic.title, topicId: topic.id, count: 11,
    path: live ? 'src/content/practice/chemistry-1-1.json' : `${root}/pending/chemistry-${topic.number.replace('.', '-')}.json`,
    status: live ? 'owner-authorized-live' : 'unpublished-human-review-pending',
    answerDistribution: distribution, semanticSha256: hash(batch),
  };
});

assert.equal(hash(questionBatches[0].questions.slice(0, 10)), '6491d0fb6efa4e05967a0f31e8a431565ab6a9a9e2cd0a0c2b44905ed99be091', 'Original approved ten changed');
let preservedPartialCount = 0;
for (const number of ['1-6', '1-7', '2-1']) {
  const partial = read(`${root}/partial/topic-${number}.json`).completeQuestions;
  const complete = read(`${root}/pending/chemistry-${number}.json`).questions;
  assert.deepEqual(complete.slice(0, partial.length), partial, `Recovered working objects changed in ${number}`);
  preservedPartialCount += partial.length;
}
assert.equal(preservedPartialCount, 29);

// The verified Unit 6 checkpoint is an immutable reference for existing valid drafts.
const baseline = '34fb9df';
const earlierFiles = execFileSync('git', ['ls-tree', '-r', '--name-only', baseline, '--', `${root}/pending`], { encoding: 'utf8', windowsHide: true }).trim().split(/\r?\n/);
assert.equal(earlierFiles.length, 49);
for (const path of earlierFiles) {
  const previous = JSON.parse(execFileSync('git', ['show', `${baseline}:${path}`], { encoding: 'utf8', windowsHide: true }));
  assert.deepEqual(read(path), previous, `Existing Unit 6 checkpoint batch changed: ${path}`);
}
const recoveryIndex = read(`${root}/recovered/index.json`);
assert.equal(fileHash(`${root}/recovered/archive-unaudited.md`), recoveryIndex.sha256);
assert.equal(fileHash('src/config/official-resources.json'), '3544ceb6d9770ba4a72e429a8a73eec3313c482365c4b8c35784f3709e4a0571');
const videoManifest = read(`${root}/research/video-candidates.json`);
assert.equal(videoManifest.videos.length, 103);
assert.equal(videoManifest.coveredTopicCount, 91);

const report = {
  asOf: '2026-10-18', topics: 91, questions: 1001, live: 11, unpublished: 990,
  unitQuestionCounts: curriculum.map(unit => ({ unit: unit.number, topics: unit.topics.length, questions: unit.topics.length * 11 })),
  preservation: { originalApprovedTen: true, unit6Baseline: baseline, completeBaselineSets: 49, recoveredWorkingQuestions: 29, archiveSha256: recoveryIndex.sha256 },
  limitations: [
    'Structural checks and reproducible arithmetic/model checks do not constitute independent human scientific review.',
    'Human review of difficulty, semantic variety, pedagogical quality and accidental similarity remains pending.',
    'Recovered 1.6 item008 overlaps later spectroscopy arithmetic; retained as valid supplied-relation PES interpretation.',
    'Recovered 1.7 items006/010 and 2.1 polarity items have variety overlap; valid existing work retained.',
    'Topic5.9 supplied fractional/inverse apparent-order examples need human difficulty calibration.',
    'Original full sources for1.2/1.3/2.2/2.3 remain unavailable; current complete sets are new replacement work, not recovered sources.',
  ],
  inventory,
};
const manifestPath = `${root}/BANK_AUDIT.json`;
if (process.argv.includes('--write')) {
  writeFileSync(manifestPath, JSON.stringify(report, null, 2) + '\n');
  console.log(`Wrote ${manifestPath}; this is an inventory, not publication approval.`);
} else {
  assert.deepEqual(read(manifestPath), report, 'Inventory changed: review changes before explicitly refreshing with --write');
}
console.log('PASS: 91 topics × 11 = 1,001; 11 live / 990 unpublished. All 49 baseline sets, 29 recovered objects and original approved ten preserved. See BANK_AUDIT.md for review limits.');
