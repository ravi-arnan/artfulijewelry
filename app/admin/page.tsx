import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteShell } from "@/components/site/SiteShell";
import { InquiryStatusControl } from "@/components/admin/InquiryStatusControl";
import type { InquiryStatus } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

interface InquiryItemRow {
  name: string;
  material: string | null;
  quantity: number;
  price_from: number | string | null;
  min_order: number | null;
}

interface InquiryRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  status: InquiryStatus;
  inquiry_items: InquiryItemRow[];
}

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
      <SiteShell>
        <Notice title="Admin is not available yet">
          The Supabase backend is not configured for this deployment.
        </Notice>
      </SiteShell>
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
      <SiteShell>
        <Notice title="Not authorized">
          This area is for store administrators only.
        </Notice>
      </SiteShell>
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

  const inquiries = (inquiriesData ?? []) as InquiryRow[];
  const openCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
          Store admin
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
          Dashboard
        </h1>

        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Products" value={productCount ?? 0} />
          <Stat label="Inquiries (latest 100)" value={inquiries.length} />
          <Stat label="New / unhandled" value={openCount} />
        </dl>

        <h2 className="mt-12 font-display text-2xl text-ink">Inquiries</h2>
        {inquiries.length === 0 ? (
          <p className="mt-4 text-ink-soft">No inquiries yet.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {inquiries.map((inquiry) => (
              <li
                key={inquiry.id}
                className="rounded-2xl bg-paper-deep p-5 ring-1 ring-line"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg text-ink">
                      {inquiry.name}
                      {inquiry.company ? (
                        <span className="text-ink-soft"> · {inquiry.company}</span>
                      ) : null}
                    </p>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="text-sm text-gold-deep hover:underline"
                    >
                      {inquiry.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <time className="text-xs text-ink-soft">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </time>
                    <InquiryStatusControl
                      id={inquiry.id}
                      status={inquiry.status}
                    />
                  </div>
                </div>

                {inquiry.message && (
                  <p className="mt-3 text-sm text-ink-soft">{inquiry.message}</p>
                )}

                <ul className="mt-4 divide-y divide-line border-t border-line text-sm">
                  {inquiry.inquiry_items.map((item, index) => (
                    <li
                      key={`${inquiry.id}-${index}`}
                      className="flex items-center justify-between gap-4 py-2"
                    >
                      <span className="text-ink">
                        {item.name}
                        {item.material ? (
                          <span className="text-ink-soft"> · {item.material}</span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-ink-soft">
                        qty {item.quantity}
                        {item.price_from != null
                          ? ` · from $${Number(item.price_from).toFixed(2)}`
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-paper-deep p-5 ring-1 ring-line">
      <dt className="text-xs uppercase tracking-widest text-ink-soft">
        {label}
      </dt>
      <dd className="mt-1 font-display text-3xl text-ink">{value}</dd>
    </div>
  );
}
