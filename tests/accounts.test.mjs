import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicCloudConfig,safeReturnTo,isSameOrigin } from '../src/lib/account-policy.ts';
import { emptyCloud,queueChange,acceptChange,conflictChange,resolveConflict,visibleRecords,projectStudy,legacyChanges,validChange } from '../src/lib/cloud-model.ts';
const id=()=>crypto.randomUUID();
test('missing/privileged cloud keys fail closed, same-origin and redirect validation',()=>{
 assert.equal(publicCloudConfig(),null);assert.equal(publicCloudConfig('https://test.supabase.co','sb_secret_test'),null);
 assert.equal(publicCloudConfig('http://evil.com','sb_publishable_test'),null);
 assert.ok(publicCloudConfig('https://test.supabase.co','sb_publishable_test'));
 for(const path of ['https://evil.com','//evil.com','/\\evil.com','/api/auth','/auth/callback','/\nheader'])assert.equal(safeReturnTo(path),'/account');
 assert.equal(safeReturnTo('/courses/chemistry/moles?x=1'),'/courses/chemistry/moles?x=1');
 assert.equal(isSameOrigin('https://evil.com','http://127.0.0.1:3000'),false);assert.equal(isSameOrigin(null,'http://127.0.0.1:3000'),false);
});
test('outbox retains typing during inflight save and rebases only the acknowledged record',()=>{
 let s=queueChange(emptyCloud(),'note','chemistry/moles','first',id());const sent=s.pending[0];
 s=queueChange(s,'note','chemistry/moles','typed while saving',id());
 s=acceptChange(s,sent,{...sent,value:'first',revision:1});assert.equal(s.pending.length,1);assert.equal(s.pending[0].revision,1);assert.equal(projectStudy(visibleRecords(s)).notes['chemistry/moles'],'typed while saving');
 s=acceptChange(s,s.pending[0],{...s.pending[0],revision:2});assert.equal(s.pending.length,0);
});
test('two-device note conflict keeps both versions until explicit choice',()=>{
 let s=queueChange(emptyCloud(),'note','calculus-ab/limits','local',id());const sent=s.pending[0];
 s=conflictChange(s,sent,{...sent,value:'remote',revision:3});assert.equal(s.conflicts[0].local.value,'local');assert.equal(s.conflicts[0].remote.value,'remote');
 let local=resolveConflict(s,'note:calculus-ab/limits','local',id());assert.equal(local.pending[0].revision,3);
 let remote=resolveConflict(s,'note:calculus-ab/limits','remote',id());assert.equal(remote.pending.length,0);assert.equal(projectStudy(visibleRecords(remote)).notes['calculus-ab/limits'],'remote');
});
test('legacy import creates canonical changes without mutating originals or overwriting cloud state',()=>{
 const legacy={selected:['chemistry','calculus-ab','human-geography'],notes:{'chemistry/moles':'C','calculus-ab/limits':'M','human-geography/topic-1-1':'G','old/no-topic':'recover'},completed:['human-geography/topic-1-1'],watchedVideos:[],saved:[],lastTopic:null};const before=JSON.stringify(legacy);
 const changes=legacyChanges(legacy);assert.equal(changes.filter(r=>r.kind==='note').length,3);assert.equal(JSON.stringify(legacy),before);
 assert.equal(validChange({...changes[0],revision:0,mutation:id(),user_id:id()}),false);
});
