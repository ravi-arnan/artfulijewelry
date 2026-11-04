import { isAdminAuthenticated } from "@/lib/adminAuth";
import { createClient } from "@/lib/supabase/server";
import { inquiriesToCsv, type ExportInquiry } from "@/lib/inquiry-export";

export const dynamic = "force-dynamic";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) return new Response("Unauthorized", { status: 401 });

  let inquiries: ExportInquiry[] = [];
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("inquiries")
        .select(
          "id, created_at, name, email, company, message, status, inquiry_items(name, material, quantity, price_from, min_order)",
        )
        .order("created_at", { ascending: false });
      if (data) {
        inquiries = data as ExportInquiry[];
      }
    } catch {
      inquiries = [];
    }
  }

  const csv = inquiriesToCsv(inquiries);
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
