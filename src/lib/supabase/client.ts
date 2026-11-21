import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

/**
 * Browser-side Supabase client factory using @supabase/ssr.
 * Fails with a clear configuration error if required environment variables are missing.
 * Uses public anon key — RLS enforces access control.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing required Supabase environment configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined."
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Lazy singleton browser client instance
let cachedClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const supabase = new Proxy(
  {} as ReturnType<typeof createBrowserClient<Database>>,
  {
    get(_target, prop, receiver) {
      if (!cachedClient) {
        cachedClient = createClient();
      }
      return Reflect.get(cachedClient, prop, receiver);
    },
  }
);
