// Establish explicit project mappings: preserve every existing ID, assign new
// number-based IDs only for topics that have never been registered in this repo.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { courses } from '../src/lib/courses.ts';
// This is the initial migration, not a tool for regenerating stable IDs.
if (readFileSync('src/lib/courses.ts', 'utf8').includes('units: chemistryUnits')) {
  console.log('Curriculum is already registered; preserving its IDs and import guide.');
  process.exit(0);
}
const chemistry = courses.find(course => course.id === 'chemistry');
const official = JSON.parse(readFileSync('content-drafts/chemistry/research/official-topics.json','utf8'));
const old = new Map(chemistry.units.flatMap(unit => unit.topics.map(topic => [topic.number, topic])));
const existing = new Set(old.keys());
const units = chemistry.units.map(unit => ({...unit, topics: official.topics.filter(topic => Number(topic.number.split('.')[0]) === unit.number).map(topic => ({
  id: old.get(topic.number)?.id || `topic-${topic.number.replace('.', '-')}`,
  number: topic.number, title: topic.title, ...(old.get(topic.number)?.ready ? {ready:true} : {})
}))}));
const ids = units.flatMap(unit => unit.topics.map(topic => topic.id));
if (ids.length !== 91 || new Set(ids).size !== 91) throw new Error('Invalid curriculum');
mkdirSync('src/config',{recursive:true});
writeFileSync('src/config/chemistry-curriculum.json', JSON.stringify(units,null,2)+'\n');
const path = 'src/lib/courses.ts';
let source = readFileSync(path,'utf8');
const start=source.indexOf('    units: [');
const end=source.indexOf('  { id: "biology"');
if(start<0 || end<start) throw new Error('Refusing an unexpected source structure');
source=source.slice(0,start)+'    units: chemistryUnits,\n  },\n'+source.slice(end);
source='import chemistryUnits from "../config/chemistry-curriculum.json" with { type: "json" };\n'+source;
writeFileSync(path,source);
const lines=['# PrepAtlas content import guide','',
  'Created 2026-10-17 from the actual project and the official 2026–27 Chemistry framework. This is the project mapping registry, not a recovered historical guide.',
  '', 'The existing 17 topic IDs are preserved. The other 74 topics were not registered before this audit: their new canonical IDs are explicitly assigned as `topic-<unit>-<topic>`. These assignments do not assert that older unavailable drafts used those IDs. Translate an old draft only after matching its official number and recording the conversion.',
  '', '## Question files and publication','',
  '- Approved application banks: `src/content/practice/`; publication registry: `src/lib/practice-bank.ts`.',
  '- Unpublished working questions: `content-drafts/chemistry/pending/`; never import this directory into application components.',
  '- One JSON object per file: only `courseId`, `unitNumber`, `topicId`, `questions`.',
  '- Question fields: only `id`, `prompt`, `options`, `correctIndex`, `explanation`.',
  '- IDs: `chem-<unit>-<topic>-001` through `011`; four distinct options; answer index 0–3. Every new complete set has exactly eleven questions.',
  '- Human scientific review is pending for new drafts. Do not register them for students without explicit approval.',
  '- The owner separately authorized one validated addition to the preserved ten Topic 1.1 questions and removal of the Topic 1.5 demo on 2026-10-17.',
  '- No general upload/import dashboard exists. Draft validation is a dry run; registration in the approved module is the publication operation.',
  '', '## Exact Chemistry mappings','', '| Topic | Official name | topicId | Mapping origin |','| --- | --- | --- | --- |'];
for(const unit of units) for(const topic of unit.topics) lines.push(`| ${topic.number} | ${topic.title} | \`${topic.id}\` | ${existing.has(topic.number) ? 'preserved existing ID' : 'new canonical assignment'} |`);
lines.push('', '## Curriculum sources','',
  '- https://apcentral.collegeboard.org/courses/how-ap-develops-courses-and-exams/course-changes-overview',
  '- https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf',
  '- https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description-clarifications.pdf',
  '', 'Accessed 2026-10-17. Fall 2024 CED applies in 2026–27. June 2026 clarifications concern front matter, resource references, and Progress Check wording; they do not introduce a different Chemistry topic inventory.');
writeFileSync('CONTENT_IMPORT_GUIDE.md',lines.join('\n')+'\n');
console.log('Registered 91 Chemistry topics. Preserved 17 IDs; explicitly assigned 74 new IDs. Other courses unchanged.');
