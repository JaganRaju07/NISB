-- ============================================================
-- NISB Digital Archive: Migration 003 (member contributions)
-- Adds members.contributions and exposes it through public_members.
-- Additive only: no DELETE, TRUNCATE, CASCADE, or constraint/index removal.
-- Any failed check aborts and rolls back the whole migration.
-- ============================================================
begin;

-- PRE-FLIGHT
do $$
declare cols text[];
begin
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='members' and column_name='contributions') then
raise exception 'Preflight: members.contributions already exists';
end if;

  if (select count(*) from information_schema.columns
      where table_schema='public' and table_name='members'
        and column_name in ('status','verification_status','source_note')) <> 3 then
raise exception 'Preflight: members.status / verification_status / source_note not all present';
end if;

  select array_agg(a.attname::text order by a.attnum) into cols
  from pg_attribute a
  where a.attrelid = 'public.public_members'::regclass and a.attnum > 0 and not a.attisdropped;
if cols is distinct from array['id','full_name','role','department','batch_year','photo_url','bio',
'interests','tenure_start','tenure_end','created_at','updated_at'] then
    raise exception 'Preflight: public_members columns differ from expected 12: %', cols;
  end if;

  if pg_get_viewdef('public.public_members'::regclass) not like '%published%'
or pg_get_viewdef('public.public_members'::regclass) not like '%confirmed%' then
    raise exception 'Preflight: public_members is not filtered by published + confirmed';
end if;
end $$;

-- COLUMN
alter table public.members add column contributions text;

-- VIEW: same 12 columns in the same order, contributions appended; same filter
create or replace view public.public_members
with (security_barrier = true)
as
  select id, full_name, role, department, batch_year, photo_url, bio, interests,
tenure_start, tenure_end, created_at, updated_at,
contributions
from public.members
where status = 'published' and verification_status = 'confirmed';
-- POST-CONDITIONS
do $$
declare cols text[];
begin
  select array_agg(a.attname::text order by a.attnum) into cols
from pg_attribute a
where a.attrelid = 'public.public_members'::regclass and a.attnum > 0 and not a.attisdropped;
if cols is distinct from array['id','full_name','role','department','batch_year','photo_url','bio',
'interests','tenure_start','tenure_end','created_at','updated_at','contributions'] then
raise exception 'Postcondition: public_members column list wrong: %', cols;
end if;
if coalesce((select c.reloptions::text from pg_class c where c.oid='public.public_members'::regclass),'')
not like '%security_barrier=true%' then
raise exception 'Postcondition: public_members lost security_barrier';
end if;
if coalesce((select c.reloptions::text from pg_class c where c.oid='public.public_members'::regclass),'')
like '%security_invoker=true%' then
raise exception 'Postcondition: public_members became security_invoker';
end if;
if not has_table_privilege('anon','public.public_members','SELECT') then
raise exception 'Postcondition: anon lost SELECT on public_members'; end if;
if has_table_privilege('anon','public.public_members','INSERT')
or has_table_privilege('anon','public.public_members','UPDATE')
or has_table_privilege('anon','public.public_members','DELETE') then
raise exception 'Postcondition: anon can write public_members'; end if;
if has_table_privilege('anon','public.members','SELECT')
or has_table_privilege('anon','public.members','INSERT')
or has_table_privilege('anon','public.members','UPDATE')
     or has_table_privilege('anon','public.members','DELETE') then
raise exception 'Postcondition: anon has direct privilege on public.members'; end if;
if not (select relrowsecurity from pg_class where oid='public.members'::regclass) then
raise exception 'Postcondition: RLS disabled on members'; end if;
end $$;
commit;
