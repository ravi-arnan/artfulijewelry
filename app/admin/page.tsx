import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, BellRing, Inbox, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { InquiryBoard, type AdminInquiry } from "@/components/admin/InquiryBoard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-3xl text-ink">{title}</h1>
      <p className="mt-3 text-ink-soft">{children}</p>
      <Link
        href="/"
        className="mt-8 inline-flex text-sm text-gold-deep hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}

export default async function AdminPage() {
  if (!CONFIGURED) {
    return (
      <Notice title="Admin is not available yet">
        The Supabase backend is not configured for this deployment.
      </Notice>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <Notice title="Not authorized">
        This area is for store administrators only.
      </Notice>
    );
  }

  const [{ data: inquiriesData }, { count: productCount }] = await Promise.all([
    supabase
      .from("inquiries")
      .select(
        "id, created_at, name, email, company, message, status, inquiry_items(name, material, quantity, price_from, min_order)",
      )
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("products").select("id", { count: "exact", head: true }),
  ]);

  const inquiries = (inquiriesData ?? []) as AdminInquiry[];
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
            href="/shop"
            hint="View catalog"
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

      <h2 className="mt-12 font-display text-2xl text-ink">Inquiries</h2>
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
