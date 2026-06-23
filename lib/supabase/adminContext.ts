import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface AdminContext {
  supabase: SupabaseClient;
  user: User | null;
  isAdmin: boolean;
}

// Resolves the current session and whether it belongs to an admin. Returns the
// session-bound client so callers reuse one connection. RLS is the real
// enforcement boundary; callers use `isAdmin` to choose the right UI/HTTP
// response (redirect, 403, notice) before issuing privileged queries.
export async function getAdminContext(): Promise<AdminContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, isAdmin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { supabase, user, isAdmin: profile?.role === "admin" };
}
