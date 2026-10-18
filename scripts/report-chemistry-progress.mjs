import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { courses } from '../src/lib/courses.ts';
import { questionBatches, validateQuestionBatches } from '../src/lib/practice-bank.ts';

const root = 'content-drafts/chemistry';
const pending = readdirSync(`${root}/pending`).filter(name => name.endsWith('.json')).map(name => JSON.parse(readFileSync(`${root}/pending/${name}`, 'utf8')));
validateQuestionBatches([...questionBatches, ...pending]);
const videos = JSON.parse(readFileSync(`${root}/research/video-candidates.json`, 'utf8'));
const sourceNeeded = new Set(['1.2', '1.3', '2.2', '2.3']);
const partial = new Set(['1.6', '1.7', '2.1']);
const chemistry = courses.find(course => course.id === 'chemistry');
const asOf = process.argv[2] || new Intl.DateTimeFormat('en-CA', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf)) throw new Error('Use an ISO date for the optional report date.');
const next = chemistry.units.flatMap(unit => unit.topics).find(topic => !questionBatches.some(batch => batch.topicId === topic.id) && !pending.some(batch => batch.topicId === topic.id) && !sourceNeeded.has(topic.number) && !partial.has(topic.number));
const lines = [
  '# AP Chemistry progress checkpoint', '',
  `Updated ${asOf}. This ledger describes saved files, not background work or a claim that the 1,001-question goal is complete.`, '',
  `- Official inventory: 91 topics in nine units; target 1,001 questions (11 per topic).`,
  `- Live approved questions: ${questionBatches.reduce((sum,batch) => sum + batch.questions.length,0)} in Topic 1.1 only. Original 001–010 preserved; owner authorized validated 011.`,
  `- Complete unpublished working sets: ${pending.length}, ${pending.length * 11} questions. These require human scientific review and owner approval; they are not additional live questions.`,
  `- Next new topic without an unavailable-source dependency: ${next ? `${next.number} — ${next.title}, ID \`${next.id}\`` : 'none'}. Earlier unavailable/partial sets still need reconciliation.`,
  '- Topic 1.5 demonstration removed entirely; its page/workspace and student storage keys are preserved. Its pending eleven-question set is separate.',
  '- Recovered originals: three complete sets (1.4, 1.5, 1.8) and fragments (1.6, 1.7, 2.1). Archived unchanged; complete working copies audited separately.',
  '- The fragments contain 29 complete recovered question objects (10/10/9); corrected partial working copies and known scope/variety flags are recorded in `qa/partial-recovery.md`. They are not complete banks and do not count toward complete-topic totals.',
  '- Earlier full drafts for 1.2, 1.3, 2.2, 2.3 and the original import guide remain unavailable. Unavailable does not mean never created. Do not regenerate them by default.',
  '- `CONTENT_IMPORT_GUIDE.md` is newly established from the actual repository: 17 existing IDs preserved, 74 new canonical assignments explicitly recorded.',
  `- Video research: ${videos.videos.length} exact creator-index URLs cover ${videos.coveredTopicCount}/91 topics. ${videos.videos.filter(video => video.providerMetadataVerified && video.creatorIdentityMatched).length} provider metadata checks passed. Every candidate remains pending owner approval; actual playback and embed permission are unverified.`,
  '- Official resource catalog: zero entries, unchanged. No researched video has been published.',
  '', '## Resume order', '',
  '1. Inspect this ledger, Git status, and `VALIDATION.md`; do not replace existing work.',
  '2. Audit any newly supplied unavailable source files before writing replacements. Partial fragments must not be completed by inventing truncated endings.',
  '3. Continue the first `not-started` topic in the table, using its exact registered ID. Read its CED scope and exclusions, write exactly eleven original questions, then do a separate solve/distractor pass and programmatic calculations where appropriate.',
  '4. Save new banks in `pending/`, QA in `qa/`; run the draft/science checks and this report after each batch. Never import pending content without explicit approval.',
  '5. Save coherent local Git checkpoints. The attached continuation limits this task to local commits; it does not authorize pushing or deployment.',
  '', '## Full inventory', '',
  '| Topic | Official name | Internal topicId | Live | Complete pending | Status |',
  '| --- | --- | --- | ---: | ---: | --- |',
];
for (const unit of chemistry.units) for (const topic of unit.topics) {
  const live = questionBatches.find(batch => batch.topicId === topic.id)?.questions.length || 0;
  const draft = pending.find(batch => batch.topicId === topic.id)?.questions.length || 0;
  const status = live ? 'approved-live' : draft ? 'draft; human-review-pending (see QA)' : partial.has(topic.number) ? 'source-fragment; full-set-unavailable' : sourceNeeded.has(topic.number) ? 'earlier-source-unavailable' : 'not-started';
  lines.push(`| ${topic.number} | ${topic.title} | \`${topic.id}\` | ${live} | ${draft} | ${status} |`);
}
lines.push('', '## Checks and provenance', '',
  '- `node --experimental-strip-types scripts/check-question-drafts.mjs`: schema, exact scope/IDs/count, global duplicate IDs, answer-position distribution; dry run only.',
  '- `node scripts/check-chemistry-science.mjs`: separately derived numerical/charge checks; not a substitute for conceptual or human review.',
  '- Per-topic QA documents describe scope, retained/replaced questions, alternate-answer checks, and verification limitations.',
  '- `recovered/index.json` records the source archive path and SHA-256. Source material is unaudited provenance, not a publication registry.',
  '- Curriculum authority and page references: `research/official-topics.json`; exact URL research: `research/video-candidates.json`.',
  '- The 2026–27 course-change overview retains the Fall 2024 CED. June 2026 clarifications do not change the 91-topic inventory.',
  '- Original ten-question comparison and resource catalog preservation are recorded in `qa/topic-1-1.md` and the validation checkpoint.',
  '');
writeFileSync(`${root}/PROGRESS.md`, lines.join('\n'));
console.log(`Progress saved: 91 topics, ${pending.length} complete pending sets; only Topic 1.1 is live.`);
