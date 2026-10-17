import { test } from "node:test";
import assert from "node:assert/strict";
import { getCategory, CATEGORIES } from "./data.ts";

test("getCategory returns the matching category for a known slug", () => {
  const first = CATEGORIES[0];
  const found = getCategory(first.slug);
  assert.equal(found?.slug, first.slug);
  assert.equal(found?.name, first.name);
});

test("getCategory returns undefined for an unknown slug", () => {
  assert.equal(getCategory("no-such-category"), undefined);
});

test("CATEGORIES is non-empty and every category has a slug and name", () => {
  assert.ok(CATEGORIES.length > 0);
  assert.ok(CATEGORIES.every((c) => c.slug && c.name));
});
