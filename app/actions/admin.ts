"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const STATUSES = ["new", "contacted", "closed"] as const;
export type InquiryStatus = (typeof STATUSES)[number];

export type UpdateStatusResult =
  | { ok: true }
  | { ok: false; error: string };

// Updates an inquiry's status. RLS already restricts this to admins (the
// "inquiries update" policy uses is_admin()); we also re-verify the caller here
// as defense in depth — a Server Action is a public boundary.
export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<UpdateStatusResult> {
  if (!STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { ok: false, error: "Backend is not configured." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return { ok: false, error: "Not authorized." };
  }

  const { error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id);
  if (error) return { ok: false, error: "Could not update the inquiry." };

  revalidatePath("/admin");
  return { ok: true };
}
