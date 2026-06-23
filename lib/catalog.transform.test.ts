import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanName, hashId, normalize, enrich } from "./catalog.transform.ts";
import type { Product } from "./data.ts";

function make(overrides: Partial<Product> & { id: string }): Product {
  return {
    name: "Sample",
    category: "beads",
    metal: "silver",
    material: "925 Sterling Silver",
    priceFrom: 1,
    minOrder: 10,
    ...overrides,
  };
}

test("cleanName removes stuttering repeated words, keeping first occurrence", () => {
  assert.equal(cleanName("Caps Brass Brass Caps"), "Caps Brass");
  assert.equal(
    cleanName("Silver Ring Mountings Silver Mountings"),
    "Silver Ring Mountings",
  );
  assert.equal(
    cleanName("Alphabet Bronze Bronze Yellow Gold Bronze"),
    "Alphabet Bronze Yellow Gold",
  );
});

test("cleanName is case-insensitive but preserves the first casing", () => {
  assert.equal(cleanName("Round round ROUND Beads"), "Round Beads");
});

test("cleanName leaves already-clean names and whitespace tidy", () => {
  assert.equal(cleanName("Round Silver Beads"), "Round Silver Beads");
  assert.equal(cleanName("  Spaced   Out  "), "Spaced Out");
});

test("normalize splits brass out of the bronze bucket by name", () => {
  const brass = normalize([make({ id: "a", name: "Caps Brass", metal: "bronze" })])[0];
  assert.equal(brass.metal, "brass");
  assert.equal(brass.material, "Solid Brass");

  const bronze = normalize([make({ id: "b", name: "Charms Bronze", metal: "bronze" })])[0];
  assert.equal(bronze.metal, "bronze");
  assert.equal(bronze.material, "Solid Bronze");
});

test("normalize reassigns Mountings pieces to the mountings category", () => {
  const out = normalize([
    make({ id: "c", name: "Silver Ring Mountings", category: "rings" }),
  ])[0];
  assert.equal(out.category, "mountings");
});

test("normalize is idempotent", () => {
  const once = normalize([make({ id: "d", name: "Caps Brass Brass", metal: "bronze" })]);
  const twice = normalize(once);
  assert.deepEqual(twice, once);
});

test("enrich synthesizes stable, deterministic stock flags", () => {
  const a = enrich([make({ id: "X42" })])[0];
  const b = enrich([make({ id: "X42" })])[0];
  assert.equal(a.inStock, b.inStock);
  assert.equal(a.isRestocked, b.isRestocked);
  assert.equal(typeof a.inStock, "boolean");
});

test("enrich preserves values the source already provides", () => {
  const out = enrich([make({ id: "Y", inStock: false, isRestocked: true })])[0];
  assert.equal(out.inStock, false);
  assert.equal(out.isRestocked, true);
});

test("enrich never marks a new item as restocked, and OOS items are never restocked", () => {
  const sample = Array.from({ length: 200 }, (_, i) => make({ id: `id-${i}`, isNew: i % 2 === 0 }));
  for (const p of enrich(sample)) {
    if (p.isRestocked) {
      assert.equal(p.isNew ?? false, false);
      assert.equal(p.inStock, true);
    }
  }
});

test("hashId is deterministic", () => {
  assert.equal(hashId("ABC123"), hashId("ABC123"));
});
