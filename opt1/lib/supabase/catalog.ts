import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Anon read-only Supabase client for the public catalog. No user cookies/session
// needed, catalog tables are world-readable via RLS, and this works at build
// time (SSG) as well as at runtime. Returns null when env is not configured so
// callers can fall back to the generated catalog files.
export function createCatalogClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
