import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Wholesale ordering terms for Bali Handmade, pricing, payment, lead times, custom work and returns.",
  robots: { index: false },
};

const SECTIONS = [
  {
    title: "Wholesale pricing",
    body: "Prices are wholesale and available to all buyers, with no reseller licence required. Prices are quoted per piece in USD and may change without notice. A formal quote confirms current pricing for your order.",
  },
  {
    title: "Orders & minimums",
    body: "Many items carry a minimum order quantity, shown on each product. Orders are confirmed once stock and pricing are agreed in writing over WhatsApp or email.",
  },
  {
    title: "Payment",
    body: "We accept bank transfer and other methods confirmed at the time of order. Custom and large orders may require a deposit before production begins.",
  },
  {
    title: "Custom & OEM work",
    body: "We manufacture to order from references or CAD files. Custom pieces are quoted individually; samples and lead times are agreed before production. Designs you supply remain yours.",
  },
  {
    title: "Lead times",
    body: "In-stock items usually ship within a few business days. Made-to-order and custom finishes take longer, depending on quantity and process. We confirm timing on every order.",
  },
  {
    title: "Returns & quality",
    body: "We guarantee the quality of what we make. If an item arrives faulty or not as described, contact us promptly and we will repair, replace or refund. Made-to-order custom pieces are non-refundable unless faulty.",
  },
];

export default function TermsPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Policies"
        title="Terms & Conditions"
        subtitle="The basics of ordering wholesale from Bali Handmade. This is a redesign concept; final terms are confirmed with your order."
      />

      <section className="mx-auto max-w-3xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-2xl text-ink">{s.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
