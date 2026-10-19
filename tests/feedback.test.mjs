import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateFeedback, reportReasons, validatePublicText } from '../src/lib/feedback.ts';
import { openFeedbackStore, createFeedbackSession, saveFeedback, publicReviews, moderateReview, updateReportStatus } from '../src/lib/feedback-store.ts';
import { handleFeedback } from '../src/lib/feedback-http.ts';
import { practiceEntries } from '../src/lib/practice.ts';

function fixture() {
  const directory=mkdtempSync(join(tmpdir(),'prepatlas-feedback-test-')), file=join(directory,'feedback.sqlite');
  return {file,cleanup:()=>rmSync(directory,{recursive:true,force:true})};
}
const review = (extra={}) => ({kind:'review',submissionId:randomUUID(),rating:1,text:'',publicOptIn:false,website:'',...extra});
const report = (extra={}) => ({kind:'question-report',submissionId:randomUUID(),questionId:practiceEntries()[0].id,displayedNumber:7,category:'other',comment:'',website:'',...extra});
const request = (payload,cookie='',extra={}) => new Request('http://127.0.0.1:3000/api/feedback',{method:'POST',headers:{origin:'http://127.0.0.1:3000','content-type':'application/json',cookie,...extra},body:typeof payload === 'string' ? payload : JSON.stringify(payload)});
async function session(file) {
  const result=await handleFeedback(new Request('http://127.0.0.1:3000/api/feedback/session'),true,file);
  assert.equal(result.status,200);
  assert.match(result.headers.get('set-cookie'),/HttpOnly; SameSite=Strict/);
  return result.headers.get('set-cookie').split(';')[0];
}

test('ratings 1–5, empty comments and all five report categories validate; extra/private fields are rejected',()=>{
  for(let rating=1;rating<=5;rating++) assert.equal(validateFeedback(review({rating})).rating,rating);
  for(const {value} of reportReasons) assert.equal(validateFeedback(report({category:value})).category,value);
  for(const rating of [0,6,1.5,'5',null]) assert.throws(()=>validateFeedback(review({rating})));
  for(const extra of [{text:'x'.repeat(501)},{publicOptIn:'true'},{website:'spam'},{email:'private@example.com'},{text:'\u0000'},{submissionId:'not-an-id'}]) assert.throws(()=>validateFeedback(review(extra)));
  for(const extra of [{category:''},{displayedNumber:0},{selectedAnswer:'A'},{courseId:'forged'},{comment:'x'.repeat(501)}]) assert.throws(()=>validateFeedback(report(extra)));
  assert.equal(validateFeedback(review({text:'x'.repeat(500)})).text.length,500);
});

test('private default and opt-in moderation gates persist; only an explicit reviewed public excerpt is returned',()=>{
  const f=fixture(); let db;
  try {
    db=openFeedbackStore(f.file); const token=createFeedbackSession(db);
    const privateId=saveFeedback(db,validateFeedback(review({text:'PRIVATE secret'})),token).id;
    assert.throws(()=>moderateReview(db,privateId,'approved','Private excerpt',true));
    const publicId=saveFeedback(db,validateFeedback(review({publicOptIn:true,text:'RAW PRIVATE material'})),token).id;
    assert.deepEqual(publicReviews(db),[]);
    assert.throws(()=>moderateReview(db,publicId,'approved','Safe text'));
    assert.throws(()=>moderateReview(db,publicId,'approved','email@example.com',true));
    moderateReview(db,publicId,'approved','A genuine low-rating critique.',true);
    assert.deepEqual(publicReviews(db),[{rating:1,text:'A genuine low-rating critique.'}]);
    db.close(); db=openFeedbackStore(f.file);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM reviews').get().n,2);
    assert.equal(publicReviews(db)[0].rating,1);
    moderateReview(db,publicId,'rejected'); assert.deepEqual(publicReviews(db),[]);
    assert.equal(db.prepare('SELECT text FROM reviews WHERE id=?').get(publicId).text,'RAW PRIVATE material');
  } finally {db?.close();f.cleanup();}
});

test('durable receipts prevent duplicate retries, changed idempotency payloads and excessive reviews',()=>{
  const f=fixture(); let db;
  try {
    db=openFeedbackStore(f.file);const token=createFeedbackSession(db),input=validateFeedback(review());
    const first=saveFeedback(db,input,token);
    assert.deepEqual(saveFeedback(db,input,token),{id:first.id,repeated:true});
    assert.throws(()=>saveFeedback(db,{...input,rating:2},token),/changed/);
    assert.throws(()=>saveFeedback(db,validateFeedback(review()),token),/already received/);
    saveFeedback(db,validateFeedback(review({rating:2})),token);
    saveFeedback(db,validateFeedback(review({rating:3})),token);
    assert.throws(()=>saveFeedback(db,validateFeedback(review({rating:4})),token),/Too many/);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM reviews').get().n,3);
    assert.throws(()=>saveFeedback(db,validateFeedback(review()),'a'.repeat(64)),/expired/);
  } finally {db?.close();f.cleanup();}
});

test('HTTP reports attach canonical metadata for any displayed position, retain every category and group without data loss',async()=>{
  const f=fixture(); let db;
  try {
    const cookie=await session(f.file), entry=practiceEntries().at(-1);
    for(const reason of reportReasons) {
      const response=await handleFeedback(request(report({questionId:entry.id,displayedNumber:2,category:reason.value}),cookie),false,f.file);
      assert.equal(response.status,201);assert.equal((await response.json()).accepted,true);
    }
    db=openFeedbackStore(f.file);
    const rows=db.prepare('SELECT * FROM question_reports').all();assert.equal(rows.length,5);
    for(const row of rows) {
      assert.equal(row.question_id,entry.id);assert.equal(row.topic_id,entry.topic.id);assert.equal(row.topic_number,entry.topic.number);
      assert.equal(row.course_id,entry.course.id);assert.equal(row.course_name,entry.course.title);assert.equal(row.unit_number,entry.unit.number);assert.equal(row.displayed_number,2);
      assert.match(row.created_at,/^\d{4}-/);assert.equal(row.status,'new');assert.equal(row.selected_answer,undefined);
    }
    updateReportStatus(db,rows[0].id,'reviewed');updateReportStatus(db,rows[0].id,'resolved');
    assert.equal(db.prepare('SELECT status FROM question_reports WHERE id=?').get(rows[0].id).status,'resolved');
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM question_reports WHERE question_id=?').get(entry.id).n,5);
    assert.equal(practiceEntries({courseId:'chemistry'}).length,1001);
  } finally {db?.close();f.cleanup();}
});

test('HTTP rejects cross-origin, missing cookie, malformed/oversized bodies, unknown IDs, extra fields and unavailable storage',async()=>{
  const f=fixture();
  try {
    const cookie=await session(f.file);
    for(const [req,status] of [
      [request(review(),cookie,{origin:'https://elsewhere.example'}),403],
      [request(review()),403], [request('{',cookie),400],
      [request('x'.repeat(4097),cookie),413],
      [request(review(),cookie,{'content-type':'text/plain'}),415],
      [request(report({questionId:'does-not-exist'}),cookie),400],
      [request(report({selectedAnswer:'A'}),cookie),400],
    ]) {const result=await handleFeedback(req,false,f.file);assert.equal(result.status,status);assert.notEqual((await result.json()).accepted,true);}
    const result=await handleFeedback(request(review(),cookie),false,f.file+'/impossible.sqlite');
    assert.equal(result.status,503);assert.deepEqual(Object.keys(await result.json()),['error']);
    const accepted=await handleFeedback(request(review(),cookie),false,f.file);
    assert.equal(accepted.status,201);
    assert.equal(accepted.headers.get('cache-control'),'no-store');
  } finally {f.cleanup();}
});

test('privacy boundary: public text is plain React text; no raw feedback or moderation GET route exists',()=>{
  for(const value of ['https://example.com','www.example.com','123-456-7890','a@b.test']) assert.throws(()=>validatePublicText(value));
  // Markup is data, never injected HTML; owner must review it before publishing.
  assert.equal(validatePublicText('<script>bad()</script>'),'<script>bad()</script>');
  const component=readFileSync('src/components/public-reviews.tsx','utf8');
  assert.ok(component.includes('{review.text}'));assert.ok(!component.includes('dangerouslySetInnerHTML'));
  const route=readFileSync('src/app/api/feedback/route.ts','utf8');assert.ok(!route.includes('function GET'));
  const dialog=readFileSync('src/components/feedback-dialog.tsx','utf8');
  assert.ok(dialog.includes('useState(false), [category'));assert.ok(!dialog.includes('localStorage'));
  assert.ok(dialog.includes('result.accepted !== true'));assert.ok(dialog.includes('receipt.current.id'));
});

test('Next internal localhost URL accepts the browser destination Host, but never an unrelated Origin',async()=>{
  const f=fixture();
  try {
    const cookie=await session(f.file);
    const nextRequest=(origin)=>new Request('http://localhost:3000/api/feedback',{method:'POST',headers:{host:'127.0.0.1:3000',origin,'content-type':'application/json',cookie},body:JSON.stringify(review())});
    assert.equal((await handleFeedback(nextRequest('https://attacker.example'),false,f.file)).status,403);
    assert.equal((await handleFeedback(nextRequest('http://127.0.0.1:3000'),false,f.file)).status,201);
  } finally {f.cleanup();}
});

test('anonymous sessions expire, limits survive reopening, and report bursts fail without dropping stored rows',()=>{
  const f=fixture();let db;
  try {
    db=openFeedbackStore(f.file);const now=Date.now(),token=createFeedbackSession(db,undefined,now),entry=practiceEntries()[0];
    const ref={questionId:entry.id,courseId:entry.course.id,courseName:entry.course.title,unitNumber:entry.unit.number,topicId:entry.topic.id,topicNumber:entry.topic.number,displayedNumber:1};
    for(let i=0;i<20;i++) saveFeedback(db,validateFeedback(report({comment:`isolated test ${i}`})),token,ref,now);
    db.close();db=openFeedbackStore(f.file);
    assert.throws(()=>saveFeedback(db,validateFeedback(report({comment:'over cap'})),token,ref,now),/Too many/);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM question_reports').get().n,20);
    assert.throws(()=>saveFeedback(db,validateFeedback(review()),token,undefined,now+2*60*60*1000),/expired/);
    assert.notEqual(createFeedbackSession(db,token,now+2*60*60*1000),token);
  } finally {db?.close();f.cleanup();}
});
