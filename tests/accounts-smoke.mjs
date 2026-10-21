import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://127.0.0.1:3000';
// Production prerenders useSearchParams forms behind their existing Suspense shells.
const productionShells={'/login':'Loading sign in…','/signup':'Loading account form…','/forgot-password':'Loading recovery…','/reset-password':'Loading reset form…'};
for(const [path,text] of [['/login','Welcome back.'],['/signup','Make room for your progress.'],['/forgot-password','Reset your password.'],['/reset-password','Choose a new password.'],['/account','Account &amp; settings'],['/progress','My progress'],['/privacy','DRAFT'],['/terms','DRAFT']]){
 const r=await fetch(base+path);assert.equal(r.status,200,path);const html=await r.text();assert.ok(html.includes(text)||(process.env.PREPATLAS_SMOKE_PRODUCTION==='1'&&productionShells[path]&&html.includes(productionShells[path])&&html.includes('/_next/static/')),path);console.log('PASS',path);
}
const status=await fetch(base+'/api/account');assert.match(status.headers.get('cache-control'),/no-store/);const account=await status.json();
if(!account.configured){
 assert.equal(account.user,null);assert.equal(account.registration,false);
 assert.equal((await fetch(base+'/api/sync')).status,401);
 for(const action of ['login','signup','forgot','google','logout']){
  const r=await fetch(base+'/api/auth',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({action})});assert.equal(r.status,503,action);assert.ok((await r.json()).error);
 }
 console.log('PASS unconfigured authentication fails honestly; guest routes work; private data unavailable');
}
for(const path of ['/auth/callback?code=unusable&next=https://evil.invalid','/auth/confirm?type=recovery&token_hash=unusable&next=//evil.invalid']){
 const r=await fetch(base+path,{redirect:'manual'});assert.equal(r.status,307);assert.ok(r.headers.get('location').startsWith(base+'/login?error='));assert.match(r.headers.get('cache-control'),/no-store/);
}
console.log('PASS callback failures stay on the configured origin and never expose tokens');
