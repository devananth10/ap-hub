import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url);
const moduleURL=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const stub=moduleURL('export async function serverSupabase(){return globalThis.__authMockClient}');
const config=moduleURL('export function appOrigin(){return globalThis.__authTestOrigin || "http://127.0.0.1:3000"} export function registrationEnabled(){return globalThis.__registrationTestEnabled===true}');
function compile(file,imports){let code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;for(const[k,v]of Object.entries(imports))code=code.replaceAll(JSON.stringify(k),JSON.stringify(v));return moduleURL(code+'\n//# sourceURL='+file);}
const helper=compile('src/lib/account-server.ts',{'next/server':pathToFileURL(require.resolve('next/server')).href,'./account-policy':new URL('../src/lib/account-policy.ts',import.meta.url).href,'./supabase/config':config,'./supabase/server':stub});
const {POST}=await import(compile('src/app/api/auth/route.ts',{'@/lib/account-server':helper,'@/lib/supabase/server':stub,'@/lib/supabase/config':config,'@/lib/account-policy':new URL('../src/lib/account-policy.ts',import.meta.url).href,'@/lib/recovery-proof':new URL('../src/lib/recovery-proof.ts',import.meta.url).href}));
const {authenticated}=await import(helper);
const send=(body,origin='http://127.0.0.1:3000')=>POST(new Request('http://127.0.0.1:3000/api/auth',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)}));
test('actual auth handler with a mock SDK: generic login errors, closed signup/OAuth, safe redirects and logout failures',async()=>{
 let calls=[];
 globalThis.__registrationTestEnabled=false;
 globalThis.__authMockClient={auth:{
  signInWithPassword:async()=>{calls.push('login');return {error:{message:'private provider error'}};},
  signUp:async()=>{calls.push('signup');return {error:null};},
  signInWithOAuth:async args=>{calls.push(args);return {data:{url:'https://accounts.google.com/example-test-flow'},error:null};},
  signOut:async()=>({error:{message:'unavailable'}}),getUser:async()=>({data:{user:null},error:{message:'expired'}}),
 }};
 for(const action of ['signup','google']){const r=await send({action,email:'student@example.invalid',password:'test-only-password'});assert.equal(r.status,403);}assert.equal(calls.length,0);
 let r=await send({action:'login',email:'student@example.invalid',password:'test-only-password'});assert.equal(r.status,400);assert.ok(!(await r.text()).includes('private provider error'));
 const before=calls.length;r=await send({action:'login',email:'student@example.invalid',password:'test-only-password'},'https://attacker.invalid');assert.equal(r.status,403);assert.equal(calls.length,before,'CSRF fails before reaching SDK');
 assert.equal(await authenticated(),null,'expired identity is not authorized by cookies alone');
 assert.equal((await send({action:'logout'})).status,503,'failed logout is not reported as success');
 globalThis.__registrationTestEnabled=true;
 r=await send({action:'google',next:'https://attacker.invalid'});assert.equal(r.status,200);const args=calls.at(-1);assert.equal(new URL(args.options.redirectTo).origin,'http://127.0.0.1:3000');assert.equal(new URL(args.options.redirectTo).searchParams.get('next'),'/account');
 const signup1=await (await send({action:'signup',email:'student@example.invalid',password:'test-only-password'})).json();
 globalThis.__authMockClient.auth.signUp=async()=>({error:{message:'already registered'}});
 const signup2=await (await send({action:'signup',email:'student@example.invalid',password:'test-only-password'})).json();assert.deepEqual(signup1,signup2,'signup cannot enumerate existing addresses');
 globalThis.__authMockClient=null;assert.equal((await send({action:'login'})).status,503);
});

test('recovery behind an HTTPS origin rejects loopback and logs only provider status', async t => {
 const publicOrigin = 'https://study.example.invalid';
 const previousSecret = process.env.AUTH_FLOW_SECRET;
 process.env.AUTH_FLOW_SECRET = 'test-only-recovery-signing-secret-12345';
 globalThis.__authTestOrigin = publicOrigin;
 t.after(() => {
   delete globalThis.__authTestOrigin;
   delete globalThis.__authMockClient;
   if (previousSecret === undefined) delete process.env.AUTH_FLOW_SECRET;
   else process.env.AUTH_FLOW_SECRET = previousSecret;
 });

 const calls = [];
 let providerError = null;
 globalThis.__authMockClient = {auth: {
   async resetPasswordForEmail(email, options) {
     calls.push({email, redirect: options.redirectTo});
     return {error: providerError};
   },
 }};
 const warn = t.mock.method(console, 'warn', () => {});
 const payload = {action: 'forgot', email: 'student@example.invalid'};

 const rejected = await send(payload);
 assert.equal(rejected.status, 403);
 assert.equal(calls.length, 0);

 const accepted = await send(payload, publicOrigin);
 assert.equal(accepted.status, 200);
 assert.deepEqual(calls, [{email: payload.email, redirect: `${publicOrigin}/auth/callback?next=%2Freset-password`}]);

 providerError = {status: 500, message: 'private provider details', code: 'private test marker'};
 const failed = await send(payload, publicOrigin);
 assert.equal(failed.status, accepted.status);
 assert.deepEqual(await failed.json(), await accepted.json());
 assert.equal(warn.mock.callCount(), 1);
 assert.deepEqual(warn.mock.calls[0].arguments, ['[auth] Password recovery provider error', {status: 500}]);
});
