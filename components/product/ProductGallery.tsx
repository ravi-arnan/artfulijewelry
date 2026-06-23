import Image from "next/image";
import type { Product } from "@/lib/data";
import { MetalTile } from "@/components/ui/MetalTile";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gold/10 blur-3xl" />
      <div className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-[0_30px_70px_-30px_rgba(60,45,30,0.4)] ring-1 ring-line">
        {product.image ? (
          <Image
            src={product.image}
            alt={`${product.name} in ${product.material}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-8 transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <MetalTile
            metal={product.metal}
            label={`${product.name} in ${product.material}`}
            rounded="rounded-3xl"
            className="absolute inset-0"
          />
        )}

        {(product.isNew || product.isSale) && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium tracking-wide ${
              product.isSale
                ? "bg-espresso text-paper"
                : "bg-paper text-espresso ring-1 ring-line"
            }`}
          >
            {product.isSale ? "On sale" : "New"}
          </span>
        )}
      </div>
    </div>
  );
}
