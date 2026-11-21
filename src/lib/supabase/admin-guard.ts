import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "./server";
import type { Database } from "@/lib/database.types";
import {
  getAdminAccessDecision,
  type AdminAccessDecision,
  type AdminAccessOptions,
} from "@/lib/utils";

export { getAdminAccessDecision, type AdminAccessDecision, type AdminAccessOptions };

/**
 * Server-only admin client factory using SUPABASE_SERVICE_ROLE_KEY.
 * Bypasses RLS for trusted administrative operations.
 * Guarded by 'server-only' package and runtime environment check.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createAdminClient must only be executed in a server environment"
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing required Supabase administrative configuration: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined."
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Checks if current authenticated session belongs to an authorized admin.
 * Verifies identity via Supabase Auth server (getUser) and queries public.admins.
 * Returns boolean status without throwing or redirecting.
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return false;
    }

    const { data, error: dbError } = await supabase
      .from("admins")
      .select("id, role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (dbError || !data) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if current authenticated session belongs to a superadmin.
 * Returns boolean status without throwing.
 */
export async function isSuperAdmin(): Promise<boolean> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return false;
    }

    const { data, error: dbError } = await supabase
      .from("admins")
      .select("id, role")
      .eq("user_id", user.id)
      .eq("role", "superadmin")
      .maybeSingle();

    if (dbError || !data) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Enforces admin authorization in Server Actions or Route Handlers.
 * Verifies user token with auth.getUser() and independently verifies admin membership.
 * Throws an Error if unauthorized or forbidden.
 */
export async function requireAdmin() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Authentication required");
  }

  const { data: adminRecord, error: dbError } = await supabase
    .from("admins")
    .select("id, user_id, email, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (dbError || !adminRecord) {
    throw new Error("Forbidden: Admin privileges required");
  }

  return { user, admin: adminRecord };
}

/**
 * Enforces superadmin authorization in Server Actions or Route Handlers.
 * Verifies user token with auth.getUser() and independently verifies superadmin membership.
 * Throws an Error if unauthorized or forbidden.
 */
export async function requireSuperAdmin() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Authentication required");
  }

  const { data: adminRecord, error: dbError } = await supabase
    .from("admins")
    .select("id, user_id, email, role")
    .eq("user_id", user.id)
    .eq("role", "superadmin")
    .maybeSingle();

  if (dbError || !adminRecord) {
    throw new Error("Forbidden: Superadmin privileges required");
  }

  return { user, admin: adminRecord };
}
