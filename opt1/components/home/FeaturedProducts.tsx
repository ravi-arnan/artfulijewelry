import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/data";
import { getAllProducts } from "@/lib/products";
import { isOutOfStock } from "@/lib/productStatus";
import { FeaturedProductsRotator } from "./FeaturedProductsRotator";

const SLOTS = 4;
const POOL_TARGET = 16; // multiple of SLOTS so rotating slots never collide

// Build a pool of photogenic, in-stock designs to rotate through: prefer
// new / sale / restocked items, then top up with other in-stock products that
// have real imagery. Trimmed to a multiple of SLOTS.
function buildPool(products: Product[]): Product[] {
  const withImage = products.filter((p) => p.image && !isOutOfStock(p));
  const highlighted = withImage.filter((p) => p.isNew || p.isSale || p.isRestocked);
  const seen = new Set(highlighted.map((p) => p.id));
  const filler = withImage.filter((p) => !seen.has(p.id));

  const pool = [...highlighted, ...filler].slice(0, POOL_TARGET);
  const usable = pool.length - (pool.length % SLOTS);
  return pool.slice(0, Math.max(usable, Math.min(pool.length, SLOTS)));
}

export async function FeaturedProducts() {
  const products = await getAllProducts();
  const pool = buildPool(products);

  if (pool.length === 0) return null;

  return (
    <section className="border-t border-line bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
              Handpicked
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
              Featured products
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-gold-deep"
          >
            Browse the catalog <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <FeaturedProductsRotator products={pool} />
      </div>
    </section>
  );
}
