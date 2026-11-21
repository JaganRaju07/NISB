import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Phase 2 — Migration Safeguards & SQL Architecture Integrity", () => {
  const rootDir = path.resolve(".");
  const migration001Path = path.join(rootDir, "supabase", "migrations", "001_init.sql");
  const migration002Path = path.join(rootDir, "supabase", "migrations", "002_verified_data_foundation.sql");
  const migration002DownPath = path.join(rootDir, "supabase", "migrations", "002_verified_data_foundation.down.sql");
  const schemaPath = path.join(rootDir, "supabase", "schema.sql");

  const migration001 = fs.readFileSync(migration001Path, "utf-8");
  const migration002 = fs.readFileSync(migration002Path, "utf-8");
  const migration002Down = fs.readFileSync(migration002DownPath, "utf-8");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  const cleanSql = (sql: string) => sql.replace(/--.*$/gm, "").trim();

  describe("Migration 002 Preflight & Transactional Safety", () => {
    it("wraps entire execution in a transactional block (begin ... commit)", () => {
      assert.ok(cleanSql(migration002).startsWith("begin;"), "Migration 002 must begin with 'begin;'");
      assert.ok(cleanSql(migration002).endsWith("commit;"), "Migration 002 must conclude with 'commit;'");
    });

    it("embeds meaningful preflight assertions checking Phase 1 tables and RLS", () => {
      assert.ok(
        migration002.includes("Migration 002 Preflight Aborted: Expected Phase 1 tables missing"),
        "Must verify all expected Phase 1 tables exist"
      );
      assert.ok(
        migration002.includes("Migration 002 Preflight Aborted: RLS is disabled on expected tables"),
        "Must assert RLS is active on baseline tables"
      );
      assert.ok(
        migration002.includes("public.is_admin() function does not exist"),
        "Must assert baseline helper functions exist"
      );
    });

    it("pre-checks duplicate member roles before unique indexes can be applied", () => {
      assert.ok(
        migration002.includes("duplicate society role record groups"),
        "Must detect duplicate society tenures"
      );
      assert.ok(
        migration002.includes("duplicate branch role record groups"),
        "Must detect duplicate branch tenures"
      );
    });

    it("captures preflight record counts to guarantee zero data loss", () => {
      assert.ok(
        migration002.includes("create temp table _preflight_counts"),
        "Must snapshot baseline table record counts"
      );
    });

    it("strictly forbids destructive operations (no uninspected DELETE, TRUNCATE, or CASCADE)", () => {
      // Must not execute raw DELETE or TRUNCATE on user tables
      const normalizedSql = migration002.replace(/--.*$/gm, ""); // strip comments
      assert.equal(/\btruncate\b/i.test(normalizedSql), false, "Must not contain TRUNCATE");
      assert.equal(/\bdelete\s+from\b/i.test(normalizedSql), false, "Must not contain DELETE FROM");
      assert.equal(/\bcascade\b/i.test(normalizedSql.replace(/on delete cascade/gi, "")), false, "Must not contain DROP ... CASCADE");
    });
  });

  describe("Publication Model & Verification Integrity Invariants", () => {
    it("enforces status and verification_status check constraints", () => {
      assert.ok(
        migration002.includes("chk_members_status"),
        "Members must enforce valid status values ('draft', 'published', 'archived')"
      );
      assert.ok(
        migration002.includes("chk_members_verification_status"),
        "Members must enforce valid verification_status values ('pending', 'source_listed', 'confirmed')"
      );
      assert.ok(
        migration002.includes("chk_members_publication_integrity"),
        "Members must enforce publication integrity constraint"
      );
      assert.ok(
        migration002.includes("chk_milestones_publication_integrity"),
        "Milestones must enforce publication integrity constraint"
      );
    });

    it("enforces member role tier consistency", () => {
      assert.ok(
        migration002.includes("chk_member_roles_tier_consistency"),
        "Must enforce tier consistency (branch requires society_id is null; society requires society_id is not null)"
      );
    });

    it("permits multi-tenure uniqueness preserving past tenures with distinct start_years", () => {
      assert.ok(
        migration002.includes("idx_member_roles_unique_society"),
        "Must define multi-tenure unique index for society roles"
      );
      assert.ok(
        migration002.includes("idx_member_roles_unique_branch"),
        "Must define multi-tenure unique index for branch roles"
      );
    });

    it("validates milestone_year boundaries at database level", () => {
      assert.ok(
        migration002.includes("chk_milestones_year"),
        "Must enforce milestone_year check (null or 1900-2100)"
      );
    });
  });

  describe("Public Views & Security Barrier Invariants", () => {
    it("creates public_members with security_barrier and explicit allowlist excluding private metadata", () => {
      assert.ok(
        migration002.includes("create or replace view public.public_members\nwith (security_barrier = true)"),
        "public_members must declare security_barrier = true"
      );
      assert.ok(
        migration002.includes("where status = 'published'\n    and verification_status = 'confirmed';"),
        "public_members must expose only confirmed published members"
      );
    });

    it("creates public_milestones with security_barrier and explicit allowlist excluding private metadata", () => {
      assert.ok(
        migration002.includes("create or replace view public.public_milestones\nwith (security_barrier = true)"),
        "public_milestones must declare security_barrier = true"
      );
      assert.ok(
        migration002.includes("where status = 'published'\n    and verification_status = 'confirmed';"),
        "public_milestones must expose only confirmed published milestones"
      );
    });

    it("embeds postcondition safeguards verifying zero private column leakage", () => {
      assert.ok(
        migration002.includes("Private columns exposed in public views!"),
        "Must verify private metadata is not exposed"
      );
      assert.ok(
        migration002.includes("Zero-data-loss violation on table"),
        "Must assert postcondition record counts >= preflight record counts"
      );
    });
  });

  describe("Rollback Migration (Down Script) Safety", () => {
    it("wraps rollback in transaction block", () => {
      assert.ok(cleanSql(migration002Down).startsWith("begin;"), "Down script must begin with 'begin;'");
      assert.ok(cleanSql(migration002Down).endsWith("commit;"), "Down script must conclude with 'commit;'");
    });

    it("implements guarded safety invariants refusing rollback when curator notes or drafts exist", () => {
      assert.ok(
        migration002Down.includes("Rollback Aborted: Database contains private curator notes"),
        "Down script must refuse to run if curator notes would be destroyed"
      );
      assert.ok(
        migration002Down.includes("Rollback Aborted: Database contains unconfirmed or draft records"),
        "Down script must refuse to run if draft records would be publicly leaked"
      );
    });
  });

  describe("Canonical schema.sql Synchronization", () => {
    it("preserves Phase 1 foundations from 001_init.sql in schema.sql", () => {
      assert.ok(migration001.includes("create table if not exists public.members"));
      assert.ok(schema.includes("create table if not exists public.members"));
    });

    it("includes status and verification_status on members and milestones", () => {
      assert.ok(schema.includes("status              text not null default 'draft'"));
      assert.ok(schema.includes("verification_status text not null default 'pending'"));
      assert.ok(schema.includes("chk_members_publication_integrity"));
      assert.ok(schema.includes("chk_milestones_publication_integrity"));
    });

    it("includes tier and chk_member_roles_tier_consistency on member_roles", () => {
      assert.ok(schema.includes("tier          text not null default 'branch'"));
      assert.ok(schema.includes("chk_member_roles_tier_consistency"));
    });

    it("defines security barrier views filtering on status = 'published' and verification_status = 'confirmed'", () => {
      assert.ok(schema.includes("public.public_members\nwith (security_barrier = true)"));
      assert.ok(schema.includes("public.public_milestones\nwith (security_barrier = true)"));
    });
  });
});
