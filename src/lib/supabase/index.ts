/**
 * Supabase client exports.
 *
 * Architecture convention:
 * - Client Components: import { createClient, supabase } from "@/lib/supabase/client"
 * - Server Components: import { createServerClient } from "@/lib/supabase/server"
 * - Admin Operations:  import { createAdminClient, isAdmin, requireAdmin } from "@/lib/supabase/admin-guard"
 */
export { createClient, supabase } from "./client";
