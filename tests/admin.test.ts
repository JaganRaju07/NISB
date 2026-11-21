import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  memberFormSchema,
  milestoneFormSchema,
  memberRoleFormSchema,
  adminSchema,
} from "../src/lib/validation.ts";
import { isSupabaseConfigured } from "../src/lib/utils.ts";

describe("Phase 3 — Admin Dashboard & Archive Management Invariants", () => {
  describe("Curatorial Publication Integrity Constraint", () => {
    it("permits member record to be published when verification_status is confirmed", () => {
      const valid = {
        full_name: "Verified Curator",
        status: "published" as const,
        verification_status: "confirmed" as const,
        source_note: "Verified from IEEE Bangalore Section charter",
      };

      const parsed = memberFormSchema.parse(valid);
      assert.equal(parsed.status, "published");
      assert.equal(parsed.verification_status, "confirmed");
      assert.equal(parsed.source_note, "Verified from IEEE Bangalore Section charter");
    });

    it("strictly rejects member record publication when verification_status is pending", () => {
      const invalid = {
        full_name: "Unverified Member",
        status: "published" as const,
        verification_status: "pending" as const,
      };

      const result = memberFormSchema.safeParse(invalid);
      assert.equal(result.success, false);
      assert.ok(
        result.error.issues.some((i) =>
          i.message.includes("may only be published when verification_status is confirmed")
        )
      );
    });

    it("strictly rejects member record publication when verification_status is source_listed", () => {
      const invalid = {
        full_name: "Staged Official Roster Member",
        status: "published" as const,
        verification_status: "source_listed" as const,
      };

      const result = memberFormSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });

    it("permits draft members with source_listed verification (official staging standard)", () => {
      const staged = {
        full_name: "Sagar Kumar Singh",
        status: "draft" as const,
        verification_status: "source_listed" as const,
        source_note: "nisb.in/content.html#team",
      };

      const parsed = memberFormSchema.parse(staged);
      assert.equal(parsed.status, "draft");
      assert.equal(parsed.verification_status, "source_listed");
    });
  });

  describe("Milestone Validation & Year Boundary Rules", () => {
    it("permits milestone publication when verification_status is confirmed", () => {
      const valid = {
        title: "NISB Founding Charter",
        milestone_year: 2008,
        status: "published" as const,
        verification_status: "confirmed" as const,
      };

      const parsed = milestoneFormSchema.parse(valid);
      assert.equal(parsed.status, "published");
      assert.equal(parsed.verification_status, "confirmed");
      assert.equal(parsed.milestone_year, 2008);
    });

    it("strictly rejects milestone publication when verification_status is pending", () => {
      const invalid = {
        title: "Future Symposium",
        milestone_year: 2025,
        status: "published" as const,
        verification_status: "pending" as const,
      };

      const result = milestoneFormSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });

    it("strictly rejects milestone with milestone_year earlier than 1900", () => {
      const invalid = {
        title: "Historical Error",
        milestone_year: 1899,
        status: "draft" as const,
        verification_status: "pending" as const,
      };

      const result = milestoneFormSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });

    it("strictly rejects milestone with milestone_year later than 2100", () => {
      const invalid = {
        title: "Far Future Anomaly",
        milestone_year: 2101,
        status: "draft" as const,
        verification_status: "pending" as const,
      };

      const result = milestoneFormSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("Role Tier Consistency Constraints", () => {
    const validMemberId = "22222222-2222-4222-a222-000000000001";
    const validSocietyId = "11111111-1111-4111-a111-000000000002";

    it("permits branch tier role without society_id", () => {
      const branchRole = {
        member_id: validMemberId,
        role_title: "Branch Counselor",
        tier: "branch" as const,
      };

      const parsed = memberRoleFormSchema.parse(branchRole);
      assert.equal(parsed.tier, "branch");
      assert.equal(parsed.role_title, "Branch Counselor");
    });

    it("rejects branch tier role when society_id is provided", () => {
      const invalidBranchRole = {
        member_id: validMemberId,
        society_id: validSocietyId,
        role_title: "Branch Counselor",
        tier: "branch" as const,
      };

      const result = memberRoleFormSchema.safeParse(invalidBranchRole);
      assert.equal(result.success, false);
      assert.ok(
        result.error.issues.some((i) =>
          i.message.includes("Branch tier cannot have a society_id")
        )
      );
    });

    it("permits society tier role with valid society_id", () => {
      const societyRole = {
        member_id: validMemberId,
        society_id: validSocietyId,
        role_title: "Chapter Chair",
        tier: "society" as const,
      };

      const parsed = memberRoleFormSchema.parse(societyRole);
      assert.equal(parsed.tier, "society");
      assert.equal(parsed.society_id, validSocietyId);
    });

    it("rejects society tier role when society_id is omitted or empty", () => {
      const invalidSocietyRole = {
        member_id: validMemberId,
        society_id: "",
        role_title: "Chapter Chair",
        tier: "society" as const,
      };

      const result = memberRoleFormSchema.safeParse(invalidSocietyRole);
      assert.equal(result.success, false);
      assert.ok(
        result.error.issues.some((i) =>
          i.message.includes("Society tier must specify a society")
        )
      );
    });
  });

  describe("Standby Mode Resilience", () => {
    it("reports standby status cleanly without throwing when unconfigured", () => {
      const configured = isSupabaseConfigured();
      assert.equal(typeof configured, "boolean");
    });
  });

  describe("Curatorial Provenance & Internal Audit Privacy", () => {
    it("preserves internal source_note in member mutations", () => {
      const member = {
        full_name: "Archive Steward",
        status: "draft" as const,
        verification_status: "pending" as const,
        source_note: "Private curator notes: unverified claim under review",
      };

      const parsed = memberFormSchema.parse(member);
      assert.equal(parsed.source_note, "Private curator notes: unverified claim under review");
    });

    it("preserves internal source_note in milestone mutations", () => {
      const milestone = {
        title: "Internal Milestone Staging",
        milestone_year: 2023,
        status: "draft" as const,
        verification_status: "source_listed" as const,
        source_note: "Verified via physical banner in student branch hall",
      };

      const parsed = milestoneFormSchema.parse(milestone);
      assert.equal(parsed.source_note, "Verified via physical banner in student branch hall");
    });
  });

  describe("Milestone Boundary Year Invariants", () => {
    it("permits milestone year exactly at boundary 1900", () => {
      const parsed = milestoneFormSchema.parse({
        title: "Earliest Permitted Boundary Event",
        milestone_year: 1900,
        status: "draft" as const,
        verification_status: "pending" as const,
      });
      assert.equal(parsed.milestone_year, 1900);
    });

    it("permits milestone year exactly at boundary 2100", () => {
      const parsed = milestoneFormSchema.parse({
        title: "Latest Permitted Boundary Event",
        milestone_year: 2100,
        status: "draft" as const,
        verification_status: "pending" as const,
      });
      assert.equal(parsed.milestone_year, 2100);
    });

    it("permits null milestone_year for staged / undated milestones", () => {
      const parsed = milestoneFormSchema.parse({
        title: "Undated Staged Milestone",
        milestone_year: null,
        status: "draft" as const,
        verification_status: "pending" as const,
      });
      assert.equal(parsed.milestone_year, null);
    });
  });

  describe("Admin Schema Authorization Invariants", () => {
    it("validates valid admin record with role assignment", () => {
      const admin = {
        id: "44444444-4444-4444-a444-000000000001",
        user_id: "55555555-5555-4555-a555-000000000001",
        email: "curator@nisb.in",
        role: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const parsed = adminSchema.parse(admin);
      assert.equal(parsed.email, "curator@nisb.in");
      assert.equal(parsed.role, "admin");
    });

    it("validates superadmin role assignment", () => {
      const superadmin = {
        id: "44444444-4444-4444-a444-000000000002",
        user_id: "55555555-5555-4555-a555-000000000002",
        email: "counselor@nisb.in",
        role: "superadmin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const parsed = adminSchema.parse(superadmin);
      assert.equal(parsed.role, "superadmin");
    });

    it("rejects admin record with invalid email format", () => {
      const invalid = {
        id: "44444444-4444-4444-a444-000000000003",
        user_id: "55555555-5555-4555-a555-000000000003",
        email: "not-an-email",
        role: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = adminSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });
});
