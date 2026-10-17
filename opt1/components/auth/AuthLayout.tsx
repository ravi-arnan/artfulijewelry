import { Check, ShieldCheck } from "lucide-react";
import { BRAND, VALUE_PROPS } from "@/lib/data";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/**
 * Two-column auth shell: a branded trust panel on the left (desktop only) and
 * the form on the right. Keeps login and signup visually consistent and avoids
 * the bare single-column look.
 */
export function AuthLayout({ eyebrow, title, subtitle, children }: AuthLayoutProps) {
  const props = VALUE_PROPS.slice(0, 4);

  return (
    <section className="mx-auto grid max-w-6xl items-stretch gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
      {/* Brand / trust panel */}
      <aside className="relative hidden overflow-hidden rounded-3xl bg-espresso-deep p-10 text-paper lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] [background-size:16px_16px]"
          aria-hidden
        />
        <div className="relative">
          <p className="font-display text-2xl font-semibold">{BRAND.name}</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-gold">
            {BRAND.slogan}
          </p>
          <h2 className="mt-10 max-w-sm font-display text-3xl leading-tight">
            Wholesale pricing, open to everyone.
          </h2>
        </div>

        <ul className="relative mt-10 space-y-4">
          {props.map((prop) => (
            <li key={prop.title} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Check className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-medium text-paper">{prop.title}</p>
                <p className="text-sm leading-relaxed text-paper/60">{prop.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="relative mt-10 flex items-center gap-2 text-xs text-paper/50">
          <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
          Handmade in Bali since {BRAND.since}.
        </p>
      </aside>

      {/* Form column */}
      <div className="flex flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{title}</h1>
        <p className="mt-3 text-ink-soft">{subtitle}</p>
        <div className="mt-8 rounded-2xl bg-paper-deep p-6 ring-1 ring-line sm:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}
