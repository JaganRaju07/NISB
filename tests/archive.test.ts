import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  isSupabaseConfigured,
  emptyToNull,
  parseInterests,
  hashString,
} from "../src/lib/utils.ts";

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
