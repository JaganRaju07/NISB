export { cn } from "cn";

/** Convert empty strings to null for database storage */
export function emptyToNull(value: string | undefined): string | null {
  if (!value || value.trim() === "") return null;
  return value.trim();
}

/** Parse comma-separated string to array, filtering empty values */
export function parseInterests(value: string | undefined): string[] | null {
  if (!value || value.trim() === "") return null;
  const items = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length > 0 ? items : null;
}

/** Generate a consistent CSS class name from a string */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Checks whether Supabase environment variables are actively configured.
 * Returns false when values are missing, empty, or unconfigured placeholders.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  const trimmedUrl = url.trim();
  const trimmedKey = anonKey.trim();

  if (trimmedUrl === "" || trimmedKey === "") return false;
  if (trimmedUrl.includes("your-project.supabase.co")) return false;
  if (trimmedKey === "your-anon-key") return false;

  return true;
}

export type AdminAccessDecision = "redirect" | "standby" | "allow";

export interface AdminAccessOptions {
  isConfigured: boolean;
  isAdmin: boolean;
  nodeEnv?: string;
}

/**
 * Pure decision function determining access for administrative routes (/admin, /admin/members, /admin/milestones).
 *
 * Rules:
 * - In production (process.env.NODE_ENV === "production"):
 *     Fail-closed: if Supabase is unconfigured OR user is not an admin => "redirect" (to /admin/login).
 *     Only configured admins are allowed => "allow".
 * - In development / non-production:
 *     Standby UI is allowed only when unconfigured => "standby".
 *     If configured but non-admin => "redirect".
 *     Configured admin => "allow".
 */
export function getAdminAccessDecision(
  isConfiguredOrOptions: boolean | AdminAccessOptions,
  isAdminArg?: boolean,
  nodeEnvArg?: string
): AdminAccessDecision {
  let isConfigured: boolean;
  let isAdmin: boolean;
  let nodeEnv: string;

  if (typeof isConfiguredOrOptions === "object" && isConfiguredOrOptions !== null) {
    isConfigured = isConfiguredOrOptions.isConfigured;
    isAdmin = isConfiguredOrOptions.isAdmin;
    nodeEnv = isConfiguredOrOptions.nodeEnv ?? process.env.NODE_ENV ?? "development";
  } else {
    isConfigured = Boolean(isConfiguredOrOptions);
    isAdmin = Boolean(isAdminArg);
    nodeEnv = nodeEnvArg ?? process.env.NODE_ENV ?? "development";
  }

  if (nodeEnv === "production") {
    if (!isConfigured || !isAdmin) {
      return "redirect";
    }
    return "allow";
  }

  // Non-production (development, test)
  if (!isConfigured) {
    return "standby";
  }

  if (!isAdmin) {
    return "redirect";
  }

  return "allow";
}
