// Server-only product catalog access. The full ~928-item catalog must never be
// bundled into client JS, so this module is server-only and client components
// receive the products they need via props.
//
// Source of truth is Supabase when configured; otherwise it falls back to the
// generated catalog files. The fallback keeps the static site building and
// rendering identically with no live credentials. The catalog is loaded once
// per process and memoized, fine for SSG (build-time) and the public catalog,
// which only changes on redeploy. Admin reads/writes go through their own
// session-bound clients, not this cache.
import "server-only";
import type { Product, Metal } from "./data";
import { PRODUCTS as SEED_PRODUCTS } from "./catalog.products.generated";
import { normalize, enrich } from "./catalog.transform";
import { deriveSubcategory } from "./subcategories";
import { createCatalogClient } from "./supabase/catalog";

// Tag each product with its derived subcategory (keyword match on the cleaned
// name). Runs after normalize so the category and name are final.
function withSubcategories(products: Product[]): Product[] {
  return products.map((p) => ({
    ...p,
    subcategory: p.subcategory ?? deriveSubcategory(p.category, p.name),
  }));
}

interface ProductRow {
  id: string;
  name: string;
  category_slug: string | null;
  metal: string;
  material: string;
  price_from: number | string;
  min_order: number;
  image: string | null;
  is_new: boolean;
  is_sale: boolean;
}

const PRODUCT_COLUMNS =
  "id,name,category_slug,metal,material,price_from,min_order,image,is_new,is_sale";

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category_slug ?? "",
    metal: row.metal as Metal,
    material: row.material,
    priceFrom: Number(row.price_from),
    minOrder: row.min_order,
    image: row.image ?? undefined,
    isNew: row.is_new,
    isSale: row.is_sale,
  };
}

async function loadAll(): Promise<Product[]> {
  const supabase = createCatalogClient();
  if (!supabase) return SEED_PRODUCTS;

  try {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .order("id", { ascending: true })
      .range(0, 1999); // catalog is ~928 rows; range guards Supabase's 1000-row default cap

    if (error || !data || data.length === 0) return SEED_PRODUCTS;
    return (data as ProductRow[]).map(mapRow);
  } catch {
    // Network/credential failure, keep the site working on the generated catalog.
    return SEED_PRODUCTS;
  }
}

let catalogCache: Promise<Product[]> | null = null;

export function getAllProducts(): Promise<Product[]> {
  if (!catalogCache)
    catalogCache = loadAll().then(normalize).then(enrich).then(withSubcategories);
  return catalogCache;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.category === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return (await getAllProducts()).find((p) => p.id === id);
}
