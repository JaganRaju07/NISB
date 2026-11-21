-- ============================================================
-- NISB People & Milestones — Schema
-- Canonical database definition. Synchronized with migrations/001_init.sql.
-- Security Audited & Hardened (Phase 1.1)
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ── Updated-at trigger function ──
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── 1. Admins Table & Privilege Verification ──
create table if not exists public.admins (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  email       text not null,
  role        text not null default 'admin' check (role in ('admin', 'superadmin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Admin check helper function (SECURITY DEFINER with safe search_path)
-- Bypasses RLS to inspect public.admins without recursion.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid()
  );
$$;

-- Superadmin check helper function (SECURITY DEFINER with safe search_path)
-- Governs admin roster management to prevent unauthorized privilege escalation.
create or replace function public.is_superadmin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid() and role = 'superadmin'
  );
$$;

-- ── 2. Societies Table ──
create table if not exists public.societies (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name              text not null check (length(trim(name)) > 0),
  short_name        text,
  description       text,
  logo_url          text,
  established_year  text,
  website_url       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ── 3. Members Table ──
create table if not exists public.members (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null check (length(trim(full_name)) > 0),
  role          text,
  department    text,
  batch_year    text,
  photo_url     text,
  bio           text,
  interests     text[],
  tenure_start  text,
  tenure_end    text,
  source_note   text,            -- Internal private field; strictly excluded from public view
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── 4. Member Roles Table (tenure & role history) ──
create table if not exists public.member_roles (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid not null references public.members(id) on delete cascade,
  society_id    uuid references public.societies(id) on delete set null,
  role_title    text not null check (length(trim(role_title)) > 0),
  start_year    text,
  end_year      text,
  is_current    boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── 5. Milestones Table ──
create table if not exists public.milestones (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (length(trim(title)) > 0),
  description   text,
  date          text,
  category      text,
  society_id    uuid references public.societies(id) on delete set null,
  image_url     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── 6. Milestone-Member Junction Table ──
create table if not exists public.milestone_members (
  id                  uuid primary key default gen_random_uuid(),
  milestone_id        uuid not null references public.milestones(id) on delete cascade,
  member_id           uuid not null references public.members(id) on delete cascade,
  role_in_milestone   text,
  created_at          timestamptz not null default now(),
  unique (milestone_id, member_id)
);

-- ── Indexes ──
create index if not exists idx_admins_user_id on public.admins(user_id);
create index if not exists idx_members_batch_year on public.members(batch_year);
create index if not exists idx_members_department on public.members(department);
create index if not exists idx_member_roles_member_id on public.member_roles(member_id);
create index if not exists idx_member_roles_society_id on public.member_roles(society_id);
create index if not exists idx_milestones_date on public.milestones(date);
create index if not exists idx_milestones_category on public.milestones(category);
create index if not exists idx_milestones_society_id on public.milestones(society_id);
create index if not exists idx_milestone_members_milestone on public.milestone_members(milestone_id);
create index if not exists idx_milestone_members_member on public.milestone_members(member_id);

-- ── Triggers for updated_at ──
drop trigger if exists set_admins_updated_at on public.admins;
create trigger set_admins_updated_at
  before update on public.admins
  for each row execute function public.set_updated_at();

drop trigger if exists set_societies_updated_at on public.societies;
create trigger set_societies_updated_at
  before update on public.societies
  for each row execute function public.set_updated_at();

drop trigger if exists set_members_updated_at on public.members;
create trigger set_members_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

drop trigger if exists set_member_roles_updated_at on public.member_roles;
create trigger set_member_roles_updated_at
  before update on public.member_roles
  for each row execute function public.set_updated_at();

drop trigger if exists set_milestones_updated_at on public.milestones;
create trigger set_milestones_updated_at
  before update on public.milestones
  for each row execute function public.set_updated_at();

-- ── Public Members View (Excludes source_note) ──
-- Created with security_barrier to prevent optimization side-channels.
-- Uses default owner-executed mode (security_invoker = false) so anonymous
-- and ordinary users do not require direct table grants on public.members.
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

-- ── Row Level Security ──

-- Enable RLS on all tables
alter table public.admins enable row level security;
alter table public.societies enable row level security;
alter table public.members enable row level security;
alter table public.member_roles enable row level security;
alter table public.milestones enable row level security;
alter table public.milestone_members enable row level security;

-- Admins table policies (Idempotent policy management)
-- All authenticated admins can view admin list
drop policy if exists "Admins can view admin list" on public.admins;
create policy "Admins can view admin list"
  on public.admins for select
  to authenticated
  using (public.is_admin());

-- Only superadmins can create, update, or remove admin records to prevent privilege escalation
drop policy if exists "Superadmins can manage admins" on public.admins;
create policy "Superadmins can manage admins"
  on public.admins for all
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- Societies policies (public read, admin mutate)
drop policy if exists "Public can read societies" on public.societies;
create policy "Public can read societies"
  on public.societies for select
  using (true);

drop policy if exists "Admins can manage societies" on public.societies;
create policy "Admins can manage societies"
  on public.societies for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Members table policies:
-- Only authenticated admins can directly select/mutate members table (which contains source_note).
-- Public/anon users read through public_members view.
drop policy if exists "Admins have full access to members table" on public.members;
create policy "Admins have full access to members table"
  on public.members for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Member Roles policies (public read, admin mutate)
drop policy if exists "Public can read member roles" on public.member_roles;
create policy "Public can read member roles"
  on public.member_roles for select
  using (true);

drop policy if exists "Admins can manage member roles" on public.member_roles;
create policy "Admins can manage member roles"
  on public.member_roles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Milestones policies (public read, admin mutate)
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

-- Milestone Members junction policies (public read, admin mutate)
drop policy if exists "Public can read milestone members" on public.milestone_members;
create policy "Public can read milestone members"
  on public.milestone_members for select
  using (true);

drop policy if exists "Admins can manage milestone members" on public.milestone_members;
create policy "Admins can manage milestone members"
  on public.milestone_members for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Permissions & View Security Model ──
-- Defense-in-depth: explicitly revoke mutation privileges from anon and public roles
revoke insert, update, delete on public.societies from anon, public;
revoke insert, update, delete on public.member_roles from anon, public;
revoke insert, update, delete on public.milestones from anon, public;
revoke insert, update, delete on public.milestone_members from anon, public;
revoke all on public.members from anon, public;
revoke all on public.admins from anon, public;
revoke insert, update, delete on public.public_members from anon, authenticated, public;

-- Grant select on public views and safe tables to anon and authenticated
grant select on public.public_members to anon, authenticated;
grant select on public.societies to anon, authenticated;
grant select on public.member_roles to anon, authenticated;
grant select on public.milestones to anon, authenticated;
grant select on public.milestone_members to anon, authenticated;

-- Revoke default public execution and restrict execute permissions to authenticated
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

revoke execute on function public.is_superadmin() from public, anon;
grant execute on function public.is_superadmin() to authenticated;

-- ── Storage Bucket & Policies ──
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'archive-media',
  'archive-media',
  true,
  5242880, -- 5 MB limit
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS with idempotent policy definitions
drop policy if exists "Public can view archive media" on storage.objects;
create policy "Public can view archive media"
  on storage.objects for select
  using (bucket_id = 'archive-media');

drop policy if exists "Admins can upload archive media" on storage.objects;
create policy "Admins can upload archive media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'archive-media'
    and public.is_admin()
  );

drop policy if exists "Admins can update archive media" on storage.objects;
create policy "Admins can update archive media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'archive-media'
    and public.is_admin()
  )
  with check (
    bucket_id = 'archive-media'
    and public.is_admin()
  );

drop policy if exists "Admins can delete archive media" on storage.objects;
create policy "Admins can delete archive media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'archive-media'
    and public.is_admin()
  );
