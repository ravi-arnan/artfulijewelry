import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Factory, Hand, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "About — handmade silver from Bali since 2004",
  description:
    "Bali Handmade is a jewelry manufacturer in Bali producing solid 925 sterling silver beads, findings and finished jewelry at wholesale prices since 2004.",
};

const PILLARS = [
  { Icon: Hand, title: "Made by hand", text: "Every piece is cast, soldered and finished by bench artisans trained over generations." },
  { Icon: Factory, title: "One roof", text: "Design, casting, plating, engraving and stone setting all happen in our own facility." },
  { Icon: BadgeCheck, title: "Genuine 925", text: "Solid sterling silver, with vermeil to the FTC standard. No plating shortcuts." },
  { Icon: Sparkles, title: "Wholesale for all", text: "Wholesale pricing for every buyer, with no reseller licence required." },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Our story"
        title="Handmade silver from Bali, since 2004"
        subtitle="We are a family-run jewelry manufacturer producing solid sterling silver components and finished pieces for studios and brands worldwide."
      />

      <section className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gold/10 blur-3xl" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white shadow-[0_30px_70px_-30px_rgba(60,45,30,0.4)] ring-1 ring-line">
              <Image
                src="/products/B0572.jpg"
                alt="Hand-finished filigree sterling silver piece"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-10"
              />
            </div>
          </div>

          <div className="space-y-5 text-base leading-relaxed text-ink-soft">
            <p>
              Bali Handmade began in 2004 in a small workshop on the island of
              Bali. Two decades on, the craft is the same — granulation,
              filigree and stone work done by hand — but the facility has grown
              to a complete manufacturing house.
            </p>
            <p>
              We run our own casting, plating and finishing under one roof,
              including computerized laser engraving and a recently opened
              second casting line. That means we can take a design from a sketch
              or a CAD file all the way to a finished, plated, retail-ready
              piece without leaving the building.
            </p>
            <p className="font-display text-xl italic text-ink">
              “Every bead has its own story — and we guarantee the quality of
              what we make.”
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-paper-deep p-6 ring-1 ring-line"
            >
              <Icon className="h-6 w-6 text-gold-deep" aria-hidden />
              <h2 className="mt-4 font-display text-lg text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
