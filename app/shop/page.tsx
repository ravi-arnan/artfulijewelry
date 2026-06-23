import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { ShopCatalog, type SortKey } from "@/components/shop/ShopCatalog";
import { CATEGORIES, getCollection, type Metal, type Product } from "@/lib/data";
import { STATUS_KEYS, matchesStatus, type StatusKey } from "@/lib/productStatus";
import { getSubcategories } from "@/lib/subcategories";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop wholesale Bali silver, gold & bronze components",
  description:
    "Browse handmade 925 sterling silver beads, charms, findings, fine jewelry and bronze components at wholesale prices.",
};

const PAGE_SIZE = 48;
const VALID_METALS: Metal[] = ["silver", "gold", "brass", "bronze"];
const VALID_SORTS: SortKey[] = ["featured", "price-asc", "price-desc"];
const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));

function asString(v: string | string[] | undefined): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function sortProducts(list: Product[], sort: SortKey): Product[] {
  if (sort === "price-asc") return [...list].sort((a, b) => a.priceFrom - b.priceFrom);
  if (sort === "price-desc") return [...list].sort((a, b) => b.priceFrom - a.priceFrom);
  return list;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const categoryParam = asString(params.category);
  const category = categoryParam && CATEGORY_SLUGS.has(categoryParam) ? categoryParam : null;

  const metalParam = asString(params.metal);
  const metal =
    metalParam && VALID_METALS.includes(metalParam as Metal) ? (metalParam as Metal) : null;

  const sortParam = asString(params.sort);
  const sort: SortKey =
    sortParam && VALID_SORTS.includes(sortParam as SortKey) ? (sortParam as SortKey) : "featured";

  const statusParam = asString(params.status);
  const status: StatusKey | null =
    statusParam && STATUS_KEYS.includes(statusParam as StatusKey)
      ? (statusParam as StatusKey)
      : null;

  const collection = getCollection(asString(params.collection) ?? "");
  const collectionSlugs = collection ? new Set(collection.categorySlugs) : null;

  // Subcategories only apply within a selected category.
  const subItems = getSubcategories(category);
  const subSlugs = new Set(subItems.map((s) => s.slug));
  const subcategoryParam = asString(params.subcategory);
  const subcategory =
    subcategoryParam && subSlugs.has(subcategoryParam) ? subcategoryParam : null;

  const pageRaw = Number.parseInt(asString(params.page) ?? "1", 10);
  const requestedPage = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const allProducts = await getAllProducts();
  const filtered = sortProducts(
    allProducts.filter(
      (p) =>
        (!category || p.category === category) &&
        (!subcategory || p.subcategory === subcategory) &&
        (!metal || p.metal === metal) &&
        (!collectionSlugs || collectionSlugs.has(p.category)) &&
        (!status || matchesStatus(p, status)),
    ),
    sort,
  );

  const headingOverride = collection
    ? { eyebrow: "Collection", title: collection.name, blurb: collection.blurb }
    : undefined;

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, lastPage);
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const categoryFacets = CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: c.itemCount,
  }));

  const subcategoryFacets = subItems.map((s) => ({ slug: s.slug, name: s.label }));

  return (
    <SiteShell>
      <ShopCatalog
        products={slice}
        categories={categoryFacets}
        subcategories={subcategoryFacets}
        category={category}
        subcategory={subcategory}
        metal={metal}
        sort={sort}
        status={status}
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        headingOverride={headingOverride}
      />
    </SiteShell>
  );
}
