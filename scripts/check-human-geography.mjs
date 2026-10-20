import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {courses} from '../src/lib/courses.ts';
import {publishOfficialResources,resourcesForTopic,youtubeVideoId} from '../src/lib/resource-policy.ts';
import {humanGeographyInstructors} from '../src/lib/video-instructors.ts';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
export function validateHumanGeographyEvidence(report,inventory){
 assert.equal(report.playlists.length,14);assert.deepEqual(report.errors,[]);
 assert.ok(report.playlists.every(p=>!p.continuation&&/^[a-f0-9]{64}$/.test(p.pageSha256)));
 const ids=new Set(),resources=new Set();
 for(const row of report.candidates){
  assert.equal(youtubeVideoId(row.url),row.videoId);assert.ok(!ids.has(row.videoId));ids.add(row.videoId);assert.ok(!resources.has(row.id));resources.add(row.id);
  const instructor=humanGeographyInstructors.find(i=>i.id===row.instructorId);assert.ok(instructor);
  if(row.verificationStatus==='metadata-and-topic-number-verified'){
   assert.deepEqual(row.issues,[]);assert.equal(row.creator,instructor.publisher);assert.equal(row.sourceChannel,instructor.id==='mr-sinn'?'https://www.youtube.com/@MrSinn':'https://www.youtube.com/@heimlershistory');assert.equal(row.creatorUrl,row.sourceChannel);assert.equal(row.provider,'YouTube');assert.equal(row.embeddableMetadata,true);
   assert.ok(row.topicNumbers.length>0);assert.equal(row.topicIds.length,row.topicNumbers.length);
   const numbers=row.title.match(/\bUnit\s*([1-7])\s*[,,:–—-]?\s*Topics?\s*(\d+)(?:\s*(?:&|and|[-–])\s*(\d+))?/i);assert.ok(numbers);
   const expected=Array.from({length:Number(numbers[3]||numbers[2])-Number(numbers[2])+1},(_,n)=>`${numbers[1]}.${Number(numbers[2])+n}`);assert.deepEqual(row.topicNumbers,expected);
   row.topicNumbers.forEach((number,index)=>{const topic=inventory.find(t=>t.topicNumber===number);assert.ok(topic);assert.equal(topic.unitNumber,row.playlistUnit);assert.equal(topic.topicId,row.topicIds[index]);});
  }else{assert.equal(row.verificationStatus,'pending-review');assert.ok(row.issues.length);}
 }
 return {discovered:ids.size,verified:report.candidates.filter(r=>!r.issues.length).length,pending:report.candidates.filter(r=>r.issues.length).length};
}
export function checkHumanGeography(){
 const official=read('content-drafts/human-geography/research/official-topics.json'),course=courses.find(c=>c.id==='human-geography');
 assert.equal(course.units.length,7);assert.deepEqual(course.units.map(u=>u.topics.length),[7,12,8,10,12,11,8]);
 assert.deepEqual(course.units.flatMap(u=>u.topics.map(t=>({unitNumber:u.number,unitTitle:u.title,topicNumber:t.number,topicId:t.id,title:t.title}))),official.inventory);
 assert.equal(new Set(official.inventory.map(t=>t.topicId)).size,68);
 const evidence=read('content-drafts/human-geography/research/VIDEO_VERIFICATION.json');const counts=validateHumanGeographyEvidence(evidence,official.inventory);
 const ledger=read('docs/INITIAL_HUMAN_GEOGRAPHY_APPROVAL.json');const live=publishOfficialResources(read('src/config/official-resources.json'),courses).filter(r=>r.courseId===course.id);
 assert.equal(live.length,136);assert.deepEqual(live.map(r=>r.url),ledger.approvedUrls);
 for(const resource of live){const row=evidence.candidates.find(c=>c.id===resource.id);assert.ok(row&&!row.issues.length);assert.equal(row.title,resource.title);assert.equal(row.creator,resource.publisher);assert.equal(resource.instructorId,row.instructorId);assert.equal(resource.video.videoId,row.videoId);assert.deepEqual(resource.topicIds,row.topicIds);assert.equal(resource.unitNumber,row.playlistUnit);}
 for(const topic of official.inventory){const scoped=resourcesForTopic(live,course.id,topic.unitNumber,topic.topicId);assert.equal(scoped.length,2);assert.deepEqual(scoped.map(r=>r.instructorId).sort(),['heimler','mr-sinn']);}
 for(const pending of evidence.candidates.filter(c=>c.issues.length))assert.ok(!live.some(r=>r.url===pending.url));
 return {...counts,published:live.length,topicsWithBoth:68,topicsWithOne:0,topicsWithNeither:0};
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/check-human-geography.mjs'))console.log('HUMAN GEOGRAPHY PASS',JSON.stringify(checkHumanGeography()));
