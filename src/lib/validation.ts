import { z } from "zod";

/** Schema for a public member (from public_members view) */
export const publicMemberSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1, "Name is required"),
  role: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  batch_year: z.string().nullable().optional(),
  photo_url: z.string().url("Must be a valid URL").nullable().optional(),
  bio: z.string().nullable().optional(),
  interests: z.array(z.string()).nullable().optional(),
  tenure_start: z.string().nullable().optional(),
  tenure_end: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type PublicMember = z.infer<typeof publicMemberSchema>;

/** Schema for creating/updating a member (admin form) */
export const memberFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  role: z.string().optional().default(""),
  department: z.string().optional().default(""),
  batch_year: z.string().optional().default(""),
  photo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bio: z.string().optional().default(""),
  interests: z.string().optional().default(""), // comma-separated strings
  tenure_start: z.string().optional().default(""),
  tenure_end: z.string().optional().default(""),
  source_note: z.string().optional().default(""), // internal-only
});

export type MemberFormData = z.infer<typeof memberFormSchema>;

/** Schema for a society/chapter */
export const societySchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Society name is required"),
  short_name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  logo_url: z.string().url().nullable().optional(),
  established_year: z.string().nullable().optional(),
  website_url: z.string().url().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Society = z.infer<typeof societySchema>;

/** Schema for creating/updating a society */
export const societyFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  name: z.string().min(1, "Name is required"),
  short_name: z.string().optional().default(""),
  description: z.string().optional().default(""),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  established_year: z.string().optional().default(""),
  website_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type SocietyFormData = z.infer<typeof societyFormSchema>;

/** Schema for member role record */
export const memberRoleSchema = z.object({
  id: z.string().uuid(),
  member_id: z.string().uuid(),
  society_id: z.string().uuid().nullable().optional(),
  role_title: z.string().min(1, "Role title is required"),
  start_year: z.string().nullable().optional(),
  end_year: z.string().nullable().optional(),
  is_current: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

export type MemberRole = z.infer<typeof memberRoleSchema>;

/** Schema for creating/updating a member role */
export const memberRoleFormSchema = z.object({
  member_id: z.string().uuid("Invalid member ID"),
  society_id: z.string().uuid().optional().or(z.literal("")),
  role_title: z.string().min(1, "Role title is required"),
  start_year: z.string().optional().default(""),
  end_year: z.string().optional().default(""),
  is_current: z.boolean().default(false),
});

export type MemberRoleFormData = z.infer<typeof memberRoleFormSchema>;

/** Schema for a milestone */
export const milestoneSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  society_id: z.string().uuid().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type MilestoneRecord = z.infer<typeof milestoneSchema>;

/** Schema for creating/updating a milestone */
export const milestoneFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  date: z.string().optional().default(""),
  category: z.string().optional().default(""),
  society_id: z.string().uuid().optional().or(z.literal("")),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type MilestoneFormData = z.infer<typeof milestoneFormSchema>;

/** Schema for milestone-member relationship */
export const milestoneMemberSchema = z.object({
  id: z.string().uuid(),
  milestone_id: z.string().uuid(),
  member_id: z.string().uuid(),
  role_in_milestone: z.string().nullable().optional(),
  created_at: z.string(),
});

export type MilestoneMember = z.infer<typeof milestoneMemberSchema>;

/** Schema for adding a member to a milestone */
export const milestoneMemberFormSchema = z.object({
  milestone_id: z.string().uuid("Invalid milestone ID"),
  member_id: z.string().uuid("Invalid member ID"),
  role_in_milestone: z.string().optional().default(""),
});

export type MilestoneMemberFormData = z.infer<typeof milestoneMemberFormSchema>;

/** Schema for admin records */
export const adminSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  email: z.string().email(),
  role: z.string().default("admin"),
  created_at: z.string(),
  updated_at: z.string(),
});

export type AdminRecord = z.infer<typeof adminSchema>;
