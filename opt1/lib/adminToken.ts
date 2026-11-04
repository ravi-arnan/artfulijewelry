import crypto from "node:crypto";

export const ADMIN_COOKIE_NAME = "bh_admin_token";
export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

export function getAdminSecret(): string {
  return process.env.ADMIN_PASSWORD || "artfuli2026";
}

export function verifyAdminPassword(candidate: string): boolean {
  if (typeof candidate !== "string" || !candidate) return false;
  const target = getAdminSecret();
  const bufA = Buffer.from(candidate);
  const bufB = Buffer.from(target);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createAdminToken(now = Date.now()): string {
  const expiry = now + SESSION_DURATION_MS;
  const secret = getAdminSecret();
  const sig = crypto.createHmac("sha256", secret).update(String(expiry)).digest("hex");
  return `${expiry}.${sig}`;
}

export function verifyAdminToken(token: string | null | undefined, now = Date.now()): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [expiryStr, sig] = parts;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry <= now) return false;

  const secret = getAdminSecret();
  const expectedSig = crypto.createHmac("sha256", secret).update(expiryStr).digest("hex");

  const bufA = Buffer.from(sig);
  const bufB = Buffer.from(expectedSig);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
