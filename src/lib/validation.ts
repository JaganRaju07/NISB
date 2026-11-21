import { z } from "zod";

/** Reusable schema for photo/media URLs or root-relative static asset paths */
export const photoUrlSchema = z
  .string()
  .refine(
    (val) => {
      if (!val) return true;
      if (val.startsWith("//") || val.startsWith("/\\")) return false;
      if (val.startsWith("/")) return true;
      try {
        const u = new URL(val);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL or path (e.g. https://... or /assets/...)" }
  );

/** Reusable schema for member contributions (optional, trim, max 2000 chars, empty string becomes null) */
export const contributionsSchema = z
  .string()
  .trim()
  .max(2000, "Contributions must not exceed 2000 characters")
  .transform((val) => (val === "" ? null : val))
  .nullable()
  .optional();

/** Schema for a public member (from public_members view) */
export const publicMemberSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1, "Name is required"),
  role: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  batch_year: z.string().nullable().optional(),
  photo_url: photoUrlSchema.nullable().optional(),
  bio: z.string().nullable().optional(),
  interests: z.array(z.string()).nullable().optional(),
  tenure_start: z.string().nullable().optional(),
  tenure_end: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  contributions: contributionsSchema,
});

export type PublicMember = z.infer<typeof publicMemberSchema>;

/** Schema for creating/updating a member (admin form) */
export const baseMemberFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  role: z.string().optional().default(""),
  department: z.string().optional().default(""),
  batch_year: z.string().optional().default(""),
  photo_url: photoUrlSchema.optional().or(z.literal("")),
  bio: z.string().optional().default(""),
  interests: z.string().optional().default(""), // comma-separated strings
  tenure_start: z.string().optional().default(""),
  tenure_end: z.string().optional().default(""),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  verification_status: z
    .enum(["pending", "source_listed", "confirmed"])
    .default("pending"),
  source_note: z.string().optional().default(""), // internal-only
  contributions: contributionsSchema,
});

export const memberFormSchema = baseMemberFormSchema.refine(
  (data) => {
    if (data.status === "published") {
      return data.verification_status === "confirmed";
    }
    return true;
  },
  {
    message: "A member record may only be published when verification_status is confirmed",
    path: ["verification_status"],
  }
);

export type MemberFormData = z.infer<typeof baseMemberFormSchema>;

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
export const baseMemberRoleSchema = z.object({
  id: z.string().uuid(),
  member_id: z.string().uuid(),
  society_id: z.string().uuid().nullable().optional(),
  role_title: z.string().min(1, "Role title is required"),
  tier: z.enum(["branch", "society"]).default("branch"),
  start_year: z.string().nullable().optional(),
  end_year: z.string().nullable().optional(),
  is_current: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

export const memberRoleSchema = baseMemberRoleSchema.refine(
  (data) => {
    if (data.tier === "branch") {
      return !data.society_id;
    }
    if (data.tier === "society") {
      return Boolean(data.society_id);
    }
    return true;
  },
  {
    message: "Branch tier cannot have a society_id; Society tier must have a valid society_id",
    path: ["society_id"],
  }
);

export type MemberRole = z.infer<typeof baseMemberRoleSchema>;

/** Schema for creating/updating a member role */
export const baseMemberRoleFormSchema = z.object({
  member_id: z.string().uuid("Invalid member ID"),
  society_id: z.string().uuid().optional().or(z.literal("")),
  role_title: z.string().min(1, "Role title is required"),
  tier: z.enum(["branch", "society"]).default("branch"),
  start_year: z.string().optional().default(""),
  end_year: z.string().optional().default(""),
  is_current: z.boolean().default(false),
});

export const memberRoleFormSchema = baseMemberRoleFormSchema.refine(
  (data) => {
    if (data.tier === "branch") {
      return !data.society_id || data.society_id === "";
    }
    if (data.tier === "society") {
      return Boolean(data.society_id && data.society_id !== "");
    }
    return true;
  },
  {
    message: "Branch tier cannot have a society_id; Society tier must specify a society",
    path: ["society_id"],
  }
);

export type MemberRoleFormData = z.infer<typeof baseMemberRoleFormSchema>;

/** Schema for a public milestone (from public_milestones view) */
export const publicMilestoneSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  milestone_year: z.number().int().min(1900).max(2100).nullable().optional(),
  category: z.string().nullable().optional(),
  society_id: z.string().uuid().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type PublicMilestone = z.infer<typeof publicMilestoneSchema>;

/** Schema for a milestone base table (admin scope) */
export const baseMilestoneSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  milestone_year: z.number().int().min(1900).max(2100).nullable().optional(),
  category: z.string().nullable().optional(),
  society_id: z.string().uuid().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  verification_status: z
    .enum(["pending", "source_listed", "confirmed"])
    .default("pending"),
  source_note: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const milestoneSchema = baseMilestoneSchema.refine(
  (data) => {
    if (data.status === "published") {
      return data.verification_status === "confirmed";
    }
    return true;
  },
  {
    message: "A milestone record may only be published when verification_status is confirmed",
    path: ["verification_status"],
  }
);

export type MilestoneRecord = z.infer<typeof baseMilestoneSchema>;

/** Schema for creating/updating a milestone */
export const baseMilestoneFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  date: z.string().optional().default(""),
  milestone_year: z.number().int().min(1900).max(2100).optional().nullable(),
  category: z.string().optional().default(""),
  society_id: z.string().uuid().optional().or(z.literal("")),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  verification_status: z
    .enum(["pending", "source_listed", "confirmed"])
    .default("pending"),
  source_note: z.string().optional().default(""),
});

export const milestoneFormSchema = baseMilestoneFormSchema.refine(
  (data) => {
    if (data.status === "published") {
      return data.verification_status === "confirmed";
    }
    return true;
  },
  {
    message: "A milestone record may only be published when verification_status is confirmed",
    path: ["verification_status"],
  }
);

export type MilestoneFormData = z.infer<typeof baseMilestoneFormSchema>;

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
