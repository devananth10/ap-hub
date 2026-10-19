import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {courses} from '../src/lib/courses.ts';
import {practiceEntries,practiceCount,practiceHref} from '../src/lib/practice.ts';
import {questionBatches} from '../src/lib/practice-bank.ts';
import {validateCalculusBank} from '../scripts/check-calculus-bank.mjs';
import {verifyCalculusQuestion,figureLimit,evaluateExpression,numericalOption} from '../scripts/check-calculus-math.mjs';
import {practiceFigures} from '../src/lib/practice-figures.ts';
test('official Calculus AB inventory keeps all eight old IDs and excludes BC-only gaps',()=>{
  const course=courses.find(course=>course.id==='calculus-ab');
  const topics=course.units.flatMap(unit=>unit.topics);
  assert.equal(topics.length,81);assert.equal(new Set(topics.map(topic=>topic.id)).size,81);
  const old=['limits','derivatives','chain-rule','rates','mean-value','integrals','equations','average'];
  course.units.forEach((unit,i)=>assert.equal(unit.topics[0].id,old[i]));
  for(const number of ['6.11','6.12','6.13','7.5','7.9','8.13']) assert.ok(!topics.some(topic=>topic.number===number));
  assert.ok(topics.some(topic=>topic.number==='6.14'));assert.ok(topics.some(topic=>topic.number==='7.8'));
});
test('published Calculus sets pass QA, counts match registry, unfinished topics remain empty and grading is unique',()=>{
  const result=validateCalculusBank();
  const batches=questionBatches.filter(batch=>batch.courseId==='calculus-ab');
  assert.equal(batches.length,result.completedTopics);
  assert.equal(practiceCount({courseId:'calculus-ab'}),result.questions);
  for(const unit of courses.find(course=>course.id==='calculus-ab').units) for(const topic of unit.topics) {
    const scope={courseId:'calculus-ab',unitNumber:unit.number,topicId:topic.id};
    const entries=practiceEntries(scope),batch=batches.find(batch=>batch.topicId===topic.id);
    assert.equal(entries.length,batch?11:0);assert.equal(practiceCount(scope),entries.length);
    assert.ok(practiceHref(scope).includes('course=calculus-ab'));
    for(const entry of entries) {assert.equal(entry.course.id,'calculus-ab');assert.equal(entry.topic.id,topic.id);assert.equal(entry.question.options.filter((_,i)=>i===entry.question.correctIndex).length,1);}
  }
  const index=JSON.parse(readFileSync('src/config/published-practice-index.json','utf8'));
  assert.equal(index.reduce((n,item)=>n+item.count,0),practiceEntries().length);
  assert.equal(practiceEntries({courseId:'chemistry'}).length,1001);
});
test('independent numeric verifier detects altered keys, input data and stale conceptual answers',()=>{
  const batch=questionBatches.find(batch=>batch.courseId==='calculus-ab');assert.ok(batch);
  const qa=JSON.parse(readFileSync('content-drafts/calculus-ab/qa/topic-1-1.json','utf8'));
  const first=batch.questions[0],review=qa.questions[0];
  assert.throws(()=>verifyCalculusQuestion({...first,correctIndex:(first.correctIndex+1)%4},review));
  assert.throws(()=>verifyCalculusQuestion({...first,prompt:'Changed input data.'},review));
  const concept=batch.questions[2];
  assert.throws(()=>verifyCalculusQuestion({...concept,correctIndex:(concept.correctIndex+1)%4},qa.questions[2]));
});
test('original graph models distinguish holes, jumps, endpoints and transformations; stale graphs fail review',()=>{
  assert.equal(figureLimit(practiceFigures['calc-ab-1-3-001'],2),5);
  assert.equal(figureLimit(practiceFigures['calc-ab-1-3-003'],4),'DNE');
  assert.equal(figureLimit(practiceFigures['calc-ab-1-3-007'],-2,'left'),4);
  assert.equal(figureLimit(practiceFigures['calc-ab-1-3-009'],2,'right'),-3);
  const multi=practiceFigures['calc-ab-1-3-011'];
  assert.deepEqual([0,1,2,3].map(x=>figureLimit(multi,x)),['DNE',2,'DNE','DNE']);
  const batch=questionBatches.find(batch=>batch.courseId==='calculus-ab'&&batch.topicId==='topic-1-3');
  const qa=JSON.parse(readFileSync('content-drafts/calculus-ab/qa/topic-1-3.json','utf8'));
  assert.throws(()=>verifyCalculusQuestion(batch.questions[0],{...qa.questions[0],check:{...qa.questions[0].check,figureSha256:'changed'}}),/Graph changed/);
  assert.throws(()=>verifyCalculusQuestion({...batch.questions[7],correctIndex:(batch.questions[7].correctIndex+1)%4},qa.questions[7]),/graph key/);
});
test('table estimates check actual paired data, omit isolated values and reject wrong keys or stale tables',()=>{
  const batch=questionBatches.find(batch=>batch.courseId==='calculus-ab'&&batch.topicId==='topic-1-4');
  const qa=JSON.parse(readFileSync('content-drafts/calculus-ab/qa/topic-1-4.json','utf8'));
  for(const i of [0,1,2,3,4,6,8,9]) verifyCalculusQuestion(batch.questions[i],qa.questions[i]);
  const quotient=batch.questions[8];
  assert.throws(()=>verifyCalculusQuestion({...quotient,correctIndex:(quotient.correctIndex+1)%4},qa.questions[8]),/table estimate key/);
  assert.throws(()=>verifyCalculusQuestion(batch.questions[0],{...qa.questions[0],tableSha256:'changed'}),/Table changed/);
});
test('limit-law verifier checks signs, fractions, roots and domains and catches equivalent alternate answers',()=>{
  assert.equal(numericalOption('7/6'),7/6);assert.equal(numericalOption('−1/3'),-1/3);assert.equal(numericalOption('√9'),3);
  assert.equal(evaluateExpression(['sub',['mul',2,3],['mul',3,-2]]),12);
  assert.throws(()=>evaluateExpression(['sqrt',-1]),/domain/);assert.throws(()=>evaluateExpression(['div',1,0]),/domain/);
  assert.throws(()=>numericalOption('2^3'),/explicit verified parser/);
  const batch=questionBatches.find(batch=>batch.courseId==='calculus-ab'&&batch.topicId==='topic-1-5');
  const qa=JSON.parse(readFileSync('content-drafts/calculus-ab/qa/topic-1-5.json','utf8'));
  for(const [i,equivalent] of [[3,'14/12'],[4,'√9']]) {
    const question=structuredClone(batch.questions[i]);question.options[(question.correctIndex+1)%4]=equivalent;
    assert.throws(()=>verifyCalculusQuestion(question,qa.questions[i]),/must have one numerical answer/);
  }
});
test('algebraic manipulation answers are corroborated from raw punctured expressions, with side disagreements preserved',()=>{
  const batch=questionBatches.find(batch=>batch.courseId==='calculus-ab'&&batch.topicId==='topic-1-6');
  const qa=JSON.parse(readFileSync('content-drafts/calculus-ab/qa/topic-1-6.json','utf8'));
  for(let i=0;i<10;i++) verifyCalculusQuestion(batch.questions[i],qa.questions[i]);
  const fraction=batch.questions[6];assert.equal(fraction.options[fraction.correctIndex],'−1/4');
  assert.throws(()=>verifyCalculusQuestion({...fraction,correctIndex:(fraction.correctIndex+1)%4},qa.questions[6]),/punctured-expression key/);
  const sides=qa.questions[9];
  assert.throws(()=>verifyCalculusQuestion(batch.questions[9],{...sides,check:{...sides.check,allowSideDisagreement:false}}),/Numerical approaches do not agree/);
});
test('procedure selections corroborate their underlying limits and preserve one-sided real domains',()=>{
  const batch=questionBatches.find(batch=>batch.courseId==='calculus-ab'&&batch.topicId==='topic-1-7');
  const qa=JSON.parse(readFileSync('content-drafts/calculus-ab/qa/topic-1-7.json','utf8'));
  for(const i of [0,1,2,3,6,7,8,9,10]) verifyCalculusQuestion(batch.questions[i],qa.questions[i]);
  assert.throws(()=>verifyCalculusQuestion({...batch.questions[0],correctIndex:(batch.questions[0].correctIndex+1)%4},qa.questions[0]),/procedure answer/);
  const right=qa.questions[9];
  assert.throws(()=>verifyCalculusQuestion(batch.questions[9],{...right,check:{...right.check,limitCheck:{...right.check.limitCheck,side:'both'}}}),/domain/);
});
