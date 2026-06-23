import { createClient } from "@/lib/supabase/server";
import { inquiriesToCsv, type ExportInquiry } from "@/lib/inquiry-export";

export const dynamic = "force-dynamic";

// GET /admin/export -> downloads all inquiries (with line items) as CSV.
// Admin-gated (RLS would also scope reads, but we reject non-admins explicitly).
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const { data, error } = await supabase
    .from("inquiries")
    .select(
      "id, created_at, name, email, company, message, status, inquiry_items(name, material, quantity, price_from, min_order)",
    )
    .order("created_at", { ascending: false });

  if (error) return new Response("Export failed", { status: 500 });

  const csv = inquiriesToCsv((data ?? []) as ExportInquiry[]);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inquiries-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
