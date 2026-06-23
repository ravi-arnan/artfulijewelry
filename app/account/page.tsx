import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Mail, Building2, CalendarDays } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My account",
  robots: { index: false },
};

function formatDate(value: string | undefined): string {
  if (!value) return "Unknown";
  const d = new Date(value);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  // Company can live on the profile row or the auth metadata.
  let company: string | null = (user.user_metadata?.company as string) ?? null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("company")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.company) company = profile.company;

  const rows = [
    { icon: Mail, label: "Email", value: user.email ?? "Unknown" },
    { icon: Building2, label: "Company", value: company || "Not set" },
    { icon: CalendarDays, label: "Member since", value: formatDate(user.created_at) },
  ];

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Wholesale account"
        title="My account"
        subtitle="Your account details and quick links. Wholesale pricing is unlocked while you are signed in."
      />

      <section className="mx-auto max-w-3xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="rounded-2xl border border-line p-7 sm:p-8">
          <h2 className="font-display text-2xl text-ink">Account details</h2>
          <dl className="mt-6 divide-y divide-line">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center gap-4 py-4">
                <row.icon className="h-5 w-5 shrink-0 text-gold-deep" aria-hidden />
                <dt className="w-32 shrink-0 text-sm text-ink-soft">{row.label}</dt>
                <dd className="truncate text-sm font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <SignOutButton />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/inquiry"
            className="group flex items-center justify-between rounded-2xl bg-paper-deep p-6 ring-1 ring-line transition-shadow hover:shadow-lg"
          >
            <div>
              <p className="font-display text-lg text-ink">My inquiry list</p>
              <p className="mt-1 text-sm text-ink-soft">Review and submit your quote request.</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gold-deep" />
          </Link>
          <Link
            href="/shop"
            className="group flex items-center justify-between rounded-2xl bg-paper-deep p-6 ring-1 ring-line transition-shadow hover:shadow-lg"
          >
            <div>
              <p className="font-display text-lg text-ink">Browse the catalog</p>
              <p className="mt-1 text-sm text-ink-soft">See wholesale prices across the range.</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gold-deep" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
