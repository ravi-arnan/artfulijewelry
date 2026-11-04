"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { createClient } from "@/lib/supabase/server";

export interface ProductPatch {
  priceFrom: number;
  minOrder: number;
  isNew: boolean;
  isSale: boolean;
}

export type UpdateProductResult = { ok: true } | { ok: false; error: string };

const MAX_PRICE = 100_000;
const MAX_MIN_ORDER = 100_000;

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

  const authed = await isAdminAuthenticated();
  if (!authed) return { ok: false, error: "Not authorized." };

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = await createClient();
      await supabase
        .from("products")
        .update({
          price_from: patch.priceFrom,
          min_order: patch.minOrder,
          is_new: patch.isNew,
          is_sale: patch.isSale,
        })
        .eq("id", id);
    } catch {
      // ignore
    }
  }

  revalidatePath("/admin/products");
  return { ok: true };
}
