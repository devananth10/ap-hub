import assert from 'node:assert/strict';
import {courses} from '../src/lib/courses.ts';
import {practiceEntries,practiceHref,practiceCount} from '../src/lib/practice.ts';
import {practiceFigures} from '../src/lib/practice-figures.ts';
import {practiceTables} from '../src/lib/practice-tables.ts';
import {readFileSync} from 'node:fs';
import {publishOfficialResources,resourcesForTopic} from '../src/lib/resource-policy.ts';
const videos=publishOfficialResources(JSON.parse(readFileSync('src/config/official-resources.json','utf8')),courses);
const base=process.env.BASE_URL||'http://127.0.0.1:3000';
const course=courses.find(course=>course.id==='calculus-ab');
const plain=text=>text.replace(/<!--.*?-->/g,'');
const decode=text=>text.replace(/&#x([0-9a-f]+);/gi,(_,hex)=>String.fromCodePoint(parseInt(hex,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replaceAll('&quot;','"').replaceAll('&apos;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
let completed=0,questions=0;
for(const unit of course.units) {
  for(const topic of unit.topics) {
    const scope={courseId:course.id,unitNumber:unit.number,topicId:topic.id},entries=practiceEntries(scope);
    const response=await fetch(base+practiceHref(scope));assert.equal(response.status,200,topic.number+' practice route');
    const html=plain(await response.text());
    assert.ok(html.includes(`${entries.length} MCQ questions`),topic.number+' actual count');
    if(entries.length) {
      assert.equal(entries.length,11);assert.ok(html.includes('Question 1 of 11'));
      assert.ok(/<fieldset[^>]*disabled[^>]*aria-busy="true"/.test(html),'Server-rendered answers wait for interactive readiness');
      const legend=html.match(/<legend[^>]*>(.*?)<\/legend>/s)?.[1];assert.equal(decode(legend),entries[0].question.prompt,topic.number+' correct first question');
      assert.equal((html.match(/aria-label="Report this question"/g)||[]).length,1);
      if(practiceFigures[entries[0].id]) assert.ok(html.includes(`data-question-figure="${entries[0].id}"`),'Required original graph is rendered');
      if(practiceTables[entries[0].id]) assert.ok(html.includes(`data-question-table="${entries[0].id}"`),'Required numerical table is rendered');
      completed++;questions+=entries.length;
    } else assert.ok(html.includes('coming soon')&&!html.includes('practice-question-frame'),topic.number+' honest empty state');
    const workspaceResponse=await fetch(`${base}/courses/calculus-ab/${topic.id}`);assert.equal(workspaceResponse.status,200);
    const workspace=plain(await workspaceResponse.text());assert.ok(workspace.includes(`${entries.length} MCQs available`));
    const lessons=resourcesForTopic(videos,course.id,unit.number,topic.id);
    if(lessons.length){assert.ok(!workspace.includes('No videos yet'));for(const lesson of lessons)assert.ok(workspace.includes(lesson.url)&&workspace.includes(`data-resource-id="${lesson.id}"`));}
    else assert.ok(workspace.includes('No videos yet'));
    assert.ok(!workspace.includes('youtube-nocookie.com/embed/'),'Player remains click-to-load');
    assert.ok(workspace.includes('Show Notes')&&!workspace.includes('id="topic-notes"'));
    assert.ok(workspace.includes(practiceHref(scope).replaceAll('&','&amp;')));
  }
  const unitResponse=await fetch(base+practiceHref({courseId:course.id,unitNumber:unit.number}));assert.equal(unitResponse.status,200);
  assert.ok(plain(await unitResponse.text()).includes(`${practiceCount({courseId:course.id,unitNumber:unit.number})} MCQ questions`));
}
const all=await fetch(base+practiceHref({courseId:course.id}));assert.equal(all.status,200);
assert.ok(plain(await all.text()).includes(`${questions} MCQ questions`));
console.log(`PASS Calculus: all 81 Practice and topic routes, eight unit scopes and course scope; ${completed} complete topics / ${questions} questions, correctly scoped approved videos and guarded initial answers.`);
