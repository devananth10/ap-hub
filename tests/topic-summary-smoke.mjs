import assert from 'node:assert/strict';
import {courses} from '../src/lib/courses.ts';
import {getTopicSummary,topicSummaryCatalog} from '../src/lib/topic-summaries.ts';
const base=process.env.BASE_URL||'http://127.0.0.1:3000';
for(const s of topicSummaryCatalog){
 const response=await fetch(`${base}/courses/${s.courseId}/${s.topicId}`);assert.equal(response.status,200);
 const html=await response.text();assert.ok(html.includes('Topic Summary')&&!html.includes('Quick AI summary'));
 assert.ok(html.includes(s.validation.contentHash),s.courseId+' '+s.topicNumber+' receives its sealed review');
 assert.ok(!html.includes('id="topic-summary"'),'Summary remains optional and collapsed');
 assert.ok(!html.includes('id="topic-notes"'),'Personal notes remain optional');
 console.log('PASS summary route '+s.courseId+' '+s.topicNumber);
}
for(const course of courses.filter(c=>['chemistry','calculus-ab','human-geography'].includes(c.id))){
 const missing=course.units.flatMap(u=>u.topics).find(t=>!getTopicSummary(course.id,t.id));if(!missing)continue;
 const r=await fetch(`${base}/courses/${course.id}/${missing.id}`);assert.equal(r.status,200);const html=await r.text();
 assert.ok(html.includes('Topic Summary'));for(const s of topicSummaryCatalog)assert.ok(!html.includes(s.validation.contentHash),'No other topic’s summary leaks into a missing topic');
}
console.log(`PASS ${topicSummaryCatalog.length} published summary routes and unavailable-topic boundaries`);
