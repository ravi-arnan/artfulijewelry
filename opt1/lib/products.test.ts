import { test } from "node:test";
import assert from "node:assert/strict";

// Ensure no Supabase env leaks in from the shell, so getAllProducts exercises
// the generated-catalog fallback deterministically. mapRow is tested directly.
delete process.env.NEXT_PUBLIC_SUPABASE_URL;
delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const { mapRow, getAllProducts, getProductById, getProductsByCategory } =
  await import("./products.ts");
const { PRODUCTS: SEED } = await import("./catalog.products.generated.ts");

test("mapRow converts a snake_case row to the camelCase Product shape", () => {
  const product = mapRow({
    id: "x1",
    name: "Toggle Clasp",
    category_slug: "clasps",
    metal: "silver",
    material: "925 Silver",
    price_from: 3.5,
    min_order: 12,
    image: "/products/x1.jpg",
    is_new: true,
    is_sale: false,
  });
  assert.deepEqual(product, {
    id: "x1",
    name: "Toggle Clasp",
    category: "clasps",
    metal: "silver",
    material: "925 Silver",
    priceFrom: 3.5,
    minOrder: 12,
    image: "/products/x1.jpg",
    isNew: true,
    isSale: false,
  });
});

test("mapRow coerces a string price (PostgREST numeric) to a number", () => {
  const product = mapRow({
    id: "x2",
    name: "Bead",
    category_slug: "beads",
    metal: "bronze",
    material: "Bronze",
    price_from: "0.75",
    min_order: 50,
    image: null,
    is_new: false,
    is_sale: true,
  });
  assert.equal(product.priceFrom, 0.75);
  assert.equal(typeof product.priceFrom, "number");
});

test("mapRow normalizes null image to undefined and null category to empty string", () => {
  const product = mapRow({
    id: "x3",
    name: "Charm",
    category_slug: null,
    metal: "gold",
    material: "Gold",
    price_from: 9,
    min_order: 1,
    image: null,
    is_new: false,
    is_sale: false,
  });
  assert.equal(product.image, undefined);
  assert.equal(product.category, "");
});

test("getAllProducts falls back to the full generated catalog when env is absent", async () => {
  const products = await getAllProducts();
  assert.equal(products.length, SEED.length);
  assert.ok(products.length > 900, `expected the full catalog, got ${products.length}`);
});

test("getProductById returns a known seed product and undefined for a miss", async () => {
  const sample = SEED[0];
  const found = await getProductById(sample.id);
  assert.equal(found?.id, sample.id);
  assert.equal(await getProductById("definitely-not-a-real-id"), undefined);
});

test("getProductsByCategory returns only products in that category", async () => {
  const category = SEED[0].category;
  const inCategory = await getProductsByCategory(category);
  assert.ok(inCategory.length > 0);
  assert.ok(inCategory.every((p) => p.category === category));
});

test("every product carries an enriched subcategory pass (defined or undefined, never missing key behavior)", async () => {
  const products = await getAllProducts();
  // enrich + withSubcategories ran: inStock defaults to a boolean on every item.
  assert.ok(products.every((p) => typeof p.inStock === "boolean"));
});
