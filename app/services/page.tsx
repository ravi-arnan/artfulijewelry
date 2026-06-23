import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Boxes, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { SERVICES, CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "One-stop services: design, casting, plating & finishing",
  description:
    "From 3D design and casting to plating, stone setting, engraving and finishing, we manufacture your jewellery under one roof in Bali.",
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="One-stop services"
        title="Your design, made under one roof"
        subtitle="Beyond the catalog we manufacture to order. Bring a reference or a full CAD file and we handle the rest, from first cast to final finish."
      />

      <section className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group flex flex-col rounded-2xl border border-line p-7 transition-shadow hover:shadow-lg"
            >
              <h2 className="font-display text-xl text-ink group-hover:text-gold-deep">
                {service.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                {service.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm text-gold-deep">
                Learn more <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}

          {/* Certificate service links to its dedicated page */}
          <Link
            href="/certificate"
            className="group flex flex-col rounded-2xl bg-paper-deep p-7 ring-1 ring-line transition-shadow hover:shadow-lg"
          >
            <ShieldCheck className="h-6 w-6 text-gold-deep" aria-hidden />
            <h2 className="mt-4 font-display text-xl text-ink group-hover:text-gold-deep">
              Metal Assay Certificates
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
              Independent XRF scan certificates verifying the precious-metal
              purity of your gold, silver, platinum and palladium pieces.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm text-gold-deep">
              View certificates <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="mt-12 flex flex-col items-start gap-5 rounded-2xl bg-espresso p-8 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="font-display text-2xl">Start a custom order</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/70">
              Send a sketch, a sample or a CAD file. We will quote lead time and
              pricing, and produce a sample before any production run.
            </p>
          </div>
          <ButtonLink href={CONTACT.whatsapp[0].href} variant="gold" className="shrink-0">
            <Boxes className="h-4 w-4" />
            Message us
          </ButtonLink>
        </div>
      </section>
    </SiteShell>
  );
}
