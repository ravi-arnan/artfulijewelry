import { getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductRelatedProps {
  categorySlug: string;
  excludeId: string;
}

export async function ProductRelated({ categorySlug, excludeId }: ProductRelatedProps) {
  const related = (await getProductsByCategory(categorySlug))
    .filter((p) => p.id !== excludeId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-line bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">
          More from this collection
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {related.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
