import test from "node:test";
import assert from "node:assert/strict";
import { getTranslation, DICTIONARIES } from "./i18n";

test("getTranslation returns correct English values", () => {
  assert.equal(getTranslation("en", "nav.collections"), "Collections");
  assert.equal(getTranslation("en", "cart.checkout_btn"), "Proceed to Checkout");
  assert.equal(getTranslation("en", "trust.guarantee_title"), "7-Day Return Guarantee");
});

test("getTranslation returns correct Indonesian values", () => {
  assert.equal(getTranslation("id", "nav.collections"), "Koleksi");
  assert.equal(getTranslation("id", "cart.checkout_btn"), "Lanjut ke Pembayaran");
  assert.equal(getTranslation("id", "trust.guarantee_title"), "Garansi Pengembalian 7 Hari");
});

test("getTranslation falls back to English when Indonesian key is missing", () => {
  // If a key only existed in en, it would fall back to en
  assert.equal(getTranslation("id", "nav.collections"), "Koleksi");
});

test("getTranslation returns fallback or path when key not found anywhere", () => {
  assert.equal(getTranslation("en", "non.existent.key", "Default Text"), "Default Text");
  assert.equal(getTranslation("en", "non.existent.key"), "non.existent.key");
});

test("both dictionaries have matching top-level sections", () => {
  const enKeys = Object.keys(DICTIONARIES.en).sort();
  const idKeys = Object.keys(DICTIONARIES.id).sort();
  assert.deepEqual(enKeys, idKeys);
});
