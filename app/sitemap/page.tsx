import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { CATEGORIES, COLLECTIONS } from "@/lib/data";
import { STATUS_KEYS, STATUS_LABEL } from "@/lib/productStatus";

export const metadata: Metadata = {
  title: "Sitemap — browse every page",
  description:
    "A directory of every section of the Bali Handmade site: shop categories, collections, services and company pages.",
};

const MAIN_PAGES = [
  { label: "Home", href: "/" },
  { label: "Shop the catalog", href: "/shop" },
  { label: "Our Story", href: "/about" },
  { label: "Shipping", href: "/shipping" },
  { label: "Help & FAQ", href: "/help" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Inquiry list", href: "/inquiry" },
  { label: "Sign in", href: "/login" },
  { label: "Create account", href: "/signup" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-ink-soft underline-offset-4 transition-colors hover:text-gold-deep hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SitemapPage() {
  const categoryLinks = CATEGORIES.map((c) => ({
    label: `${c.name} (${c.itemCount})`,
    href: `/shop?category=${c.slug}`,
  }));
  const collectionLinks = [
    ...COLLECTIONS.map((c) => ({ label: c.name, href: `/shop?collection=${c.slug}` })),
    ...STATUS_KEYS.map((s) => ({ label: STATUS_LABEL[s], href: `/shop?status=${s}` })),
  ];

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Directory"
        title="Sitemap"
        subtitle="Every page on the site in one place — pick a category, a collection, or a company page."
      />

      <section className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <LinkColumn title="Pages" links={MAIN_PAGES} />
          <LinkColumn title="Shop by category" links={categoryLinks} />
          <LinkColumn title="Collections" links={collectionLinks} />
        </div>
      </section>
    </SiteShell>
  );
}
