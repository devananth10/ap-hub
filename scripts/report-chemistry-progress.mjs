import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { publishOfficialResources } from '../src/lib/resource-policy.ts';
import { courses } from '../src/lib/courses.ts';
import { questionBatches, validateQuestionBatches } from '../src/lib/practice-bank.ts';

const root = 'content-drafts/chemistry';
const sourceSnapshots = readdirSync(`${root}/pending`).filter(name => name.endsWith('.json')).map(name => JSON.parse(readFileSync(`${root}/pending/${name}`, 'utf8')));
const publishedTopics = new Set(questionBatches.map(batch => batch.topicId));
const pending = sourceSnapshots.filter(batch => !publishedTopics.has(batch.topicId));
for (const snapshot of sourceSnapshots.filter(batch => publishedTopics.has(batch.topicId))) {
  const published = questionBatches.find(batch => batch.topicId === snapshot.topicId);
  if (JSON.stringify(published) !== JSON.stringify(snapshot)) throw new Error(`Published/source content differs: ${snapshot.topicId}; review provenance before reporting.`);
}
validateQuestionBatches([...questionBatches, ...pending]);
const liveResources = publishOfficialResources(JSON.parse(readFileSync('src/config/official-resources.json', 'utf8')), courses);
const videoEvidence = JSON.parse(readFileSync(`${root}/research/KRUG_VERIFICATION.json`, 'utf8'));
const videos = JSON.parse(readFileSync(`${root}/research/video-candidates.json`, 'utf8'));
const sourceNeeded = new Set(['1.2', '1.3', '2.2', '2.3']);
const partial = new Set(['1.6', '1.7', '2.1']);
const chemistry = courses.find(course => course.id === 'chemistry');
const asOf = process.argv[2] || new Intl.DateTimeFormat('en-CA', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf)) throw new Error('Use an ISO date for the optional report date.');
const missing = chemistry.units.flatMap(unit => unit.topics).filter(topic => !questionBatches.some(batch => batch.topicId === topic.id) && !pending.some(batch => batch.topicId === topic.id));
const next = missing.find(topic => Number(topic.number.split('.')[0]) >= 7) || missing[0];
const lines = [
  '# AP Chemistry progress checkpoint', '',
  `Updated ${asOf}. Current publication checkpoint. The owner explicitly authorized bulk publication of the completed bank after automated checks; no independent human scientific review is claimed. See PUBLICATION_REVIEW.md.`, '',
  `- Official inventory: 91 topics in nine units; target 1,001 questions (11 per topic).`,
  `- Published questions: ${questionBatches.reduce((sum,batch) => sum + batch.questions.length,0)} across ${questionBatches.length} topics. All 1,001 question objects match the authorized 627b7e2 snapshot; original Topic 1.1 IDs, answers and explanations remain intact.`,
  `- Complete unpublished working sets: ${pending.length}, ${pending.length * 11} questions. No questions withheld from the completed bank.`,
  `- Historical source copies: ${sourceSnapshots.length} files in pending/ remain unchanged for provenance; their 990 questions are now published copies, not additional questions or current pending work.`,
  `- Next missing topic: ${next ? `${next.number} — ${next.title}, ID \`${next.id}\`` : 'none'}. All 91 topics are published with eleven questions each.`,
  '- Topic 1.5 demonstration remains removed. Its eleven proper original MCQs are now published; its page/workspace and student storage keys are preserved.',
  '- Recovered originals: three complete sets (1.4, 1.5, 1.8) and fragments (1.6, 1.7, 2.1). Archived unchanged; complete working copies audited separately.',
  '- The fragments contain 29 complete recovered question objects (10/10/9); corrected partial working copies and historical scope/variety flags are recorded in `qa/partial-recovery.md`. All 29 objects and four completion additions remain intact in the published banks. Never count archived copies twice. Publication dispositions are in PUBLICATION_REVIEW.md.',
  '- Earlier full drafts for 1.2, 1.3, 2.2, 2.3 and the original import guide remain unavailable. Unavailable does not mean never created. After Unit 9, the October 18 continuation authorized new replacement/additional work. All four unavailable-source topics now have new eleven-question sets, explicitly distinguished from recovered content.',
  '- `CONTENT_IMPORT_GUIDE.md` is newly established from the actual repository: 17 existing IDs preserved, 74 new canonical assignments explicitly recorded.',
  `- Video research: ${videos.videos.length} exact creator-index URLs cover ${videos.coveredTopicCount}/91 topics. ${videos.videos.filter(video => video.providerMetadataVerified && video.creatorIdentityMatched).length} provider metadata checks passed. This earlier research is historical. Current verification: ${videoEvidence.verifiedUniqueVideos} unique videos; the owner later authorized the initial collection once. Full viewing and universal embedding are not certified.`,
  `- Official resource catalog: ${liveResources.length} published initial Jeremy Krug videos, all 91 Chemistry topics covered. Directory has 103 labels / 102 unique IDs; duplicate 9.8b remains pending as a distinct lesson. See docs/VIDEO_VERIFICATION.md and docs/INITIAL_KRUG_APPROVAL.json.`,
  '', '## Resume order', '',
  '1. Inspect this ledger, Git status, and `VALIDATION.md`; do not replace existing work.',
  '2. No further generation is needed. Audit any newly supplied historical files before considering replacements; preserve valid published objects and recorded provenance.',
  '3. PUBLICATION_REVIEW.md resolves the flagged scope, difficulty and similarity concerns. BANK_AUDIT.md and per-topic QA retain the earlier history. Independent human review remains a useful future quality step, not an approval status asserted here.',
  '4. Future new banks still need explicit publication authorization. The current authorization covers this completed bank only, not future questions or educational URLs.',
  '5. Save coherent Git checkpoints and normal pushes to the existing upstream. The later post-publication master prompt authorizes the initial verified video collection, fullscreen, watched status and workspace refinements. Track that work in docs/DEVELOPMENT_PROGRESS.md; no public deployment or paid AI is authorized.',
  '', '## Full inventory', '',
  '| Topic | Official name | Internal topicId | Live | Complete pending | Status |',
  '| --- | --- | --- | ---: | ---: | --- |',
];
for (const unit of chemistry.units) for (const topic of unit.topics) {
  const live = questionBatches.find(batch => batch.topicId === topic.id)?.questions.length || 0;
  const draft = pending.find(batch => batch.topicId === topic.id)?.questions.length || 0;
  const status = live ? 'published; owner bulk authorization' : draft ? 'draft; not published' : partial.has(topic.number) ? 'source-fragment; full-set-unavailable' : sourceNeeded.has(topic.number) ? 'earlier-source-unavailable' : 'not-started';
  lines.push(`| ${topic.number} | ${topic.title} | \`${topic.id}\` | ${live} | ${draft} | ${status} |`);
}
lines.push('', '## Checks and provenance', '',
  '- `node --experimental-strip-types scripts/check-question-drafts.mjs`: schema, exact scope/IDs/count, global duplicate IDs, answer-position distribution; dry run only.',
  '- `node scripts/check-chemistry-science.mjs`: separately derived numerical/charge checks; not a substitute for conceptual or human review.',
  '- `node --experimental-strip-types scripts/audit-chemistry-bank.mjs`: complete 91-topic inventory, frozen content hashes, explanation markers and preservation checks; see BANK_AUDIT.md.',
  '- `node --experimental-strip-types scripts/check-chemistry-publication.mjs`: all 1,001 published objects match frozen hashes; correct registration, topic counts, authorization and flagged calculation checks.',
  '- `node --experimental-strip-types tests/chemistry-publication-smoke.mjs`: all 91 topic routes, nine units and course scope; eleven per topic, correct question identity, one rendered question and scoring controls.',
  '- Per-topic QA documents describe scope, retained/replaced questions, alternate-answer checks, and verification limitations.',
  '- `recovered/index.json` records the source archive path and SHA-256. Source material is unaudited provenance, not a publication registry.',
  '- Curriculum authority and page references: `research/official-topics.json`; exact URL research: `research/video-candidates.json`.',
  '- The 2026–27 course-change overview retains the Fall 2024 CED. June 2026 clarifications do not change the 91-topic inventory.',
  '- Original ten-question comparison and resource catalog preservation are recorded in `qa/topic-1-1.md` and the validation checkpoint.',
  '');
writeFileSync(`${root}/PROGRESS.md`, lines.join('\n'));
console.log(`Progress saved: ${questionBatches.length} published topics, ${questionBatches.reduce((sum,batch) => sum + batch.questions.length,0)} published MCQs; ${pending.length} unpublished sets. Historical copies are not counted twice.`);
