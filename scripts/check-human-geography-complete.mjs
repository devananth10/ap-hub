// Completion gate, separate from incremental validation so partial batches remain resumable.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateHumanGeographyBank } from './check-human-geography-bank.mjs';
import { practiceEntries, practiceCount } from '../src/lib/practice.ts';
import { courses } from '../src/lib/courses.ts';

const report=validateHumanGeographyBank();
assert.equal(report.completedTopics,68,'All official topics must be complete');
assert.equal(report.questions,748);
assert.deepEqual(report.missing,[]);
assert.deepEqual(report.withheldQuestionIds,[]);
assert.ok(report.stimulusPercent>=35&&report.stimulusPercent<=40);
const course=courses.find(c=>c.id==='human-geography');
assert.deepEqual(course.units.map(u=>u.topics.length),[7,12,8,10,12,11,8]);
const entries=practiceEntries({courseId:course.id});
assert.equal(entries.length,748);
assert.equal(new Set(entries.map(e=>e.id)).size,748);
assert.equal(practiceCount({courseId:course.id}),748);
for(const unit of course.units){
 assert.equal(practiceCount({courseId:course.id,unitNumber:unit.number}),unit.topics.length*11);
 for(const topic of unit.topics){
  const scope={courseId:course.id,unitNumber:unit.number,topicId:topic.id};
  const published=practiceEntries(scope);
  const source=JSON.parse(readFileSync(`src/content/practice/human-geography-${topic.number.replace('.','-')}.json`,'utf8'));
  assert.equal(practiceCount(scope),11);
  assert.equal(published.length,11);
  assert.deepEqual(published.map(e=>e.question),source.questions,'Every source question must be published intact');
  for(const e of published){
   assert.equal(e.course.id,course.id);assert.equal(e.unit.number,unit.number);assert.equal(e.topic.id,topic.id);
   assert.equal(e.question.options.length,4);assert.equal(new Set(e.question.options).size,4);
  }
 }
}
assert.equal(practiceEntries({courseId:'chemistry'}).length,1001);
assert.equal(practiceEntries({courseId:'calculus-ab'}).length,891);
const all=practiceEntries();assert.equal(all.length,2640);assert.equal(new Set(all.map(e=>e.id)).size,2640);
const keys=entries.reduce((a,e)=>(a[e.question.correctIndex]++,a),[0,0,0,0]);
console.log('COMPLETE GEOGRAPHY PASS',JSON.stringify({topics:68,published:748,withheld:0,stimuli:report.stimulusQuestions,stimulusPercent:report.stimulusPercent,evidenceChecks:report.modelChecks,answerPositions:keys,allCoursePublished:all.length,independentHumanReview:false}));
