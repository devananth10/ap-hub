// No retries, cache deletion, server restarts or student-storage access.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
const base=process.env.BASE_URL || 'http://127.0.0.1:3000';
const log=process.env.PREVIEW_ERROR_LOG || 'tmp/preview-restored-stderr.log';
const start=existsSync(log)?readFileSync(log).length:0;
const routes=['/','/courses/chemistry','/courses/chemistry/moles','/courses/chemistry/topic-3-4','/courses/calculus-ab/limits','/practice?course=chemistry&unit=3&topic=intermolecular-forces','/practice?course=calculus-ab&unit=1&topic=limits','/notes'];
let cursor=0,checked=0;
const requests=Array.from({length:80},(_,i)=>routes[i%routes.length]);
await Promise.all(Array.from({length:3},async()=>{
  while(cursor<requests.length){
    const path=requests[cursor++];
    const response=await fetch(base+path,{cache:'no-store',signal:AbortSignal.timeout(30000)});
    assert.equal(response.status,200,path);
    assert.ok(!/Manifest file is empty|Unexpected end of JSON input/.test(await response.text()),path+' manifest failure');
    checked++;
  }
}));
if(existsSync(log))assert.ok(!/Manifest file is empty|Unexpected end of JSON input/.test(readFileSync(log).subarray(start).toString()),'A new manifest parse failure was logged during the run');
console.log(`PASS ${checked} preview requests across eight routes at concurrency 3, no retries or new manifest parse errors. This does not prove the intermittent issue is permanently fixed.`);
