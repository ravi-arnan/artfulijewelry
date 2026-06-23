import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

type Tile = {
  id: string;
  src: string;
  alt: string;
  name: string;
  metal: "silver" | "gold";
  ratio: string;
};

// Two staggered columns of "specimen" cards. Left column is pushed down so the
// pair reads as an editorial masonry rather than a flat 2x2 grid.
const LEFT_TILES: Tile[] = [
  { id: "B0572", src: "/products/B0572.jpg", alt: "Filigree sterling silver heart pendant", name: "Filigree Heart", metal: "silver", ratio: "aspect-[4/5]" },
  { id: "WDR002Y22", src: "/products/WDR002Y22.jpg", alt: "Pair of gold band rings", name: "Gold Band, Pair", metal: "gold", ratio: "aspect-square" },
];
const RIGHT_TILES: Tile[] = [
  { id: "B1759VR", src: "/products/B1759VR-gold-vermeil-bead.jpg", alt: "Gold vermeil granulated beads", name: "Vermeil Bead", metal: "gold", ratio: "aspect-square" },
  { id: "SSRBT032", src: "/products/SSRBT032.jpg", alt: "Sterling silver word ring", name: "Word Ring", metal: "silver", ratio: "aspect-[4/5]" },
];

function SpecimenTile({ tile, priority }: { tile: Tile; priority?: boolean }) {
  return (
    <Link
      href={`/shop/${tile.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-[0_18px_48px_-20px_rgba(60,45,30,0.3)] ring-1 ring-line/70 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_64px_-22px_rgba(60,45,30,0.4)]"
    >
      <div className={`relative ${tile.ratio} w-full`}>
        <Image
          src={tile.src}
          alt={tile.alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-contain p-6 transition-transform duration-700 group-hover:scale-[1.07]"
        />
      </div>
      <div className="flex items-center gap-2 border-t border-line/80 px-4 py-3">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${tile.metal === "gold" ? "bg-gold" : "bg-silver"}`}
        />
        <span className="truncate text-xs font-medium tracking-wide text-ink-soft">
          {tile.name}
        </span>
      </div>
    </Link>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-12 lg:pb-28 lg:pt-24">
        <div className="rise lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold-deep">
            <Sparkles className="h-3.5 w-3.5" />
            Handmade in Bali since 2004
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Solid silver,
            <br />
            <span className="text-gold-deep italic">made by hand.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Wholesale 925 sterling beads, charms and findings cast and finished
            by artisans in Bali. Every bead has its own story — and wholesale
            pricing for everyone, no reseller licence required.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href="/shop" variant="ink">
              Browse the catalog
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/#services" variant="ghost">
              Custom manufacturing
            </ButtonLink>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-8">
            {[
              { value: "20+", label: "Years crafting" },
              { value: "2,000+", label: "Catalog designs" },
              { value: "925", label: "Sterling silver" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl text-ink">{stat.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rise lg:col-span-6">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="pointer-events-none absolute -left-12 top-12 -z-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />

            <div className="relative flex gap-4 sm:gap-5">
              <div className="flex w-1/2 flex-col gap-4 pt-10 sm:gap-5">
                {LEFT_TILES.map((tile, i) => (
                  <SpecimenTile key={tile.id} tile={tile} priority={i === 0} />
                ))}
              </div>
              <div className="flex w-1/2 flex-col gap-4 sm:gap-5">
                {RIGHT_TILES.map((tile, i) => (
                  <SpecimenTile key={tile.id} tile={tile} priority={i === 0} />
                ))}
              </div>
            </div>

            {/* Floating focal seal */}
            <div className="absolute left-1/2 top-1/2 hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-espresso text-paper shadow-xl ring-2 ring-gold/40 lg:flex">
              <span className="font-display text-2xl leading-none text-gold">925</span>
              <span className="mt-1 text-[0.55rem] uppercase tracking-[0.25em] text-paper/80">
                Sterling
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
