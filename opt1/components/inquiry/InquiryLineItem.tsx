"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import type { InquiryItem } from "@/lib/inquiry";
import { useInquiry } from "@/context/InquiryContext";

interface InquiryLineItemProps {
  item: InquiryItem;
}

export function InquiryLineItem({ item }: InquiryLineItemProps) {
  const { setQuantity, remove } = useInquiry();
  const step = Math.max(1, Math.round(item.minOrder / 4));

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/shop/${item.productId}`}
        aria-hidden
        tabIndex={-1}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-line"
      >
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-contain p-2"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/shop/${item.productId}`}
              className="font-display text-lg leading-snug text-ink hover:text-gold-deep"
            >
              {item.name}
            </Link>
            <p className="text-sm text-ink-soft">{item.material}</p>
          </div>
          <button
            type="button"
            onClick={() => remove(item.productId)}
            aria-label={`Remove ${item.name}`}
            className="shrink-0 rounded-full p-2 text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full border border-line p-1">
            <button
              type="button"
              onClick={() => setQuantity(item.productId, item.quantity - step)}
              disabled={item.quantity <= item.minOrder}
              aria-label="Decrease quantity"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-deep disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              value={item.quantity}
              min={item.minOrder}
              step={step}
              max={100000}
              onChange={(e) =>
                setQuantity(item.productId, Number(e.target.value))
              }
              aria-label={`Quantity for ${item.name}, minimum ${item.minOrder} pieces`}
              className="w-14 bg-transparent text-center text-sm text-ink focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => setQuantity(item.productId, item.quantity + step)}
              aria-label="Increase quantity"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-deep"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-xs text-ink-soft">min {item.minOrder} pcs</p>
            <p className="font-display text-lg text-gold-deep">
              ${(item.quantity * item.priceFrom).toFixed(2)}
              <span className="ml-1 text-xs text-ink-soft">est.</span>
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
