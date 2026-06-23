import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { SERVICES, getService, CONTACT } from "@/lib/data";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service" };
  return {
    title: `${service.title}: one-stop service`,
    description: service.intro,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <SiteShell>
      <PageHeader eyebrow="One-stop services" title={service.title} subtitle={service.intro} />

      <section className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div>
            <h2 className="font-display text-2xl text-ink">What is included</h2>
            <ul className="mt-6 space-y-4">
              {service.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-start gap-5 rounded-2xl bg-espresso p-8 text-paper sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-xl">Bring us your project</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-paper/70">
                  Share a reference and we will quote lead time and pricing.
                </p>
              </div>
              <ButtonLink
                href={CONTACT.whatsapp[0].href}
                variant="gold"
                className="shrink-0"
              >
                Message us
              </ButtonLink>
            </div>
          </div>

          {/* Other services nav, mirrors the live sidebar */}
          <aside className="lg:border-l lg:border-line lg:pl-8">
            <h2 className="text-xs uppercase tracking-[0.2em] text-ink-soft">
              Other services
            </h2>
            <ul className="mt-4 space-y-1">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-paper-deep hover:text-gold-deep"
                  >
                    {s.title}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/certificate"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-paper-deep hover:text-gold-deep"
                >
                  Metal Assay Certificates
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
