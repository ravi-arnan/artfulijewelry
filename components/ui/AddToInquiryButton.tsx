"use client";

import { Check, Plus } from "lucide-react";
import type { Product } from "@/lib/data";
import { useInquiry } from "@/context/InquiryContext";

interface AddToInquiryButtonProps {
  product: Product;
}

export function AddToInquiryButton({ product }: AddToInquiryButtonProps) {
  const { add, isInInquiry } = useInquiry();
  const added = isInInquiry(product.id);

  return (
    <button
      type="button"
      onClick={() => add(product)}
      disabled={added}
      aria-label={added ? `${product.name} added to inquiry` : `Add ${product.name} to inquiry`}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
        added
          ? "border-gold bg-gold/15 text-gold-deep"
          : "border-line text-ink-soft hover:border-gold hover:text-gold-deep"
      }`}
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}
