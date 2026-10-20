import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {courses} from '../src/lib/courses.ts';
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
 assert.ok((await page(unitScope)).includes('AP Human Geography practice questions are coming soon.'));
 for(const topic of unit.topics){
  const href=`/courses/human-geography/${topic.id}`,scope=unitScope+`&topic=${topic.id}`;
  assert.ok(outline.includes(href));const html=await page(href);
  assert.ok(html.includes('Choose Your Instructor'));assert.equal((html.match(/type="radio"/g)||[]).length,2);
  assert.equal((html.match(/class="video-play"/g)||[]).length,1);assert.ok(html.includes('1 video · 0 MCQs available'));
  const lessons=resourcesForTopic(resources,course.id,unit.number,topic.id);assert.equal(lessons.length,2);
  const sinn=lessons.find(r=>r.instructorId==='mr-sinn');assert.ok(html.includes(`data-resource-id="${sinn.id}"`));
  assert.ok(html.includes('Mark as Watched'));assert.ok(!html.includes('aria-label="Video lessons" role="tablist"'));
  assert.ok(html.includes('Show Notes')&&!html.includes('id="topic-notes"'));assert.ok(html.includes(scope.replaceAll('&','&amp;')));
  const practice=await page(scope);assert.ok(practice.includes('AP Human Geography practice questions are coming soon.'));assert.ok(!practice.includes('practice-question-frame'));assert.ok(practice.includes(href));
 }
 console.log(`PASS Human Geography Unit ${unit.number}: ${unit.topics.length} topic and empty Practice routes`);
}
assert.ok((await page('/practice?course=human-geography')).includes('AP Human Geography practice questions are coming soon.'));
const home=await page('/');assert.ok(home.includes('AP Human Geography'),'New course is available to the picker');
console.log('PASS 68 complete topic pages, seven units, course, default instructor, one player, hidden notes, scoped zero-MCQ Practice, no pending URL leakage.');
