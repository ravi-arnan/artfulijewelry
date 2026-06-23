import { test } from "node:test";
import assert from "node:assert/strict";
import {
  toInquiryItem,
  inquiryTotalPieces,
  inquiryEstimateFrom,
  buildWhatsAppHref,
  buildMailtoHref,
  type InquiryItem,
} from "./inquiry.ts";
import { CONTACT, type Product } from "./data.ts";

const PRODUCT: Product = {
  id: "abc123",
  name: "Round Spacer Bead",
  category: "beads",
  metal: "silver",
  material: "925 Sterling Silver",
  priceFrom: 1.25,
  minOrder: 20,
  image: "/products/abc123.jpg",
};

const ITEMS: InquiryItem[] = [
  { productId: "a", name: "Bead A", material: "Silver", priceFrom: 2, minOrder: 10, quantity: 10 },
  { productId: "b", name: "Clasp B", material: "Bronze", priceFrom: 0.5, minOrder: 50, quantity: 100 },
];

test("toInquiryItem copies fields and defaults quantity to minOrder", () => {
  const item = toInquiryItem(PRODUCT);
  assert.equal(item.productId, "abc123");
  assert.equal(item.name, "Round Spacer Bead");
  assert.equal(item.priceFrom, 1.25);
  assert.equal(item.minOrder, 20);
  assert.equal(item.quantity, 20); // starts at the minimum order
});

test("inquiryTotalPieces sums quantities", () => {
  assert.equal(inquiryTotalPieces(ITEMS), 110);
  assert.equal(inquiryTotalPieces([]), 0);
});

test("inquiryEstimateFrom sums quantity * priceFrom", () => {
  assert.equal(inquiryEstimateFrom(ITEMS), 10 * 2 + 100 * 0.5); // 70
  assert.equal(inquiryEstimateFrom([]), 0);
});

test("buildWhatsAppHref targets the first WhatsApp number with an encoded quote", () => {
  const href = buildWhatsAppHref(ITEMS);
  assert.ok(href.startsWith(`${CONTACT.whatsapp[0].href}?text=`));
  const text = decodeURIComponent(href.split("?text=")[1]);
  assert.match(text, /Bead A \(Silver\): qty 10 @ from \$2\.00\/pc/);
  assert.match(text, /Clasp B \(Bronze\): qty 100 @ from \$0\.50\/pc/);
  assert.match(text, /Approx\. 110 pieces total/);
});

test("buildMailtoHref targets the first email with an encoded subject and body", () => {
  const href = buildMailtoHref(ITEMS);
  assert.ok(href.startsWith(`mailto:${CONTACT.emails[0].address}?subject=`));
  assert.match(href, /subject=Wholesale%20inquiry/);
  const body = decodeURIComponent(href.split("&body=")[1]);
  assert.match(body, /Bead A \(Silver\): qty 10 @ from \$2\.00\/pc/);
  assert.match(body, /Approx\. 110 pieces total/);
});
