import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import type {
  PublicMember,
  PublicMilestone,
  Society,
  MemberRole,
  MilestoneMember,
} from "@/lib/validation";

export { isSupabaseConfigured };

export type MemberRoleQueryOptions = {
  memberId?: string;
  societyId?: string;
  tier?: "branch" | "society";
};

export type MilestoneMemberQueryOptions = {
  milestoneId?: string;
  memberId?: string;
};

/**
 * Fetches published members strictly from the secure public_members view.
 * Excludes source_note and private draft records.
 */
export async function getPublicMembers(): Promise<{
  data: PublicMember[];
  isConfigured: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], isConfigured: false, error: null };
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("public_members")
      .select("*")
      .order("full_name", { ascending: true });

    if (error) {
      return { data: [], isConfigured: true, error: error.message };
    }

    return { data: (data as PublicMember[]) ?? [], isConfigured: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load directory";
    return { data: [], isConfigured: true, error: message };
  }
}

/**
 * Fetches a single published member by their UUID from public_members view.
 * Returns null if not found or unpublished.
 */
export async function getPublicMemberById(id: string): Promise<{
  data: PublicMember | null;
  isConfigured: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, isConfigured: false, error: null };
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("public_members")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { data: null, isConfigured: true, error: error.message };
    }

    return { data: (data as PublicMember) ?? null, isConfigured: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load member";
    return { data: null, isConfigured: true, error: message };
  }
}

/**
 * Fetches published milestones strictly from the secure public_milestones view.
 * Excludes source_note and unannounced draft records.
 */
export async function getPublicMilestones(): Promise<{
  data: PublicMilestone[];
  isConfigured: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], isConfigured: false, error: null };
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("public_milestones")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      return { data: [], isConfigured: true, error: error.message };
    }

    return { data: (data as PublicMilestone[]) ?? [], isConfigured: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load milestones";
    return { data: [], isConfigured: true, error: message };
  }
}

/**
 * Fetches a single published milestone by its UUID from public_milestones view.
 * Returns null if not found or unpublished.
 */
export async function getPublicMilestoneById(id: string): Promise<{
  data: PublicMilestone | null;
  isConfigured: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, isConfigured: false, error: null };
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("public_milestones")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { data: null, isConfigured: true, error: error.message };
    }

    return { data: (data as PublicMilestone) ?? null, isConfigured: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load milestone";
    return { data: null, isConfigured: true, error: message };
  }
}

/**
 * Fetches public societies and chapters from the societies table.
 */
export async function getPublicSocieties(): Promise<{
  data: Society[];
  isConfigured: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], isConfigured: false, error: null };
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("societies")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return { data: [], isConfigured: true, error: error.message };
    }

    return { data: (data as Society[]) ?? [], isConfigured: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load societies";
    return { data: [], isConfigured: true, error: message };
  }
}

/**
 * Fetches a single public society by its URL slug.
 * Returns null if not found.
 */
export async function getPublicSocietyBySlug(slug: string): Promise<{
  data: Society | null;
  isConfigured: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, isConfigured: false, error: null };
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("societies")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return { data: null, isConfigured: true, error: error.message };
    }

    return { data: (data as Society) ?? null, isConfigured: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load society";
    return { data: null, isConfigured: true, error: message };
  }
}

/**
 * Fetches published member roles from member_roles table.
 * Supports filtering by memberId, societyId, or tier.
 * RLS ensures only roles for published members are returned to anon/authenticated users.
 */
export async function getPublicMemberRoles(
  filter?: string | MemberRoleQueryOptions
): Promise<{
  data: MemberRole[];
  isConfigured: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], isConfigured: false, error: null };
  }

  try {
    const supabase = await createServerClient();
    let query = supabase
      .from("member_roles")
      .select("*")
      .order("start_year", { ascending: false });

    if (typeof filter === "string") {
      query = query.eq("member_id", filter);
    } else if (filter) {
      if (filter.memberId) {
        query = query.eq("member_id", filter.memberId);
      }
      if (filter.societyId) {
        query = query.eq("society_id", filter.societyId);
      }
      if (filter.tier) {
        query = query.eq("tier", filter.tier);
      }
    }

    const { data, error } = await query;

    if (error) {
      return { data: [], isConfigured: true, error: error.message };
    }

    return { data: (data as MemberRole[]) ?? [], isConfigured: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load member roles";
    return { data: [], isConfigured: true, error: message };
  }
}

/**
 * Fetches published milestone member junction records.
 * Supports filtering by milestoneId or memberId.
 * RLS ensures connections are only returned when both the milestone and member are published.
 */
export async function getPublicMilestoneMembers(
  filter?: string | MilestoneMemberQueryOptions
): Promise<{
  data: MilestoneMember[];
  isConfigured: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], isConfigured: false, error: null };
  }

  try {
    const supabase = await createServerClient();
    let query = supabase.from("milestone_members").select("*");

    if (typeof filter === "string") {
      query = query.eq("milestone_id", filter);
    } else if (filter) {
      if (filter.milestoneId) {
        query = query.eq("milestone_id", filter.milestoneId);
      }
      if (filter.memberId) {
        query = query.eq("member_id", filter.memberId);
      }
    }

    const { data, error } = await query;

    if (error) {
      return { data: [], isConfigured: true, error: error.message };
    }

    return { data: (data as MilestoneMember[]) ?? [], isConfigured: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load milestone members";
    return { data: [], isConfigured: true, error: message };
  }
}
