// Public metadata lookup only. This never registers or publishes a resource.
import { readFileSync, writeFileSync } from 'node:fs';
const path='content-drafts/chemistry/research/video-candidates.json';
const manifest=JSON.parse(readFileSync(path,'utf8'));
let cursor=0, limited=false;
await Promise.all(Array.from({length:2},async()=>{
  while(cursor<manifest.videos.length && !limited){
    const item=manifest.videos[cursor++];
    const url=new URL(item.url);
    if(url.protocol!=='https:' || url.hostname!=='youtu.be') throw new Error('Unexpected provider URL');
    try{
      const response=await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(item.url)}&format=json`,{signal:AbortSignal.timeout(15000)});
      item.providerMetadataStatus=response.status;
      if(response.status===429){limited=true;continue;}
      if(response.ok){
        const data=await response.json();
        item.providerTitle=data.title;
        item.providerAuthor=data.author_name;
        item.creatorIdentityMatched=/Jeremy Krug/i.test(data.author_name||'');
        item.providerMetadataVerified=true;
      }else item.providerMetadataVerified=false;
    }catch(error){item.providerMetadataVerified=false;item.providerMetadataError=error.name;}
    if(cursor%20===0) console.log(`Checked ${cursor}/${manifest.videos.length}`);
  }
}));
manifest.providerMetadataCheckedOn='2026-10-17';
manifest.providerMetadataVerifiedCount=manifest.videos.filter(item=>item.providerMetadataVerified).length;
manifest.creatorMatchedCount=manifest.videos.filter(item=>item.creatorIdentityMatched).length;
manifest.rateLimited=limited;
writeFileSync(path,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({verified:manifest.providerMetadataVerifiedCount,creatorMatched:manifest.creatorMatchedCount,total:manifest.videos.length,rateLimited:limited}));
