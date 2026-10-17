import { Package, Truck } from "lucide-react";
import { BRAND, type Category, type Product } from "@/lib/data";
import { WholesalePrice } from "@/components/product/WholesalePrice";

interface ProductMetaProps {
  product: Product;
  category?: Category;
}

const METAL_LABEL: Record<Product["metal"], string> = {
  silver: "925 Sterling Silver",
  gold: "Gold",
  brass: "Solid Brass",
  bronze: "Solid Bronze",
};

export function ProductMeta({ product, category }: ProductMetaProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
        {category?.name ?? "Catalog"}
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
        {product.name}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-paper-deep px-3 py-1 text-xs tracking-wide text-ink-soft ring-1 ring-line">
          {METAL_LABEL[product.metal]}
        </span>
        {product.isNew && (
          <span className="rounded-full bg-paper px-3 py-1 text-xs text-espresso ring-1 ring-line">
            New
          </span>
        )}
        {product.isSale && (
          <span className="rounded-full bg-espresso px-3 py-1 text-xs text-paper">
            On sale
          </span>
        )}
      </div>

      <p className="mt-5 text-base leading-relaxed text-ink-soft">
        {product.material}. Cast and finished by hand in Bali. Wholesale pricing
        available to everyone, no reseller licence required.
      </p>

      <div className="mt-7 border-t border-line pt-6">
        <WholesalePrice price={product.priceFrom} variant="detail" />
      </div>

      <ul className="mt-6 space-y-3 text-sm text-ink-soft">
        <li className="flex items-center gap-3">
          <Package className="h-5 w-5 shrink-0 text-gold-deep" aria-hidden />
          Minimum order {product.minOrder} pcs
        </li>
        <li className="flex items-center gap-3">
          <Truck className="h-5 w-5 shrink-0 text-gold-deep" aria-hidden />
          Free DHL / EMS shipping on orders over {BRAND.freeShippingThreshold}
        </li>
      </ul>
    </div>
  );
}
