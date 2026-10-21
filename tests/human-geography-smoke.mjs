import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {courses} from '../src/lib/courses.ts';
import {practiceEntries,practiceCount} from '../src/lib/practice.ts';
import {publishOfficialResources,resourcesForTopic} from '../src/lib/resource-policy.ts';
const base=process.env.BASE_URL||'http://127.0.0.1:3000';
const course=courses.find(c=>c.id==='human-geography');
const resources=publishOfficialResources(JSON.parse(readFileSync('src/config/official-resources.json','utf8')),courses);
const pending=JSON.parse(readFileSync('content-drafts/human-geography/research/VIDEO_VERIFICATION.json','utf8')).candidates.filter(r=>r.issues.length);
async function page(path){const response=await fetch(base+path);assert.equal(response.status,200,path);const html=(await response.text()).replace(/<!--.*?-->/g,'');for(const row of pending)assert.ok(!html.includes(row.url),'Pending URL must never enter client props or markup');assert.ok(!html.includes('youtube-nocookie.com/embed/'),'Click to load only');return html;}
const outline=await page('/courses/human-geography');assert.ok(outline.includes('data-course-art="geography"'));assert.ok(outline.includes('68 topics are'));
for(const unit of course.units){
 const unitScope=`/practice?course=human-geography&unit=${unit.number}`;
 assert.ok(outline.includes(unitScope.replaceAll('&','&amp;')));
 const unitCount=practiceCount({courseId:course.id,unitNumber:unit.number}); const unitPage=await page(unitScope);assert.ok(unitCount?unitPage.includes(`${unitCount} MCQ questions`):unitPage.includes('are coming soon.'));
 for(const topic of unit.topics){
  const href=`/courses/human-geography/${topic.id}`,scope=unitScope+`&topic=${topic.id}`;
  assert.ok(outline.includes(href));const html=await page(href);
  assert.ok(html.includes('Choose Your Instructor'));assert.equal((html.match(/name="lesson-instructor"/g)||[]).length,2);
  assert.equal((html.match(/class="video-play"/g)||[]).length,1);const entries=practiceEntries({courseId:course.id,unitNumber:unit.number,topicId:topic.id});assert.ok(html.includes(`1 video from Mr. Sinn · 2 total across instructors · ${entries.length} MCQs available`));
  const lessons=resourcesForTopic(resources,course.id,unit.number,topic.id);assert.equal(lessons.length,2);
  const sinn=lessons.find(r=>r.instructorId==='mr-sinn');assert.ok(html.includes(`data-resource-id="${sinn.id}"`));
  assert.ok(html.includes('Mark as Watched'));assert.ok(!html.includes('aria-label="Video lessons" role="tablist"'));
  assert.ok(html.includes('Show Notes')&&!html.includes('id="topic-notes"'));assert.ok(html.includes(scope.replaceAll('&','&amp;')));
  const practice=await page(scope);if(entries.length){assert.equal(entries.length,11);assert.ok(practice.includes('Question 1 of 11'));assert.ok(practice.includes(entries[0].question.prompt));}else{assert.ok(practice.includes('are coming soon.'));assert.ok(!practice.includes('practice-question-frame'));}assert.ok(practice.includes(href));
 }
 console.log(`PASS Human Geography Unit ${unit.number}: ${unit.topics.length} topic and correctly scoped Practice routes`);
}
const count=practiceCount({courseId:course.id});const coursePage=await page('/practice?course=human-geography');assert.ok(count?coursePage.includes(`${count} MCQ questions`):coursePage.includes('are coming soon.'));
const home=await page('/');assert.ok(home.includes('AP Human Geography'),'New course is available to the picker');
console.log('PASS 68 complete topic pages, seven units, course, default instructor, one player, hidden notes, honest published/empty Practice, no pending URL leakage.');
