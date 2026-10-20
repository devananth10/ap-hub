import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {courses} from '../src/lib/courses.ts';
import {instructorAvailability,instructorLessons} from '../src/lib/video-instructors.ts';
import {publishOfficialResources,watchedVideoKey} from '../src/lib/resource-policy.ts';
import {parseStudyData,STORAGE_KEY} from '../src/lib/study-storage.ts';
import {practiceEntries,practiceCount,validPracticeScope} from '../src/lib/practice.ts';
import {checkHumanGeography,validateHumanGeographyEvidence} from '../scripts/check-human-geography.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const fixtures=()=>['mr-sinn','mr-sinn','heimler'].map((instructorId,index)=>({id:`fixture-lesson-${index}`,kind:'video',title:`TEST ONLY ${index}`,publisher:instructorId==='mr-sinn'?'Mr. Sinn':"Heimler's History",description:'Synthetic, never fetched or published',url:`https://www.youtube.com/watch?v=testVideo0${index}`,courseId:'human-geography',unitNumber:1,topicIds:['topic-1-1'],instructorId,order:index,approval:{status:'approved',approvedBy:'owner',approvedOn:'2026-10-19',approvedUrl:`https://www.youtube.com/watch?v=testVideo0${index}`,reference:'TEST ONLY'},video:{provider:'youtube',videoId:`testVideo0${index}`,embedPolicy:'allowed'}}));
// Render the actual selector without adding a public fixture route or new dependency.
const require=createRequire(import.meta.url);
const compiled=ts.transpileModule(readFileSync('src/components/instructor-selector.tsx','utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
 .replaceAll('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
 .replaceAll('"@/lib/video-instructors"',JSON.stringify(new URL('../src/lib/video-instructors.ts',import.meta.url).href));
const {InstructorSelector}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const render=(resources,preferred='mr-sinn',ready=true)=>renderToStaticMarkup(createElement(InstructorSelector,{resources,preferred,ready,onChange:()=>{}}));

test('Human Geography is a complete selectable course: seven units, 68 stable topics and honest published Practice counts',()=>{
 const course=courses.find(c=>c.id==='human-geography');assert.equal(course.artwork,'geography');assert.equal(course.units.length,7);assert.equal(course.units.flatMap(u=>u.topics).length,68);
 const official=read('content-drafts/human-geography/research/official-topics.json');assert.equal(official.independentHeadingMatches,68);assert.match(official.cedSha256,/^[a-f0-9]{64}$/);
 for(const unit of course.units)for(const topic of unit.topics){const scope={courseId:course.id,unitNumber:unit.number,topicId:topic.id};assert.equal(topic.id,`topic-${topic.number.replace('.','-')}`);assert.ok(topic.workspaceReady);assert.ok(validPracticeScope(scope));const entries=practiceEntries(scope);assert.ok([0,11].includes(entries.length));assert.equal(practiceCount(scope),entries.length);}
});
test('initial Human Geography evidence and all 136 approved mappings pass; thirteen uncertain extras stay out',()=>{
 assert.deepEqual(checkHumanGeography(),{discovered:149,verified:136,pending:13,published:136,topicsWithBoth:68,topicsWithOne:0,topicsWithNeither:0});
 const live=publishOfficialResources(read('src/config/official-resources.json'),courses);assert.equal(live.length,319);assert.equal(live.filter(r=>r.courseId==='chemistry').length,102);assert.equal(live.filter(r=>r.courseId==='calculus-ab').length,81);
});
test('instructor evidence rejects wrong creators, channels, provider IDs and mismatched topic numbers',()=>{
 const original=read('content-drafts/human-geography/research/VIDEO_VERIFICATION.json'),inventory=read('content-drafts/human-geography/research/official-topics.json').inventory;
 for(const patch of [{creator:'Wrong creator'},{creatorUrl:'https://www.youtube.com/@someoneelse'},{videoId:'different01'},{topicNumbers:['2.1']},{embeddableMetadata:false}]){const report=structuredClone(original);Object.assign(report.candidates[0],patch);assert.throws(()=>validateHumanGeographyEvidence(report,inventory));}
});
test('both instructors default to Sinn; Heimler preference filters all video tabs and resources',()=>{
 const all=fixtures();assert.equal(instructorAvailability(all).active.id,'mr-sinn');assert.equal(instructorLessons(all).videos.length,2);
 const heimler=instructorLessons(all,'heimler');assert.equal(heimler.videos.length,1);assert.ok(heimler.resources.every(r=>r.instructorId==='heimler'));
 const html=render(all);assert.match(html,/Choose Your Instructor/);assert.equal((html.match(/type="radio"/g)||[]).length,2);assert.match(html,/checked=""[^>]*value="mr-sinn"|value="mr-sinn"[^>]*checked=""/);
 assert.match(render(all,'heimler'),/checked=""[^>]*value="heimler"|value="heimler"[^>]*checked=""/);assert.match(render(all,'mr-sinn',false),/<fieldset disabled/);
});
test('Sinn-only, Heimler-only and neither availability avoid inert controls and preserve preference',()=>{
 const all=fixtures(),sinn=all.slice(0,2),heimler=all.slice(2);
 for(const [rows,preferred,active] of [[sinn,'heimler','mr-sinn'],[heimler,'mr-sinn','heimler']]){const choice=instructorAvailability(rows,preferred);assert.equal(choice.active.id,active);assert.equal(choice.preferredUnavailable,true);const html=render(rows,preferred);assert.ok(!html.includes('type="radio"'));assert.match(html,/your preference is saved/);}
 assert.equal(instructorAvailability([],'heimler').active,null);assert.equal(render([]),'');
 const pending=all.map(r=>({...r,approval:{status:'draft'}}));assert.equal(render(pending),'');assert.deepEqual(instructorLessons(pending).videos,[]);
 assert.equal(render(all.map(r=>({...r,visibility:'hidden'}))),'');
});
test('additive instructor preference survives refresh/fallback without changing notes, bookmarks or watched keys',()=>{
 const all=fixtures(),legacy={selected:['chemistry','calculus-ab','human-geography'],notes:{'human-geography/topic-1-1':'Keep this note','chemistry/moles':'Existing'},completed:['chemistry/moles'],saved:['old-resource'],watchedVideos:[watchedVideoKey(all[0])],lastTopic:'human-geography/topic-1-1'};
 assert.equal(STORAGE_KEY,'ap-hub:v1');assert.deepEqual(parseStudyData(legacy,courses),legacy);
 const saved={...legacy,preferredInstructors:{'human-geography':'heimler'}};assert.deepEqual(parseStudyData(JSON.parse(JSON.stringify(saved)),courses),saved);
 assert.equal(instructorAvailability(all.slice(0,2),saved.preferredInstructors['human-geography']).active.id,'mr-sinn');assert.equal(saved.preferredInstructors['human-geography'],'heimler');assert.equal(instructorAvailability(all,saved.preferredInstructors['human-geography']).active.id,'heimler');
 assert.notEqual(watchedVideoKey(all[0]),watchedVideoKey(all[2]));assert.ok(!saved.watchedVideos.includes(watchedVideoKey(all[2])));
 assert.deepEqual(parseStudyData({...legacy,preferredInstructors:{'human-geography':'invalid'}},courses).notes,legacy.notes);
});
test('resource approval validates instructor identity and supports a single video across multiple same-unit topics',()=>{
 const all=fixtures();assert.equal(publishOfficialResources({resources:all},courses).length,3);
 for(const patch of [{publisher:'Wrong teacher'},{instructorId:'unknown'},{instructorId:undefined},{courseId:'chemistry'}])assert.throws(()=>publishOfficialResources({resources:[{...all[0],...patch}]},courses));
 const shared={...all[0],topicIds:['topic-1-1','topic-1-2']};assert.equal(publishOfficialResources({resources:[shared]},courses).length,1);
 assert.deepEqual(publishOfficialResources({resources:[{...all[0],approval:{status:'draft'}}]},courses),[]);
});
