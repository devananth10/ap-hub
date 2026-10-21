begin;
-- All-course Practice sessions have no single course; question IDs retain exact scope.
alter table public.practice_attempts alter column course_id drop not null;
create or replace function public.touch_student_profile() returns trigger language plpgsql set search_path='' as $$
begin
 if TG_OP='UPDATE' and new.user_id<>old.user_id then raise exception 'ownership is immutable'; end if;
 new.updated_at=now();return new;
end $$;
drop trigger if exists profile_timestamp on public.student_profiles;
create trigger profile_timestamp before insert or update on public.student_profiles for each row execute function public.touch_student_profile();
revoke all on function public.touch_student_profile() from public,anon,authenticated;
commit;
