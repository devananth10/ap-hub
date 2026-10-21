begin;
-- The internal mutator always derives ownership from auth.uid(). Only the validated
-- wrapper is callable by students. Keep both fixed-search-path functions private.
create or replace function public.save_study_change(p_kind text,p_key text,p_value jsonb,p_revision bigint,p_mutation uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare c text:=split_part(p_key,'/',1); t text:=split_part(p_key,'/',2);
begin
 if auth.uid() is null then raise exception 'authentication required' using errcode='42501'; end if;
 if p_kind is null or p_key is null or p_value is null or p_revision is null or p_revision<0 or p_mutation is null or length(p_key)>220 or octet_length(p_value::text)>400000 then raise exception 'invalid change'; end if;
 if p_kind in ('topic','note') and (p_key<>c||'/'||t or not exists(select 1 from public.study_topics where course_id=c and topic_id=t)) then raise exception 'invalid topic'; end if;
 case p_kind
 when 'note' then
  if jsonb_typeof(p_value)<>'string' or length(p_value#>>'{}')>50000 then raise exception 'invalid note'; end if;
 when 'course','video','saved' then
  if jsonb_typeof(p_value)<>'boolean' then raise exception 'invalid state'; end if;
 when 'topic' then
  if jsonb_typeof(p_value)<>'object' or jsonb_typeof(p_value->'completed') is distinct from 'boolean' or not(p_value?'lastStudied') or (p_value-'completed'-'lastStudied')<>'{}'::jsonb then raise exception 'invalid progress'; end if;
  if p_value->'lastStudied'<>'null'::jsonb then perform (p_value->>'lastStudied')::timestamptz; end if;
 when 'instructor' then
  if p_key<>'human-geography' or jsonb_typeof(p_value)<>'string' or (p_value#>>'{}') not in ('mr-sinn','heimler') then raise exception 'invalid instructor'; end if;
 when 'recent' then
  if p_key<>'last' or jsonb_typeof(p_value)<>'string' or not exists(select 1 from public.study_topics where course_id||'/'||topic_id=p_value#>>'{}') then raise exception 'invalid recent topic'; end if;
 when 'import' then
  if p_key!~'^[a-f0-9]{64}$' or p_value<>'true'::jsonb then raise exception 'invalid receipt'; end if;
 when 'attempt' then
  if jsonb_typeof(p_value)<>'object' or not(p_value ?& array['id','courseId','topicId','questionIds','total','correct','answered','percent','startedAt','completedAt']) or (p_value-'id'-'courseId'-'topicId'-'questionIds'-'total'-'correct'-'answered'-'percent'-'startedAt'-'completedAt')<>'{}'::jsonb or p_value->>'id'<>p_key then raise exception 'invalid attempt'; end if;
  if jsonb_typeof(p_value->'questionIds')<>'array' or exists(select 1 from jsonb_array_elements(p_value->'questionIds') v where jsonb_typeof(v)<>'string' or (v#>>'{}')!~'^[A-Za-z0-9_-]{1,100}$') then raise exception 'invalid question IDs'; end if;
  if (select count(*) from jsonb_array_elements(p_value->'questionIds'))<>(select count(distinct v) from jsonb_array_elements(p_value->'questionIds') v) then raise exception 'duplicate question IDs'; end if;
  if p_value->'courseId'='null'::jsonb and p_value->'topicId'<>'null'::jsonb then raise exception 'invalid attempt scope'; end if;
 else raise exception 'unknown study record';
 end case;
 return public.apply_study_change(p_kind,p_key,p_value,p_revision,p_mutation);
end $$;
revoke all on function public.apply_study_change(text,text,jsonb,bigint,uuid) from public,anon,authenticated;
revoke all on function public.save_study_change(text,text,jsonb,bigint,uuid) from public,anon;
grant execute on function public.save_study_change(text,text,jsonb,bigint,uuid) to authenticated;
commit;
