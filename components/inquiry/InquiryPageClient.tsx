"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useInquiry } from "@/context/InquiryContext";
import { inquiryEstimateFrom, inquiryTotalPieces } from "@/lib/inquiry";
import { InquiryLineItem } from "./InquiryLineItem";
import { InquiryContactForm } from "./InquiryContactForm";

export function InquiryPageClient() {
  const { items, hydrated, clear } = useInquiry();

  if (!hydrated) {
    return <div className="mx-auto min-h-[60vh] max-w-7xl px-4 py-12 sm:px-6" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-paper-deep">
          <ShoppingBag className="h-7 w-7 text-gold-deep" />
        </div>
        <h1 className="mt-6 font-display text-3xl text-ink">
          Your inquiry list is empty
        </h1>
        <p className="mt-3 text-ink-soft">
          Browse the catalog and add the pieces you would like a wholesale quote
          for. We will reply with availability and shipping.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-3 text-sm font-medium text-paper transition-colors hover:bg-espresso-deep"
        >
          Browse the catalog
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
            Wholesale inquiry
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
            Your quote request
          </h1>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex min-h-[44px] items-center gap-2 px-2 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <Trash2 className="h-4 w-4" />
            Clear list
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <InquiryLineItem key={item.productId} item={item} />
          ))}
        </ul>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-paper-deep p-6 ring-1 ring-line">
            <h2 className="font-display text-xl text-ink">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Items</dt>
                <dd className="text-ink">{items.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Total pieces</dt>
                <dd className="text-ink">{inquiryTotalPieces(items)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2">
                <dt className="text-ink-soft">Estimate from</dt>
                <dd className="font-display text-lg text-gold-deep">
                  ${inquiryEstimateFrom(items).toFixed(2)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              Indicative only. Final wholesale pricing and shipping are confirmed
              by our team on reply.
            </p>
            <div className="mt-6">
              <InquiryContactForm items={items} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
