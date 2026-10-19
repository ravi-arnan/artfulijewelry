import { test } from "node:test";
import assert from "node:assert/strict";
import { db, products, eq } from "./index";

test("Drizzle and Turso libSQL client can query products table", async () => {
  const testId = `test-prod-${Date.now()}`;
  const testSku = `SKU-TEST-${Date.now()}`;

  // 1. Insert product
  await db.insert(products).values({
    id: testId,
    sku: testSku,
    name: "Celuk Filigree Test Ring",
    slug: `test-ring-${Date.now()}`,
    category: "Rings",
    material: "925 Sterling Silver",
    priceIdr: 850000,
    priceUsd: 55.0,
    weightGrams: 8.5,
    stockQuantity: 12,
    images: ["/images/test-ring.jpg"],
  });

  // 2. Query product
  const found = await db.query.products.findFirst({
    where: eq(products.id, testId),
  });

  assert.ok(found, "Product should exist in database");
  assert.equal(found.name, "Celuk Filigree Test Ring");
  assert.equal(found.priceIdr, 850000);
  assert.equal(found.priceUsd, 55.0);

  // 3. Cleanup
  await db.delete(products).where(eq(products.id, testId));

  const afterDelete = await db.query.products.findFirst({
    where: eq(products.id, testId),
  });
  assert.equal(afterDelete, undefined);
});
