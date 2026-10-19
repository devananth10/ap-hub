import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {courses} from '../src/lib/courses.ts';
import {practiceEntries,practiceCount,practiceHref} from '../src/lib/practice.ts';
import {questionBatches} from '../src/lib/practice-bank.ts';
import {validateCalculusBank} from '../scripts/check-calculus-bank.mjs';
import {verifyCalculusQuestion,figureLimit,evaluateExpression,numericalOption,rationalBehavior,rationalPoleSides,intervalOption,domainMatches} from '../scripts/check-calculus-math.mjs';
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
test('squeeze checks compare both bounding limits, enforce their order and reject altered answers',()=>{
  const batch=questionBatches.find(batch=>batch.courseId==='calculus-ab'&&batch.topicId==='topic-1-8');
  const qa=JSON.parse(readFileSync('content-drafts/calculus-ab/qa/topic-1-8.json','utf8'));
  for(let i=0;i<11;i++) verifyCalculusQuestion(batch.questions[i],qa.questions[i]);
  const question=batch.questions[0],review=qa.questions[0];
  assert.throws(()=>verifyCalculusQuestion({...question,correctIndex:(question.correctIndex+1)%4},review),/squeeze key/);
  assert.throws(()=>verifyCalculusQuestion(question,{...review,check:{...review.check,upper:4}}),/bounding limits disagree/);
  assert.throws(()=>verifyCalculusQuestion(question,{...review,check:{...review.check,lower:review.check.upper,upper:review.check.lower}}),/lower bound exceeds/);
});
test('cross-representation checks use graph input/output transformations and verify rounded formula tables',()=>{
  const batch=questionBatches.find(batch=>batch.courseId==='calculus-ab'&&batch.topicId==='topic-1-9');
  const qa=JSON.parse(readFileSync('content-drafts/calculus-ab/qa/topic-1-9.json','utf8'));
  const q=batch.questions[7],r=qa.questions[7];verifyCalculusQuestion(q,r);
  assert.throws(()=>verifyCalculusQuestion(q,{...r,check:{...r.check,outputOffset:0}}),/unique graph-based result|graph key/);
  const tables=JSON.parse(readFileSync('src/content/practice-tables/calculus-ab.json','utf8'));
  for(const [sx,sy] of tables['calc-ab-1-9-009'].rows) {
    const x=Number(sx.replace('−','-'));if(x!==0)assert.ok(Math.abs(1/(Math.sqrt(9+x)+3)-Number(sy))<0.00000051);
  }
});
test('rational discontinuities distinguish removable roots from remaining poles and unequal multiplicities',()=>{
  assert.deepEqual(rationalBehavior([1,-2,1],[1,1,-2],1),{kind:'Removable discontinuity',limit:0});
  assert.deepEqual(rationalBehavior([1,-2],[1,-4,4],2),{kind:'Infinite discontinuity',limit:'unbounded'});
  assert.deepEqual(rationalBehavior([1,-1,-6],[1,0,-4],-2),{kind:'Removable discontinuity',limit:5/4});
  assert.equal(rationalBehavior([1,-1,-6],[1,0,-4],2).kind,'Infinite discontinuity');
  const batch=questionBatches.find(batch=>batch.courseId==='calculus-ab'&&batch.topicId==='topic-1-10');
  const qa=JSON.parse(readFileSync('content-drafts/calculus-ab/qa/topic-1-10.json','utf8'));
  assert.throws(()=>verifyCalculusQuestion({...batch.questions[5],correctIndex:(batch.questions[5].correctIndex+1)%4},qa.questions[5]),/classification key/);
  assert.throws(()=>verifyCalculusQuestion(batch.questions[0],{...qa.questions[0],check:{...qa.questions[0].check,numerator:[1,1,-9]}}),/rational limit/);
});
test('interval-domain checks distinguish open, closed, missing and extra boundaries across every sign cell',()=>{
  assert.equal(domainMatches(intervalOption('[−4,∞)'),[{coefficients:[1,4],relation:'>='}]),true);
  assert.equal(domainMatches(intervalOption('(−4,∞)'),[{coefficients:[1,4],relation:'>='}]),false);
  assert.equal(domainMatches(intervalOption('[2,∞)'),[{coefficients:[1,-2],relation:'>'}]),false);
  assert.equal(domainMatches(intervalOption('(−∞,−2) ∪ (2,∞)'),[{coefficients:[1,0,-4],relation:'>'}]),true);
  assert.equal(domainMatches(intervalOption('(−∞,−2] ∪ [2,∞)'),[{coefficients:[1,0,-4],relation:'>'}]),false);
  assert.equal(domainMatches(intervalOption('(−∞,−3) ∪ (−3,2) ∪ (2,∞)'),[{coefficients:[1,0,-9],relation:'!='}]),false);
  assert.throws(()=>intervalOption('[−∞,3)'),/Invalid interval/);
  const batch=questionBatches.find(batch=>batch.courseId==='calculus-ab'&&batch.topicId==='topic-1-12');
  const qa=JSON.parse(readFileSync('content-drafts/calculus-ab/qa/topic-1-12.json','utf8'));
  assert.throws(()=>verifyCalculusQuestion({...batch.questions[9],correctIndex:(batch.questions[9].correctIndex+1)%4},qa.questions[9]),/domain key/);
});
test('pole-side signs follow exact residual multiplicity, not large finite samples',()=>{
  assert.deepEqual(rationalPoleSides([2,-1],[1,1],-1),{left:'+∞',right:'−∞'});
  assert.deepEqual(rationalPoleSides([-5],[1,-6,9],3),{left:'−∞',right:'−∞'});
  assert.deepEqual(rationalPoleSides([1,-1],[1,-3,3,-1],1),{left:'+∞',right:'+∞'});
  assert.throws(()=>rationalPoleSides([1,-1],[1,-1],1),/No rational pole/);
  assert.equal(numericalOption('−∞'),-Infinity);
  const batch=questionBatches.find(batch=>batch.courseId==='calculus-ab'&&batch.topicId==='topic-1-14');
  const qa=JSON.parse(readFileSync('content-drafts/calculus-ab/qa/topic-1-14.json','utf8'));
  assert.throws(()=>verifyCalculusQuestion({...batch.questions[1],correctIndex:(batch.questions[1].correctIndex+1)%4},qa.questions[1]),/pole sign key/);
});
