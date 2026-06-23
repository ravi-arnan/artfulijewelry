import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { MetalTile } from "@/components/ui/MetalTile";

export function CategoryShowcase() {
  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
            The catalog
          </p>
          <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight text-ink sm:text-5xl">
            Shop by collection
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-gold-deep"
        >
          View all <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.slice(0, 6).map((category, i) => (
          <Link
            key={category.slug}
            href={`/shop?category=${category.slug}`}
            className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl p-6 ring-1 ring-line transition-shadow hover:shadow-xl ${
              i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
            }`}
          >
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <MetalTile
                metal={category.metal}
                rounded="rounded-3xl"
                className="absolute inset-0"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/90 via-espresso-deep/40 to-espresso-deep/10" />
            <div className="relative">
              <span className="text-xs uppercase tracking-widest text-gold">
                {category.itemCount}+ designs
              </span>
              <h3 className="mt-1 font-display text-2xl text-paper sm:text-3xl">
                {category.name}
              </h3>
              <p className="mt-1 line-clamp-2 max-w-sm text-sm text-paper/80">
                {category.blurb}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Shop now <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
