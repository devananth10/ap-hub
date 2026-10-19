import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { courses } from '../src/lib/courses.ts';
import { validateQuestionBatches } from '../src/lib/practice-bank.ts';
import { verifyCalculusQuestion } from './check-calculus-math.mjs';
import {practiceFigures} from '../src/lib/practice-figures.ts';
const read=file=>JSON.parse(readFileSync(file,'utf8'));
export const semanticHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function validateCalculusBank() {
  const inventory=read('content-drafts/calculus-ab/research/official-topics.json');
  const course=courses.find(course=>course.id==='calculus-ab');
  assert.deepEqual(course.units.map(unit=>unit.topics.length),[16,10,6,7,12,11,7,12]);
  assert.equal(inventory.inventory.length,81);assert.equal(inventory.targetQuestions,891);
  assert.deepEqual(course.units.flatMap(unit=>unit.topics.map(topic=>[unit.number,topic.number,topic.id,topic.title])),inventory.inventory.map(topic=>[topic.unitNumber,topic.topicNumber,topic.topicId,topic.topicTitle]));
  const files=readdirSync('src/content/practice').filter(file=>file.startsWith('calculus-ab-')&&file.endsWith('.json'));
  const batches=validateQuestionBatches(files.map(file=>read('src/content/practice/'+file)));
  const prompts=new Set(),topics=new Set(),structures=new Map();let questions=0,numeric=0;const rows=[];
  for(const batch of batches) {
    assert.equal(batch.courseId,'calculus-ab');
    const topic=inventory.inventory.find(topic=>topic.topicId===batch.topicId);
    assert.ok(topic && topic.unitNumber===batch.unitNumber);assert.ok(!topics.has(topic.topicId));topics.add(topic.topicId);
    const qa=read(`content-drafts/calculus-ab/qa/topic-${topic.topicNumber.replace('.','-')}.json`);
    assert.equal(qa.status,'passed');assert.equal(qa.humanReviewPerformed,false);
    assert.equal(qa.semanticSha256,semanticHash(batch),'Content changed after verification: '+topic.topicNumber);
    assert.equal(qa.questions.length,11);
    const keys=new Set();
    batch.questions.forEach((question,i)=>{
      assert.equal(question.id,`calc-ab-${topic.topicNumber.replace('.','-')}-${String(i+1).padStart(3,'0')}`);
      const normalized=question.prompt.normalize('NFKC').replace(/\s+/g,' ').trim();
      assert.ok(!prompts.has(normalized),'Duplicate prompt: '+question.id);prompts.add(normalized);
      const skeleton=normalized.replace(/[−-]?\d+(?:\.\d+)?/g,'#');
      structures.set(skeleton,[...(structures.get(skeleton)||[]),question.id]);
      assert.ok(!/\\(?:frac|lim|int|begin|end)|\$\$|https?:\/\//.test(question.prompt+question.options.join('')+question.explanation),'Unsupported raw notation/dependency: '+question.id);
      for(const letter of ['A','B','C','D']) assert.ok(question.explanation.includes(letter+':'),question.id+' needs explanation for every choice');
      assert.ok(question.explanation.length>240,question.id+' needs a complete explanation');
      const review=qa.questions.find(item=>item.questionId===question.id);assert.ok(review);
      if(question.prompt.includes('graph below')) {
        const figure=practiceFigures[question.id];assert.ok(figure,question.id+' missing graph');
        assert.ok(figure.description.length>50);
        assert.ok(figure.xRange[0]<=0 && figure.xRange[1]>=0 && figure.yRange[0]<=0 && figure.yRange[1]>=0,'Graph must show origin accurately');
        for(const curve of figure.curves) {
          assert.ok(curve.points.length>=2);
          curve.points.forEach(([x,y],i)=>{assert.ok(Number.isFinite(x)&&Number.isFinite(y));assert.ok(x>=figure.xRange[0]&&x<=figure.xRange[1]&&y>=figure.yRange[0]&&y<=figure.yRange[1]);if(i)assert.ok(x>curve.points[i-1][0]);});
        }
      }
      verifyCalculusQuestion(question,review);numeric+=Number(review.check.type!=='reasoning');keys.add(question.correctIndex);questions++;
    });
    assert.ok(keys.size>=3,topic.topicNumber+' vary correct positions');
    assert.ok(qa.varietyReview && qa.scopeReview && qa.repetitionReview);
    rows.push({topic:topic.topicNumber,topicId:topic.topicId,count:11,status:'validated',file:topic.file});
  }
  rows.sort((a,b)=>Number(a.topic.split('.')[0])-Number(b.topic.split('.')[0])||Number(a.topic.split('.')[1])-Number(b.topic.split('.')[1]));
  return {officialTopics:81,targetQuestions:891,completedTopics:rows.length,questions,numeric,repeatedPromptPatterns:[...structures.values()].filter(ids=>ids.length>1),topics:rows,missing:inventory.inventory.filter(topic=>!topics.has(topic.topicId)).map(topic=>topic.topicNumber)};
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/check-calculus-bank.mjs')) {
  const result=validateCalculusBank();
  if(process.argv.includes('--write')) writeFileSync('content-drafts/calculus-ab/VALIDATION.json',JSON.stringify(result,null,2)+'\n');
  console.log(`STRUCTURE PASS: ${result.completedTopics}/81 topics, ${result.questions}/891 MCQs; ${result.missing.length} topics missing. Missing sets are not counted as placeholders.`);
}
