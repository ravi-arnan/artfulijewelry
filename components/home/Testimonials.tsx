import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";
import { RevealWrapper } from "@/components/ui/RevealWrapper";

export function Testimonials() {
  return (
    <section className="border-t border-line bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
            From the bench to your bench
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
            Trusted by studios worldwide
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <RevealWrapper key={t.name} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-2xl bg-paper p-7 ring-1 ring-line">
                <Quote className="h-7 w-7 text-gold" aria-hidden />
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <p className="font-display text-lg text-ink">{t.name}</p>
                  <p className="text-sm text-ink-soft">{t.role}</p>
                </figcaption>
              </figure>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
