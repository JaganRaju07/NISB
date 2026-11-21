import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  publicMemberSchema,
  memberFormSchema,
  memberRoleSchema,
  memberRoleFormSchema,
  publicMilestoneSchema,
  milestoneSchema,
  milestoneFormSchema,
  societySchema,
} from "../src/lib/validation.ts";

describe("Phase 2 — Validation & Archival Integrity", () => {
  describe("publicMemberSchema", () => {
    it("validates valid public member records", () => {
      const valid = {
        id: "22222222-2222-4222-a222-000000000001",
        full_name: "Dr. Rohini Nagapadma",
        role: "Branch Counselor",
        department: "Electronics and Communication Engineering",
        batch_year: "Faculty",
        photo_url: "https://example.com/photo.jpg",
        bio: "Founding Branch Counselor.",
        interests: ["Signal Processing", "Wireless"],
        tenure_start: "2008",
        tenure_end: "2018",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = publicMemberSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("rejects public member records missing required full_name", () => {
      const invalid = {
        id: "22222222-2222-4222-a222-000000000001",
        full_name: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = publicMemberSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("memberRoleSchema Tier Consistency Constraints", () => {
    it("accepts branch tier when society_id is null", () => {
      const branchRole = {
        id: "33333333-3333-4333-a333-000000000001",
        member_id: "22222222-2222-4222-a222-000000000001",
        society_id: null,
        role_title: "Branch Chair",
        tier: "branch" as const,
        start_year: "2021",
        end_year: "2022",
        is_current: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = memberRoleSchema.safeParse(branchRole);
      assert.equal(result.success, true);
    });

    it("rejects branch tier when society_id is present", () => {
      const invalidBranchRole = {
        id: "33333333-3333-4333-a333-000000000001",
        member_id: "22222222-2222-4222-a222-000000000001",
        society_id: "11111111-1111-4111-a111-000000000001",
        role_title: "Branch Chair",
        tier: "branch" as const,
        start_year: "2021",
        end_year: "2022",
        is_current: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = memberRoleSchema.safeParse(invalidBranchRole);
      assert.equal(result.success, false);
    });

    it("accepts society tier when society_id is provided", () => {
      const societyRole = {
        id: "33333333-3333-4333-a333-000000000002",
        member_id: "22222222-2222-4222-a222-000000000001",
        society_id: "11111111-1111-4111-a111-000000000002",
        role_title: "CS Chapter Chair",
        tier: "society" as const,
        start_year: "2022",
        end_year: "2023",
        is_current: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = memberRoleSchema.safeParse(societyRole);
      assert.equal(result.success, true);
    });

    it("rejects society tier when society_id is null or omitted", () => {
      const invalidSocietyRole = {
        id: "33333333-3333-4333-a333-000000000002",
        member_id: "22222222-2222-4222-a222-000000000001",
        society_id: null,
        role_title: "CS Chapter Chair",
        tier: "society" as const,
        start_year: "2022",
        end_year: "2023",
        is_current: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = memberRoleSchema.safeParse(invalidSocietyRole);
      assert.equal(result.success, false);
    });
  });

  describe("memberRoleFormSchema", () => {
    it("validates branch role form without society_id", () => {
      const form = {
        member_id: "22222222-2222-4222-a222-000000000001",
        society_id: "",
        role_title: "Secretary",
        tier: "branch" as const,
        start_year: "2022",
      };

      const result = memberRoleFormSchema.safeParse(form);
      assert.equal(result.success, true);
    });

    it("rejects branch role form when society_id is specified", () => {
      const form = {
        member_id: "22222222-2222-4222-a222-000000000001",
        society_id: "11111111-1111-4111-a111-000000000002",
        role_title: "Secretary",
        tier: "branch" as const,
      };

      const result = memberRoleFormSchema.safeParse(form);
      assert.equal(result.success, false);
    });

    it("rejects society role form when society_id is empty", () => {
      const form = {
        member_id: "22222222-2222-4222-a222-000000000001",
        society_id: "",
        role_title: "Secretary",
        tier: "society" as const,
      };

      const result = memberRoleFormSchema.safeParse(form);
      assert.equal(result.success, false);
    });
  });

  describe("publicMilestoneSchema & Year Validation", () => {
    it("accepts valid milestone with milestone_year between 1900 and 2100", () => {
      const milestone = {
        id: "44444444-4444-4444-a444-000000000001",
        title: "Inception of NIE IEEE Student Branch",
        description: "Official charter STB64141.",
        date: "August 2008",
        milestone_year: 2008,
        category: "Charter",
        society_id: "11111111-1111-4111-a111-000000000001",
        image_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = publicMilestoneSchema.safeParse(milestone);
      assert.equal(result.success, true);
    });

    it("rejects milestone with milestone_year below 1900", () => {
      const invalid = {
        id: "44444444-4444-4444-a444-000000000001",
        title: "Ancient Milestone",
        milestone_year: 1850,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = publicMilestoneSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });

    it("rejects milestone with milestone_year beyond 2100", () => {
      const invalid = {
        id: "44444444-4444-4444-a444-000000000001",
        title: "Future Milestone",
        milestone_year: 2150,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = publicMilestoneSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("memberFormSchema & Publication Integrity", () => {
    it("defaults status to draft and verification_status to pending", () => {
      const form = {
        full_name: "Test Leader",
        source_note: "Audited from meeting minutes",
      };

      const parsed = memberFormSchema.parse(form);
      assert.equal(parsed.status, "draft");
      assert.equal(parsed.verification_status, "pending");
      assert.equal(parsed.source_note, "Audited from meeting minutes");
    });

    it("accepts draft status with source_listed verification (official roster standard)", () => {
      const rosterEntry = {
        full_name: "Official Listed Member",
        status: "draft" as const,
        verification_status: "source_listed" as const,
        source_note: "Listed on official NISB team page",
      };

      const result = memberFormSchema.safeParse(rosterEntry);
      assert.equal(result.success, true);
    });

    it("accepts published status when verification_status is confirmed", () => {
      const published = {
        full_name: "Confirmed Leader",
        status: "published" as const,
        verification_status: "confirmed" as const,
      };

      const result = memberFormSchema.safeParse(published);
      assert.equal(result.success, true);
    });

    it("rejects published status when verification_status is pending", () => {
      const invalid = {
        full_name: "Premature Leader",
        status: "published" as const,
        verification_status: "pending" as const,
      };

      const result = memberFormSchema.safeParse(invalid);
      assert.equal(result.success, false);
      if (!result.success) {
        assert.ok(
          result.error.issues.some((i) =>
            i.message.includes("published when verification_status is confirmed")
          )
        );
      }
    });

    it("rejects published status when verification_status is source_listed", () => {
      const invalid = {
        full_name: "Unconfirmed Leader",
        status: "published" as const,
        verification_status: "source_listed" as const,
      };

      const result = memberFormSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("milestoneSchema, milestoneFormSchema & societySchema", () => {
    it("validates full admin milestone record with confirmed publication", () => {
      const record = {
        id: "44444444-4444-4444-a444-000000000001",
        title: "Branch Inception",
        milestone_year: 2008,
        status: "published" as const,
        verification_status: "confirmed" as const,
        source_note: "Verified from IEEE Regional Office",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const parsed = milestoneSchema.parse(record);
      assert.equal(parsed.status, "published");
      assert.equal(parsed.verification_status, "confirmed");
      assert.equal(parsed.source_note, "Verified from IEEE Regional Office");
    });

    it("rejects milestoneSchema when published with pending verification", () => {
      const invalid = {
        id: "44444444-4444-4444-a444-000000000001",
        title: "Premature Milestone",
        milestone_year: 2020,
        status: "published" as const,
        verification_status: "pending" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = milestoneSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });

    it("validates milestoneFormSchema with default values and draft status", () => {
      const form = {
        title: "Annual Symposium",
        milestone_year: 2024,
      };

      const parsed = milestoneFormSchema.parse(form);
      assert.equal(parsed.status, "draft");
      assert.equal(parsed.verification_status, "pending");
      assert.equal(parsed.source_note, "");
    });

    it("rejects milestoneFormSchema when published with unconfirmed status", () => {
      const invalid = {
        title: "Symposium",
        status: "published" as const,
        verification_status: "source_listed" as const,
      };

      const result = milestoneFormSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });

    it("validates societySchema slug format and properties", () => {
      const society = {
        id: "11111111-1111-4111-a111-000000000002",
        slug: "ieee-cs",
        name: "IEEE Computer Society Chapter",
        short_name: "IEEE CS",
        established_year: "2011",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const parsed = societySchema.parse(society);
      assert.equal(parsed.slug, "ieee-cs");
      assert.equal(parsed.name, "IEEE Computer Society Chapter");
    });
  });

  describe("Official NISB Roster Integrity (seed.sql)", () => {
    const rootDir = path.resolve(".");
    const seedPath = path.join(rootDir, "supabase", "seed.sql");
    const seedSql = fs.readFileSync(seedPath, "utf-8");

    it("stages exactly 21 official NISB team entries from nisb.in/content.html", () => {
      const memberInsertions = seedSql.match(/'22222222-2222-4222-a222-\d{12}'/g);
      assert.ok(memberInsertions, "Must have member insertions in seed.sql");
      assert.equal(memberInsertions.length, 21, "Must contain exactly 21 official NISB team entries");
    });

    it("verifies all 21 team members default strictly to draft + source_listed", () => {
      const draftMatches = seedSql.match(/'draft',\s*'source_listed'/g);
      assert.ok(draftMatches);
      assert.equal(draftMatches.length, 21, "All 21 entries must be set to 'draft' and 'source_listed'");
    });

    it("verifies all 21 team members match official names with zero invented metadata", () => {
      const expectedMembers = [
        "Sagar Kumar Singh",
        "Abhay Hegde",
        "Yogesh S",
        "Sakleshwar Hubli",
        "K Anantha Krishna Rao",
        "Shreya P V",
        "Aadya Sharma",
        "Sagar N Mutalik",
        "Pranav A Korlahalli",
        "Aashish Vatwani",
        "Rahul K",
        "Shresth S Juptimath",
        "Priyanka Pramod Daivagna",
        "Prerika P",
        "Nikitha H S",
        "Suma Acharya",
        "Sanjana S Shetty",
        "Panchami Urs S",
        "Rachit Kulkarni",
        "Mohammed Mansooruddin",
        "Amol S",
      ];

      for (const name of expectedMembers) {
        assert.ok(seedSql.includes(`'${name}'`), `Seed must contain official member: ${name}`);
      }
    });

    it("verifies official societies include parent branch and technical chapters", () => {
      const expectedSocieties = [
        "nisb",
        "ieee-cs",
        "ieee-wie",
        "ieee-cass",
        "ieee-pes",
        "ieee-ceda",
        "ieee-grss",
        "ieee-ras",
      ];

      for (const slug of expectedSocieties) {
        assert.ok(seedSql.includes(`'${slug}'`), `Seed must contain verified society: ${slug}`);
      }
    });
  });
});
