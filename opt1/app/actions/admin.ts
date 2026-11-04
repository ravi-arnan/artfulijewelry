"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { createClient } from "@/lib/supabase/server";

const STATUSES = ["new", "contacted", "closed"] as const;
export type InquiryStatus = (typeof STATUSES)[number];

export type UpdateStatusResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<UpdateStatusResult> {
  if (!STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const authed = await isAdminAuthenticated();
  if (!authed) return { ok: false, error: "Not authorized." };

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from("inquiries")
        .update({ status })
        .eq("id", id);
      if (error) return { ok: false, error: "Could not update the inquiry." };
    } catch {
      return { ok: false, error: "Database unavailable." };
    }
  }

  revalidatePath("/admin");
  return { ok: true };
}
