"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { updateProduct } from "@/app/actions/products";

export interface EditableProduct {
  id: string;
  name: string;
  category_slug: string | null;
  metal: string;
  price_from: number;
  min_order: number;
  is_new: boolean;
  is_sale: boolean;
}

export function ProductEditRow({ product }: { product: EditableProduct }) {
  // Baseline = last persisted state. Edits are compared against it for the
  // dirty/Saved indicator; on a successful save the baseline advances. Props
  // are never mutated.
  const [baseline, setBaseline] = useState({
    price: String(product.price_from),
    minOrder: String(product.min_order),
    isNew: product.is_new,
    isSale: product.is_sale,
  });
  const [price, setPrice] = useState(baseline.price);
  const [minOrder, setMinOrder] = useState(baseline.minOrder);
  const [isNew, setIsNew] = useState(baseline.isNew);
  const [isSale, setIsSale] = useState(baseline.isSale);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    price !== baseline.price ||
    minOrder !== baseline.minOrder ||
    isNew !== baseline.isNew ||
    isSale !== baseline.isSale;

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateProduct(product.id, {
        priceFrom: Number(price),
        minOrder: Number(minOrder),
        isNew,
        isSale,
      });
      if (result.ok) {
        setBaseline({ price, minOrder, isNew, isSale });
        setSaved(true);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <li className="rounded-xl bg-paper p-4 ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{product.name}</p>
          <p className="text-xs text-ink-soft">
            {product.id} · {product.category_slug ?? "uncategorized"} · {product.metal}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-4">
        <label className="text-xs text-ink-soft">
          <span className="mb-1 block">Price from ($)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-28 rounded-lg border border-line bg-paper px-3 py-1.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
        <label className="text-xs text-ink-soft">
          <span className="mb-1 block">Min order</span>
          <input
            type="number"
            min="1"
            step="1"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
            className="w-24 rounded-lg border border-line bg-paper px-3 py-1.5 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
            className="h-4 w-4 accent-gold-deep"
          />
          New
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={isSale}
            onChange={(e) => setIsSale(e.target.checked)}
            className="h-4 w-4 accent-gold-deep"
          />
          On sale
        </label>

        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || pending}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-espresso px-4 py-1.5 text-sm text-paper transition-colors hover:bg-espresso-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : saved && !dirty ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : null}
          {saved && !dirty ? "Saved" : "Save"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </li>
  );
}
