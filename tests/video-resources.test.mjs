import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { courses } from '../src/lib/courses.ts';
import { publishOfficialResources, resourcesForTopic, watchedVideoKey, courseWithResources } from '../src/lib/resource-policy.ts';
import { parseStudyData } from '../src/lib/study-storage.ts';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const catalog = read('src/config/official-resources.json');
const resources = publishOfficialResources(catalog, courses);
const verification = read('content-drafts/chemistry/research/KRUG_VERIFICATION.json');
const approval = read('docs/INITIAL_KRUG_APPROVAL.json');

test('initial collection has 102 unique verified approved URLs, with a pending duplicate alias', () => {
  assert.equal(resources.length, 102);
  assert.equal(new Set(resources.map(resource => resource.video.videoId)).size, 102);
  assert.deepEqual(resources.map(resource => resource.url), approval.approvedUrls);
  assert.equal(verification.directoryEntryCount, 103);
  assert.equal(approval.pendingEntries.length, 1);
  assert.equal(approval.pendingEntries[0].sourceLabel, '9.8b');
  for (const resource of resources) {
    const evidence = verification.records.find(item => item.videoId === resource.video.videoId);
    assert.ok(evidence.eligible && evidence.metadataVerified && evidence.creatorMatched);
    assert.ok(evidence.directoryMatches.every(item => item.found));
    assert.equal(resource.title, evidence.title);
    assert.equal(resource.publisher, evidence.creator);
    assert.equal(resource.approval.approvedUrl, resource.url);
  }
});
test('every official Chemistry topic has correctly scoped ordered videos; shared videos have one record', () => {
  const chemistry = courses.find(course => course.id === 'chemistry');
  let covered = 0;
  for (const unit of chemistry.units) for (const topic of unit.topics) {
    const videos = resourcesForTopic(resources, chemistry.id, unit.number, topic.id);
    assert.ok(videos.length >= 1);
    assert.ok(videos.every(video => video.source.labels.length && video.topicIds.includes(topic.id)));
    assert.deepEqual(videos.map(video => video.order), videos.map(video => video.order).sort((a,b)=>a-b));
    covered++;
  }
  assert.equal(covered, 91);
  assert.equal(courseWithResources(chemistry, resources).units.flatMap(unit => unit.topics).filter(topic => topic.ready).length, 91);
  assert.equal(resources.filter(video => video.video.videoId === 'Sl5mJT0tvSE').length, 1);
  assert.equal(resources.find(video => video.video.videoId === 'Sl5mJT0tvSE').part, 'A');
  assert.deepEqual(resourcesForTopic(resources, 'calculus-ab', 1, 'limits'), []);
});
test('hide/restore, reorder and move preserve identity; changing actual video resets its watched identity', () => {
  const resource = structuredClone(resources[0]);
  const key = watchedVideoKey(resource);
  assert.equal(publishOfficialResources({resources:[{...resource, visibility:'hidden'}]}, courses).length, 0);
  assert.equal(publishOfficialResources({resources:[{...resource, visibility:'published'}]}, courses).length, 1);
  assert.equal(watchedVideoKey({...resource, order:999, title:'Corrected title', topicIds:['mass-spectra']}), key);
  assert.notEqual(watchedVideoKey({...resource, url:resources[1].url}), key);
  assert.throws(()=>publishOfficialResources({resources:[{...resource, url:resources[1].url}]}, courses), /exact URL/);
  assert.throws(()=>publishOfficialResources({resources:[{...resource, video:{...resource.video,videoId:'mismatch'}}]}, courses), /videoId/);
  assert.throws(()=>publishOfficialResources({resources:[resource,{...resource,id:'duplicate-video'}]}, courses), /duplicate video ID/);
  assert.throws(()=>publishOfficialResources({resources:[{...resource,order:-1}]}, courses), /order/);
});
test('watched data extends legacy storage without clearing notes, saved IDs or topic completion', () => {
  const legacy={selected:['chemistry'], notes:{'chemistry/moles':'Retain this'}, saved:['old-resource'], completed:['chemistry/moles'],lastTopic:'chemistry/moles'};
  const parsed=parseStudyData(legacy,courses);
  assert.deepEqual(parsed,{...legacy,watchedVideos:[]});
  const watched=watchedVideoKey(resources[0]);
  assert.deepEqual(parseStudyData({...legacy,watchedVideos:[watched]},courses),{...legacy,watchedVideos:[watched]});
  assert.throws(()=>parseStudyData({...legacy,watchedVideos:[5]},courses),/watched/);
});
