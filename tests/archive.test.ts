import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  isSupabaseConfigured,
  emptyToNull,
  parseInterests,
  hashString,
} from "../src/lib/utils.ts";
import {
  formatRoleTierLabel,
  formatTenure,
  isMemberRecordEmpty,
  filterDirectoryMembers,
  filterPublicMilestones,
  extractSocietyCodes,
} from "../src/lib/archive-helpers.ts";
import type { PublicMember, MemberRole, PublicMilestone, Society } from "../src/lib/validation.ts";

describe("Phase 2 — Archival Utils & Standby Detection", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  describe("isSupabaseConfigured()", () => {
    it("returns false when env variables are completely missing", () => {
      assert.equal(isSupabaseConfigured(), false);
    });

    it("returns false when env variables are empty whitespace", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "   ";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "   ";
      assert.equal(isSupabaseConfigured(), false);
    });

    it("returns false when placeholder domain is used", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://your-project.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "valid-anon-key-123";
      assert.equal(isSupabaseConfigured(), false);
    });

    it("returns false when placeholder anon key is used", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://abcxyz.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "your-anon-key";
      assert.equal(isSupabaseConfigured(), false);
    });

    it("returns true when valid Supabase URL and anon key are set", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://nisb-archive.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.audited";
      assert.equal(isSupabaseConfigured(), true);
    });
  });

  describe("Data normalization utilities", () => {
    it("emptyToNull trims and converts empty strings to null", () => {
      assert.equal(emptyToNull(""), null);
      assert.equal(emptyToNull("   "), null);
      assert.equal(emptyToNull(undefined), null);
      assert.equal(emptyToNull("  Computer Science  "), "Computer Science");
    });

    it("parseInterests parses comma-separated lists into clean arrays", () => {
      assert.equal(parseInterests(""), null);
      assert.equal(parseInterests("   "), null);
      assert.equal(parseInterests(undefined), null);
      assert.deepEqual(parseInterests("VLSI, Embedded Systems , Robotics"), [
        "VLSI",
        "Embedded Systems",
        "Robotics",
      ]);
    });

    it("hashString creates deterministic positive integer hashes", () => {
      const h1 = hashString("NISB");
      const h2 = hashString("NISB");
      const h3 = hashString("IEEE");
      assert.equal(h1, h2);
      assert.notEqual(h1, h3);
      assert.ok(h1 >= 0);
    });
  });
});

describe("Phase 4 — Pure Archival Helper Functions", () => {
  describe("formatRoleTierLabel()", () => {
    it("labels branch-level tier as 'Branch'", () => {
      assert.equal(formatRoleTierLabel("branch"), "Branch");
      assert.equal(formatRoleTierLabel("branch", "Ignored"), "Branch");
    });

    it("labels society-level tier with society name when provided", () => {
      assert.equal(
        formatRoleTierLabel("society", "Computer Society"),
        "Society (Computer Society)"
      );
    });

    it("labels society-level tier as 'Society' when society name is omitted", () => {
      assert.equal(formatRoleTierLabel("society"), "Society");
      assert.equal(formatRoleTierLabel("society", null), "Society");
    });
  });

  describe("formatTenure()", () => {
    it("formats start and end year with an en-dash", () => {
      assert.equal(formatTenure("2023", "2024"), "2023–2024");
    });

    it("returns single year if start equals end", () => {
      assert.equal(formatTenure("2024", "2024"), "2024");
    });

    it("returns start year when end year is missing", () => {
      assert.equal(formatTenure("2022", null), "2022");
      assert.equal(formatTenure("2022", ""), "2022");
    });

    it("returns end year when start year is missing", () => {
      assert.equal(formatTenure(null, "2025"), "2025");
      assert.equal(formatTenure("", "2025"), "2025");
    });

    it("returns null when both years are missing or empty", () => {
      assert.equal(formatTenure(null, null), null);
      assert.equal(formatTenure("", "  "), null);
      assert.equal(formatTenure(undefined, undefined), null);
    });
  });

  describe("isMemberRecordEmpty()", () => {
    it("returns true when bio, interests, contributions, and tenure are all empty", () => {
      const member = {
        bio: null,
        interests: null,
        contributions: null,
        tenure_start: null,
        tenure_end: null,
      };
      assert.equal(isMemberRecordEmpty(member), true);
    });

    it("returns true when fields contain only empty whitespace or empty arrays", () => {
      const member = {
        bio: "   ",
        interests: [],
        contributions: "  ",
        tenure_start: "",
        tenure_end: "",
      };
      assert.equal(isMemberRecordEmpty(member), true);
    });

    it("returns false when bio is present", () => {
      const member = {
        bio: "Curator and researcher.",
        interests: null,
        contributions: null,
        tenure_start: null,
        tenure_end: null,
      };
      assert.equal(isMemberRecordEmpty(member), false);
    });

    it("returns false when interests array has items", () => {
      const member = {
        bio: null,
        interests: ["Robotics"],
        contributions: null,
        tenure_start: null,
        tenure_end: null,
      };
      assert.equal(isMemberRecordEmpty(member), false);
    });

    it("returns false when contributions is present", () => {
      const member = {
        bio: null,
        interests: null,
        contributions: "Organized annual symposium.",
        tenure_start: null,
        tenure_end: null,
      };
      assert.equal(isMemberRecordEmpty(member), false);
    });

    it("returns false when tenure is present", () => {
      const member = {
        bio: null,
        interests: null,
        contributions: null,
        tenure_start: "2022",
        tenure_end: "2024",
      };
      assert.equal(isMemberRecordEmpty(member), false);
    });
  });

  describe("filterDirectoryMembers()", () => {
    const mockMembers: PublicMember[] = [
      {
        id: "11111111-1111-1111-1111-111111111111",
        full_name: "Aarav Sharma",
        role: "Chairperson",
        department: "Computer Science",
        batch_year: "2024",
        photo_url: null,
        bio: "Leading branch activities.",
        interests: ["AI", "Distributed Systems"],
        tenure_start: "2023",
        tenure_end: "2024",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        contributions: null,
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        full_name: "Bhavana Rao",
        role: "PES Chapter Lead",
        department: "Electrical Engineering",
        batch_year: "2025",
        photo_url: null,
        bio: "Power systems research.",
        interests: ["Renewables", "Smart Grids"],
        tenure_start: "2023",
        tenure_end: "2025",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        contributions: null,
      },
    ];

    const mockSociety: Society = {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      slug: "pes",
      name: "Power & Energy Society",
      short_name: "PES",
      description: "PES Chapter",
      logo_url: null,
      established_year: "2015",
      website_url: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    const rolesByMember = new Map<string, MemberRole[]>([
      [
        "11111111-1111-1111-1111-111111111111",
        [
          {
            id: "r1",
            member_id: "11111111-1111-1111-1111-111111111111",
            society_id: null,
            role_title: "Chair",
            tier: "branch",
            start_year: "2023",
            end_year: "2024",
            is_current: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ],
      ],
      [
        "22222222-2222-2222-2222-222222222222",
        [
          {
            id: "r2",
            member_id: "22222222-2222-2222-2222-222222222222",
            society_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            role_title: "Chapter Lead",
            tier: "society",
            start_year: "2023",
            end_year: "2025",
            is_current: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ],
      ],
    ]);

    const societyMap = new Map<string, Society>([
      ["aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", mockSociety],
    ]);

    it("filters by search query matching name or interests", () => {
      const res = filterDirectoryMembers(mockMembers, rolesByMember, societyMap, {
        searchQuery: "Smart Grids",
      });
      assert.equal(res.length, 1);
      assert.equal(res[0].full_name, "Bhavana Rao");
    });

    it("filters by tier = 'branch'", () => {
      const res = filterDirectoryMembers(mockMembers, rolesByMember, societyMap, {
        tier: "branch",
      });
      assert.equal(res.length, 1);
      assert.equal(res[0].full_name, "Aarav Sharma");
    });

    it("filters by tier = 'society'", () => {
      const res = filterDirectoryMembers(mockMembers, rolesByMember, societyMap, {
        tier: "society",
      });
      assert.equal(res.length, 1);
      assert.equal(res[0].full_name, "Bhavana Rao");
    });

    it("filters by society slug", () => {
      const res = filterDirectoryMembers(mockMembers, rolesByMember, societyMap, {
        society: "pes",
      });
      assert.equal(res.length, 1);
      assert.equal(res[0].full_name, "Bhavana Rao");
    });

    it("filters by department and batch year", () => {
      const res = filterDirectoryMembers(mockMembers, rolesByMember, societyMap, {
        department: "Computer Science",
        batch: "2024",
      });
      assert.equal(res.length, 1);
      assert.equal(res[0].full_name, "Aarav Sharma");
    });
  });

  describe("filterPublicMilestones()", () => {
    const mockSociety: Society = {
      id: "soc-1",
      slug: "cs",
      name: "Computer Society",
      short_name: "CS",
      description: null,
      logo_url: null,
      established_year: "2010",
      website_url: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    const mockMilestones: PublicMilestone[] = [
      {
        id: "m-1",
        title: "National Symposium 2023",
        description: "National flagship technical symposium.",
        date: "2023-10-15",
        milestone_year: 2023,
        category: "Symposium",
        society_id: null,
        image_url: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "m-2",
        title: "CS Hackathon 2024",
        description: "24-hour hackathon by CS chapter.",
        date: "2024-03-20",
        milestone_year: 2024,
        category: "Hackathon",
        society_id: "soc-1",
        image_url: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ];

    const societyMap = new Map<string, Society>([["soc-1", mockSociety]]);

    it("filters milestones by year", () => {
      const res = filterPublicMilestones(mockMilestones, {
        year: 2023,
        societyMap,
      });
      assert.equal(res.length, 1);
      assert.equal(res[0].title, "National Symposium 2023");
    });

    it("filters milestones by society slug", () => {
      const res = filterPublicMilestones(mockMilestones, {
        society: "cs",
        societyMap,
      });
      assert.equal(res.length, 1);
      assert.equal(res[0].title, "CS Hackathon 2024");
    });

    it("filters milestones by both society slug and year", () => {
      const match = filterPublicMilestones(mockMilestones, {
        society: "cs",
        year: 2024,
        societyMap,
      });
      assert.equal(match.length, 1);

      const noMatch = filterPublicMilestones(mockMilestones, {
        society: "cs",
        year: 2023,
        societyMap,
      });
      assert.equal(noMatch.length, 0);
    });
  });

  describe("extractSocietyCodes()", () => {
    it("extracts 'NISB' for branch roles and society short_name for society roles", () => {
      const mockSociety: Society = {
        id: "soc-pes",
        slug: "pes",
        name: "Power & Energy Society",
        short_name: "PES",
        description: null,
        logo_url: null,
        established_year: "2015",
        website_url: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };
      const societyMap = new Map<string, Society>([["soc-pes", mockSociety]]);

      const roles: MemberRole[] = [
        {
          id: "r1",
          member_id: "m1",
          society_id: null,
          role_title: "Vice Chair",
          tier: "branch",
          start_year: "2023",
          end_year: "2024",
          is_current: true,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: "r2",
          member_id: "m1",
          society_id: "soc-pes",
          role_title: "Secretary",
          tier: "society",
          start_year: "2022",
          end_year: "2023",
          is_current: false,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];

      const codes = extractSocietyCodes(roles, societyMap);
      assert.deepEqual(codes, ["NISB", "PES"]);
    });
  });
});
