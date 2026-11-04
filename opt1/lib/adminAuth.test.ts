import { test } from "node:test";
import assert from "node:assert/strict";
import {
  verifyAdminPassword,
  createAdminToken,
  verifyAdminToken,
} from "./adminToken";

test("verifyAdminPassword matches target secret and rejects wrong passwords", () => {
  const original = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = "super-secret-password-123";

  try {
    assert.equal(verifyAdminPassword("super-secret-password-123"), true);
    assert.equal(verifyAdminPassword("wrong-password"), false);
    assert.equal(verifyAdminPassword(""), false);
    assert.equal(verifyAdminPassword(null as unknown as string), false);
  } finally {
    process.env.ADMIN_PASSWORD = original;
  }
});

test("createAdminToken and verifyAdminToken validate authentic tokens", () => {
  const original = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = "test-token-secret";

  try {
    const now = 1700000000000;
    const token = createAdminToken(now);

    assert.ok(token.includes("."));
    assert.equal(verifyAdminToken(token, now), true);
    // Still valid 1 hour later
    assert.equal(verifyAdminToken(token, now + 3600 * 1000), true);
    // Invalid 9 hours later (exceeds 8h duration)
    assert.equal(verifyAdminToken(token, now + 9 * 3600 * 1000), false);
  } finally {
    process.env.ADMIN_PASSWORD = original;
  }
});

test("verifyAdminToken rejects tampered or malformed tokens", () => {
  const original = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = "test-token-secret";

  try {
    const now = 1700000000000;
    const token = createAdminToken(now);
    const [expiryStr, sig] = token.split(".");

    // Tampered expiry
    const tamperedExpiryToken = `${Number(expiryStr) + 1000}.${sig}`;
    assert.equal(verifyAdminToken(tamperedExpiryToken, now), false);

    // Tampered signature
    const tamperedSigToken = `${expiryStr}.${sig.slice(0, -1)}a`;
    assert.equal(verifyAdminToken(tamperedSigToken, now), false);

    // Malformed strings
    assert.equal(verifyAdminToken("not-a-token"), false);
    assert.equal(verifyAdminToken(""), false);
    assert.equal(verifyAdminToken(null), false);
    assert.equal(verifyAdminToken(undefined), false);
  } finally {
    process.env.ADMIN_PASSWORD = original;
  }
});
