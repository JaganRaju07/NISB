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
 * Fetches published member roles from member_roles table.
 * RLS ensures only roles for published members are returned to anon/authenticated users.
 */
export async function getPublicMemberRoles(memberId?: string): Promise<{
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

    if (memberId) {
      query = query.eq("member_id", memberId);
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
 * RLS ensures connections are only returned when both the milestone and member are published.
 */
export async function getPublicMilestoneMembers(milestoneId?: string): Promise<{
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

    if (milestoneId) {
      query = query.eq("milestone_id", milestoneId);
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
