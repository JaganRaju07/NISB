"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { emptyToNull, parseInterests } from "@/lib/utils";
import {
  memberFormSchema,
  milestoneFormSchema,
  memberRoleFormSchema,
  milestoneMemberFormSchema,
} from "@/lib/validation";

export type ActionResponse = {
  success: boolean;
  error?: string | null;
  data?: unknown;
};

function formatError(err: unknown, fallback: string): string {
  if (err instanceof z.ZodError) {
    return err.issues.map((i) => i.message).join("; ");
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}

function parseUuid(id: string, entityName: string): string {
  return z.string().uuid(`Invalid ${entityName} ID format`).parse(id);
}

/**
 * Curator login action.
 * Authenticates against Supabase Auth and strictly verifies membership in public.admins.
 */
export async function loginAdminAction(formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  const emailCheck = z.string().email("Please enter a valid curator email address").safeParse(email);
  if (!emailCheck.success) {
    return { success: false, error: emailCheck.error.issues[0]?.message };
  }

  try {
    const supabase = await createServerClient();
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || "Invalid curator credentials",
      };
    }

    // Verify authorized admin membership
    const { data: adminRecord, error: dbError } = await supabase
      .from("admins")
      .select("id, role")
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (dbError || !adminRecord) {
      // User is authenticated in Auth, but not in public.admins
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Access Forbidden: Account is not recognized as an authorized administrator.",
      };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    return { success: false, error: formatError(err, "Authentication error") };
  }
}

/**
 * Curator logout action.
 */
export async function logoutAdminAction(): Promise<void> {
  try {
    const supabase = await createServerClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore error on sign out
  }
  revalidatePath("/admin");
  redirect("/admin/login");
}

/**
 * Create a new member record with full audit fields and publication integrity check.
 */
export async function createMemberAction(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const { user } = await requireAdmin();
    const supabase = await createServerClient();

    const raw = {
      full_name: formData.get("full_name")?.toString() ?? "",
      role: formData.get("role")?.toString() ?? "",
      department: formData.get("department")?.toString() ?? "",
      batch_year: formData.get("batch_year")?.toString() ?? "",
      photo_url: formData.get("photo_url")?.toString() ?? "",
      bio: formData.get("bio")?.toString() ?? "",
      interests: formData.get("interests")?.toString() ?? "",
      tenure_start: formData.get("tenure_start")?.toString() ?? "",
      tenure_end: formData.get("tenure_end")?.toString() ?? "",
      status: formData.get("status")?.toString() ?? "draft",
      verification_status:
        formData.get("verification_status")?.toString() ?? "pending",
      source_note: formData.get("source_note")?.toString() ?? "",
      contributions: formData.get("contributions")?.toString() ?? "",
    };

    const validated = memberFormSchema.parse(raw);

    const { data, error } = await supabase
      .from("members")
      .insert({
        full_name: validated.full_name.trim(),
        role: emptyToNull(validated.role),
        department: emptyToNull(validated.department),
        batch_year: emptyToNull(validated.batch_year),
        photo_url: emptyToNull(validated.photo_url),
        bio: emptyToNull(validated.bio),
        interests: parseInterests(validated.interests),
        tenure_start: emptyToNull(validated.tenure_start),
        tenure_end: emptyToNull(validated.tenure_end),
        status: validated.status,
        verification_status: validated.verification_status,
        source_note: emptyToNull(validated.source_note),
        contributions: validated.contributions ?? null,
        updated_by: user.id,
      })
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/members");
    revalidatePath("/directory");
    return { success: true, data };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to create member") };
  }
}

/**
 * Update an existing member record.
 */
export async function updateMemberAction(
  memberId: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const { user } = await requireAdmin();
    const validId = parseUuid(memberId, "member");
    const supabase = await createServerClient();

    const raw = {
      full_name: formData.get("full_name")?.toString() ?? "",
      role: formData.get("role")?.toString() ?? "",
      department: formData.get("department")?.toString() ?? "",
      batch_year: formData.get("batch_year")?.toString() ?? "",
      photo_url: formData.get("photo_url")?.toString() ?? "",
      bio: formData.get("bio")?.toString() ?? "",
      interests: formData.get("interests")?.toString() ?? "",
      tenure_start: formData.get("tenure_start")?.toString() ?? "",
      tenure_end: formData.get("tenure_end")?.toString() ?? "",
      status: formData.get("status")?.toString() ?? "draft",
      verification_status:
        formData.get("verification_status")?.toString() ?? "pending",
      source_note: formData.get("source_note")?.toString() ?? "",
      contributions: formData.get("contributions")?.toString() ?? "",
    };

    const validated = memberFormSchema.parse(raw);

    const { error } = await supabase
      .from("members")
      .update({
        full_name: validated.full_name.trim(),
        role: emptyToNull(validated.role),
        department: emptyToNull(validated.department),
        batch_year: emptyToNull(validated.batch_year),
        photo_url: emptyToNull(validated.photo_url),
        bio: emptyToNull(validated.bio),
        interests: parseInterests(validated.interests),
        tenure_start: emptyToNull(validated.tenure_start),
        tenure_end: emptyToNull(validated.tenure_end),
        status: validated.status,
        verification_status: validated.verification_status,
        source_note: emptyToNull(validated.source_note),
        contributions: validated.contributions ?? null,
        updated_by: user.id,
      })
      .eq("id", validId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/members");
    revalidatePath("/directory");
    return { success: true };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to update member") };
  }
}

/**
 * Delete a member record.
 */
export async function deleteMemberAction(memberId: string): Promise<ActionResponse> {
  try {
    await requireAdmin();
    const validId = parseUuid(memberId, "member");
    const supabase = await createServerClient();

    const { error } = await supabase.from("members").delete().eq("id", validId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/members");
    revalidatePath("/directory");
    return { success: true };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to delete member") };
  }
}

/**
 * Add a tenure role to a member with strict tier consistency.
 */
export async function addMemberRoleAction(
  formData: FormData
): Promise<ActionResponse> {
  try {
    await requireAdmin();
    const supabase = await createServerClient();

    const raw = {
      member_id: formData.get("member_id")?.toString() ?? "",
      society_id: formData.get("society_id")?.toString() ?? "",
      role_title: formData.get("role_title")?.toString() ?? "",
      tier: (formData.get("tier")?.toString() ?? "branch") as "branch" | "society",
      start_year: formData.get("start_year")?.toString() ?? "",
      end_year: formData.get("end_year")?.toString() ?? "",
      is_current: formData.get("is_current") === "true",
    };

    const validated = memberRoleFormSchema.parse(raw);

    const { error } = await supabase.from("member_roles").insert({
      member_id: validated.member_id,
      society_id: emptyToNull(validated.society_id),
      role_title: validated.role_title.trim(),
      tier: validated.tier,
      start_year: emptyToNull(validated.start_year),
      end_year: emptyToNull(validated.end_year),
      is_current: validated.is_current,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/members");
    revalidatePath("/directory");
    return { success: true };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to add member role") };
  }
}

/**
 * Delete a member role.
 */
export async function deleteMemberRoleAction(roleId: string): Promise<ActionResponse> {
  try {
    await requireAdmin();
    const validId = parseUuid(roleId, "role");
    const supabase = await createServerClient();

    const { error } = await supabase
      .from("member_roles")
      .delete()
      .eq("id", validId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/members");
    revalidatePath("/directory");
    return { success: true };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to delete member role") };
  }
}

/**
 * Create a new milestone with publication integrity and year validation.
 */
export async function createMilestoneAction(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const { user } = await requireAdmin();
    const supabase = await createServerClient();

    const milestoneYearRaw = formData.get("milestone_year")?.toString();
    const milestoneYear =
      milestoneYearRaw && milestoneYearRaw.trim() !== ""
        ? parseInt(milestoneYearRaw, 10)
        : null;

    const raw = {
      title: formData.get("title")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      date: formData.get("date")?.toString() ?? "",
      milestone_year: milestoneYear,
      category: formData.get("category")?.toString() ?? "",
      society_id: formData.get("society_id")?.toString() ?? "",
      image_url: formData.get("image_url")?.toString() ?? "",
      status: formData.get("status")?.toString() ?? "draft",
      verification_status:
        formData.get("verification_status")?.toString() ?? "pending",
      source_note: formData.get("source_note")?.toString() ?? "",
    };

    const validated = milestoneFormSchema.parse(raw);

    const { data, error } = await supabase
      .from("milestones")
      .insert({
        title: validated.title.trim(),
        description: emptyToNull(validated.description),
        date: emptyToNull(validated.date),
        milestone_year: validated.milestone_year,
        category: emptyToNull(validated.category),
        society_id: emptyToNull(validated.society_id),
        image_url: emptyToNull(validated.image_url),
        status: validated.status,
        verification_status: validated.verification_status,
        source_note: emptyToNull(validated.source_note),
        updated_by: user.id,
      })
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/milestones");
    revalidatePath("/milestones");
    return { success: true, data };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to create milestone") };
  }
}

/**
 * Update an existing milestone.
 */
export async function updateMilestoneAction(
  milestoneId: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const { user } = await requireAdmin();
    const validId = parseUuid(milestoneId, "milestone");
    const supabase = await createServerClient();

    const milestoneYearRaw = formData.get("milestone_year")?.toString();
    const milestoneYear =
      milestoneYearRaw && milestoneYearRaw.trim() !== ""
        ? parseInt(milestoneYearRaw, 10)
        : null;

    const raw = {
      title: formData.get("title")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      date: formData.get("date")?.toString() ?? "",
      milestone_year: milestoneYear,
      category: formData.get("category")?.toString() ?? "",
      society_id: formData.get("society_id")?.toString() ?? "",
      image_url: formData.get("image_url")?.toString() ?? "",
      status: formData.get("status")?.toString() ?? "draft",
      verification_status:
        formData.get("verification_status")?.toString() ?? "pending",
      source_note: formData.get("source_note")?.toString() ?? "",
    };

    const validated = milestoneFormSchema.parse(raw);

    const { error } = await supabase
      .from("milestones")
      .update({
        title: validated.title.trim(),
        description: emptyToNull(validated.description),
        date: emptyToNull(validated.date),
        milestone_year: validated.milestone_year,
        category: emptyToNull(validated.category),
        society_id: emptyToNull(validated.society_id),
        image_url: emptyToNull(validated.image_url),
        status: validated.status,
        verification_status: validated.verification_status,
        source_note: emptyToNull(validated.source_note),
        updated_by: user.id,
      })
      .eq("id", validId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/milestones");
    revalidatePath("/milestones");
    return { success: true };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to update milestone") };
  }
}

/**
 * Delete a milestone record.
 */
export async function deleteMilestoneAction(
  milestoneId: string
): Promise<ActionResponse> {
  try {
    await requireAdmin();
    const validId = parseUuid(milestoneId, "milestone");
    const supabase = await createServerClient();

    const { error } = await supabase
      .from("milestones")
      .delete()
      .eq("id", validId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/milestones");
    revalidatePath("/milestones");
    return { success: true };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to delete milestone") };
  }
}

/**
 * Add a participant/member to a milestone with custom contribution role.
 */
export async function addMilestoneMemberAction(
  formData: FormData
): Promise<ActionResponse> {
  try {
    await requireAdmin();
    const supabase = await createServerClient();

    const raw = {
      milestone_id: formData.get("milestone_id")?.toString() ?? "",
      member_id: formData.get("member_id")?.toString() ?? "",
      role_in_milestone: formData.get("role_in_milestone")?.toString() ?? "",
    };

    const validated = milestoneMemberFormSchema.parse(raw);

    const { data, error } = await supabase
      .from("milestone_members")
      .insert({
        milestone_id: validated.milestone_id,
        member_id: validated.member_id,
        role_in_milestone: emptyToNull(validated.role_in_milestone),
      })
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/milestones");
    revalidatePath("/milestones");
    revalidatePath("/directory");
    return { success: true, data };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to add milestone participant") };
  }
}

/**
 * Delete a milestone member participant link.
 */
export async function deleteMilestoneMemberAction(
  junctionId: string
): Promise<ActionResponse> {
  try {
    await requireAdmin();
    const validId = parseUuid(junctionId, "milestone member junction");
    const supabase = await createServerClient();

    const { error } = await supabase
      .from("milestone_members")
      .delete()
      .eq("id", validId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/milestones");
    revalidatePath("/milestones");
    revalidatePath("/directory");
    return { success: true };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to remove milestone participant") };
  }
}

/**
 * Quick status and verification transition for a member record.
 * Strictly enforces publication integrity: cannot publish unless confirmed.
 */
export async function quickUpdateMemberStatusAction(
  memberId: string,
  status: "draft" | "published" | "archived",
  verificationStatus: "pending" | "source_listed" | "confirmed"
): Promise<ActionResponse> {
  try {
    const { user } = await requireAdmin();
    const validId = parseUuid(memberId, "member");

    if (status === "published" && verificationStatus !== "confirmed") {
      return {
        success: false,
        error: "Publication Constraint Violation: Records can only be published when verification status is 'confirmed'.",
      };
    }

    const supabase = await createServerClient();
    const { error } = await supabase
      .from("members")
      .update({
        status,
        verification_status: verificationStatus,
        updated_by: user.id,
      })
      .eq("id", validId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/members");
    revalidatePath("/directory");
    return { success: true };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to update member status") };
  }
}

/**
 * Quick status and verification transition for a milestone record.
 * Strictly enforces publication integrity: cannot publish unless confirmed.
 */
export async function quickUpdateMilestoneStatusAction(
  milestoneId: string,
  status: "draft" | "published" | "archived",
  verificationStatus: "pending" | "source_listed" | "confirmed"
): Promise<ActionResponse> {
  try {
    const { user } = await requireAdmin();
    const validId = parseUuid(milestoneId, "milestone");

    if (status === "published" && verificationStatus !== "confirmed") {
      return {
        success: false,
        error: "Publication Constraint Violation: Milestones can only be published when verification status is 'confirmed'.",
      };
    }

    const supabase = await createServerClient();
    const { error } = await supabase
      .from("milestones")
      .update({
        status,
        verification_status: verificationStatus,
        updated_by: user.id,
      })
      .eq("id", validId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/milestones");
    revalidatePath("/milestones");
    return { success: true };
  } catch (err) {
    return { success: false, error: formatError(err, "Failed to update milestone status") };
  }
}
