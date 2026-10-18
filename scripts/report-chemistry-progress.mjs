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
const missing = chemistry.units.flatMap(unit => unit.topics).filter(topic => !questionBatches.some(batch => batch.topicId === topic.id) && !pending.some(batch => batch.topicId === topic.id));
const next = missing.find(topic => Number(topic.number.split('.')[0]) >= 7) || missing[0];
const lines = [
  '# AP Chemistry progress checkpoint', '',
  `Updated ${asOf}. This ledger describes saved files. Complete draft coverage is distinct from human scientific review and publication approval.`, '',
  `- Official inventory: 91 topics in nine units; target 1,001 questions (11 per topic).`,
  `- Live approved questions: ${questionBatches.reduce((sum,batch) => sum + batch.questions.length,0)} in Topic 1.1 only. Original 001–010 preserved; owner authorized validated 011.`,
  `- Complete unpublished working sets: ${pending.length}, ${pending.length * 11} questions. These require human scientific review and owner approval; they are not additional live questions.`,
  `- Next topic in the owner-authorized completion order: ${next ? `${next.number} — ${next.title}, ID \`${next.id}\`` : 'none'}. All topics are complete when no next topic is listed; use BANK_AUDIT.md for remaining review items.`,
  '- Topic 1.5 demonstration removed entirely; its page/workspace and student storage keys are preserved. Its pending eleven-question set is separate.',
  '- Recovered originals: three complete sets (1.4, 1.5, 1.8) and fragments (1.6, 1.7, 2.1). Archived unchanged; complete working copies audited separately.',
  '- The fragments contain 29 complete recovered question objects (10/10/9); corrected partial working copies and known scope/variety flags are recorded in `qa/partial-recovery.md`. Those historical partial files remain unchanged; all 29 objects are retained in complete pending banks with four newly written additions. Count only the pending banks, never the archived duplicates.',
  '- Earlier full drafts for 1.2, 1.3, 2.2, 2.3 and the original import guide remain unavailable. Unavailable does not mean never created. After Unit 9, the October 18 continuation authorized new replacement/additional work. All four unavailable-source topics now have new eleven-question sets, explicitly distinguished from recovered content.',
  '- `CONTENT_IMPORT_GUIDE.md` is newly established from the actual repository: 17 existing IDs preserved, 74 new canonical assignments explicitly recorded.',
  `- Video research: ${videos.videos.length} exact creator-index URLs cover ${videos.coveredTopicCount}/91 topics. ${videos.videos.filter(video => video.providerMetadataVerified && video.creatorIdentityMatched).length} provider metadata checks passed. Every candidate remains pending owner approval; actual playback and embed permission are unverified.`,
  '- Official resource catalog: zero entries, unchanged. No researched video has been published.',
  '', '## Resume order', '',
  '1. Inspect this ledger, Git status, and `VALIDATION.md`; do not replace existing work.',
  '2. Audit any newly supplied unavailable source files before writing replacements. Preserve valid recovered questions. Newly written missing questions must be identified as new work, never recovered endings.',
  '3. All 91 topics now have complete sets. Review BANK_AUDIT.md and per-topic QA for scientific/editorial follow-up; do not generate extra questions beyond 11 per topic.',
  '4. Save new banks in `pending/`, QA in `qa/`; run the draft/science checks and this report after each batch. Never import pending content without explicit approval.',
  '5. Save coherent Git checkpoints and normal pushes to the existing upstream under the current owner-provided AGENTS.md milestone workflow. This later instruction supersedes the older handoff no-push restriction. Pushing drafts is not publication approval; do not deploy or register them.',
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
  '- `node --experimental-strip-types scripts/audit-chemistry-bank.mjs`: complete 91-topic inventory, frozen content hashes, explanation markers and preservation checks; see BANK_AUDIT.md.',
  '- Per-topic QA documents describe scope, retained/replaced questions, alternate-answer checks, and verification limitations.',
  '- `recovered/index.json` records the source archive path and SHA-256. Source material is unaudited provenance, not a publication registry.',
  '- Curriculum authority and page references: `research/official-topics.json`; exact URL research: `research/video-candidates.json`.',
  '- The 2026–27 course-change overview retains the Fall 2024 CED. June 2026 clarifications do not change the 91-topic inventory.',
  '- Original ten-question comparison and resource catalog preservation are recorded in `qa/topic-1-1.md` and the validation checkpoint.',
  '');
writeFileSync(`${root}/PROGRESS.md`, lines.join('\n'));
console.log(`Progress saved: 91 topics, ${pending.length} complete pending sets; only Topic 1.1 is live.`);
