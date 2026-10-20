// Offline evidence validation. This never approves or fetches new resources.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {youtubeVideoId} from '../src/lib/resource-policy.ts';
export function validateFlippedMathInventory(report, inventory) {
  assert.equal(report.version,1);
  assert.equal(report.source,'https://calculus.flippedmath.com/list-of-lessons.html');
  assert.equal(report.records.length,81);
  assert.equal(report.lessonPagesResearched,81);
  const topics=new Set(),ids=new Set();
  for(const row of report.records) {
    const topic=inventory.find(t=>t.topicNumber===row.topicNumber);
    assert.ok(topic,'Non-AB topic in video inventory');
    assert.equal(row.topicId,topic.topicId);assert.equal(row.unitNumber,topic.unitNumber);
    assert.ok(!topics.has(row.topicNumber),'Duplicate topic');topics.add(row.topicNumber);
    assert.equal(row.version,1);
    assert.equal(new URL(row.lessonPage).origin,'https://calculus.flippedmath.com');
    assert.ok(/^[a-f0-9]{64}$/.test(row.pageSha256));
    assert.ok(row.directoryLabel.startsWith(row.topicNumber+' '));
    assert.ok(row.pageTitle.startsWith(row.topicNumber+' '));
    for(const video of row.videos) {
      assert.equal(youtubeVideoId(video.url),video.videoId);
      const sourceEmbed=new URL(video.sourceEmbedUrl);
      assert.equal(sourceEmbed.origin,'https://www.youtube.com');
      assert.equal(sourceEmbed.pathname,'/embed/'+video.videoId);
      assert.ok(!ids.has(video.videoId),'Duplicate video ID');ids.add(video.videoId);
      if(video.eligible) {
        assert.equal(video.creator,'The Algebros');
        assert.equal(video.creatorUrl,'https://www.youtube.com/@TheAlgebros');
        assert.equal(video.provider,'YouTube');assert.equal(video.embeddableMetadata,true);
        const titleTopics=[...video.title.matchAll(/\b(\d+\.\d+)\b/g)].map(m=>m[1]);
        assert.ok(titleTopics.includes(row.topicNumber),'Video title/topic mismatch');
        assert.equal(video.creatorMatched,true);assert.equal(video.topicMatched,true);
        assert.ok(!video.error);
      }
    }
    if(row.status==='verified')assert.ok(row.issues.length===0&&row.videos.length>0&&row.videos.every(v=>v.eligible));
    else assert.equal(row.status,'pending');
    for(const excluded of row.excludedEmbeds||[])assert.ok(excluded.url.startsWith('https://www.geogebra.org/'));
  }
  assert.deepEqual([...topics],inventory.map(t=>t.topicNumber));
  assert.equal(report.excluded.filter(e=>e.reason.startsWith('BC')).length,30);
  assert.ok(report.excluded.every(e=>!inventory.some(t=>t.topicNumber===e.topicNumber)));
  assert.equal(report.uniqueVideoIdsFound,ids.size);
  return {topics:topics.size,videos:ids.size,verified:report.records.flatMap(r=>r.videos).filter(v=>v.eligible).length,pending:report.records.filter(r=>r.status!=='verified').map(r=>r.topicNumber)};
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/check-flippedmath-inventory.mjs')) {
  const read=file=>JSON.parse(readFileSync(file,'utf8'));
  const result=validateFlippedMathInventory(read('content-drafts/calculus-ab/research/FLIPPED_MATH_V1_VERIFICATION.json'),read('content-drafts/calculus-ab/research/official-topics.json').inventory);
  console.log('FLIPPED MATH INVENTORY PASS:',JSON.stringify(result));
}
