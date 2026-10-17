import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { getProductBadge } from "@/lib/productStatus";
import { MetalTile } from "./MetalTile";
import { AddToInquiryButton } from "./AddToInquiryButton";
import { WholesalePrice } from "@/components/product/WholesalePrice";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const href = `/shop/${product.id}`;

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <Link href={href} aria-hidden tabIndex={-1} className="block">
          {product.image ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white ring-1 ring-line">
              <Image
                src={product.image}
                alt={`${product.name} in ${product.material}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <MetalTile
              metal={product.metal}
              label={`${product.name} in ${product.material}`}
              className="aspect-square w-full"
            />
          )}
        </Link>
        {(() => {
          const badge = getProductBadge(product);
          if (!badge) return null;
          return (
            <span
              className={`pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium tracking-wide ${badge.className}`}
            >
              {badge.label}
            </span>
          );
        })()}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-display text-base leading-snug text-ink sm:text-lg">
          <Link href={href} className="line-clamp-2 hover:text-gold-deep">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-ink-soft">{product.material}</p>
        <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
          <div>
            <WholesalePrice price={product.priceFrom} variant="card" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-ink-soft">
              min {product.minOrder} pcs
            </span>
            <AddToInquiryButton product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}
