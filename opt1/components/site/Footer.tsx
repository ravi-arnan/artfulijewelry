import Link from "next/link";
import { Camera, Mail, MessageCircle, Send } from "lucide-react";
import { BRAND, COLLECTIONS, CONTACT } from "@/lib/data";
import { Newsletter } from "@/components/site/Newsletter";

// Top-level shop lines: collections, key categories and the material ranges the
// live site exposes as separate sections (Brass, Bronze).
const SHOP_LINKS = [
  ...COLLECTIONS.map((c) => ({ label: c.name, href: `/shop?collection=${c.slug}` })),
  { label: "Beads", href: "/shop?category=beads" },
  { label: "Charms & Dangles", href: "/shop?category=charms" },
  { label: "Findings", href: "/shop?category=findings" },
  { label: "Mountings", href: "/shop?category=mountings" },
  { label: "Wire & Chains", href: "/shop?category=wire-chains" },
  { label: "Brass", href: "/shop?metal=brass" },
  { label: "Bronze", href: "/shop?metal=bronze" },
];

const COMPANY_LINKS = [
  { label: "Our Story", href: "/#story" },
  { label: "Services", href: "/services" },
  { label: "Certificates", href: "/certificate" },
  { label: "Shipping", href: "/shipping" },
  { label: "Help & FAQ", href: "/help" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "About", href: "/about" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Sitemap", href: "/sitemap" },
];

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-espresso-deep text-paper">
      <div className="rule-gold h-px w-full opacity-60" />
      <Newsletter />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl font-semibold leading-none">
            Bali Handmade
          </p>
          <p className="mt-2 text-[0.6rem] uppercase tracking-[0.18em] text-gold">
            {BRAND.slogan}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">
            Solid 925 sterling silver beads and findings, handmade by artisans
            in Bali since {BRAND.since}.
          </p>
          <div className="mt-6 flex gap-3">
            <FooterIcon href={`https://instagram.com/${BRAND.instagram.replace("@", "")}`} label="Instagram">
              <Camera className="h-5 w-5" />
            </FooterIcon>
            <FooterIcon href={CONTACT.whatsapp[0].href} label="WhatsApp">
              <MessageCircle className="h-5 w-5" />
            </FooterIcon>
            <FooterIcon href={CONTACT.telegram[0].href} label="Telegram">
              <Send className="h-5 w-5" />
            </FooterIcon>
            <FooterIcon href={`mailto:${CONTACT.emails[0].address}`} label="Email">
              <Mail className="h-5 w-5" />
            </FooterIcon>
            <FooterIcon href="https://twitter.com/" label="X / Twitter">
              <XIcon />
            </FooterIcon>
            <FooterIcon href="https://facebook.com/" label="Facebook">
              <FacebookIcon />
            </FooterIcon>
          </div>
        </div>

        <div>
          <FooterHeading>Shop</FooterHeading>
          <ul className="space-y-2 text-sm text-paper/70">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Contact</FooterHeading>
          <ul className="space-y-2 text-sm text-paper/70">
            {CONTACT.whatsapp.map((w) => (
              <li key={w.number}>
                <a href={w.href} className="transition-colors hover:text-gold">
                  WhatsApp · {w.label} {w.number}
                </a>
              </li>
            ))}
            <li>
              <a
                href={CONTACT.telegram[0].href}
                className="transition-colors hover:text-gold"
              >
                Telegram · {CONTACT.telegram[0].label} {CONTACT.telegram[0].number}
              </a>
            </li>
            {CONTACT.emails.map((e) => (
              <li key={e.address}>
                <a
                  href={`mailto:${e.address}`}
                  className="transition-colors hover:text-gold"
                >
                  {e.label}: {e.address}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Company</FooterHeading>
          <ul className="space-y-2 text-sm text-paper/70">
            {COMPANY_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-paper/70">
            Worldwide via {CONTACT.shipping.join(" and ")}. Free over{" "}
            {BRAND.freeShippingThreshold}.
          </p>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-paper/50 sm:flex-row sm:px-6">
          <p>
            © {BRAND.since}–present {BRAND.name}. Redesign concept.
          </p>
          <p>Wholesale prices for everyone.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
      {children}
    </h3>
  );
}

function FooterIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-paper/20 p-2 text-paper/80 transition-colors hover:border-gold hover:text-gold"
    >
      {children}
    </a>
  );
}
