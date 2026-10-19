import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { courses } from '../src/lib/courses.ts';
import { publishOfficialResources, resourcesForTopic } from '../src/lib/resource-policy.ts';
const resources=publishOfficialResources(JSON.parse(readFileSync('src/config/official-resources.json','utf8')),courses);
const base=process.env.BASE_URL || 'http://127.0.0.1:3000';
const strip=html=>html.replace(/<!--.*?-->/g,'');
let total=0;
for(const unit of courses.find(course=>course.id==='chemistry').units){
  for(const topic of unit.topics){
    const response=await fetch(`${base}/courses/chemistry/${topic.id}`);
    assert.equal(response.status,200,topic.number);
    const html=strip(await response.text());
    const videos=resourcesForTopic(resources,'chemistry',unit.number,topic.id);
    assert.ok(html.includes(`${videos.length} approved ${videos.length===1?'video':'videos'} · 11 MCQs available`),topic.number+' actual counts');
    assert.ok(html.includes('Show Notes') && !html.includes('id="topic-notes"'),topic.number+' optional notes');
    assert.ok(html.includes('Mark as Watched') && html.includes('Watch on YouTube'),topic.number+' video actions');
    assert.equal((html.match(/class="video-play"/g)||[]).length,1,topic.number+' exactly one main player');
    assert.equal(html.includes('role="tablist" aria-label="Video lessons"'),videos.length>1,topic.number+' video tabs only for multipart');
    for(const video of videos) assert.ok(html.includes(video.url),topic.number+' resource original link');
    assert.ok(html.includes(`/practice?course=chemistry&amp;unit=${unit.number}&amp;topic=${topic.id}`),topic.number+' scoped Practice');
    total++;
  }
  console.log(`PASS Unit ${unit.number} workspaces`);
}
assert.equal(total,91);
const empty=strip(await (await fetch(`${base}/courses/calculus-ab/limits`)).text());
assert.ok(empty.includes('No approved videos yet') && empty.includes('0 MCQs available'));
assert.ok(!empty.includes('class="video-play"') && !empty.includes('youtube-nocookie.com/embed/'));
console.log('PASS all 91 Chemistry workspaces: videos, topic counts, optional notes, tabs and scoped Practice; empty Calculus workspace has no player or fake questions.');
