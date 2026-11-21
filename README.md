# NISB — People & Milestones

An institutional archive of the people and milestones of NIE IEEE Student Branch (NISB), Mysuru.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript strict, Turbopack)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Base UI)
- **Database & Auth**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`) with PostgreSQL RLS
- **Validation**: Zod
- **Forms**: react-hook-form + @hookform/resolvers
- **Icons**: lucide-react

## Getting Started

1. Copy `.env.example` to `.env.local` and configure your Supabase project credentials:
   ```bash
   cp .env.example .env.local
   ```

2. Run the SQL migration in `supabase/migrations/001_init.sql` (or `supabase/schema.sql`) in the Supabase SQL Editor to establish tables, views, triggers, and Row-Level Security policies.

3. Install dependencies and start the local development server:
   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata, base styling)
│   ├── page.tsx            # Home page & archive navigation
│   ├── not-found.tsx       # 404 archive not found page
│   ├── globals.css         # Tailwind v4 theme tokens & typography
│   ├── directory/
│   │   └── page.tsx        # Member directory (public_members view)
│   ├── milestones/
│   │   └── page.tsx        # Milestones timeline
│   ├── societies/
│   │   └── page.tsx        # Societies & chapters directory
│   └── about/
│       └── page.tsx        # About page & archive purpose
├── components/
│   └── ui/                 # Custom archive components & shadcn UI primitives
│       ├── monogram.tsx    # Missing-photo placeholder
│       ├── page-header.tsx # Reusable editorial page header
│       ├── footer.tsx      # Site footer
│       ├── button.tsx      # Button primitive
│       ├── input.tsx       # Form input primitive
│       ├── textarea.tsx    # Textarea primitive
│       ├── select.tsx      # Select dropdown primitive
│       ├── dialog.tsx      # Modal dialog primitive
│       ├── table.tsx       # Table primitive
│       ├── form.tsx        # React Hook Form wrapper
│       ├── sonner.tsx      # Toast notifications
│       ├── badge.tsx       # Tag & status badge primitive
│       └── alert-dialog.tsx# Confirmation dialog primitive
├── lib/
│   ├── database.types.ts   # Supabase Database TypeScript definitions
│   ├── validation.ts       # Canonical Zod schemas (members, societies, roles, milestones)
│   ├── schemas.ts          # Schema exports
│   ├── utils.ts            # Class merging (cn) and data utility functions
│   └── supabase/
│       ├── client.ts       # Browser-side Supabase client (@supabase/ssr)
│       ├── server.ts       # Server-side Supabase client (@supabase/ssr)
│       ├── admin-guard.ts  # Server-only admin verification & service client
│       └── index.ts        # Re-exports
supabase/
├── migrations/
│   └── 001_init.sql        # Initial audited schema, RLS policies, and storage
└── schema.sql              # Database schema & RLS policies
```

## Design Language

"Institutional archive" aesthetic:
- **Paper**: `#F4F1EA` — **Ink**: `#141414` — **Accent**: `#00629B`
- **Borders**: `#D9D4C7` hairline — **Radius**: 2px — No shadows/gradients
- **Fonts**: Newsreader (display), Geist (UI), Geist Mono (metadata)
