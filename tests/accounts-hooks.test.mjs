// Isolated React hooks with a simulated transport and browser stores, never live auth.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import React from 'react';
import {render,act,fireEvent} from '@testing-library/react';
import {JSDOM} from 'jsdom';
import {emptyCloud} from '../src/lib/cloud-model.ts';
import {accountCacheKey,serializeAccountCache} from '../src/lib/account-cache.ts';
import {practiceEntries} from '../src/lib/practice.ts';
import syncCatalog from '../src/config/sync-catalog.json' with {type:'json'};
import resourceConfig from '../src/config/official-resources.json' with {type:'json'};
import {publishOfficialResources} from '../src/lib/resource-policy.ts';
import {courses} from '../src/lib/courses.ts';
const require=createRequire(import.meta.url),url=p=>pathToFileURL(require.resolve(p)).href;
const compile=(file,imports={})=>{
 let code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 for(const [name,value]of Object.entries({react:url('react'),'react/jsx-runtime':url('react/jsx-runtime'),...imports}))code=code.replaceAll(JSON.stringify(name),JSON.stringify(value));
 return 'data:text/javascript;base64,'+Buffer.from(code+'\n//# sourceURL='+file+'\n').toString('base64');
};
const cloudModule=compile('src/components/cloud-study.tsx',{'@/lib/account-cache':new URL('../src/lib/account-cache.ts',import.meta.url).href,'@/lib/cloud-model':new URL('../src/lib/cloud-model.ts',import.meta.url).href});
const {useCloudStudy}=await import(cloudModule);
const authStub='data:text/javascript;base64,'+Buffer.from('export function useAuth(){return globalThis.__accountHookAuth}').toString('base64');
const studyModule=compile('src/components/study-provider.tsx',{
 '@/lib/courses':new URL('../src/lib/courses.ts',import.meta.url).href,
 '@/lib/study-storage':new URL('../src/lib/study-storage.ts',import.meta.url).href,
 '@/lib/cloud-model':new URL('../src/lib/cloud-model.ts',import.meta.url).href,
 '@/lib/account-cache':new URL('../src/lib/account-cache.ts',import.meta.url).href,
 './auth-provider':authStub,'./cloud-study':cloudModule,
});
const {StudyProvider,useStudy}=await import(studyModule);
class Store{map=new Map();get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,String(v));}removeItem(k){this.map.delete(k);}}
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const create=element=>{const root=render(element);return {...root,update:element=>root.rerender(element),unmount:()=>root.unmount()};};
function setup(){
 const dom=new JSDOM('<!doctype html><html data-theme="light"><body></body></html>',{url:'http://127.0.0.1:3000'});
 globalThis.localStorage=new Store();globalThis.sessionStorage=new Store();globalThis.window=dom.window;globalThis.document=dom.window.document;Object.defineProperty(document,'visibilityState',{value:'visible',configurable:true});
 dom.window.HTMLElement.prototype.scrollIntoView=function(){};
 Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
 let serverOwner='A',posts=[],records=[],fail=false,hold=null;const mutations=new Map();
 globalThis.fetch=async(path,options={})=>{
  if(options.method!=='POST')return Response.json({owner:serverOwner,records});
  const input=JSON.parse(options.body);posts.push(input);
  if(hold){const wait=hold;hold=null;await wait;}
  if(fail)throw new Error('simulated offline');
  if(input.owner!==serverOwner)return Response.json({error:'account changed'},{status:409});
  const c=input.change,old=records.find(r=>r.kind===c.kind&&r.key===c.key);
  const mutationKey=serverOwner+':'+c.kind+':'+c.key;
  if(old&&mutations.get(mutationKey)===c.mutation)return Response.json({owner:serverOwner,ok:true,record:old});
  if((old?.revision||0)!==c.revision)return Response.json({owner:serverOwner,ok:false,record:old||null},{status:409});
  const record={kind:c.kind,key:c.key,value:c.value,revision:(old?.revision||0)+1};records=[...records.filter(r=>r!==old),record];mutations.set(mutationKey,c.mutation);return Response.json({owner:serverOwner,ok:true,record});
 };
 return {get posts(){return posts;},get records(){return records;},set records(v){records=v;},set owner(v){serverOwner=v;},set fail(v){fail=v;},set hold(v){hold=v;}};
}
async function loadPractice(){
 const fakeQuestion='data:text/javascript;base64,'+Buffer.from(`import React from ${JSON.stringify(url('react'))};export function PracticeQuestion({onSelect,onCheck,onRetry,disabled}){return React.createElement('div',null,...[0,1,2,3].map(i=>React.createElement('button',{key:i,disabled,onClick:()=>onSelect(i)},'Choice '+i)),React.createElement('button',{disabled,onClick:onCheck},'Check answer'),React.createElement('button',{disabled,onClick:onRetry},'Try again'));}`).toString('base64');
 const linkStub='data:text/javascript;base64,'+Buffer.from(`import React from ${JSON.stringify(url('react'))};export default function Link(props){return React.createElement('a',props);}`).toString('base64');
 return (await import(compile('src/components/practice-session.tsx',{'next/link':linkStub,'lucide-react':url('lucide-react'),'@/lib/practice-session':new URL('../src/lib/practice-session.ts',import.meta.url).href,'./study-provider':studyModule,'./practice-question':fakeQuestion,'./feedback-dialog':'data:text/javascript,export function QuestionReport(){return null}','./account-menu':'data:text/javascript,export function SyncStatus(){return null}'}))).PracticeSession;
}
test('real sync hook: debounced autosave, offline outbox, reconnection, conflict and account isolation',async(t)=>{
 const server=setup();let value,root;
 function Probe({owner}){value=useCloudStudy(owner,true);return null;}
 await act(async()=>{root=create(React.createElement(Probe,{owner:'A',key:'A'}));});
 await act(async()=>{await pause(760);});assert.equal(value.status,'saved');assert.equal(value.ready,true);
 await act(async()=>{value.change('note','chemistry/moles','one');value.change('note','chemistry/moles','two');});
 assert.equal(server.posts.length,0,'autosave waits for the debounce');assert.equal(value.status,'saving');
 assert.ok([...localStorage.map.values()].some(v=>v.includes('two')),'outbox persisted before network');
 await act(async()=>{await pause(760);});assert.equal(server.posts.length,1);assert.equal(server.records[0].value,'two');assert.equal(value.status,'saved');
 navigator.onLine=false;
 await act(async()=>value.change('note','chemistry/moles','offline edit'));await act(async()=>{await pause(760);});assert.equal(value.status,'offline');assert.equal(value.state.pending.length,1);
 navigator.onLine=true;await act(async()=>window.dispatchEvent(new window.Event('online')));await act(async()=>{await pause(760);});assert.equal(value.state.pending.length,0);assert.equal(server.records[0].value,'offline edit');
 server.records=[{kind:'note',key:'chemistry/moles',value:'other device',revision:9}];
 await act(async()=>value.change('note','chemistry/moles','my conflict'));await act(async()=>{await pause(760);});assert.equal(value.status,'conflict');assert.equal(value.state.conflicts[0].remote.value,'other device');
 await act(async()=>value.choose('note:chemistry/moles','local'));await act(async()=>{await pause(760);});assert.equal(server.records[0].value,'my conflict');assert.equal(server.records[0].revision,10);
 navigator.onLine=false;await act(async()=>value.change('note','chemistry/moles','A unsynced secret'));
 server.owner='B';server.records=[];await act(async()=>root.update(React.createElement(Probe,{owner:'B',key:'B'})));assert.equal(value.records.length,0,'B never sees A memory/cache');
 assert.ok([...localStorage.map.values()].some(v=>v.includes('A unsynced secret')),'A outbox remains recoverable');
 await act(async()=>root.unmount());
});
test('real guest provider preserves legacy notes and stores completed results once without credentials',async()=>{
 setup();const original={selected:['chemistry','calculus-ab','human-geography'],notes:{'chemistry/moles':'retained note'},completed:['chemistry/moles'],saved:[],watchedVideos:[],lastTopic:null};
 localStorage.setItem('ap-hub:v1',JSON.stringify(original));globalThis.__accountHookAuth={ready:true,user:null};let study,root;
 function Probe(){study=useStudy();return null;}
 await act(async()=>{root=create(React.createElement(StudyProvider,null,React.createElement(Probe)));});assert.equal(study.notes['chemistry/moles'],'retained note');assert.equal(study.syncStatus,'guest');
 await act(async()=>study.setNote('calculus-ab/limits','a new note'));assert.equal(JSON.parse(localStorage.getItem('ap-hub:v1')).notes['chemistry/moles'],'retained note');
 const a={id:crypto.randomUUID(),courseId:'chemistry',topicId:'moles',questionIds:['q1'],total:1,correct:0,answered:1,percent:0,startedAt:'2026-10-21T12:00:00.000Z',completedAt:'2026-10-21T12:01:00.000Z'};
 await act(async()=>study.recordAttempt(a));await act(async()=>study.recordAttempt({...a,correct:1,percent:100}));assert.equal(study.attempts.length,1);assert.equal(study.attempts[0].percent,0);
 await act(async()=>root.unmount());
});
test('real import hook retains cloud notes and waits for conflict resolution before an import receipt',async()=>{
 const server=setup();server.records=[{kind:'note',key:'chemistry/moles',value:'cloud note',revision:2}];let value,root;
 function Probe(){value=useCloudStudy('A',true);return null;}
 await act(async()=>{root=create(React.createElement(Probe));});await act(async()=>{await pause(760);});
 await act(async()=>{await value.importRecords([{kind:'note',key:'chemistry/moles',value:'guest note'},{kind:'course',key:'human-geography',value:true}],'a'.repeat(64));});
 assert.equal(value.state.conflicts.length,1);assert.equal(server.records[0].value,'cloud note');
 await act(async()=>{await pause(760);});assert.equal(server.records.some(r=>r.kind==='import'),false);
 await act(async()=>value.choose('note:chemistry/moles','remote'));await act(async()=>{await pause(760);});await act(async()=>{await pause(760);});
 assert.equal(server.records.some(r=>r.kind==='import'),true);assert.equal(server.records.find(r=>r.kind==='note').value,'cloud note');
 await act(async()=>root.unmount());
});
test('actual Practice reducer/provider integration persists the original score once across review and retries',async()=>{
 setup();globalThis.__accountHookAuth={ready:true,user:null};
 const PracticeSession=await loadPractice();const entries=practiceEntries({courseId:'chemistry',unitNumber:1,topicId:'moles'}).slice(0,2);let root;
 await act(async()=>{root=create(React.createElement(StudyProvider,null,React.createElement(PracticeSession,{entries})));});
 const correct=entries[0].question.correctIndex,wrong=(correct+1)%4;
 await act(async()=>fireEvent.click(root.getByRole('button',{name:'Choice '+wrong})));
 await act(async()=>fireEvent.click(root.getByRole('button',{name:'Check answer'})));
 await act(async()=>fireEvent.click(root.getByRole('button',{name:'Try again'})));
 await act(async()=>fireEvent.click(root.getByRole('button',{name:'Choice '+correct})));
 await act(async()=>fireEvent.click(root.getByRole('button',{name:'Finish practice'})));
 let attempts=JSON.parse(localStorage.getItem('prepatlas:guest-attempts:v1'));assert.equal(attempts.length,1);assert.equal(attempts[0].correct,0);assert.equal(attempts[0].total,2);assert.equal(attempts[0].answered,1);
 await act(async()=>fireEvent.click(root.getByRole('button',{name:'Review answers'})));
 await act(async()=>fireEvent.click(root.getByRole('button',{name:'Next question'})));
 await act(async()=>fireEvent.click(root.getByRole('button',{name:'Choice '+entries[1].question.correctIndex})));
 await act(async()=>fireEvent.click(root.getByRole('button',{name:'Check answer'})));
 await act(async()=>fireEvent.click(root.getByRole('button',{name:'Finish practice'})));
 assert.ok(root.getByText('Score: 0 of 2 (0%)'),'reviewing previously unanswered questions must not change the displayed completed score');
 assert.equal(JSON.parse(localStorage.getItem('prepatlas:guest-attempts:v1')).length,1);
 await act(async()=>root.unmount());
});

test('Practice waits for account/progress initialization instead of accepting answers that would be reset',async()=>{
 setup();globalThis.__accountHookAuth={ready:false,user:null};const Practice=await loadPractice();
 const entries=practiceEntries({courseId:'chemistry',unitNumber:1,topicId:'moles'}).slice(0,2);let root;
 const element=()=>React.createElement(StudyProvider,null,React.createElement(Practice,{entries}));
 try{
  await act(async()=>{root=create(element());});
  assert.equal(root.getByRole('button',{name:'Finish practice'}).disabled,true,'practice cannot finish before identity/progress are loaded');
  assert.equal(root.getByRole('button',{name:'Choice 0'}).disabled,true,'answer controls must wait for initialization');
  globalThis.__accountHookAuth={ready:true,user:null};await act(async()=>root.update(element()));
  assert.equal(root.getByRole('button',{name:'Finish practice'}).disabled,false);
 }finally{if(root)await act(async()=>root.unmount());}
});

test('all study types and completed scores survive refresh, guest sign-out and a new authenticated session',async()=>{
 const server=setup();let study,root;
 const guestRaw=JSON.stringify({selected:['biology'],notes:{'chemistry/moles':'guest original'},completed:[],saved:[],watchedVideos:[],lastTopic:null});localStorage.setItem('ap-hub:v1',guestRaw);
 globalThis.__accountHookAuth={ready:true,user:{id:'A'}};
 function Probe(){study=useStudy();return null;}
 const mount=()=>React.createElement(StudyProvider,null,React.createElement(Probe));
 const videoA=syncCatalog.videos.find(id=>id.startsWith('mr-sinn-')),videoB=syncCatalog.videos.find(id=>id.startsWith('heimler-'));
 const attempt={id:crypto.randomUUID(),courseId:'calculus-ab',topicId:'limits',questionIds:[practiceEntries({courseId:'calculus-ab',unitNumber:1,topicId:'limits'})[0].id],total:1,correct:1,answered:1,percent:100,startedAt:'2026-10-21T12:00:00.000Z',completedAt:'2026-10-21T12:01:00.000Z'};
 try{
  await act(async()=>{root=create(mount());});await act(async()=>{await pause(760);});
  assert.equal(study.notes['chemistry/moles'],undefined,'guest data is never auto-imported');
  await act(async()=>{study.toggleCourse('chemistry');study.toggleCourse('calculus-ab');study.toggleCourse('human-geography');study.setNote('chemistry/moles','chemistry account note');study.setNote('calculus-ab/limits','calculus account note');study.setNote('human-geography/topic-1-1','geography account note');study.toggleCompleted('human-geography/topic-1-1');study.toggleWatchedVideo(videoA);study.toggleWatchedVideo(videoB);study.toggleSaved(syncCatalog.resources[0]);study.setPreferredInstructor('human-geography','heimler');study.visitTopic('calculus-ab/limits');study.recordAttempt(attempt);});
  await act(async()=>{await pause(800);});assert.equal(study.syncStatus,'saved');assert.equal(server.posts.length,14);
  const expected={notes:study.notes,selected:study.selected,completed:study.completed,watched:study.watchedVideos,saved:study.saved,instructors:study.preferredInstructors,last:study.lastTopic,attempts:study.attempts};
  await act(async()=>root.unmount());await act(async()=>{root=create(mount());});await act(async()=>{await pause(760);});
  assert.deepEqual({notes:study.notes,selected:study.selected,completed:study.completed,watched:study.watchedVideos,saved:study.saved,instructors:study.preferredInstructors,last:study.lastTopic,attempts:study.attempts},expected);
  assert.equal(server.posts.length,14,'refresh reads without rewriting saved progress');
  globalThis.__accountHookAuth={ready:true,user:null};await act(async()=>root.update(mount()));assert.equal(study.notes['chemistry/moles'],'guest original');assert.equal(study.attempts.length,0);
  globalThis.__accountHookAuth={ready:true,user:{id:'A'}};await act(async()=>root.update(mount()));await act(async()=>{await pause(760);});assert.deepEqual(study.attempts,[attempt]);assert.equal(study.notes['calculus-ab/limits'],'calculus account note');
  assert.equal(localStorage.getItem('ap-hub:v1'),guestRaw,'sign-out/session changes do not overwrite guest data');
  // A completely new device/browser has no account cache; the server snapshot restores it.
  await act(async()=>root.unmount());localStorage=new Store();sessionStorage=new Store();await act(async()=>{root=create(mount());});await act(async()=>{await pause(760);});
  assert.deepEqual(study.watchedVideos,[videoA,videoB]);assert.deepEqual(study.attempts,[attempt]);assert.equal(study.notes['human-geography/topic-1-1'],'geography account note');
 }finally{if(root)await act(async()=>root.unmount());}
});

test('typing during a delayed save is rebased; a committed response lost in transit retries idempotently',async()=>{
 const server=setup();let value,root,release;
 function Probe(){value=useCloudStudy('A',true);return null;}
 try{
  await act(async()=>{root=create(React.createElement(Probe));});await act(async()=>{await pause(760);});
  server.hold=new Promise(resolve=>{release=resolve;});await act(async()=>value.change('note','chemistry/moles','first edit'));
  await act(async()=>{await pause(760);});await act(async()=>value.change('note','chemistry/moles','latest edit'));
  await act(async()=>{release();await pause(0);});assert.equal(server.records[0].value,'latest edit');assert.equal(value.state.pending.length,0);
  const transport=globalThis.fetch;let loseResponse=true;
  globalThis.fetch=async(path,options)=>{const response=await transport(path,options);if(options?.method==='POST'&&loseResponse){loseResponse=false;throw new Error('response lost after server commit');}return response;};
  await act(async()=>value.change('note','chemistry/moles','committed once'));await act(async()=>{await pause(760);});assert.equal(value.status,'error');assert.equal(value.state.pending.length,1);const sent=value.state.pending[0];
  await act(async()=>value.retry());await act(async()=>{await pause(760);});assert.equal(value.status,'saved');assert.equal(value.state.pending.length,0);assert.equal(value.state.conflicts.length,0);assert.equal(server.records[0].revision,3);assert.equal(server.posts.at(-1).change.mutation,sent.mutation);
 }finally{if(release)release();if(root)await act(async()=>root.unmount());}
});

test('late save responses cannot repopulate another account after an identity switch',async()=>{
 const server=setup();let value,root,release;function Probe({owner}){value=useCloudStudy(owner,true);return null;}
 try{
  await act(async()=>{root=create(React.createElement(Probe,{key:'A',owner:'A'}));});await act(async()=>{await pause(760);});
  const transport=globalThis.fetch;let holdResponse=true;
  globalThis.fetch=async(path,options)=>{const response=await transport(path,options);if(options?.method==='POST'&&holdResponse){holdResponse=false;await new Promise(resolve=>{release=resolve;});}return response;};
  await act(async()=>value.change('note','chemistry/moles','A private pending note'));await act(async()=>{await pause(760);});
  server.owner='B';server.records=[];await act(async()=>root.update(React.createElement(Probe,{key:'B',owner:'B'})));
  await act(async()=>{release();await pause(760);});assert.equal(value.status,'saved');assert.equal(value.records.length,0);assert.ok([...localStorage.map.values()].some(raw=>raw.includes('A private pending note')));
 }finally{if(release)release();if(root)await act(async()=>root.unmount());}
});
test('actual AuthProvider revalidates account changes but does not lock an unchanged account on another tab event',async()=>{
 setup();let user={id:'A',email:'student@example.invalid',displayName:''},auth,root,resolve;
 const channels=[];
 const oldChannel=globalThis.BroadcastChannel;
 globalThis.BroadcastChannel=class{constructor(){channels.push(this);}postMessage(){}close(){}};
 globalThis.fetch=async()=>{if(resolve)await new Promise(r=>{resolve.release=r;});return Response.json({configured:true,registration:false,deletion:false,user});};
 const browserStub='data:text/javascript,export function browserSupabase(){return null}';
 const mod=await import(compile('src/components/auth-provider.tsx',{'@/lib/supabase/browser':browserStub}));
 function Probe(){auth=mod.useAuth();return null;}
 try{
  await act(async()=>{root=create(React.createElement(mod.AuthProvider,null,React.createElement(Probe)));});assert.equal(auth.user.id,'A');assert.equal(auth.ready,true);
  resolve={};await act(async()=>{channels[0].onmessage({data:{userId:'A'}});});assert.equal(auth.ready,true,'same-account refresh keeps study memory mounted');
  await act(async()=>{resolve.release();resolve=null;await pause(0);});
  user={id:'B',email:'other@example.invalid',displayName:''};resolve={};
  await act(async()=>channels[0].onmessage({data:{userId:'B'}}));assert.equal(auth.user,null);assert.equal(auth.ready,false,'previous account hidden before another identity loads');
  await act(async()=>{await pause(10);});await act(async()=>{resolve.release();resolve=null;await pause(0);});assert.equal(auth.user.id,'B');
 }finally{if(root)await act(async()=>root.unmount());globalThis.BroadcastChannel=oldChannel;}
});
test('duplicated page storage is forked so separate live pages retain independent unsynced notes',async()=>{
 setup();navigator.onLine=false;let first,second,a,b;
 function First(){first=useCloudStudy('A',true);return null;}function Second(){second=useCloudStudy('A',true);return null;}
 await act(async()=>{a=create(React.createElement(First));});await act(async()=>first.change('note','chemistry/moles','source edit'));
 const sourceKey=[...localStorage.map.keys()].find(k=>k.startsWith('prepatlas:account:v1:A:'));
 await act(async()=>{b=create(React.createElement(Second));});await act(async()=>second.change('note','chemistry/moles','duplicate edit'));
 assert.equal(JSON.parse(localStorage.getItem(sourceKey)).state.pending[0].value,'source edit');
 assert.ok([...localStorage.map.values()].some(raw=>raw.includes('duplicate edit')));
 assert.equal(first.state.pending[0].value,'source edit');assert.equal(second.state.pending[0].value,'duplicate edit');
 await act(async()=>{a.unmount();b.unmount();});
});

test('actual AuthProvider keeps identity on failed logout and ignores stale identity responses after successful logout',async()=>{
 setup();let user={id:'A',email:'synthetic@example.invalid',displayName:''},auth,root,release,hold=false,failLogout=true;
 const oldChannel=globalThis.BroadcastChannel;globalThis.BroadcastChannel=class{postMessage(){}close(){}};
 globalThis.fetch=async(path,options)=>{
  if(options?.method==='POST'){if(failLogout)return Response.json({error:'Sign out failed'},{status:503});user=null;return Response.json({ok:true});}
  const result={configured:true,registration:false,deletion:false,user};if(hold){hold=false;await new Promise(resolve=>{release=resolve;});}return Response.json(result);
 };
 const mod=await import(compile('src/components/auth-provider.tsx',{'@/lib/supabase/browser':'data:text/javascript,export function browserSupabase(){return null}'}));
 function Probe(){auth=mod.useAuth();return null;}
 try{
  await act(async()=>{root=create(React.createElement(mod.AuthProvider,null,React.createElement(Probe)));});
  await act(async()=>assert.equal(await auth.signOut(),false));assert.equal(auth.user.id,'A');
  hold=true;let stale;await act(async()=>{stale=auth.refresh();});failLogout=false;
  await act(async()=>assert.equal(await auth.signOut(),true));assert.equal(auth.user,null);
  await act(async()=>{release();await stale;});assert.equal(auth.user,null,'late A response must never restore a signed-out identity');
 }finally{if(release)release();if(root)await act(async()=>root.unmount());globalThis.BroadcastChannel=oldChannel;}
});

test('pending notes survive a failed save and offline reload, then reconnect without losing the edit',async()=>{
 const server=setup();let value,root;function Probe(){value=useCloudStudy('A',true);return null;}
 try{
  await act(async()=>{root=create(React.createElement(Probe));});await act(async()=>{await pause(760);});
  server.fail=true;await act(async()=>value.change('note','calculus-ab/limits','offline draft retained'));await act(async()=>{await pause(760);});assert.equal(value.status,'error');
  await act(async()=>root.unmount());navigator.onLine=false;await act(async()=>{root=create(React.createElement(Probe));});await act(async()=>{await pause(760);});
  assert.equal(value.status,'offline');assert.equal(value.ready,true);assert.equal(value.state.pending[0].value,'offline draft retained');assert.equal(value.records.find(r=>r.kind==='note').value,'offline draft retained');
  server.fail=false;navigator.onLine=true;await act(async()=>window.dispatchEvent(new window.Event('online')));await act(async()=>{await pause(760);});assert.equal(value.status,'saved');assert.equal(value.state.pending.length,0);assert.equal(server.records[0].value,'offline draft retained');
 }finally{if(root)await act(async()=>root.unmount());}
});

test('storage quota and cloud failures remain visible; pending edits are retained and retry can recover',async()=>{
 const server=setup();let value,root;function Probe(){value=useCloudStudy('A',true);return null;}
 try{
  await act(async()=>{root=create(React.createElement(Probe));});await act(async()=>{await pause(760);});
  const write=localStorage.setItem;localStorage.setItem=()=>{throw new Error('simulated quota');};server.fail=true;
  await act(async()=>value.change('note','chemistry/moles','retained in memory'));await act(async()=>{await pause(760);});assert.equal(value.storageError,true);assert.equal(value.status,'error');assert.equal(value.state.pending[0].value,'retained in memory');
  localStorage.setItem=write;server.fail=false;await act(async()=>value.retry());await act(async()=>{await pause(760);});assert.equal(value.storageError,false);assert.equal(value.status,'saved');assert.equal(server.records[0].value,'retained in memory');
 }finally{if(root)await act(async()=>root.unmount());}
});

test('dashboard derives separate completion, watched and first-score counts from the authenticated snapshot',async()=>{
 const server=setup();globalThis.__accountHookAuth={ready:true,user:{id:'A'}};
 const resources=publishOfficialResources(resourceConfig,courses),video=resources.find(r=>r.courseId==='chemistry'),watched=syncCatalog.videos.find(id=>id.startsWith(video.id+':'));
 const a={id:crypto.randomUUID(),courseId:'chemistry',topicId:'moles',questionIds:[practiceEntries({courseId:'chemistry',unitNumber:1,topicId:'moles'})[0].id],total:1,correct:0,answered:1,percent:0,startedAt:'2026-10-21T12:00:00.000Z',completedAt:'2026-10-21T12:01:00.000Z'};
 server.records=[{kind:'course',key:'chemistry',value:true,revision:1},{kind:'topic',key:'chemistry/moles',value:{completed:true,lastStudied:a.completedAt},revision:1},{kind:'video',key:watched,value:true,revision:1},{kind:'attempt',key:a.id,value:a,revision:1}];
 const linkStub='data:text/javascript;base64,'+Buffer.from(`import React from ${JSON.stringify(url('react'))};export default function Link(props){return React.createElement('a',props);}`).toString('base64');
 const {ProgressDashboard}=await import(compile('src/components/progress-dashboard.tsx',{'next/link':linkStub,'@/lib/courses':new URL('../src/lib/courses.ts',import.meta.url).href,'@/lib/resource-policy':new URL('../src/lib/resource-policy.ts',import.meta.url).href,'./study-provider':studyModule,'./auth-provider':authStub,'./account-menu':'data:text/javascript,export function SyncStatus(){return null}'}));
 let root;
 try{
  await act(async()=>{root=create(React.createElement(StudyProvider,null,React.createElement(ProgressDashboard,{resources})));});await act(async()=>{await pause(760);});
  assert.ok(root.getByText('1 / 91 available topics complete · 1%'));assert.ok(root.getByText('1 / 102 videos marked watched'));assert.ok(root.getByText('0/1 · 0%'));
  for(const label of ['Topics marked complete','Individual videos watched','Completed Practice attempts'])assert.equal(root.getByText(label).parentElement.querySelector('strong').textContent,'1');
  assert.equal(server.posts.length,0,'rendering progress does not write or import data');
 }finally{if(root)await act(async()=>root.unmount());}
});
