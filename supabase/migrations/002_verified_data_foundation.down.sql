-- ============================================================
-- NISB People & Milestones — Migration 002 Down Script
-- Guarded Rollback: Reverts Migration 002 to Phase 1 Baseline
-- Pre-Condition Protected: Refuses execution if data loss or
-- security/confidentiality regressions would occur.
-- ============================================================

begin;

-- ── 1. Safety Guard Invariants ──
-- Refuse execution if curator notes or draft records would be lost or exposed
do $$
declare
  active_curator_notes_members bigint;
  active_curator_notes_milestones bigint;
  unconfirmed_members bigint;
  unconfirmed_milestones bigint;
begin
  select count(*) into active_curator_notes_members
  from public.members where source_note is not null;

  select count(*) into active_curator_notes_milestones
  from public.milestones where source_note is not null;

  select count(*) into unconfirmed_members
  from public.members where status != 'published' or verification_status != 'confirmed';

  select count(*) into unconfirmed_milestones
  from public.milestones where status != 'published' or verification_status != 'confirmed';

  if active_curator_notes_members > 0 or active_curator_notes_milestones > 0 then
    raise exception 'Rollback Aborted: Database contains private curator notes (members: %, milestones: %). Reverting to Phase 1 would permanently destroy archival provenance metadata.',
      active_curator_notes_members, active_curator_notes_milestones;
  end if;

  if unconfirmed_members > 0 or unconfirmed_milestones > 0 then
    raise exception 'Rollback Aborted: Database contains unconfirmed or draft records (members: %, milestones: %). Phase 1 views lack publication filtering and rolling back would leak draft records publicly.',
      unconfirmed_members, unconfirmed_milestones;
  end if;
end $$;


-- ── 2. Revert Public Views to Phase 1 Baseline ──

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
  from public.members;

-- Phase 1 public_milestones did not exist as a dedicated view (was direct table query in Phase 1)
drop view if exists public.public_milestones;


-- ── 3. Revert RLS Policies to Phase 1 Baseline ──

-- Milestones: restore Phase 1 public read policy
drop policy if exists "Admins have full access to milestones table" on public.milestones;
drop policy if exists "Public can read milestones" on public.milestones;
create policy "Public can read milestones"
  on public.milestones for select
  using (true);

drop policy if exists "Admins can manage milestones" on public.milestones;
create policy "Admins can manage milestones"
  on public.milestones for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Member roles: restore Phase 1 public read policy
drop policy if exists "Public can read published member roles" on public.member_roles;
drop policy if exists "Admins can select all member roles" on public.member_roles;
drop policy if exists "Admins can manage member roles" on public.member_roles;

create policy "Public can read member roles"
  on public.member_roles for select
  using (true);

create policy "Admins can manage member roles"
  on public.member_roles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Milestone members: restore Phase 1 public read policy
drop policy if exists "Public can read published milestone members" on public.milestone_members;
drop policy if exists "Admins can select all milestone members" on public.milestone_members;
drop policy if exists "Admins can manage milestone members" on public.milestone_members;

create policy "Public can read milestone members"
  on public.milestone_members for select
  using (true);

create policy "Admins can manage milestone members"
  on public.milestone_members for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ── 4. Drop Security Definer Helper Functions Added in Migration 002 ──

drop function if exists public.is_member_published(uuid);
drop function if exists public.is_milestone_published(uuid);
drop trigger if exists set_members_audit_fields on public.members;
drop trigger if exists set_milestones_audit_fields on public.milestones;
drop function if exists public.set_audit_fields();

-- Restore original Phase 1 updated_at triggers
drop trigger if exists set_members_updated_at on public.members;
create trigger set_members_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

drop trigger if exists set_milestones_updated_at on public.milestones;
create trigger set_milestones_updated_at
  before update on public.milestones
  for each row execute function public.set_updated_at();


-- ── 5. Drop Migration 002 Constraints & Partial Indexes ──

alter table public.members
  drop constraint if exists chk_members_status,
  drop constraint if exists chk_members_verification_status,
  drop constraint if exists chk_members_publication_integrity;

drop index if exists public.idx_members_published_name;
drop index if exists public.idx_members_status;
drop index if exists public.idx_members_verification_status;
drop index if exists public.idx_members_updated_by;

alter table public.member_roles
  drop constraint if exists chk_member_roles_tier,
  drop constraint if exists chk_member_roles_tier_consistency;

drop index if exists public.idx_member_roles_unique_society;
drop index if exists public.idx_member_roles_unique_branch;
drop index if exists public.idx_member_roles_tier;

alter table public.milestones
  drop constraint if exists chk_milestones_status,
  drop constraint if exists chk_milestones_verification_status,
  drop constraint if exists chk_milestones_publication_integrity,
  drop constraint if exists chk_milestones_year;

drop index if exists public.idx_milestones_published_date;
drop index if exists public.idx_milestones_status;
drop index if exists public.idx_milestones_verification_status;
drop index if exists public.idx_milestones_updated_by;

alter table public.societies
  drop constraint if exists chk_societies_slug;

-- Restore Phase 1 table grants
grant select on public.milestones to anon, authenticated;

commit;
