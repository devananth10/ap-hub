// Actual Route Handlers with a simulated authenticated SDK; never hosted writes.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {practiceEntries} from '../src/lib/practice.ts';
import {courses} from '../src/lib/courses.ts';
const require=createRequire(import.meta.url);
const moduleURL=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const stub=moduleURL('export async function serverSupabase(){return globalThis.__syncMockClient}');
const config=moduleURL('export function appOrigin(){return "http://127.0.0.1:3000"}');
function compile(file,imports){let code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;for(const[k,v]of Object.entries(imports))code=code.replaceAll(JSON.stringify(k),JSON.stringify(v));return moduleURL(code+'\n//# sourceURL='+file);}
const helper=compile('src/lib/account-server.ts',{'next/server':pathToFileURL(require.resolve('next/server')).href,'./account-policy':new URL('../src/lib/account-policy.ts',import.meta.url).href,'./supabase/config':config,'./supabase/server':stub});
const {GET,POST}=await import(compile('src/app/api/sync/route.ts',{'@/lib/account-server':helper,'@/lib/cloud-model':new URL('../src/lib/cloud-model.ts',import.meta.url).href,'@/lib/practice':new URL('../src/lib/practice.ts',import.meta.url).href,'@/lib/courses':new URL('../src/lib/courses.ts',import.meta.url).href}));
const send=(value,origin='http://127.0.0.1:3000')=>POST(new Request('http://127.0.0.1:3000/api/sync',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(value)}));
const attempt=entries=>({id:crypto.randomUUID(),courseId:entries.every(e=>e.course.id===entries[0].course.id)?entries[0].course.id:null,topicId:entries.every(e=>e.course.id===entries[0].course.id&&e.topic.id===entries[0].topic.id)?entries[0].topic.id:null,questionIds:entries.map(e=>e.id),total:entries.length,correct:1,answered:1,percent:Math.round(100/entries.length),startedAt:'2026-10-21T12:00:00.000Z',completedAt:'2026-10-21T12:01:00.000Z'});
function client(records=[],owner='A'){
 const calls={reads:[],writes:[]};
 globalThis.__syncMockClient={auth:{getUser:async()=>({data:{user:{id:owner}},error:null})},from(table){
  const read={table,orders:[]};calls.reads.push(read);
  const query={select(fields){read.fields=fields;return query;},eq(field,value){read.filter={field,value};return query;},order(field){read.orders.push(field);return query;},async range(start,end){read.range=[start,end];return {data:records.slice(start,end+1),error:null};}};return query;
 },async rpc(name,args){calls.writes.push({name,args});return {data:{ok:true,record:{kind:args.p_kind,key:args.p_key,value:args.p_value,revision:1}},error:null};}};
 return calls;
}

test('topic, course and all-course finished attempts reach the authenticated save RPC with valid question scopes',async()=>{
 for(const scope of [{courseId:'chemistry',unitNumber:1,topicId:'moles'},{courseId:'calculus-ab',unitNumber:1,topicId:'limits'},{courseId:'human-geography',unitNumber:1,topicId:'topic-1-1'},{courseId:'chemistry'},{}]){
  const calls=client(),available=practiceEntries(scope);
  const entries=scope.topicId?available.slice(0,11):[available[0],available.find(e=>scope.courseId?e.topic.id!==available[0].topic.id:e.course.id!==available[0].course.id)];
  const a=attempt(entries);
  const response=await send({owner:'A',change:{kind:'attempt',key:a.id,value:a,revision:0,mutation:crypto.randomUUID()}});
  assert.equal(response.status,200,JSON.stringify(scope));assert.equal(calls.writes.length,1);assert.equal(calls.writes[0].name,'save_study_change');assert.equal(calls.writes[0].args.p_key,a.id);assert.ok(!('user_id'in calls.writes[0].args));
 }
});

test('sync denies anonymous, forged owners, extra ownership fields, wrong scopes and cross-origin writes',async()=>{
 globalThis.__syncMockClient=null;assert.equal((await GET()).status,401);assert.equal((await send({})).status,401);
 const calls=client([], 'B'),change={kind:'note',key:'chemistry/moles',value:'synthetic note',revision:0,mutation:crypto.randomUUID()};
 assert.equal((await send({owner:'A',change})).status,409);
 assert.equal((await send({owner:'B',change,user_id:'A'})).status,400);
 assert.equal((await send({owner:'B',change:{...change,user_id:'A'}})).status,400);
 assert.equal((await send({owner:'B',change},'https://untrusted.invalid')).status,400);
 const a=attempt(practiceEntries({courseId:'chemistry',unitNumber:1,topicId:'moles'}).slice(0,2));a.questionIds[0]=practiceEntries({courseId:'calculus-ab',unitNumber:1,topicId:'limits'})[0].id;
 assert.equal((await send({owner:'B',change:{kind:'attempt',key:a.id,value:a,revision:0,mutation:crypto.randomUUID()}})).status,400);assert.equal(calls.writes.length,0);
});

test('private snapshot pagination loads over 500 canonical records with verified ownership and no private caching',async()=>{
 const records=courses.flatMap(c=>c.units.flatMap(u=>u.topics.flatMap(t=>[{kind:'note',key:c.id+'/'+t.id,value:'synthetic '+t.id,revision:1},{kind:'topic',key:c.id+'/'+t.id,value:{completed:true,lastStudied:null},revision:1}])));
 const calls=client(records);const response=await GET(),body=await response.json();assert.equal(response.status,200);assert.equal(body.owner,'A');assert.equal(body.records.length,502);assert.equal(calls.reads.length,2);assert.match(response.headers.get('cache-control'),/private.*no-store/);
 for(const read of calls.reads){assert.equal(read.table,'study_snapshot');assert.deepEqual(read.filter,{field:'user_id',value:'A'});assert.deepEqual(read.orders,['kind','key']);}
 assert.deepEqual(calls.reads.map(r=>r.range),[[0,499],[500,999]]);
});

test('failed or malformed snapshots/saves do not report success or leak SDK error details',async()=>{
 let calls=client([{kind:'note',key:'unknown/topic',value:'synthetic private text',revision:1}]);let r=await GET();assert.equal(r.status,409);assert.ok(!(await r.text()).includes('synthetic private text'));
 calls=client();globalThis.__syncMockClient.rpc=async()=>({data:null,error:{message:'private provider detail'}});
 r=await send({owner:'A',change:{kind:'note',key:'chemistry/moles',value:'synthetic note',revision:0,mutation:crypto.randomUUID()}});assert.equal(r.status,503);assert.ok(!(await r.text()).includes('private provider detail'));
 globalThis.__syncMockClient.auth.getUser=async()=>({data:{user:null},error:{message:'expired session'}});assert.equal((await GET()).status,401);
});
