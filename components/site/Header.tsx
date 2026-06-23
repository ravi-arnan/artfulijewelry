"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";
import { BRAND, CATEGORIES } from "@/lib/data";
import { ButtonLink } from "@/components/ui/Button";
import { AuthNav } from "@/components/auth/AuthNav";
import { useInquiry } from "@/context/InquiryContext";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "New In", href: "/shop?status=new" },
  { label: "On Sale", href: "/shop?status=sale" },
  { label: "Restocked", href: "/shop?status=restocked" },
  { label: "Services", href: "/services" },
  { label: "Our Story", href: "/about" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useInquiry();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Bali Handmade
          </span>
          <span className="text-[0.6rem] uppercase tracking-[0.18em] text-gold-deep">
            {BRAND.slogan}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-ink-soft transition-colors hover:text-gold-deep"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/inquiry"
            aria-label={`Inquiry list, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            className="relative rounded-full p-2 text-ink-soft transition-colors hover:text-gold-deep"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-semibold text-espresso-deep">
                {itemCount}
              </span>
            )}
          </Link>
          <AuthNav variant="icon" />
          <ButtonLink href="/shop" variant="gold" className="hidden md:inline-flex">
            Browse catalog
          </ButtonLink>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-ink lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3 text-ink-soft last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-2 max-[400px]:grid-cols-1">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop?category=${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="truncate rounded-lg bg-paper-deep px-3 py-2 text-sm leading-tight text-ink"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <AuthNav variant="full" onNavigate={() => setOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}
