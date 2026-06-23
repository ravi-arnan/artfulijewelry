import type { InquiryItem } from "./inquiry";

// Merges a local (this-device) inquiry list with the remote (saved-cart) list
// on sign-in. Union by productId; on a conflict keep the larger quantity so a
// sync never silently shrinks a selection. Local metadata wins (it reflects the
// freshest catalog the device loaded). Quantities are clamped to minOrder.
export function mergeCarts(
  local: readonly InquiryItem[],
  remote: readonly InquiryItem[],
): InquiryItem[] {
  const byId = new Map<string, InquiryItem>();

  for (const item of remote) byId.set(item.productId, item);

  for (const item of local) {
    const existing = byId.get(item.productId);
    byId.set(
      item.productId,
      existing
        ? { ...item, quantity: Math.max(item.quantity, existing.quantity) }
        : item,
    );
  }

  return [...byId.values()].map((item) => ({
    ...item,
    quantity: Math.max(item.minOrder, item.quantity),
  }));
}
