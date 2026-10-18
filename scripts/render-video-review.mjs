import { readFileSync, writeFileSync } from 'node:fs';
const manifest=JSON.parse(readFileSync('content-drafts/chemistry/research/video-candidates.json','utf8'));
const lines=['# Jeremy Krug video suggestions — awaiting approval','',
  'This is an unpublished editorial list. Exact links were found in the creator index; public title/author metadata was checked on 2026-10-17. All 103 remain pending owner approval. No playback, embedding permission, transcript, or detailed lesson-content review is claimed. See `README.md` in this directory for verification limits.','',
  'The owner can choose exact URLs and topic associations from this list. Inclusion here does not publish or approve a resource.','',
  '| # | Creator topic label | Official topic mapping | Exact URL | Approval |',
  '| ---: | --- | --- | --- | --- |'];
manifest.videos.forEach((video,index)=>lines.push(`| ${index+1} | ${video.sourceLabel.replaceAll('|','/')} | ${video.officialTopics.join(', ')} | [Open video](${video.url}) | Pending |`));
writeFileSync('content-drafts/chemistry/research/VIDEO_REVIEW.md',lines.join('\n')+'\n');
console.log(`Saved ${manifest.videos.length} unpublished suggestions. No catalog changes.`);
