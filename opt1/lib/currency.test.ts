import test from "node:test";
import assert from "node:assert/strict";
import { formatCurrency, resolveProductPrice, USD_TO_IDR_RATE } from "./currency";

test("formatCurrency formats IDR with thousand separator and Rp prefix", () => {
  assert.equal(formatCurrency(750000, "IDR"), "Rp 750.000");
  assert.equal(formatCurrency(1250000, "IDR"), "Rp 1.250.000");
  assert.equal(formatCurrency(0, "IDR"), "Rp 0");
  assert.equal(formatCurrency(1999.8, "IDR"), "Rp 2.000");
});

test("formatCurrency formats USD with dollar sign and proper decimals", () => {
  assert.equal(formatCurrency(48, "USD"), "$48");
  assert.equal(formatCurrency(48.5, "USD"), "$48.50");
  assert.equal(formatCurrency(1250.75, "USD"), "$1,250.75");
  assert.equal(formatCurrency(0, "USD"), "$0");
});

test("resolveProductPrice prefers discrete priceIdr when IDR is selected", () => {
  const product = {
    priceIdr: 850000,
    priceUsd: 55,
    priceFrom: 50,
  };
  const result = resolveProductPrice(product, "IDR");
  assert.equal(result.amount, 850000);
  assert.equal(result.formatted, "Rp 850.000");
});

test("resolveProductPrice prefers discrete priceUsd when USD is selected", () => {
  const product = {
    priceIdr: 850000,
    priceUsd: 55,
    priceFrom: 50,
  };
  const result = resolveProductPrice(product, "USD");
  assert.equal(result.amount, 55);
  assert.equal(result.formatted, "$55");
});

test("resolveProductPrice falls back to USD_TO_IDR_RATE if priceIdr missing", () => {
  const product = {
    priceUsd: 50,
  };
  const result = resolveProductPrice(product, "IDR");
  assert.equal(result.amount, 50 * USD_TO_IDR_RATE);
  assert.equal(result.formatted, formatCurrency(50 * USD_TO_IDR_RATE, "IDR"));
});

test("resolveProductPrice handles missing values safely", () => {
  const resultIdr = resolveProductPrice({}, "IDR");
  assert.equal(resultIdr.amount, 0);
  assert.equal(resultIdr.formatted, "Rp 0");

  const resultUsd = resolveProductPrice({}, "USD");
  assert.equal(resultUsd.amount, 0);
  assert.equal(resultUsd.formatted, "$0");
});
