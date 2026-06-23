import { test } from "node:test";
import assert from "node:assert/strict";
import {
  matchesStatus,
  getProductBadge,
  isOutOfStock,
  STATUS_KEYS,
} from "./productStatus.ts";
import type { Product } from "./data.ts";

function make(overrides: Partial<Product>): Product {
  return {
    id: "p",
    name: "Sample",
    category: "beads",
    metal: "silver",
    material: "925 Sterling Silver",
    priceFrom: 1,
    minOrder: 10,
    inStock: true,
    ...overrides,
  };
}

test("STATUS_KEYS covers the four facets", () => {
  assert.deepEqual([...STATUS_KEYS].sort(), [
    "new",
    "out-of-stock",
    "restocked",
    "sale",
  ]);
});

test("isOutOfStock only true when inStock is explicitly false", () => {
  assert.equal(isOutOfStock(make({ inStock: false })), true);
  assert.equal(isOutOfStock(make({ inStock: true })), false);
  assert.equal(isOutOfStock(make({ inStock: undefined })), false);
});

test("matchesStatus respects each facet", () => {
  assert.equal(matchesStatus(make({ isNew: true }), "new"), true);
  assert.equal(matchesStatus(make({ isSale: true }), "sale"), true);
  assert.equal(matchesStatus(make({ isRestocked: true }), "restocked"), true);
  assert.equal(matchesStatus(make({ inStock: false }), "out-of-stock"), true);
});

test("out-of-stock items never match new/sale/restocked", () => {
  const oos = make({ inStock: false, isNew: true, isSale: true, isRestocked: true });
  assert.equal(matchesStatus(oos, "new"), false);
  assert.equal(matchesStatus(oos, "sale"), false);
  assert.equal(matchesStatus(oos, "restocked"), false);
  assert.equal(matchesStatus(oos, "out-of-stock"), true);
});

test("getProductBadge priority: out-of-stock > sale > restocked > new", () => {
  assert.equal(
    getProductBadge(make({ inStock: false, isSale: true }))?.label,
    "Out of stock",
  );
  assert.equal(
    getProductBadge(make({ isSale: true, isNew: true }))?.label,
    "On sale",
  );
  assert.equal(
    getProductBadge(make({ isRestocked: true, isNew: true }))?.label,
    "Restocked",
  );
  assert.equal(getProductBadge(make({ isNew: true }))?.label, "New");
  assert.equal(getProductBadge(make({})), null);
});
