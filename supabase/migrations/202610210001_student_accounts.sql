-- Additive and re-runnable. Never reset a project containing student data.
begin;
create table if not exists public.study_courses (id text primary key);
create table if not exists public.study_topics (course_id text references public.study_courses(id), topic_id text, primary key(course_id,topic_id));
create table if not exists public.study_resources (id text primary key);
create table if not exists public.study_videos (video_key text primary key, course_id text not null references public.study_courses(id), topic_id text, foreign key(course_id,topic_id) references public.study_topics(course_id,topic_id));
create table if not exists public.student_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
 display_name text not null default '' check(length(display_name)<=60),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.course_selections (
 user_id uuid references auth.users(id) on delete cascade default auth.uid(), course_id text references public.study_courses(id),
 selected boolean not null, selected_at timestamptz not null default now(),
 revision bigint not null default 1, last_mutation uuid not null, updated_at timestamptz not null default now(), primary key(user_id,course_id)
);
create table if not exists public.topic_progress (
 user_id uuid references auth.users(id) on delete cascade default auth.uid(), course_id text, topic_id text,
 completed boolean not null, completed_at timestamptz, last_studied_at timestamptz,
 revision bigint not null default 1, last_mutation uuid not null, updated_at timestamptz not null default now(),
 primary key(user_id,course_id,topic_id), foreign key(course_id,topic_id) references public.study_topics(course_id,topic_id)
);
create table if not exists public.video_progress (
 user_id uuid references auth.users(id) on delete cascade default auth.uid(), video_key text references public.study_videos(video_key),
 watched boolean not null, watched_at timestamptz,
 revision bigint not null default 1, last_mutation uuid not null, updated_at timestamptz not null default now(), primary key(user_id,video_key)
);
create table if not exists public.instructor_preferences (
 user_id uuid references auth.users(id) on delete cascade default auth.uid(), course_id text references public.study_courses(id),
 instructor_id text not null check(course_id='human-geography' and instructor_id in ('mr-sinn','heimler')),
 revision bigint not null default 1, last_mutation uuid not null, updated_at timestamptz not null default now(), primary key(user_id,course_id)
);
create table if not exists public.student_notes (
 user_id uuid references auth.users(id) on delete cascade default auth.uid(), course_id text, topic_id text,
 content text not null check(length(content)<=50000), created_at timestamptz not null default now(),
 revision bigint not null default 1, last_mutation uuid not null, updated_at timestamptz not null default now(),
 primary key(user_id,course_id,topic_id), foreign key(course_id,topic_id) references public.study_topics(course_id,topic_id)
);
create table if not exists public.saved_resources (
 user_id uuid references auth.users(id) on delete cascade default auth.uid(), resource_id text references public.study_resources(id), saved boolean not null,
 revision bigint not null default 1, last_mutation uuid not null, updated_at timestamptz not null default now(), primary key(user_id,resource_id)
);
create table if not exists public.study_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(), last_topic text not null check(length(last_topic)<=220),
 revision bigint not null default 1, last_mutation uuid not null, updated_at timestamptz not null default now()
);
create table if not exists public.practice_attempts (
 user_id uuid references auth.users(id) on delete cascade default auth.uid(), attempt_id uuid,
 course_id text not null references public.study_courses(id), topic_id text, question_count integer not null check(question_count between 1 and 2640),
 first_correct integer not null check(first_correct>=0), answered_count integer not null, final_score integer not null,
 started_at timestamptz not null, completed_at timestamptz not null, metadata jsonb not null check(jsonb_typeof(metadata)='array' and octet_length(metadata::text)<=300000),
 revision bigint not null default 1, last_mutation uuid not null, updated_at timestamptz not null default now(),
 primary key(user_id,attempt_id), foreign key(course_id,topic_id) references public.study_topics(course_id,topic_id),
 check(first_correct<=answered_count and answered_count<=question_count), check(completed_at>=started_at),
 check(final_score=round(first_correct::numeric/question_count*100)), check(jsonb_array_length(metadata)=question_count)
);
create table if not exists public.local_imports (
 user_id uuid references auth.users(id) on delete cascade default auth.uid(), fingerprint text check(fingerprint ~ '^[a-f0-9]{64}$'),
 revision bigint not null default 1, last_mutation uuid not null, updated_at timestamptz not null default now(), primary key(user_id,fingerprint)
);
create index if not exists topic_progress_recent on public.topic_progress(user_id,last_studied_at desc);
create index if not exists practice_attempts_recent on public.practice_attempts(user_id,completed_at desc);
create or replace function public.bump_study_revision() returns trigger language plpgsql set search_path='' as $$
begin
 if TG_OP='UPDATE' then
  if new.user_id<>old.user_id then raise exception 'ownership is immutable'; end if;
  new.revision:=old.revision+1;
 end if;
 new.updated_at:=now(); return new;
end $$;
do $$ declare t text; begin
 foreach t in array array['course_selections','topic_progress','video_progress','instructor_preferences','student_notes','saved_resources','study_preferences','practice_attempts','local_imports'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('drop policy if exists own_records on public.%I',t);
  execute format('create policy own_records on public.%I for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id)',t);
  execute format('drop trigger if exists study_revision on public.%I',t);
  execute format('create trigger study_revision before insert or update on public.%I for each row execute function public.bump_study_revision()',t);
  execute format('revoke all on public.%I from anon, authenticated',t);
  -- Writes go through the bounded CAS function. Its owner checks auth.uid() explicitly.
  execute format('grant select on public.%I to authenticated',t);
 end loop;
 foreach t in array array['study_courses','study_topics','study_resources','study_videos'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('drop policy if exists catalog_read on public.%I',t);
  execute format('create policy catalog_read on public.%I for select to authenticated using (true)',t);
  execute format('revoke all on public.%I from anon, authenticated',t);
  execute format('grant select on public.%I to authenticated',t);
 end loop;
end $$;
alter table public.student_profiles enable row level security;
drop policy if exists own_profile on public.student_profiles;
create policy own_profile on public.student_profiles for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
revoke all on public.student_profiles from anon,authenticated;
grant select,insert,update,delete on public.student_profiles to authenticated;

create or replace view public.study_snapshot with (security_invoker=true) as
 select user_id,'course'::text kind,course_id key,to_jsonb(selected) value,revision,last_mutation from public.course_selections
 union all select user_id,'topic',course_id||'/'||topic_id,jsonb_build_object('completed',completed,'lastStudied',last_studied_at),revision,last_mutation from public.topic_progress
 union all select user_id,'note',course_id||'/'||topic_id,to_jsonb(content),revision,last_mutation from public.student_notes
 union all select user_id,'video',video_key,to_jsonb(watched),revision,last_mutation from public.video_progress
 union all select user_id,'instructor',course_id,to_jsonb(instructor_id),revision,last_mutation from public.instructor_preferences
 union all select user_id,'saved',resource_id,to_jsonb(saved),revision,last_mutation from public.saved_resources
 union all select user_id,'recent','last',to_jsonb(last_topic),revision,last_mutation from public.study_preferences
 union all select user_id,'import',fingerprint,'true'::jsonb,revision,last_mutation from public.local_imports
 union all select user_id,'attempt',attempt_id::text,jsonb_build_object('id',attempt_id,'courseId',course_id,'topicId',topic_id,'questionIds',metadata,'total',question_count,'correct',first_correct,'answered',answered_count,'percent',final_score,'startedAt',started_at,'completedAt',completed_at),revision,last_mutation from public.practice_attempts;
revoke all on public.study_snapshot from anon,authenticated;
grant select on public.study_snapshot to authenticated;

create or replace function public.apply_study_change(p_kind text,p_key text,p_value jsonb,p_revision bigint,p_mutation uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); old_record record; c text:=split_part(p_key,'/',1); t text:=split_part(p_key,'/',2); result jsonb;
begin
 if uid is null then raise exception 'authentication required' using errcode='42501'; end if;
 if p_kind not in ('course','topic','note','video','instructor','saved','recent','attempt','import') or length(p_key)>220 or p_revision<0 or p_mutation is null or p_value is null or octet_length(p_value::text)>400000 then raise exception 'invalid study change'; end if;
 -- Serialize records for this user; a different user's data is never part of the lookup.
 perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
 select * into old_record from public.study_snapshot where user_id=uid and kind=p_kind and key=p_key;
 if found then
  if old_record.last_mutation=p_mutation or (p_kind in ('attempt','import') and old_record.value=p_value) then
   return jsonb_build_object('ok',true,'record',jsonb_build_object('kind',p_kind,'key',p_key,'value',old_record.value,'revision',old_record.revision));
  end if;
  if old_record.revision<>p_revision or p_kind in ('attempt','import') then
   return jsonb_build_object('ok',false,'record',jsonb_build_object('kind',p_kind,'key',p_key,'value',old_record.value,'revision',old_record.revision));
  end if;
 elsif p_revision<>0 then return jsonb_build_object('ok',false,'record',null);
 end if;
 case p_kind
 when 'course' then
  if jsonb_typeof(p_value)<>'boolean' then raise exception 'invalid selection'; end if;
  insert into public.course_selections(user_id,course_id,selected,last_mutation) values(uid,p_key,p_value::boolean,p_mutation) on conflict(user_id,course_id) do update set selected=excluded.selected,last_mutation=excluded.last_mutation;
 when 'topic' then
  if jsonb_typeof(p_value->'completed')<>'boolean' or not(p_value?'lastStudied') then raise exception 'invalid progress'; end if;
  insert into public.topic_progress(user_id,course_id,topic_id,completed,completed_at,last_studied_at,last_mutation) values(uid,c,t,(p_value->>'completed')::boolean,case when (p_value->>'completed')::boolean then now() else null end,(p_value->>'lastStudied')::timestamptz,p_mutation) on conflict(user_id,course_id,topic_id) do update set completed=excluded.completed,completed_at=case when excluded.completed then coalesce(topic_progress.completed_at,now()) else null end,last_studied_at=excluded.last_studied_at,last_mutation=excluded.last_mutation;
 when 'note' then
  if jsonb_typeof(p_value)<>'string' then raise exception 'invalid note'; end if;
  insert into public.student_notes(user_id,course_id,topic_id,content,last_mutation) values(uid,c,t,p_value#>>'{}',p_mutation) on conflict(user_id,course_id,topic_id) do update set content=excluded.content,last_mutation=excluded.last_mutation;
 when 'video' then
  if jsonb_typeof(p_value)<>'boolean' then raise exception 'invalid video'; end if;
  insert into public.video_progress(user_id,video_key,watched,watched_at,last_mutation) values(uid,p_key,p_value::boolean,case when p_value::boolean then now() else null end,p_mutation) on conflict(user_id,video_key) do update set watched=excluded.watched,watched_at=excluded.watched_at,last_mutation=excluded.last_mutation;
 when 'instructor' then
  insert into public.instructor_preferences(user_id,course_id,instructor_id,last_mutation) values(uid,p_key,p_value#>>'{}',p_mutation) on conflict(user_id,course_id) do update set instructor_id=excluded.instructor_id,last_mutation=excluded.last_mutation;
 when 'saved' then
  if jsonb_typeof(p_value)<>'boolean' then raise exception 'invalid bookmark'; end if;
  insert into public.saved_resources(user_id,resource_id,saved,last_mutation) values(uid,p_key,p_value::boolean,p_mutation) on conflict(user_id,resource_id) do update set saved=excluded.saved,last_mutation=excluded.last_mutation;
 when 'recent' then
  if p_key<>'last' or not exists(select 1 from public.study_topics where course_id=split_part(p_value#>>'{}','/',1) and topic_id=split_part(p_value#>>'{}','/',2)) then raise exception 'invalid recent topic'; end if;
  insert into public.study_preferences(user_id,last_topic,last_mutation) values(uid,p_value#>>'{}',p_mutation) on conflict(user_id) do update set last_topic=excluded.last_topic,last_mutation=excluded.last_mutation;
 when 'attempt' then
  if p_value->>'id'<>p_key then raise exception 'invalid attempt identity'; end if;
  insert into public.practice_attempts(user_id,attempt_id,course_id,topic_id,question_count,first_correct,answered_count,final_score,started_at,completed_at,metadata,last_mutation)
  values(uid,p_key::uuid,p_value->>'courseId',p_value->>'topicId',(p_value->>'total')::integer,(p_value->>'correct')::integer,(p_value->>'answered')::integer,(p_value->>'percent')::integer,(p_value->>'startedAt')::timestamptz,(p_value->>'completedAt')::timestamptz,p_value->'questionIds',p_mutation);
 when 'import' then
  if p_value<>'true'::jsonb then raise exception 'invalid import receipt'; end if;
  insert into public.local_imports(user_id,fingerprint,last_mutation) values(uid,p_key,p_mutation);
 end case;
 select jsonb_build_object('kind',kind,'key',key,'value',value,'revision',revision) into result from public.study_snapshot where user_id=uid and kind=p_kind and key=p_key;
 return jsonb_build_object('ok',true,'record',result);
end $$;
revoke all on function public.apply_study_change(text,text,jsonb,bigint,uuid) from public,anon;
grant execute on function public.apply_study_change(text,text,jsonb,bigint,uuid) to authenticated;
revoke all on function public.bump_study_revision() from public,anon,authenticated;
commit;
