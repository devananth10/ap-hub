// Public metadata research only. Never mutates the live catalog or grants approval.
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root='content-drafts/human-geography/research';
const output=process.argv[2]||`${root}/VIDEO_VERIFICATION.json`;
if(existsSync('docs/INITIAL_HUMAN_GEOGRAPHY_APPROVAL.json')&&output===`${root}/VIDEO_VERIFICATION.json`)throw new Error('Initial evidence is frozen. Supply a separate research output path.');
const inventory=JSON.parse(readFileSync(`${root}/official-topics.json`,'utf8')).inventory;
const checkedOn=new Date().toISOString().slice(0,10);
mkdirSync('tmp/human-geography',{recursive:true});mkdirSync(root,{recursive:true});
const hash=s=>createHash('sha256').update(s).digest('hex');
const fetchText=async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw new Error(`HTTP ${r.status}: ${url}`);return r.text();};
const initialData=html=>{const m=html.match(/var ytInitialData = (.*?);<\/script>/s);if(!m)throw new Error('Public channel/playlist data unavailable');return JSON.parse(m[1]);};
function walk(value,visit){if(!value||typeof value!=='object')return;visit(value);for(const item of Object.values(value))if(typeof item==='object')walk(item,visit);}
const instructors=[{id:'mr-sinn',publisher:'Mr. Sinn',channel:'https://www.youtube.com/@MrSinn'},{id:'heimler',publisher:"Heimler's History",channel:'https://www.youtube.com/@heimlershistory'}];
const playlists=[],videos=new Map(),errors=[];
for(const instructor of instructors){
 const url=instructor.channel+'/playlists';const html=await fetchText(url);writeFileSync(`tmp/human-geography/${instructor.id}-channel.html`,html);
 const selected=new Map();
 walk(initialData(html).contents,node=>{const l=node.lockupViewModel,title=l?.metadata?.lockupMetadataViewModel?.title?.content;const match=title?.match(/^AP Human Geography Unit ([1-7])(?: Review)?$/i);if(match&&!selected.has(Number(match[1])))selected.set(Number(match[1]),{playlistId:l.contentId,title,unitNumber:Number(match[1])});});
 for(let unit=1;unit<=7;unit++){
  const playlist=selected.get(unit);if(!playlist){errors.push({instructorId:instructor.id,unitNumber:unit,error:'No unit playlist discovered on public channel'});continue;}
  const sourceUrl='https://www.youtube.com/playlist?list='+playlist.playlistId;
  try{const page=await fetchText(sourceUrl),data=initialData(page);writeFileSync(`tmp/human-geography/${instructor.id}-${unit}.html`,page);
   const rows=[];walk(data.contents,node=>{const l=node.lockupViewModel;if(l?.contentType==='LOCKUP_CONTENT_TYPE_VIDEO'&&/^[\w-]{11}$/.test(l.contentId))rows.push({videoId:l.contentId,title:l.metadata?.lockupMetadataViewModel?.title?.content});});
   const continuation=JSON.stringify(data.contents).includes('continuationItemRenderer');
   playlists.push({...playlist,instructorId:instructor.id,sourceUrl,pageSha256:hash(page),rows:rows.length,continuation});
   if(continuation)errors.push({sourceUrl,error:'Playlist has more pages; initial-page research is not exhaustive'});
   for(const row of rows){const previous=videos.get(row.videoId);if(previous){previous.sources.push(sourceUrl);continue;}videos.set(row.videoId,{...row,instructorId:instructor.id,expectedPublisher:instructor.publisher,sourceChannel:instructor.channel,playlistUnit:unit,sources:[sourceUrl]});}
  }catch(error){errors.push({sourceUrl,error:String(error)});}
 }
}
const candidates=[...videos.values()];let cursor=0;
await Promise.all(Array.from({length:4},async()=>{while(cursor<candidates.length){const row=candidates[cursor++];row.url='https://www.youtube.com/watch?v='+row.videoId;row.id=`${row.instructorId}-human-geography-${hash(row.videoId).slice(0,12)}`;row.approvalStatus='pending';row.topicNumbers=[];row.issues=[];
 try{const metadata=JSON.parse(await fetchText('https://www.youtube.com/oembed?url='+encodeURIComponent(row.url)+'&format=json'));row.title=metadata.title;row.creator=metadata.author_name;row.creatorUrl=metadata.author_url;row.provider=metadata.provider_name;row.embeddableMetadata=metadata.html?.includes('/embed/'+row.videoId)&&/allowfullscreen/i.test(metadata.html);row.metadataSha256=hash(JSON.stringify(metadata));
  if(row.creator!==row.expectedPublisher)row.issues.push('Creator does not match requested instructor');
  if(row.creatorUrl?.toLowerCase()!==row.sourceChannel.toLowerCase())row.issues.push('Creator channel does not match official channel');
  if(row.provider!=='YouTube'||!row.embeddableMetadata)row.issues.push('Provider/embed metadata not verified');
  const match=row.title.match(/\bUnit\s*([1-7])\s*[,,:–—-]?\s*Topics?\s*(\d+)(?:\s*(?:&|and|[-–])\s*(\d+))?/i);
  if(match){const unit=Number(match[1]),start=Number(match[2]),end=Number(match[3]||match[2]);if(unit!==row.playlistUnit)row.issues.push('Title/playlist unit mismatch');if(end<start||end-start>4)row.issues.push('Ambiguous topic range');else for(let n=start;n<=end;n++){const number=`${unit}.${n}`;if(inventory.some(t=>t.topicNumber===number))row.topicNumbers.push(number);else row.issues.push('Non-curriculum topic '+number);}}
  else row.issues.push('No precise topic number in provider title; retain for mapping review, not publication');
  row.topicIds=row.topicNumbers.map(number=>inventory.find(t=>t.topicNumber===number).topicId);
  row.verificationStatus=row.issues.length?'pending-review':'metadata-and-topic-number-verified';
 }catch(error){row.issues.push(String(error));row.verificationStatus='pending-review';}
}}));
const report={checkedOn,sourcePolicy:'Initial official public creator unit playlists; metadata and explicit title topic numbers only. No transcripts/media downloaded. Pending is not approval. No claim of full lesson viewing or independent human content review.',instructors,playlists,errors,candidates};
writeFileSync(output,JSON.stringify(report,null,2)+'\n');
for(const i of instructors){const rows=candidates.filter(r=>r.instructorId===i.id),verified=rows.filter(r=>!r.issues.length);console.log(i.id,JSON.stringify({discovered:rows.length,verified:verified.length,topics:new Set(verified.flatMap(r=>r.topicNumbers)).size,pending:rows.filter(r=>r.issues.length).map(r=>({id:r.videoId,title:r.title,issues:r.issues}))}));}
console.log('RESEARCH ERRORS:',JSON.stringify(errors));
