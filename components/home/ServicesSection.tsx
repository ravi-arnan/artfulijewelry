import Link from "next/link";
import { ArrowUpRight, Boxes, Droplets, Flame, Gem, PenTool, Sparkles } from "lucide-react";
import { SERVICES } from "@/lib/data";
import { ButtonLink } from "@/components/ui/Button";

const ICONS = [PenTool, Flame, Sparkles, PenTool, Gem, Droplets];

export function ServicesSection() {
  return (
    <section id="services" className="bg-espresso text-paper">
      <div className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">
              One-stop services
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Your design, made under one roof
            </h2>
            <p className="mt-5 text-base leading-relaxed text-paper/70">
              Beyond the catalog, we manufacture to order. Bring a reference or a
              full CAD file, we handle the rest, from first cast to final
              finish.
            </p>
            <ButtonLink
              href={`https://wa.me/6287883992277`}
              variant="gold"
              className="mt-8"
            >
              <Boxes className="h-4 w-4" />
              Start a custom order
            </ButtonLink>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/services"
                className="flex items-center gap-1 text-sm text-paper/70 transition-colors hover:text-gold"
              >
                Explore all services <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/certificate"
                className="flex items-center gap-1 text-sm text-paper/70 transition-colors hover:text-gold"
              >
                Metal assay certificates <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl bg-paper/10 sm:grid-cols-2 lg:col-span-8">
            {SERVICES.map((service, i) => {
              const Icon = ICONS[i % ICONS.length];
              const isLast = i === SERVICES.length - 1;
              const spanFull = isLast && SERVICES.length % 2 !== 0;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className={`group/card block bg-espresso p-7 transition-colors hover:bg-espresso-deep ${spanFull ? "sm:col-span-2" : ""}`}
                >
                  <Icon className="h-6 w-6 text-gold" aria-hidden />
                  <h3 className="mt-4 font-display text-xl group-hover/card:text-gold">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">
                    {service.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
