"use client";

import { Mail, MessageCircle } from "lucide-react";
import type { InquiryItem } from "@/lib/inquiry";
import { buildMailtoHref, buildWhatsAppHref } from "@/lib/inquiry";

interface InquirySubmitButtonsProps {
  items: InquiryItem[];
}

export function InquirySubmitButtons({ items }: InquirySubmitButtonsProps) {
  const disabled = items.length === 0;

  return (
    <div className="flex flex-col gap-3">
      <a
        href={disabled ? undefined : buildWhatsAppHref(items)}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-colors ${
          disabled
            ? "pointer-events-none bg-paper-deep text-ink-soft"
            : "bg-gold text-espresso-deep hover:bg-gold-deep hover:text-paper"
        }`}
      >
        <MessageCircle className="h-4 w-4" />
        Send via WhatsApp
      </a>
      <a
        href={disabled ? undefined : buildMailtoHref(items)}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border px-7 py-3 text-sm font-medium transition-colors ${
          disabled
            ? "pointer-events-none border-line text-ink-soft"
            : "border-line text-ink hover:border-gold hover:text-gold-deep"
        }`}
      >
        <Mail className="h-4 w-4" />
        Send via email
      </a>
    </div>
  );
}
