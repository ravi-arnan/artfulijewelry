"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";

const SLOTS = 4;
const INTERVAL_MS = 3200;

interface FeaturedProductsRotatorProps {
  products: Product[];
}

/**
 * Shows four featured products and continuously swaps one slot at a time to a
 * fresh design from the pool, so the row is always quietly changing. Each slot
 * is kept SLOTS apart in the pool, so the four visible cards never collide as
 * long as the pool length is a multiple of SLOTS. Honors reduced-motion by
 * staying static.
 */
export function FeaturedProductsRotator({ products }: FeaturedProductsRotatorProps) {
  const len = products.length;
  // Each slot holds an index into `products`; start them SLOTS apart.
  const [slotIndexes, setSlotIndexes] = useState<number[]>(() =>
    Array.from({ length: Math.min(SLOTS, len) }, (_, i) => i),
  );

  useEffect(() => {
    if (len <= SLOTS) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let step = 0;
    const id = window.setInterval(() => {
      const column = step % SLOTS;
      step += 1;
      setSlotIndexes((prev) =>
        prev.map((value, i) => (i === column ? (value + SLOTS) % len : value)),
      );
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [len]);

  return (
    <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
      {slotIndexes.map((productIndex, slot) => {
        const product = products[productIndex];
        return (
          <div key={slot} className="min-w-0">
            {/* Keying on the product id remounts the card so the swap-in
                animation runs each time the slot changes. */}
            <div key={product.id} className="swap-in">
              <ProductCard product={product} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
