// Run only against an isolated local test server and its NEW, disposable database.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { openFeedbackStore, moderateReview } from '../src/lib/feedback-store.ts';
const base=process.env.BASE_URL;
assert.equal(process.env.FEEDBACK_ISOLATED_TEST,'1','Explicit isolated test opt-in required');
assert.ok(process.env.PREPATLAS_FEEDBACK_DB && base && new URL(base).hostname==='127.0.0.1' && new URL(base).port!=='3000','Never seed live preview feedback');
const db=openFeedbackStore();
try {
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM reviews').get().n,0,'Use a new disposable database');
  const session=await fetch(base+'/api/feedback/session');assert.equal(session.status,200);
  const cookie=session.headers.get('set-cookie').split(';')[0];
  const send=payload=>fetch(base+'/api/feedback',{method:'POST',headers:{origin:base,'content-type':'application/json',cookie},body:JSON.stringify({...payload,submissionId:payload.submissionId || randomUUID(),website:''})});
  const privateText='PRIVATE_QA_ONLY_DO_NOT_PUBLISH';
  const privateResult=await send({kind:'review',rating:1,text:privateText,publicOptIn:false});assert.equal(privateResult.status,201);
  const pendingResult=await send({kind:'review',rating:1,text:'RAW_QA_ONLY',publicOptIn:true});assert.equal(pendingResult.status,201);
  const pendingId=(await pendingResult.json()).id;
  let home=await(await fetch(base)).text();
  assert.ok(!home.includes('student-reviews-title'));assert.ok(!home.includes(privateText));
  const excerpt='<img src=x onerror=alert(1)> ISOLATED TEST TEXT';
  moderateReview(db,pendingId,'approved',excerpt,true);
  home=await(await fetch(base)).text();
  assert.ok(home.includes('student-reviews-title'));assert.ok(home.includes('&lt;img src=x onerror=alert(1)&gt; ISOLATED TEST TEXT'));
  assert.ok(!home.includes('<img src=x'));assert.ok(!home.includes(privateText));assert.ok(!home.includes('RAW_QA_ONLY'));
  assert.ok(home.includes('1 of 5 stars'));assert.ok(home.includes('PrepAtlas student'));
  moderateReview(db,pendingId,'rejected');
  assert.ok(!(await(await fetch(base)).text()).includes('student-reviews-title'));
  const report={kind:'question-report',questionId:'chem-1-1-001',displayedNumber:17,category:'other',comment:'ISOLATED HTTP TEST',submissionId:randomUUID()};
  const result=await send(report);assert.equal(result.status,201);const receipt=await result.json();
  const repeated=await send(report);assert.equal(repeated.status,200);assert.equal((await repeated.json()).id,receipt.id);
  const row=db.prepare('SELECT * FROM question_reports WHERE id=?').get(receipt.id);
  assert.equal(row.topic_id,'moles');assert.equal(row.displayed_number,17);assert.equal(row.course_id,'chemistry');
  for(const path of ['/api/feedback','/api/feedback/reviews','/api/feedback/reports','/api/feedback/admin','/feedback.sqlite']) {
    const response=await fetch(base+path);assert.ok([404,405].includes(response.status),path+' must not expose records');
    assert.ok(!(await response.text()).includes(privateText));
  }
  assert.equal((await send({...report,submissionId:randomUUID(),category:'invalid'})).status,400);
  assert.equal((await fetch(base+'/api/feedback',{method:'POST',headers:{origin:'https://evil.example','content-type':'application/json',cookie},body:JSON.stringify(report)})).status,403);
  console.log('PASS isolated production feedback: durable API receipts, canonical report metadata, pending/private gates, low-star moderation, escaped public text, unpublication and private endpoint denial. No synthetic review published in live preview.');
} finally {db.close();}
