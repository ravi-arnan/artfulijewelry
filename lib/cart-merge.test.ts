import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeCarts } from "./cart-merge.ts";
import type { InquiryItem } from "./inquiry.ts";

function item(productId: string, quantity: number, minOrder = 10): InquiryItem {
  return { productId, name: productId, material: "Silver", priceFrom: 1, minOrder, quantity };
}

test("mergeCarts unions disjoint local and remote items", () => {
  const merged = mergeCarts([item("a", 10)], [item("b", 20)]);
  assert.deepEqual(merged.map((i) => i.productId).sort(), ["a", "b"]);
});

test("mergeCarts keeps the larger quantity on conflict", () => {
  const merged = mergeCarts([item("a", 30)], [item("a", 10)]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].quantity, 30);

  const merged2 = mergeCarts([item("a", 10)], [item("a", 50)]);
  assert.equal(merged2[0].quantity, 50);
});

test("mergeCarts clamps quantity up to minOrder", () => {
  const merged = mergeCarts([item("a", 3, 25)], []);
  assert.equal(merged[0].quantity, 25);
});

test("mergeCarts prefers local metadata on conflict", () => {
  const local: InquiryItem = { ...item("a", 10), name: "Local Name" };
  const remote: InquiryItem = { ...item("a", 10), name: "Remote Name" };
  assert.equal(mergeCarts([local], [remote])[0].name, "Local Name");
});

test("mergeCarts handles empty inputs", () => {
  assert.deepEqual(mergeCarts([], []), []);
  assert.equal(mergeCarts([], [item("a", 10)]).length, 1);
  assert.equal(mergeCarts([item("a", 10)], []).length, 1);
});
