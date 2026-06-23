import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { TESTIMONIALS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Testimonials — what wholesale buyers say",
  description:
    "Designers and jewellery brands on working with Bali Handmade for solid 925 sterling silver components and one-stop manufacturing.",
};

export default function TestimonialsPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="In their words"
        title="What our buyers say"
        subtitle="Designers, makers and brands who source their sterling silver and bronze components from our bench in Bali."
      />

      <section className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-line bg-paper-deep p-7"
            >
              <Quote className="h-7 w-7 text-gold" aria-hidden />
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <p className="font-display text-base text-ink">{t.name}</p>
                <p className="text-sm text-ink-soft">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
