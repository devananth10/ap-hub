import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const A='11111111-1111-4111-8111-111111111111', B='22222222-2222-4222-8222-222222222222';
test('isolated PostgreSQL: RLS, forged ownership, CAS, replay, score immutability and cascade deletion',async()=>{
 const db=new PGlite();
 try {
  await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated; insert into auth.users values('${A}'),('${B}');`);
  for (let repeat=0;repeat<2;repeat++)for(const f of ['202610210001_student_accounts.sql','202610210002_catalog.sql','202610210003_account_hardening.sql','202610210004_validate_sync_boundary.sql'])await db.exec(readFileSync(new URL('../supabase/migrations/'+f,import.meta.url),'utf8'));
  const asUser=async(id,role='authenticated')=>{await db.exec(`reset role; set role ${role}; select set_config('request.jwt.claim.sub','${id}',false);`);};
  const change=async(kind,key,value,revision=0,mutation=crypto.randomUUID())=>(await db.query('select public.save_study_change($1,$2,$3::jsonb,$4,$5) result',[kind,key,JSON.stringify(value),revision,mutation])).rows[0].result;
  await asUser(A); const mutation=crypto.randomUUID();
  let result=await change('note','chemistry/moles','A private note',0,mutation);assert.equal(result.ok,true);assert.equal(result.record.revision,1);
  assert.equal((await change('note','chemistry/moles','A private note',0,mutation)).record.revision,1,'lost responses replay idempotently');
  assert.equal((await change('note','chemistry/moles','two-device stale edit',0)).ok,false);
  assert.equal((await change('note','chemistry/moles','updated',1)).record.revision,2);
  await assert.rejects(change('note','chemistry/moles','x'.repeat(50001),2),/invalid note/);
  await assert.rejects(change('note','chemistry/moles/extra','bad'),/invalid topic/);
  await change('topic','human-geography/topic-1-1',{completed:true,lastStudied:null});
  await change('instructor','human-geography','heimler');
  const attempt={id:crypto.randomUUID(),courseId:'chemistry',topicId:'moles',questionIds:['chem-1'],total:1,correct:0,answered:1,percent:0,startedAt:'2026-10-21T12:00:00.000Z',completedAt:'2026-10-21T12:01:00.000Z'};
  await change('attempt',attempt.id,attempt);
  await assert.rejects(change('attempt',crypto.randomUUID(),{...attempt,id:'wrong'}),/invalid attempt/);
  assert.equal((await change('attempt',attempt.id,{...attempt,correct:1,percent:100},1)).ok,false,'retries cannot overwrite saved scores');
  await asUser(B); assert.equal((await db.query('select * from public.student_notes')).rows.length,0);
  assert.equal((await db.query('select * from public.practice_attempts')).rows.length,0);
  assert.equal((await db.query('select * from public.study_snapshot')).rows.length,0);
  await assert.rejects(db.query('update public.topic_progress set completed=false where user_id=$1',[A]),/permission denied/);
  await assert.rejects(db.query('delete from public.student_notes where user_id=$1',[A]),/permission denied/);
  await assert.rejects(db.query('insert into public.student_profiles(user_id,display_name) values($1,$2)',[A,'forged']),/row-level security/);
  await change('note','chemistry/moles','B private note');
  assert.equal((await db.query('select content from public.student_notes')).rows[0].content,'B private note');
  await asUser('','anon'); await assert.rejects(db.query('select * from public.student_notes'),/permission denied/);await assert.rejects(change('note','chemistry/moles','anon'),/permission denied/);
  await asUser(''); await assert.rejects(change('note','chemistry/moles','no claims'),/authentication required/);
  // Exercise RLS independently of the deliberately narrower production grants.
  await db.exec('reset role; grant update,delete on public.topic_progress,public.student_notes to authenticated');
  await asUser(B);assert.equal((await db.query('update public.topic_progress set completed=false where user_id=$1 returning *',[A])).rows.length,0);
  assert.equal((await db.query('delete from public.student_notes where user_id=$1 returning *',[A])).rows.length,0);
  await db.exec('reset role');
  const hostedProcedure=readFileSync(new URL('../supabase/tests/account-isolation.sql',import.meta.url),'utf8').replaceAll('USER_A_UUID',A).replaceAll('USER_B_UUID',B);
  await db.exec(hostedProcedure);
  await db.query('delete from auth.users where id=$1',[A]);assert.equal((await db.query('select * from public.student_notes where user_id=$1',[A])).rows.length,0);
  assert.equal((await db.query('select * from public.student_notes where user_id=$1',[B])).rows.length,1);
  const tables=(await db.query("select relname,relrowsecurity from pg_class where relnamespace='public'::regnamespace and relname in ('student_profiles','course_selections','topic_progress','video_progress','instructor_preferences','student_notes','saved_resources','study_preferences','practice_attempts','local_imports')")).rows;
  assert.equal(tables.length,10);assert.ok(tables.every(t=>t.relrowsecurity));
 } finally {await db.close();}
});
