// A dry run only. Nothing here registers questions or publishes resources.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { validateQuestionBatches, questionBatches } from '../src/lib/practice-bank.ts';
import { findTopic } from '../src/lib/courses.ts';

const directory = 'content-drafts/chemistry/pending';
const files = existsSync(directory) ? readdirSync(directory).filter(file => file.endsWith('.json')).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})) : [];
const drafts = files.map(file => JSON.parse(readFileSync(`${directory}/${file}`, 'utf8')));
validateQuestionBatches([...questionBatches, ...drafts]);
const prompts = new Map();
for (const batch of [...questionBatches, ...drafts]) for (const question of batch.questions) {
  // Preserve case: Co and CO have different chemical meanings.
  const normalized = question.prompt.normalize('NFKC').replace(/\s+/g,' ').trim();
  if (prompts.has(normalized)) throw new Error(`Duplicate prompt: ${question.id} and ${prompts.get(normalized)}`);
  prompts.set(normalized,question.id);
}
for (const [index, batch] of drafts.entries()) {
  const { topic } = findTopic(batch.courseId, batch.topicId);
  if (!existsSync(`content-drafts/chemistry/qa/topic-${topic.number.replace('.','-')}.md`)) throw new Error(`Missing scope/QA record for ${topic.number}`);
  const prefix = `chem-${topic.number.replace('.', '-')}-`;
  batch.questions.forEach((question, i) => {
    if (question.id !== `${prefix}${String(i + 1).padStart(3, '0')}`) throw new Error(`Unexpected ordered ID: ${question.id}`);
  });
  const counts = [0, 1, 2, 3].map(answer => batch.questions.filter(question => question.correctIndex === answer).length);
  if (counts.some(count => count < 2 || count > 3)) throw new Error(`Unbalanced answer positions: ${files[index]}`);
  console.log(`${topic.number}: 11 structurally valid unpublished questions; A/B/C/D=${counts.join('/')}`);
}
console.log(`Draft validation passed: ${drafts.length} batches, ${drafts.length * 11} questions; no normalized exact prompt duplicates and a QA record for each topic. Scientific review and owner approval are separate requirements.`);
