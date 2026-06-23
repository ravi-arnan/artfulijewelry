"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle, Plus } from "lucide-react";
import type { Product } from "@/lib/data";
import { useInquiry } from "@/context/InquiryContext";
import { buildWhatsAppHref, toInquiryItem } from "@/lib/inquiry";

interface ProductInquiryCTAProps {
  product: Product;
}

export function ProductInquiryCTA({ product }: ProductInquiryCTAProps) {
  const { add, isInInquiry } = useInquiry();
  const added = isInInquiry(product.id);
  const whatsappHref = useMemo(
    () => buildWhatsAppHref([toInquiryItem(product)]),
    [product],
  );

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
      {added ? (
        <Link
          href="/inquiry"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-espresso px-7 py-3 text-sm font-medium text-paper transition-colors hover:bg-espresso-deep"
        >
          <Check className="h-4 w-4 text-gold" />
          In your inquiry, view list
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => add(product)}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-medium text-espresso-deep transition-colors hover:bg-gold-deep hover:text-paper"
        >
          <Plus className="h-4 w-4" />
          Add to inquiry
        </button>
      )}

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ask about this product on WhatsApp (opens in a new tab)"
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-line px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold-deep"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        Ask on WhatsApp
      </a>
    </div>
  );
}
