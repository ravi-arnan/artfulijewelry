import type { Metadata } from "next";
import { Globe, PackageCheck, Truck } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { BRAND, CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shipping, worldwide via DHL & EMS",
  description:
    "We ship wholesale orders worldwide via DHL and EMS, with free shipping on orders over $2,000 to major regions.",
};

const FREE_REGIONS = [
  "United States",
  "Canada",
  "Mexico",
  "Europe",
  "Australia & New Zealand",
  "Japan & South Korea",
  "China, Hong Kong & Taiwan",
  "Singapore",
];

export default function ShippingPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Delivery"
        title="Shipping worldwide"
        subtitle={`We ship via ${CONTACT.shipping.join(" and ")} with tracking, and offer free shipping on orders over ${BRAND.freeShippingThreshold} to major regions.`}
      />

      <section className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-paper-deep p-7 ring-1 ring-line">
            <Truck className="h-6 w-6 text-gold-deep" aria-hidden />
            <h2 className="mt-4 font-display text-xl text-ink">Couriers</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              All orders ship with {CONTACT.shipping.join(" or ")}, fully tracked
              from our workshop to your door. Express options are available on
              request.
            </p>
          </div>
          <div className="rounded-2xl bg-paper-deep p-7 ring-1 ring-line">
            <PackageCheck className="h-6 w-6 text-gold-deep" aria-hidden />
            <h2 className="mt-4 font-display text-xl text-ink">
              Free over {BRAND.freeShippingThreshold}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Free shipping applies to orders above {BRAND.freeShippingThreshold}{" "}
              to the regions listed. Other destinations ship at low,
              clearly-quoted rates.
            </p>
          </div>
          <div className="rounded-2xl bg-paper-deep p-7 ring-1 ring-line">
            <Globe className="h-6 w-6 text-gold-deep" aria-hidden />
            <h2 className="mt-4 font-display text-xl text-ink">Customs & duties</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Import duties and taxes are set by your country and are the
              buyer&apos;s responsibility. We declare shipments accurately and
              help with paperwork.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-line p-7 sm:p-10">
          <h2 className="font-display text-2xl text-ink">
            Free-shipping regions
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FREE_REGIONS.map((r) => (
              <li
                key={r}
                className="flex items-center gap-2 text-sm text-ink-soft"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-soft">
            Shipping somewhere not listed? Message us on WhatsApp at{" "}
            {CONTACT.whatsapp[0].number} for a quote.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
