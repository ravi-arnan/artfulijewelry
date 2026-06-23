// Wholesale inquiry (quote-request) model and message builders.
// No payment/checkout — buyers assemble a list and submit via WhatsApp or email.

import type { Product } from "@/lib/data";
import { CONTACT } from "@/lib/data";

export interface InquiryItem {
  productId: string;
  name: string;
  material: string;
  priceFrom: number;
  minOrder: number;
  image?: string;
  quantity: number; // always >= minOrder
}

export function toInquiryItem(product: Product): InquiryItem {
  return {
    productId: product.id,
    name: product.name,
    material: product.material,
    priceFrom: product.priceFrom,
    minOrder: product.minOrder,
    image: product.image,
    quantity: product.minOrder,
  };
}

export function inquiryTotalPieces(items: InquiryItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function inquiryEstimateFrom(items: InquiryItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity * i.priceFrom, 0);
}

function quoteLines(items: InquiryItem[]): string {
  return items
    .map(
      (i) =>
        `- ${i.name} (${i.material}): qty ${i.quantity} @ from $${i.priceFrom.toFixed(2)}/pc`,
    )
    .join("\n");
}

export function buildWhatsAppHref(items: InquiryItem[]): string {
  const text = `Hello Bali Handmade, I would like a wholesale quote for:\n\n${quoteLines(
    items,
  )}\n\nApprox. ${inquiryTotalPieces(
    items,
  )} pieces total. Please confirm availability and shipping. Thank you.`;
  return `${CONTACT.whatsapp[0].href}?text=${encodeURIComponent(text)}`;
}

export function buildMailtoHref(items: InquiryItem[]): string {
  const subject = "Wholesale inquiry";
  const body = `Dear Bali Handmade,\n\nI would like a quote for the following:\n\n${quoteLines(
    items,
  )}\n\nApprox. ${inquiryTotalPieces(
    items,
  )} pieces total. Please advise on shipping and minimum-order confirmation.\n\nThank you.`;
  return `mailto:${CONTACT.emails[0].address}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
