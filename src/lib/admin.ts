import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import {
  isSupabaseConfigured,
  getAdminAccessDecision,
  type AdminAccessDecision,
  type AdminAccessOptions,
} from "@/lib/utils";
import type { Database } from "@/lib/database.types";

export { getAdminAccessDecision, type AdminAccessDecision, type AdminAccessOptions };

export type AdminMember = Database["public"]["Tables"]["members"]["Row"] & {
  member_roles?: (Database["public"]["Tables"]["member_roles"]["Row"] & {
    societies?: Database["public"]["Tables"]["societies"]["Row"] | null;
  })[];
};

export type AdminMilestone = Database["public"]["Tables"]["milestones"]["Row"] & {
  societies?: Database["public"]["Tables"]["societies"]["Row"] | null;
};

export type AdminMilestoneMember = Database["public"]["Tables"]["milestone_members"]["Row"];

export type AdminSociety = Database["public"]["Tables"]["societies"]["Row"];

export type AdminAuthStatus = {
  isConfigured: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  role: string | null;
};

/**
 * Checks current curator authentication status.
 * Resilient to standby mode (unconfigured Supabase).
 */
export async function getAdminAuthStatus(): Promise<AdminAuthStatus> {
  if (!isSupabaseConfigured()) {
    return {
      isConfigured: false,
      isAuthenticated: false,
      isAdmin: false,
      userEmail: null,
      role: null,
    };
  }

  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        isConfigured: true,
        isAuthenticated: false,
        isAdmin: false,
        userEmail: null,
        role: null,
      };
    }

    const { data: adminRecord, error: adminError } = await supabase
      .from("admins")
      .select("id, email, role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !adminRecord) {
      return {
        isConfigured: true,
        isAuthenticated: true,
        isAdmin: false,
        userEmail: user.email ?? null,
        role: null,
      };
    }

    return {
      isConfigured: true,
      isAuthenticated: true,
      isAdmin: true,
      userEmail: adminRecord.email,
      role: adminRecord.role,
    };
  } catch {
    return {
      isConfigured: false,
      isAuthenticated: false,
      isAdmin: false,
      userEmail: null,
      role: null,
    };
  }
}

/**
 * Fetches dashboard aggregates for curator overview.
 */
export async function getAdminDashboardStats() {
  if (!isSupabaseConfigured()) {
    return {
      isConfigured: false,
      totalMembers: 0,
      publishedMembers: 0,
      draftMembers: 0,
      archivedMembers: 0,
      confirmedMembers: 0,
      sourceListedMembers: 0,
      pendingMembers: 0,
      totalMilestones: 0,
      publishedMilestones: 0,
      draftMilestones: 0,
      totalSocieties: 0,
    };
  }

  try {
    const supabase = await createServerClient();

    const [membersRes, milestonesRes, societiesRes] = await Promise.all([
      supabase.from("members").select("status, verification_status"),
      supabase.from("milestones").select("status, verification_status"),
      supabase.from("societies").select("id", { count: "exact", head: true }),
    ]);

    const members = membersRes.data ?? [];
    const milestones = milestonesRes.data ?? [];

    return {
      isConfigured: true,
      totalMembers: members.length,
      publishedMembers: members.filter((m) => m.status === "published").length,
      draftMembers: members.filter((m) => m.status === "draft").length,
      archivedMembers: members.filter((m) => m.status === "archived").length,
      confirmedMembers: members.filter((m) => m.verification_status === "confirmed").length,
      sourceListedMembers: members.filter((m) => m.verification_status === "source_listed").length,
      pendingMembers: members.filter((m) => m.verification_status === "pending").length,
      totalMilestones: milestones.length,
      publishedMilestones: milestones.filter((m) => m.status === "published").length,
      draftMilestones: milestones.filter((m) => m.status === "draft").length,
      totalSocieties: societiesRes.count ?? 0,
    };
  } catch {
    return {
      isConfigured: false,
      totalMembers: 0,
      publishedMembers: 0,
      draftMembers: 0,
      archivedMembers: 0,
      confirmedMembers: 0,
      sourceListedMembers: 0,
      pendingMembers: 0,
      totalMilestones: 0,
      publishedMilestones: 0,
      draftMilestones: 0,
      totalSocieties: 0,
    };
  }
}

/**
 * Fetches member records with audit fields and associated roles for admin management.
 */
export async function getAdminMembers(options?: {
  status?: string;
  verification_status?: string;
  query?: string;
}): Promise<{
  data: AdminMember[];
  isConfigured: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], isConfigured: false, error: null };
  }

  try {
    const supabase = await createServerClient();
    let q = supabase
      .from("members")
      .select("*, member_roles(*, societies(*))")
      .order("updated_at", { ascending: false });

    if (options?.status && options.status !== "all") {
      q = q.eq("status", options.status as "draft" | "published" | "archived");
    }

    if (options?.verification_status && options.verification_status !== "all") {
      q = q.eq(
        "verification_status",
        options.verification_status as "pending" | "source_listed" | "confirmed"
      );
    }

    if (options?.query && options.query.trim() !== "") {
      q = q.ilike("full_name", `%${options.query.trim()}%`);
    }

    const { data, error } = await q;

    if (error) {
      return { data: [], isConfigured: true, error: error.message };
    }

    return {
      data: (data as unknown as AdminMember[]) ?? [],
      isConfigured: true,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load members";
    return { data: [], isConfigured: true, error: message };
  }
}

/**
 * Fetches milestone records with audit fields and associated society for admin management.
 */
export async function getAdminMilestones(options?: {
  status?: string;
  verification_status?: string;
  query?: string;
}): Promise<{
  data: AdminMilestone[];
  isConfigured: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], isConfigured: false, error: null };
  }

  try {
    const supabase = await createServerClient();
    let q = supabase
      .from("milestones")
      .select("*, societies(*)")
      .order("milestone_year", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (options?.status && options.status !== "all") {
      q = q.eq("status", options.status as "draft" | "published" | "archived");
    }

    if (options?.verification_status && options.verification_status !== "all") {
      q = q.eq(
        "verification_status",
        options.verification_status as "pending" | "source_listed" | "confirmed"
      );
    }

    if (options?.query && options.query.trim() !== "") {
      q = q.ilike("title", `%${options.query.trim()}%`);
    }

    const { data, error } = await q;

    if (error) {
      return { data: [], isConfigured: true, error: error.message };
    }

    return {
      data: (data as unknown as AdminMilestone[]) ?? [],
      isConfigured: true,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load milestones";
    return { data: [], isConfigured: true, error: message };
  }
}

/**
 * Fetches societies list for dropdowns in role and milestone assignments.
 */
export async function getAdminSocieties(): Promise<{
  data: AdminSociety[];
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

    return { data: data ?? [], isConfigured: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load societies";
    return { data: [], isConfigured: true, error: message };
  }
}

/**
 * Fetches milestone participant junctions for curator management.
 */
export async function getAdminMilestoneMembers(milestoneId?: string): Promise<{
  data: AdminMilestoneMember[];
  isConfigured: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], isConfigured: false, error: null };
  }

  try {
    const supabase = await createServerClient();
    let q = supabase.from("milestone_members").select("*");
    if (milestoneId) {
      q = q.eq("milestone_id", milestoneId);
    }
    const { data, error } = await q;

    if (error) {
      return { data: [], isConfigured: true, error: error.message };
    }

    return { data: (data as AdminMilestoneMember[]) ?? [], isConfigured: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load milestone participants";
    return { data: [], isConfigured: true, error: message };
  }
}
