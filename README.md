# NISB People & Milestones

An institutional digital archive for the people and milestones of NIE IEEE Student Branch (NISB), The National Institute of Engineering, Mysuru (IEEE Branch Code: STB64141, IEEE Bangalore Section).

## Overview and Purpose

The NISB People & Milestones archive provides a structured, verifiable, and permanent record of student branch leadership, society officers, and institutional achievements. The platform combines a publicly accessible directory and milestone timeline with an authenticated administrative dashboard for curators. It is designed to maintain historical provenance while strictly preventing unverified or speculative claims.

## Data Source and Governance

All initial factual records are sourced exclusively from the official NIE IEEE Student Branch website at `https://www.nisb.in/content.html`.

Governance principles enforced across the platform:
- Official Source Only: No records, achievements, or titles are fabricated. Facts are taken directly from `nisb.in/content.html#team`.
- Zero Speculative Metadata: Missing fields—including tenure dates, departments, technical interests, contributions, and personal biographies—remain explicitly null or empty until confirmed by official branch records or committee verification.
- Official Photographic Assets: Photographs are linked to official assets hosted under `https://www.nisb.in/assets/cores25-26/`. When a photograph is unavailable, the system renders a deterministic monogram avatar derived from the member's full name.
- Roster Staging: The 21 members published on the official website are staged in the database with status `draft` and verification status `source_listed`. Appearance on the public website establishes presence on the roster, but public visibility in the directory requires curator confirmation.

## Features

### Public Archive
- Searchable Member Directory: Live search across member names, roles, departments, batch years, and technical interests, with filtering by society and affinity chapter.
- Comprehensive Member Profiles: Detailed archival view per member showing official photograph (or monogram fallback), current role, society affiliations, tenures, technical interests, contributions, and linked milestones.
- Milestones Timeline: Chronological archive of branch and society milestones, filterable by society chapter and calendar year.
- Milestone Detail Records: Dedicated milestone page with event date, year, society context, descriptive overview, and an explicit list of linked participants ("People Behind This Milestone").
- Society & Chapter Overviews: Individual society pages detailing history, establishment year, official website links, current officers, and associated milestones.

### Admin Dashboard
- Curatorial Authentication: Dedicated login flow backed by Supabase Auth with server-enforced role verification.
- Member Management: Full CRUD operations for branch members, including bio, interests, department, batch year, contributions, and curatorial source notes.
- Milestone Management: Full CRUD operations for branch milestones, including milestone year, society association, description, and source notes.
- Role and Tenure Tracking: Association of members with specific branch or society roles, enforcing tier consistency (branch vs. society).
- Milestone-Member Junctions: Linking of members to specific milestones with custom contribution roles (e.g., Organizer, Lead, Speaker).
- Photo Asset Management: Safe URL handling supporting official NISB asset URLs, full HTTPS URLs, and root-relative paths.
- Publication Workflow Controls: Admin-controlled status transitions enforcing publication integrity rules prior to public indexing.

## Tech Stack

- Framework: Next.js 16 (App Router, TypeScript strict mode, Turbopack)
- Database & Auth: Supabase (PostgreSQL with Row-Level Security, `@supabase/supabase-js`, `@supabase/ssr`)
- Styling & Primitives: Tailwind CSS v4, Base UI, Lucide React
- Schema Validation: Zod
- Notifications: Sonner

## Project Structure

```
NISB/
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Root layout with navigation and fonts
│   │   ├── page.tsx                       # Homepage and archive entrance
│   │   ├── not-found.tsx                  # Global 404 archive handler
│   │   ├── globals.css                    # Design tokens and Tailwind configuration
│   │   ├── about/
│   │   │   └── page.tsx                   # Archival mission and governance page
│   │   ├── directory/
│   │   │   ├── page.tsx                   # Member directory page (server component)
│   │   │   ├── directory-list.tsx         # Searchable directory list (client component)
│   │   │   └── [id]/
│   │   │       └── page.tsx               # Member profile detail page
│   │   ├── milestones/
│   │   │   ├── page.tsx                   # Milestones timeline page (server component)
│   │   │   ├── milestone-list.tsx         # Filterable milestone list (client component)
│   │   │   └── [id]/
│   │   │       └── page.tsx               # Milestone detail record page
│   │   ├── societies/
│   │   │   ├── page.tsx                   # Societies catalog page
│   │   │   └── [slug]/
│   │   │       └── page.tsx               # Society detail page
│   │   └── admin/
│   │       ├── layout.tsx                 # Protected admin layout
│   │       ├── page.tsx                   # Admin metrics and overview dashboard
│   │       ├── login/
│   │       │   └── page.tsx               # Admin login page
│   │       ├── members/
│   │       │   ├── page.tsx               # Member roster management (server component)
│   │       │   └── member-management-client.tsx
│   │       └── milestones/
│   │           ├── page.tsx               # Milestone timeline management (server component)
│   │           └── milestone-management-client.tsx
│   ├── components/
│   │   ├── admin/
│   │   │   └── admin-header.tsx           # Curator top navigation header
│   │   └── ui/                            # Archival UI components and primitives
│   │       ├── member-avatar.tsx          # Photo renderer with Monogram fallback
│   │       ├── monogram.tsx               # Deterministic typography avatar
│   │       ├── page-header.tsx            # Standardized page header
│   │       ├── footer.tsx                 # Archive footer
│   │       └── [button, dialog, etc.]     # Form and dialog primitives
│   └── lib/
│       ├── archive.ts                     # Public data access layer (reads public views)
│       ├── archive-helpers.ts             # Pure transformation and filtering helpers
│       ├── validation.ts                  # Canonical Zod schemas and validation rules
│       ├── database.types.ts              # Supabase database TypeScript definitions
│       ├── utils.ts                       # General utility and access decision functions
│       ├── actions/
│       │   └── admin-actions.ts           # Server actions for admin mutations
│       └── supabase/
│           ├── client.ts                  # Browser-side Supabase client
│           ├── server.ts                  # Server-side Supabase client (cookie-based)
│           └── admin-guard.ts             # Server-only admin guard and service role client
├── supabase/
│   ├── migrations/
│   │   ├── 001_init.sql                   # Baseline schema, RLS, and admin verification
│   │   ├── 002_verified_data_foundation.sql     # Lifecycle, verification, security views
│   │   ├── 002_verified_data_foundation.down.sql # Rollback script (DO NOT APPLY)
│   │   └── 003_contributions.sql          # Contributions column and view update
│   ├── schema.sql                         # Consolidated schema reference
│   └── seed.sql                           # Official NISB seed dataset
├── tests/
│   ├── validation.test.ts                 # Schema and input validation invariants
│   ├── archive.test.ts                    # Archival helpers and seed integrity tests
│   ├── migration.test.ts                  # SQL migration and security barrier invariants
│   └── admin.test.ts                      # Admin authorization and guard invariants
└── package.json
```

## Local Setup

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env.local` and provide the following configuration variable names:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:3000`. When environment variables are not configured, the public archive safely displays standby notices without throwing errors.

## Database Setup

Apply the migrations in `supabase/migrations/` sequentially using the Supabase SQL Editor or Supabase CLI:

1. `supabase/migrations/001_init.sql` — Initializes baseline tables (`admins`, `societies`, `members`, `member_roles`, `milestones`, `milestone_members`), helper functions (`is_admin`, `is_superadmin`), and RLS policies.
2. `supabase/migrations/002_verified_data_foundation.sql` — Establishes status and verification models, role tier constraints, audit triggers (`updated_by`), and security barrier public views.
3. `supabase/migrations/003_contributions.sql` — Appends the `contributions` column to `members` and updates the `public_members` security barrier view.
4. `supabase/seed.sql` — Populates official societies and the 21 NISB team entries sourced from `nisb.in/content.html#team`.

Important: The file `supabase/migrations/002_verified_data_foundation.down.sql` is a rollback script for teardown and development testing only. It must NOT be applied during database setup.

## First Superadmin

To establish the initial superadmin curator:

1. Create a user account in the Supabase Dashboard under Authentication > Users (or via the admin login screen sign-up if enabled).
2. Retrieve the generated UUID for that user from the Supabase Auth table.
3. Execute the following SQL statement in the Supabase SQL Editor to grant superadmin privileges:

```sql
insert into public.admins (user_id, email, role)
values ('<AUTH_USER_UUID>', 'curator@example.com', 'superadmin');
```

Replace `<AUTH_USER_UUID>` with the actual user ID and `curator@example.com` with the corresponding email. The `public.admins` table enforces authorization checks via the `is_admin()` and `is_superadmin()` security definer functions.

## Publication Workflow

The archive enforces a two-dimensional publication integrity lifecycle defined at both the database schema level (via SQL check constraints) and application layer (via Zod schemas):

### Lifecycle Statuses
- `draft`: Work-in-progress or staged record. Not eligible for public view.
- `published`: Intended for public indexation, subject to verification.
- `archived`: Historical record removed from active public view.

### Verification Statuses
- `pending`: Unverified record awaiting corroborating evidence.
- `source_listed`: Present on official website (e.g. `nisb.in/content.html`), but full details unconfirmed.
- `confirmed`: Fully verified and approved by archive curators.

### Publication Integrity Constraint
Both `public.members` and `public.milestones` enforce the following SQL check constraint:
```sql
check (status != 'published' or verification_status = 'confirmed');
```
A record can only enter the `published` status if its verification status is explicitly `confirmed`. If a curator attempts to publish a record marked `pending` or `source_listed`, the database rejects the transaction.

Only records where `status = 'published'` and `verification_status = 'confirmed'` are exposed through the `public_members` and `public_milestones` views.

## Security Model

- Row-Level Security (RLS): Enabled on all underlying tables (`members`, `milestones`, `member_roles`, `milestone_members`, `admins`, `societies`). Direct select on `members` and `milestones` is revoked from anonymous users.
- Public Views with Security Barrier: Public queries run against `public_members` and `public_milestones`, defined with `with (security_barrier = true)`. This prevents optimizer side-channel leaks. Private fields (`source_note`, `updated_by`) are omitted from the view definitions.
- Isolated Service-Role Key: `SUPABASE_SERVICE_ROLE_KEY` is referenced exclusively within `src/lib/supabase/admin-guard.ts`, which includes `import "server-only"`. The key is never exposed to browser bundles or client components.
- Fail-Closed Admin Guard: The admin access gate evaluates environment configuration and session state. In production environments (`NODE_ENV === "production"`), missing configuration or non-admin sessions unconditionally redirect to `/admin/login`. Standby mode is restricted to local development environments.

## Testing

The test suite covers schema validation, archival query helpers, database migration invariants, and admin access rules:

```bash
# Run test suite (121 tests across 35 suites)
npm test

# Run ESLint code quality checks
npm run lint

# Run TypeScript strict type verification
npx tsc --noEmit

# Run Next.js production build and page generation
npm run build
```

## Deployment

The application is deployed using Vercel connected to a Supabase project:

1. Connect the repository to Vercel.
2. In the Vercel Project Settings > Environment Variables, configure the three required variable names:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy the project. The build pipeline runs `next build` with Turbopack, generating static pages and partial prerendering routes.

No credentials, keys, or database passwords should ever be committed to the repository.

## Known Limitations

- Incomplete Metadata Pending Committee Verification: Fields such as tenure years, technical interests, contributions, and personal biographies remain empty for initial seed entries, pending verification by the incoming committee.
- No Initial Milestones Seeded: The initial seed dataset focuses solely on establishing the official team roster and society chapters. Historical milestones must be authored and confirmed through the admin dashboard.
- Identifier-Based Profile URLs: Member and milestone detail routes currently use UUID identifiers (`/directory/[id]` and `/milestones/[id]`) rather than human-readable slugs.
