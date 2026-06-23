import type { Metadata } from "next";
import { PackageOpen, ScanLine, FileCheck, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { CERTIFICATES, CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Metal assay certificates — gold, silver, platinum & palladium",
  description:
    "Independent XRF scan certificates verifying the precious-metal purity of your gold, silver, platinum and palladium pieces. Part of our one-stop service.",
};

const STEPS = [
  {
    icon: PackageOpen,
    title: "Send your piece",
    text: "Mail us the finished item — a bead, a finding, or a complete jewellery piece.",
  },
  {
    icon: ScanLine,
    title: "We scan it",
    text: "An XRF assay reads the exact precious-metal content, non-destructively.",
  },
  {
    icon: FileCheck,
    title: "Receive the certificate",
    text: "You get a signed scan certificate documenting the metal and its fineness.",
  },
];

export default function CertificatePage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="One-stop services"
        title="Metal assay certificates"
        subtitle="Independent XRF scan certificates that verify the precious-metal purity of your pieces — proof of quality you can pass on to your own customers."
      />

      <section className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
        {/* How it works */}
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="rounded-2xl bg-paper-deep p-7 ring-1 ring-line">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold-deep">
                  {i + 1}
                </span>
                <step.icon className="h-6 w-6 text-gold-deep" aria-hidden />
              </div>
              <h2 className="mt-4 font-display text-xl text-ink">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            </div>
          ))}
        </div>

        {/* Certificate types */}
        <h2 className="mt-16 font-display text-2xl text-ink">Certificates we issue</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {CERTIFICATES.map((cert) => (
            <article
              key={cert.code}
              className="flex flex-col rounded-2xl border border-line p-7 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-6 w-6 shrink-0 rounded-full ring-1 ring-line"
                  style={{ backgroundColor: cert.swatch }}
                  aria-hidden
                />
                <h3 className="font-display text-xl text-ink">{cert.name}</h3>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gold-deep">
                {cert.metal}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                {cert.description}
              </p>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-start gap-5 rounded-2xl bg-espresso p-8 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-gold" aria-hidden />
            <div>
              <h2 className="font-display text-2xl">Need a certificate?</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/70">
                Message us to arrange an assay. Certificates are issued per piece
                and can accompany any wholesale order.
              </p>
            </div>
          </div>
          <ButtonLink href={CONTACT.whatsapp[0].href} variant="gold" className="shrink-0">
            Request a certificate
          </ButtonLink>
        </div>
      </section>
    </SiteShell>
  );
}
