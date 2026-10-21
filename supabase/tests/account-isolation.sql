-- PENDING HOSTED VERIFICATION. Disposable test project only.
-- Replace USER_A_UUID and USER_B_UUID with two existing disposable Auth user IDs.
-- Run in the SQL Editor as the project operator. This transaction rolls back.
begin;
select set_config('prepatlas.test_a','USER_A_UUID',true);
select set_config('prepatlas.test_b','USER_B_UUID',true);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('prepatlas.test_b'),true);
select public.save_study_change('note','chemistry/moles',to_jsonb('B isolation test'::text),0,gen_random_uuid());
select public.save_study_change('topic','chemistry/moles','{"completed":true,"lastStudied":null}'::jsonb,0,gen_random_uuid());
select public.save_study_change('attempt','33333333-3333-4333-8333-333333333333',jsonb_build_object('id','33333333-3333-4333-8333-333333333333','courseId','chemistry','topicId','moles','questionIds',jsonb_build_array('isolation-test-question'),'total',1,'correct',0,'answered',1,'percent',0,'startedAt',now(),'completedAt',now()),0,gen_random_uuid());
select set_config('request.jwt.claim.sub',current_setting('prepatlas.test_a'),true);
do $$ begin
 if exists(select 1 from public.student_notes where user_id=current_setting('prepatlas.test_b')::uuid) then raise exception 'FAIL cross-user notes read'; end if;
 if exists(select 1 from public.practice_attempts where user_id=current_setting('prepatlas.test_b')::uuid) then raise exception 'FAIL cross-user Practice read'; end if;
 if exists(select 1 from public.study_snapshot where user_id=current_setting('prepatlas.test_b')::uuid) then raise exception 'FAIL snapshot leaks'; end if;
 begin
  insert into public.student_profiles(user_id,display_name) values(current_setting('prepatlas.test_b')::uuid,'forged');
  raise exception 'FAIL forged ownership accepted';
 exception when insufficient_privilege then null; end;
 begin
  update public.topic_progress set completed=false where user_id=current_setting('prepatlas.test_b')::uuid;
  if found then raise exception 'FAIL cross-user progress update'; end if;
 exception when insufficient_privilege then null; end;
 begin
  delete from public.student_notes where user_id=current_setting('prepatlas.test_b')::uuid;
  if found then raise exception 'FAIL cross-user note deletion'; end if;
 exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$ begin
 begin perform * from public.student_notes; raise exception 'FAIL anonymous notes access'; exception when insufficient_privilege then null; end;
 begin perform public.save_study_change('note','chemistry/moles',to_jsonb('anon'::text),0,gen_random_uuid()); raise exception 'FAIL anonymous save'; exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
-- SQL success is one check, not a live JWT/HTTP/OAuth test. Also execute the two-browser
-- and forged-owner API checklist in OWNER_SETUP_TODO.md using actual authenticated clients.
