"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/supabase/adminContext";

export interface ProductPatch {
  priceFrom: number;
  minOrder: number;
  isNew: boolean;
  isSale: boolean;
}

export type UpdateProductResult = { ok: true } | { ok: false; error: string };

const MAX_PRICE = 100_000;
const MAX_MIN_ORDER = 100_000;

// Admin-only product edit. RLS ("products write" -> is_admin()) is the real
// boundary; we re-verify here because a Server Action is a public endpoint, and
// validate the numeric fields before writing.
export async function updateProduct(
  id: string,
  patch: ProductPatch,
): Promise<UpdateProductResult> {
  if (typeof id !== "string" || id.length === 0) {
    return { ok: false, error: "Missing product id." };
  }
  if (!Number.isFinite(patch.priceFrom) || patch.priceFrom < 0 || patch.priceFrom > MAX_PRICE) {
    return { ok: false, error: "Price must be between 0 and 100000." };
  }
  if (
    !Number.isInteger(patch.minOrder) ||
    patch.minOrder < 1 ||
    patch.minOrder > MAX_MIN_ORDER
  ) {
    return { ok: false, error: "Minimum order must be a whole number of at least 1." };
  }
  if (typeof patch.isNew !== "boolean" || typeof patch.isSale !== "boolean") {
    return { ok: false, error: "Invalid flags." };
  }

  const { supabase, user, isAdmin } = await getAdminContext();
  if (!user) return { ok: false, error: "Not signed in." };
  if (!isAdmin) return { ok: false, error: "Not authorized." };

  const { error } = await supabase
    .from("products")
    .update({
      price_from: patch.priceFrom,
      min_order: patch.minOrder,
      is_new: patch.isNew,
      is_sale: patch.isSale,
    })
    .eq("id", id);

  if (error) return { ok: false, error: "Could not update the product." };

  // Refresh the admin view immediately. The public storefront reads a
  // per-process memoized catalog (see lib/products.ts), so price/flag edits
  // surface there on the next deploy/restart, not instantly.
  revalidatePath("/admin/products");
  return { ok: true };
}
