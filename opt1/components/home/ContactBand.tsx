import { ArrowUpRight, Boxes, Globe, Mail, MessageCircle, Truck } from "lucide-react";
import { BRAND, CONTACT } from "@/lib/data";

type ContactRow = {
  key: string;
  title: string;
  value: string;
  href: string;
  external: boolean;
  Icon: typeof MessageCircle;
};

const ROWS: ContactRow[] = [
  ...CONTACT.whatsapp.map((w) => ({
    key: w.number,
    title: `WhatsApp · ${w.label}`,
    value: w.number,
    href: w.href,
    external: true,
    Icon: MessageCircle,
  })),
  ...CONTACT.emails.map((e) => ({
    key: e.address,
    title: e.label,
    value: e.address,
    href: `mailto:${e.address}`,
    external: false,
    Icon: Mail,
  })),
];

const TRUST = [
  { Icon: Truck, text: `Free DHL / EMS shipping on orders over ${BRAND.freeShippingThreshold}` },
  { Icon: Globe, text: "We reply in English and Bahasa Indonesia" },
  { Icon: Boxes, text: "Custom OEM and private-label orders welcome" },
];

export function ContactBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
      <div className="grid overflow-hidden rounded-3xl shadow-[0_30px_80px_-40px_rgba(40,30,20,0.5)] ring-1 ring-line lg:grid-cols-2">
        {/* Dark panel, message */}
        <div className="relative isolate bg-espresso px-8 py-12 text-paper sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -left-16 -top-16 -z-10 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            Let&apos;s talk
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            Ready to place a wholesale order?
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-paper/70">
            Message us on WhatsApp for the fastest reply, or email for quotes and
            custom work. No reseller licence required.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-paper/80">
            {TRUST.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Light panel, contact methods */}
        <div className="flex flex-col justify-center gap-3 bg-paper px-6 py-10 sm:px-10 sm:py-12">
          {ROWS.map((row) => (
            <a
              key={row.key}
              href={row.href}
              {...(row.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex items-center gap-4 rounded-2xl bg-paper-deep/60 p-4 ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:bg-paper-deep hover:ring-gold"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep transition-colors group-hover:bg-gold group-hover:text-espresso-deep">
                <row.Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">
                  {row.title}
                </span>
                <span className="block truncate text-xs text-ink-soft">
                  {row.value}
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
