// Shared product-status vocabulary used by the shop filters, the product card
// badge, and the header nav so the four states stay consistent everywhere.
import type { Product } from "./data";

export type StatusKey = "new" | "sale" | "restocked" | "out-of-stock";

export const STATUS_KEYS: StatusKey[] = ["new", "sale", "restocked", "out-of-stock"];

export const STATUS_LABEL: Record<StatusKey, string> = {
  new: "New",
  sale: "On sale",
  restocked: "Restocked",
  "out-of-stock": "Out of stock",
};

export function isOutOfStock(product: Product): boolean {
  return product.inStock === false;
}

export function matchesStatus(product: Product, status: StatusKey): boolean {
  switch (status) {
    case "new":
      return Boolean(product.isNew) && !isOutOfStock(product);
    case "sale":
      return Boolean(product.isSale) && !isOutOfStock(product);
    case "restocked":
      return Boolean(product.isRestocked) && !isOutOfStock(product);
    case "out-of-stock":
      return isOutOfStock(product);
  }
}

interface Badge {
  label: string;
  className: string;
}

// Single badge per card, in priority order: stock state wins, then sale,
// then restocked, then new.
export function getProductBadge(product: Product): Badge | null {
  if (isOutOfStock(product)) {
    return { label: "Out of stock", className: "bg-ink/80 text-paper" };
  }
  if (product.isSale) {
    return { label: "On sale", className: "bg-espresso text-paper" };
  }
  if (product.isRestocked) {
    return { label: "Restocked", className: "bg-gold text-espresso-deep" };
  }
  if (product.isNew) {
    return { label: "New", className: "bg-paper text-espresso ring-1 ring-line" };
  }
  return null;
}
