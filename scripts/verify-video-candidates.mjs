// Public metadata lookup only. This never registers or publishes a resource.
import { readFileSync, writeFileSync } from 'node:fs';
const path='content-drafts/chemistry/research/video-candidates.json';
const manifest=JSON.parse(readFileSync(path,'utf8'));
const checkedOn=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
for(const item of manifest.videos) if(!item.providerMetadataCheckedOn && manifest.providerMetadataCheckedOn) item.providerMetadataCheckedOn=manifest.providerMetadataCheckedOn;
let cursor=0, limited=false;
await Promise.all(Array.from({length:2},async()=>{
  while(cursor<manifest.videos.length && !limited){
    const item=manifest.videos[cursor++];
    const url=new URL(item.url);
    if(url.protocol!=='https:' || url.hostname!=='youtu.be') throw new Error('Unexpected provider URL');
    for(const field of ['providerMetadataError','providerTitle','providerAuthor','providerAuthorUrl','providerMetadataStatus']) delete item[field];
    item.providerMetadataVerified=false;
    item.creatorIdentityMatched=false;
    item.providerMetadataCheckedOn=checkedOn;
    try{
      const response=await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(item.url)}&format=json`,{signal:AbortSignal.timeout(15000)});
      item.providerMetadataStatus=response.status;
      if(response.status===429){limited=true;continue;}
      if(response.ok){
        const data=await response.json();
        item.providerTitle=data.title;
        item.providerAuthor=data.author_name;
        item.providerAuthorUrl=data.author_url;
        item.creatorIdentityMatched=/Jeremy Krug/i.test(data.author_name||'');
        item.providerMetadataVerified=true;
      }else item.providerMetadataVerified=false;
    }catch(error){item.providerMetadataVerified=false;item.providerMetadataError=error.name;}
    if(cursor%20===0) console.log(`Checked ${cursor}/${manifest.videos.length}`);
  }
}));
manifest.providerMetadataCheckedOn=checkedOn;
manifest.currentRunAttemptedCount=cursor;
manifest.providerMetadataVerifiedCount=manifest.videos.filter(item=>item.providerMetadataVerified).length;
manifest.creatorMatchedCount=manifest.videos.filter(item=>item.creatorIdentityMatched).length;
manifest.rateLimited=limited;
writeFileSync(path,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({verified:manifest.providerMetadataVerifiedCount,creatorMatched:manifest.creatorMatchedCount,total:manifest.videos.length,rateLimited:limited}));
