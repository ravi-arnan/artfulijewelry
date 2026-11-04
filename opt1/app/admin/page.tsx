import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, BellRing, Download, Inbox, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { createClient } from "@/lib/supabase/server";
import { db, products } from "@/lib/db";
import { count } from "drizzle-orm";
import { getAllProducts } from "@/lib/products";
import { InquiryBoard, type AdminInquiry } from "@/components/admin/InquiryBoard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  let productCount = 0;
  try {
    const res = await db.select({ val: count() }).from(products);
    productCount = res[0]?.val ?? 0;
  } catch {
    productCount = 0;
  }

  if (productCount === 0) {
    const fallbackProducts = await getAllProducts();
    productCount = fallbackProducts.length;
  }

  let inquiries: AdminInquiry[] = [];
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = await createClient();
      const { data: inquiriesData } = await supabase
        .from("inquiries")
        .select(
          "id, created_at, name, email, company, message, status, inquiry_items(name, material, quantity, price_from, min_order)",
        )
        .order("created_at", { ascending: false })
        .limit(100);
      if (inquiriesData) {
        inquiries = inquiriesData as AdminInquiry[];
      }
    } catch {
      inquiries = [];
    }
  }

  const openCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <>
      <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
        Store admin
      </p>
      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
        Dashboard
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Package}
          label="Products"
          value={productCount ?? 0}
          href="/admin/products"
          hint="Manage catalog"
        />
        <StatCard
          icon={Inbox}
          label="Inquiries"
          value={inquiries.length}
          hint="Latest 100"
        />
        <StatCard
          icon={BellRing}
          label="New / unhandled"
          value={openCount}
          accent={openCount > 0}
          hint={openCount > 0 ? "Needs attention" : "All clear"}
        />
      </div>

      <div className="mt-12 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl text-ink">Inquiries</h2>
        {inquiries.length > 0 && (
          <a
            href="/admin/export"
            download
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-gold hover:bg-paper-deep"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export CSV
          </a>
        )}
      </div>
      <InquiryBoard initial={inquiries} />
    </>
  );
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  hint?: string;
  href?: string;
  accent?: boolean;
}

function StatCard({ icon: Icon, label, value, hint, href, accent }: StatCardProps) {
  const body = (
    <div
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-5 ring-1 transition-shadow ${
        accent
          ? "bg-gold/10 ring-gold/30"
          : "bg-paper ring-line shadow-[0_18px_48px_-30px_rgba(60,45,30,0.3)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
            accent ? "bg-gold/25 text-gold-deep" : "bg-paper-deep text-ink-soft"
          }`}
        >
          <Icon className="h-4.5 w-4.5" aria-hidden />
        </span>
        {href && (
          <ArrowUpRight
            className="h-4 w-4 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        )}
      </div>
      <div className="mt-6">
        <p className="font-display text-4xl text-ink tabular-nums">
          {value.toLocaleString()}
        </p>
        <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft">
          {label}
        </p>
        {hint && <p className="mt-0.5 text-xs text-ink-soft/80">{hint}</p>}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-2xl">
      {body}
    </Link>
  ) : (
    body
  );
}
