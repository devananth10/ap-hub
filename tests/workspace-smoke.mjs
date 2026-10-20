import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {courses} from '../src/lib/courses.ts';
import {publishOfficialResources,resourcesForTopic} from '../src/lib/resource-policy.ts';
const resources=publishOfficialResources(JSON.parse(readFileSync('src/config/official-resources.json','utf8')),courses);
const base=process.env.BASE_URL||'http://127.0.0.1:3000';
const strip=html=>html.replace(/<!--.*?-->/g,'');
for(const courseId of ['chemistry','calculus-ab']){
 let total=0;
 for(const unit of courses.find(course=>course.id===courseId).units){
  for(const topic of unit.topics){
   const response=await fetch(`${base}/courses/${courseId}/${topic.id}`);assert.equal(response.status,200,courseId+' '+topic.number);
   const html=strip(await response.text()),videos=resourcesForTopic(resources,courseId,unit.number,topic.id);
   assert.ok(videos.length>=1,'Initial verified collection covers this topic');
   assert.ok(html.includes(`${videos.length} ${videos.length===1?'video':'videos'} · 11 MCQs available`),topic.number+' actual counts');
   assert.ok(html.includes('Show Notes')&&!html.includes('id="topic-notes"'),topic.number+' optional notes');
   assert.ok(html.includes('Mark as Watched')&&html.includes('Watch on YouTube'),topic.number+' video actions');
   assert.equal((html.match(/class="video-play"/g)||[]).length,1,topic.number+' exactly one main player');
   assert.equal(html.includes('role="tablist" aria-label="Video lessons"'),videos.length>1,topic.number+' tabs only for multipart');
   for(const video of videos)assert.ok(html.includes(video.url),topic.number+' original link');
   assert.ok(html.includes(`/practice?course=${courseId}&amp;unit=${unit.number}&amp;topic=${topic.id}`),topic.number+' scoped Practice');
   assert.ok(!html.includes('youtube-nocookie.com/embed/'),'No unsolicited iframe before Play');total++;
  }
  console.log(`PASS ${courseId} Unit ${unit.number} topics`);
 }
 assert.equal(total,courseId==='chemistry'?91:81);
}
console.log('PASS all 172 Chemistry/Calculus topic pages: scoped videos/counts, one click-to-load player, original links, optional notes, correct tabs and topic-specific eleven-question Practice.');
