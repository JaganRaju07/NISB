-- ============================================================
-- NISB People & Milestones — Migration 002 (Hardened Release)
-- Verified Data Foundation: Lifecycle Status, Verification Model,
-- Role Tiers, Multi-Tenure Preserving Uniqueness & Audit Provenance
-- Security Audited, Idempotent, Zero-Data-Loss & Transactionally Safe
-- ============================================================

begin;

-- ── 1. Preflight Safeguards ──

-- Preflight 1.1: Confirm all expected Phase 1 baseline tables exist
do $$
declare
  missing_tables text;
begin
  select string_agg(t.tbl, ', ')
  into missing_tables
  from (
    select unnest(array[
      'admins',
      'societies',
      'members',
      'member_roles',
      'milestones',
      'milestone_members'
    ]) as tbl
  ) t
  where not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = t.tbl
  );

  if missing_tables is not null then
    raise exception 'Migration 002 Preflight Aborted: Expected Phase 1 tables missing: %', missing_tables;
  end if;
end $$;

-- Preflight 1.2: Confirm RLS is currently enabled on Phase 1 tables
do $$
declare
  unprotected_tables text;
begin
  select string_agg(c.relname, ', ')
  into unprotected_tables
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in ('admins', 'societies', 'members', 'member_roles', 'milestones', 'milestone_members')
    and not c.relrowsecurity;

  if unprotected_tables is not null then
    raise exception 'Migration 002 Preflight Aborted: RLS is disabled on expected tables: %', unprotected_tables;
  end if;
end $$;

-- Preflight 1.3: Confirm baseline Phase 1 helper functions exist
do $$
begin
  if not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'is_admin'
  ) then
    raise exception 'Migration 002 Preflight Aborted: public.is_admin() function does not exist.';
  end if;

  if not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'is_superadmin'
  ) then
    raise exception 'Migration 002 Preflight Aborted: public.is_superadmin() function does not exist.';
  end if;
end $$;

-- Preflight 1.4: Pre-check duplicate member roles before unique indexes can be safely applied
do $$
declare
  dup_count_society integer;
  dup_count_branch integer;
begin
  select count(*)
  into dup_count_society
  from (
    select member_id, society_id, lower(trim(role_title)), coalesce(start_year, '')
    from public.member_roles
    where society_id is not null
    group by member_id, society_id, lower(trim(role_title)), coalesce(start_year, '')
    having count(*) > 1
  ) dups;

  if dup_count_society > 0 then
    raise exception 'Migration 002 Preflight Aborted: Found % duplicate society role record groups in public.member_roles. Resolution required before applying unique constraint.', dup_count_society;
  end if;

  select count(*)
  into dup_count_branch
  from (
    select member_id, lower(trim(role_title)), coalesce(start_year, '')
    from public.member_roles
    where society_id is null
    group by member_id, lower(trim(role_title)), coalesce(start_year, '')
    having count(*) > 1
  ) dups;

  if dup_count_branch > 0 then
    raise exception 'Migration 002 Preflight Aborted: Found % duplicate branch role record groups in public.member_roles. Resolution required before applying unique constraint.', dup_count_branch;
  end if;
end $$;

-- Preflight 1.5: Snapshot record counts into temporary table for postcondition validation
create temp table _preflight_counts (
  tbl text primary key,
  cnt bigint
) on commit drop;

insert into _preflight_counts (tbl, cnt)
select 'members', count(*) from public.members
union all
select 'milestones', count(*) from public.milestones
union all
select 'societies', count(*) from public.societies
union all
select 'member_roles', count(*) from public.member_roles
union all
select 'milestone_members', count(*) from public.milestone_members;


-- ── 2. Members Table Lifecycle & Verification Hardening ──

alter table public.members
  add column if not exists status text,
  add column if not exists verification_status text,
  add column if not exists updated_by uuid references auth.users(id) on delete set null;

-- Set default provenance stamp to current authenticated user
alter table public.members
  alter column updated_by set default auth.uid();

-- Careful data transition from legacy is_published if present
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'members' and column_name = 'is_published'
  ) then
    update public.members
    set
      status = case when is_published = true then 'published' else coalesce(status, 'draft') end,
      verification_status = case when is_published = true then 'confirmed' else coalesce(verification_status, 'pending') end;

    alter table public.members drop column is_published;
  else
    update public.members
    set
      status = coalesce(status, 'draft'),
      verification_status = coalesce(verification_status, 'pending')
    where status is null or verification_status is null;
  end if;
end $$;

-- Set defaults and enforce not-null
alter table public.members
  alter column status set default 'draft',
  alter column status set not null,
  alter column verification_status set default 'pending',
  alter column verification_status set not null;

-- Lifecycle enum-like check constraints
alter table public.members
  drop constraint if exists chk_members_status,
  add constraint chk_members_status
    check (status in ('draft', 'published', 'archived'));

alter table public.members
  drop constraint if exists chk_members_verification_status,
  add constraint chk_members_verification_status
    check (verification_status in ('pending', 'source_listed', 'confirmed'));

-- Publication integrity constraint: published records MUST be confirmed
alter table public.members
  drop constraint if exists chk_members_publication_integrity,
  add constraint chk_members_publication_integrity
    check (status != 'published' or verification_status = 'confirmed');

-- Indexes
create index if not exists idx_members_status on public.members(status);
create index if not exists idx_members_verification_status on public.members(verification_status);
create index if not exists idx_members_updated_by on public.members(updated_by);

-- Covering partial index: accelerates public directory query (published & confirmed records only)
drop index if exists idx_members_published_name;
create index idx_members_published_name
  on public.members (full_name)
  where status = 'published' and verification_status = 'confirmed';


-- ── 3. Member Roles Enhancements, Tier Backfill & Consistency Hardening ──
-- NOTE: Preserves 100% of existing historical tenures. NEVER executes DELETE or TRUNCATE.

alter table public.member_roles
  add column if not exists tier text;

-- Safe deterministic backfill based on society relationship
update public.member_roles
set tier = case when society_id is null then 'branch' else 'society' end
where tier is null;

-- Set default and enforce not-null
alter table public.member_roles
  alter column tier set default 'branch',
  alter column tier set not null;

-- Clean up legacy unsegregated constraints if present
alter table public.member_roles
  drop constraint if exists chk_member_roles_tier,
  add constraint chk_member_roles_tier
    check (tier in ('branch', 'society'));

alter table public.member_roles
  drop constraint if exists chk_member_roles_tier_consistency,
  add constraint chk_member_roles_tier_consistency
    check (
      (tier = 'branch' and society_id is null) or
      (tier = 'society' and society_id is not null)
    );

create index if not exists idx_member_roles_tier on public.member_roles(tier);

-- Multi-tenure unique partial indexes preserving historical records with distinct start_years
drop index if exists idx_member_roles_unique_society;
create unique index idx_member_roles_unique_society
  on public.member_roles (member_id, society_id, lower(trim(role_title)), coalesce(start_year, ''))
  where society_id is not null;

drop index if exists idx_member_roles_unique_branch;
create unique index idx_member_roles_unique_branch
  on public.member_roles (member_id, lower(trim(role_title)), coalesce(start_year, ''))
  where society_id is null;


-- ── 4. Milestones Table Lifecycle, Verification & Year Hardening ──

alter table public.milestones
  add column if not exists status text,
  add column if not exists verification_status text,
  add column if not exists source_note text,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists milestone_year integer;

-- Set default provenance stamp to current authenticated user
alter table public.milestones
  alter column updated_by set default auth.uid();

-- Careful data transition from legacy is_published if present
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'milestones' and column_name = 'is_published'
  ) then
    update public.milestones
    set
      status = case when is_published = true then 'published' else coalesce(status, 'draft') end,
      verification_status = case when is_published = true then 'confirmed' else coalesce(verification_status, 'pending') end;

    alter table public.milestones drop column is_published;
  else
    update public.milestones
    set
      status = coalesce(status, 'draft'),
      verification_status = coalesce(verification_status, 'pending')
    where status is null or verification_status is null;
  end if;
end $$;

-- Set defaults and enforce not-null
alter table public.milestones
  alter column status set default 'draft',
  alter column status set not null,
  alter column verification_status set default 'pending',
  alter column verification_status set not null;

-- Lifecycle enum-like check constraints
alter table public.milestones
  drop constraint if exists chk_milestones_status,
  add constraint chk_milestones_status
    check (status in ('draft', 'published', 'archived'));

alter table public.milestones
  drop constraint if exists chk_milestones_verification_status,
  add constraint chk_milestones_verification_status
    check (verification_status in ('pending', 'source_listed', 'confirmed'));

-- Publication integrity constraint: published records MUST be confirmed
alter table public.milestones
  drop constraint if exists chk_milestones_publication_integrity,
  add constraint chk_milestones_publication_integrity
    check (status != 'published' or verification_status = 'confirmed');

-- Milestone year check constraint: NULL or between 1900 and 2100
alter table public.milestones
  drop constraint if exists chk_milestones_year,
  add constraint chk_milestones_year
    check (milestone_year is null or (milestone_year >= 1900 and milestone_year <= 2100));

create index if not exists idx_milestones_status on public.milestones(status);
create index if not exists idx_milestones_verification_status on public.milestones(verification_status);
create index if not exists idx_milestones_updated_by on public.milestones(updated_by);

-- Covering partial index: accelerates public milestones feed (published & confirmed records only)
drop index if exists idx_milestones_published_date;
create index idx_milestones_published_date
  on public.milestones (date desc)
  where status = 'published' and verification_status = 'confirmed';


-- ── 5. Societies Table Slug Constraint Hardening ──

alter table public.societies
  drop constraint if exists chk_societies_slug,
  add constraint chk_societies_slug
    check (slug ~ '^[a-z0-9-]+$');


-- ── 6. Automated Audit Provenance Triggers ──

create or replace function public.set_audit_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  if auth.uid() is not null then
    new.updated_by = auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists set_members_updated_at on public.members;
drop trigger if exists set_members_audit_fields on public.members;
create trigger set_members_audit_fields
  before update on public.members
  for each row execute function public.set_audit_fields();

drop trigger if exists set_milestones_updated_at on public.milestones;
drop trigger if exists set_milestones_audit_fields on public.milestones;
create trigger set_milestones_audit_fields
  before update on public.milestones
  for each row execute function public.set_audit_fields();


-- ── 7. Security Definer Publication Helper Functions ──
-- Hardened with safe search_path and marked parallel safe to eliminate query bottlenecks
-- Reveals strictly publication eligibility (boolean), never private record metadata

create or replace function public.is_member_published(p_member_id uuid)
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
parallel safe
as $$
  select exists (
    select 1 from public.members
    where id = p_member_id
      and status = 'published'
      and verification_status = 'confirmed'
  );
$$;

create or replace function public.is_milestone_published(p_milestone_id uuid)
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
parallel safe
as $$
  select exists (
    select 1 from public.milestones
    where id = p_milestone_id
      and status = 'published'
      and verification_status = 'confirmed'
  );
$$;

-- Allow anon and authenticated to execute publication check helpers
grant execute on function public.is_member_published(uuid) to anon, authenticated;
grant execute on function public.is_milestone_published(uuid) to anon, authenticated;

-- Principle of Least Privilege: is_admin and is_superadmin are strictly restricted to authenticated sessions
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

revoke execute on function public.is_superadmin() from public, anon;
grant execute on function public.is_superadmin() to authenticated;


-- ── 8. RLS Policy Hardening (Role-Targeted, Anti-Leak, High-Performance) ──

-- Milestones base table: strictly restricted to authenticated admins
drop policy if exists "Public can read milestones" on public.milestones;
drop policy if exists "Admins can manage milestones" on public.milestones;
drop policy if exists "Admins have full access to milestones table" on public.milestones;
create policy "Admins have full access to milestones table"
  on public.milestones for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Member roles:
drop policy if exists "Public can read member roles" on public.member_roles;
drop policy if exists "Public can read published member roles" on public.member_roles;
drop policy if exists "Admins can select all member roles" on public.member_roles;
drop policy if exists "Admins can manage member roles" on public.member_roles;

-- 1. Anonymous and regular users see roles only for published, confirmed members
create policy "Public can read published member roles"
  on public.member_roles for select
  to anon, authenticated
  using (public.is_member_published(member_id));

-- 2. Authenticated admins can view all member roles
create policy "Admins can select all member roles"
  on public.member_roles for select
  to authenticated
  using (public.is_admin());

-- 3. Authenticated admins can mutate member roles
create policy "Admins can manage member roles"
  on public.member_roles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Milestone members junction table:
drop policy if exists "Public can read milestone members" on public.milestone_members;
drop policy if exists "Public can read published milestone members" on public.milestone_members;
drop policy if exists "Admins can select all milestone members" on public.milestone_members;
drop policy if exists "Admins can manage milestone members" on public.milestone_members;

-- 1. Anonymous and regular users see connections only when BOTH milestone and member are published & confirmed
create policy "Public can read published milestone members"
  on public.milestone_members for select
  to anon, authenticated
  using (
    public.is_milestone_published(milestone_id)
    and
    public.is_member_published(member_id)
  );

-- 2. Authenticated admins can view all milestone-member connections
create policy "Admins can select all milestone members"
  on public.milestone_members for select
  to authenticated
  using (public.is_admin());

-- 3. Authenticated admins can mutate milestone-member connections
create policy "Admins can manage milestone members"
  on public.milestone_members for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ── 9. Public Views (Strict Column Allowlists & Security Barrier) ──

create or replace view public.public_members
with (security_barrier = true)
as
  select
    id,
    full_name,
    role,
    department,
    batch_year,
    photo_url,
    bio,
    interests,
    tenure_start,
    tenure_end,
    created_at,
    updated_at
  from public.members
  where status = 'published'
    and verification_status = 'confirmed';

create or replace view public.public_milestones
with (security_barrier = true)
as
  select
    id,
    title,
    description,
    date,
    milestone_year,
    category,
    society_id,
    image_url,
    created_at,
    updated_at
  from public.milestones
  where status = 'published'
    and verification_status = 'confirmed';


-- ── 10. Privilege Hardening (Strict Least Privilege) ──

-- Revoke direct table access on sensitive base tables containing source_note & updated_by
revoke all on public.members from anon, public;
revoke all on public.milestones from anon, public;
revoke all on public.admins from anon, public;

-- Defend views against unintended mutations: revoke ALL from public/anon/authenticated, grant SELECT only
revoke all on public.public_members from anon, authenticated, public;
grant select on public.public_members to anon, authenticated;

revoke all on public.public_milestones from anon, authenticated, public;
grant select on public.public_milestones to anon, authenticated;

-- Ensure read access on safe related tables
grant select on public.societies to anon, authenticated;
grant select on public.member_roles to anon, authenticated;
grant select on public.milestone_members to anon, authenticated;


-- ── 11. Postcondition Safeguards ──

-- Postcondition 11.1: Confirm expected columns exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'members' and column_name = 'status'
  ) or not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'members' and column_name = 'verification_status'
  ) then
    raise exception 'Postcondition Failed: members table missing status or verification_status columns';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'milestones' and column_name = 'status'
  ) or not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'milestones' and column_name = 'verification_status'
  ) then
    raise exception 'Postcondition Failed: milestones table missing status or verification_status columns';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'milestones' and column_name = 'milestone_year'
  ) then
    raise exception 'Postcondition Failed: milestones table missing milestone_year column';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'member_roles' and column_name = 'tier'
  ) then
    raise exception 'Postcondition Failed: member_roles table missing tier column';
  end if;
end $$;

-- Postcondition 11.2: Confirm private metadata is NOT exposed in public views
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name in ('public_members', 'public_milestones')
      and column_name in ('source_note', 'updated_by', 'status', 'verification_status')
  ) then
    raise exception 'Postcondition Failed: Private columns exposed in public views!';
  end if;
end $$;

-- Postcondition 11.3: Confirm public views have exact intended column allowlists
do $$
declare
  invalid_col text;
begin
  select column_name into invalid_col
  from information_schema.columns
  where table_schema = 'public' and table_name = 'public_members'
    and column_name not in (
      'id', 'full_name', 'role', 'department', 'batch_year',
      'photo_url', 'bio', 'interests', 'tenure_start', 'tenure_end',
      'created_at', 'updated_at'
    )
  limit 1;

  if invalid_col is not null then
    raise exception 'Postcondition Failed: public_members view contains unauthorized column: %', invalid_col;
  end if;

  select column_name into invalid_col
  from information_schema.columns
  where table_schema = 'public' and table_name = 'public_milestones'
    and column_name not in (
      'id', 'title', 'description', 'date', 'milestone_year',
      'category', 'society_id', 'image_url', 'created_at', 'updated_at'
    )
  limit 1;

  if invalid_col is not null then
    raise exception 'Postcondition Failed: public_milestones view contains unauthorized column: %', invalid_col;
  end if;
end $$;

-- Postcondition 11.4: Confirm RLS is still enabled on all tables
do $$
declare
  unprotected text;
begin
  select string_agg(c.relname, ', ')
  into unprotected
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in ('admins', 'societies', 'members', 'member_roles', 'milestones', 'milestone_members')
    and not c.relrowsecurity;

  if unprotected is not null then
    raise exception 'Postcondition Failed: RLS is disabled on: %', unprotected;
  end if;
end $$;

-- Postcondition 11.5: Confirm existing record counts have not decreased (Zero Data Loss)
do $$
declare
  rec record;
  current_cnt bigint;
begin
  for rec in select tbl, cnt from _preflight_counts loop
    execute format('select count(*) from public.%I', rec.tbl) into current_cnt;
    if current_cnt < rec.cnt then
      raise exception 'Postcondition Failed: Zero-data-loss violation on table %. Pre: %, Post: %', rec.tbl, rec.cnt, current_cnt;
    end if;
  end loop;
end $$;

commit;
