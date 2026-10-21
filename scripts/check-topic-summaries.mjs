import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {courses} from '../src/lib/courses.ts';
import {topicSummaryCatalog,summaryHash,getTopicSummary} from '../src/lib/topic-summaries.ts';
import {validateTopicSummary,summaryWordCount} from '../src/lib/topic-summary-policy.ts';

const ids=new Set(),texts=new Set(),counts={},next={};
for(const s of topicSummaryCatalog){
 const key=s.courseId+'/'+s.topicId;assert.ok(!ids.has(key),'Duplicate summary '+key);ids.add(key);
 assert.deepEqual(validateTopicSummary(s,courses),[],key);
 assert.equal(summaryHash(s),s.validation.contentHash,'Changed/unsealed revision '+key);
 assert.ok(!texts.has(s.overview),'Duplicate overview '+key);texts.add(s.overview);
 assert.equal(s.status,'published','Do not silently count drafts as completed');
 assert.equal(getTopicSummary(s.courseId,s.topicId),s,'Published access gate '+key);
 counts[s.courseId]=(counts[s.courseId]||0)+1;
 console.log(`PASS ${key} (${s.topicNumber}; ${summaryWordCount(s)} words; ${s.validation.checks.length} numerical checks)`);
}
for(const id of ['chemistry','calculus-ab','human-geography']){
 const topics=courses.find(c=>c.id===id).units.flatMap(u=>u.topics);
 next[id]=topics.find(t=>!getTopicSummary(id,t.id))?.number||null;
 counts[id]??=0;
}
const total=Object.values(counts).reduce((a,b)=>a+b,0);
assert.equal(courses.filter(c=>Object.keys(counts).includes(c.id)).flatMap(c=>c.units.flatMap(u=>u.topics)).length,240);
const progress={updated:'2026-10-21',target:240,published:total,remaining:240-total,counts,next,independentHumanReview:false};
if(process.argv.includes('--complete')){
 assert.equal(total,240,'Complete-course audit requires all 240 summaries');
 for(const id of ['chemistry','calculus-ab','human-geography'])assert.equal(counts[id],courses.find(c=>c.id===id).units.flatMap(u=>u.topics).length,'Full canonical coverage '+id);
}
if(process.argv.includes('--write')){
 writeFileSync('content-drafts/topic-summaries/PROGRESS.json',JSON.stringify(progress,null,2)+'\n');
 const inventory=topicSummaryCatalog.map(s=>({courseId:s.courseId,topicId:s.topicId,topicNumber:s.topicNumber,unitNumber:s.unitNumber,title:s.title,words:summaryWordCount(s),numericalChecks:s.validation.checks.length,figure:!!(s.figure||s.mathFigure),table:!!s.table,status:s.status,contentHash:s.validation.contentHash}));
 writeFileSync('content-drafts/topic-summaries/AUDIT.json',JSON.stringify({...progress,numericalChecks:inventory.reduce((n,s)=>n+s.numericalChecks,0),figures:inventory.filter(s=>s.figure).length,tables:inventory.filter(s=>s.table).length,minimumWords:Math.min(...inventory.map(s=>s.words)),maximumWords:Math.max(...inventory.map(s=>s.words)),inventory},null,2)+'\n');
}
console.log('SUMMARY AUDIT',JSON.stringify(progress));
