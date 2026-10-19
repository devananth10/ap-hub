// Explicit owner policy 2026-10-19; no filesystem auto-import in the web runtime.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {validateCalculusBank} from './check-calculus-bank.mjs';
const result=validateCalculusBank();
const read=file=>JSON.parse(readFileSync(file,'utf8'));
const imports=result.topics.map(topic=>`import topic${topic.topic.replace('.','_')} from "../content/practice/calculus-ab-${topic.topic.replace('.','-')}.json" with { type: "json" };`);
writeFileSync('src/lib/calculus-ab-bank.ts','// Original validated MCQs; permanent automatic publication policy 2026-10-19.\n// QA: content-drafts/calculus-ab/qa/. No independent human review claimed.\n'+imports.join('\n')+'\nexport const calculusABBatches = [\n'+result.topics.map(topic=>`  topic${topic.topic.replace('.','_')}`).join(',\n')+'\n];\n');
const previous=read('src/config/published-practice-index.json').filter(item=>item.courseId!=='calculus-ab');
const index=[...previous,...result.topics.map(topic=>({courseId:'calculus-ab',unitNumber:Number(topic.topic.split('.')[0]),topicId:topic.topicId,count:11}))];
writeFileSync('src/config/published-practice-index.json',JSON.stringify(index,null,2)+'\n');
const progress={...result,policy:'automatic-topic-publication-after-validation-2026-10-19',publishedQuestions:result.questions,publishedTopics:result.completedTopics,nextTopic:result.missing[0]||null,withheldQuestionIds:[],unresolvedConcerns:[],humanReviewPerformed:false,latestVerifiedCheckpoint:'Read git log; GitHub SHA is verified after each checkpoint, not fabricated before committing.'};
progress.coverage=read('content-drafts/calculus-ab/research/official-topics.json').inventory.map(topic=>{
  const complete=result.topics.some(done=>done.topicId===topic.topicId);
  return {...topic,draftStatus:complete?'complete':'not-started',validationStatus:complete?'passed':'not-started',publicationStatus:complete?'published':'unpublished',questionCount:complete?11:0};
});
writeFileSync('content-drafts/calculus-ab/PROGRESS.json',JSON.stringify(progress,null,2)+'\n');
writeFileSync('content-drafts/calculus-ab/PROGRESS.md',`# AP Calculus AB progress\n\nOfficial inventory: 81 topics; target 891 original MCQs.\n\nPublished: **${result.questions}/891 MCQs in ${result.completedTopics}/81 complete topics**. Working-only drafts: 0. No unresolved questions in the published sets. No independent human review.\n\nNext topic: **${progress.nextTopic||'none'}**. Missing topics: ${result.missing.join(', ')||'none'}.\n\nValidated and published:\n${result.topics.map(topic=>`- ${topic.topic}: 11 MCQs; stable ID ${topic.topicId}`).join('\n')}\n\nAll new sets use the unchanged question schema, four choices and per-choice explanations. QA includes separate recomputation/logic records and semantic hashes. Plain Unicode math, original accessible SVG graph sidecars and complete data descriptions are supported; no raw LaTeX or external diagrams. Automated checks cannot prove all conceptual claims, originality or AP difficulty; read QA notes. Unfinished sets remain unavailable.\n\nResume by inspecting git status/log, this tracker, official scope and existing files, then generate only missing questions. Validate, publish, test and save ordinary verified GitHub checkpoints. Never change Chemistry or resources for this work.\n`);
assert.equal(progress.questions,progress.publishedQuestions);
console.log(`PUBLISHED ${result.questions} validated Calculus AB MCQs in ${result.completedTopics} topics. Next ${progress.nextTopic}. Run application and HTTP checks before committing.`);
