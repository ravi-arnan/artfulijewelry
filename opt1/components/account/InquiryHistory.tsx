import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { InquiryStatus } from "@/app/actions/admin";
import { StatusBadge } from "@/components/inquiry/StatusBadge";

export interface AccountInquiryItem {
  name: string;
  quantity: number;
  price_from: number | string | null;
}

export interface AccountInquiry {
  id: string;
  created_at: string;
  status: InquiryStatus;
  inquiry_items: AccountInquiryItem[];
}

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function totals(items: AccountInquiryItem[]): { pieces: number; estimate: number } {
  return items.reduce(
    (acc, item) => ({
      pieces: acc.pieces + item.quantity,
      estimate: acc.estimate + item.quantity * Number(item.price_from ?? 0),
    }),
    { pieces: 0, estimate: 0 },
  );
}

export function InquiryHistory({ inquiries }: { inquiries: AccountInquiry[] }) {
  if (inquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-paper-deep/40 px-6 py-12 text-center">
        <ShoppingBag className="mx-auto h-7 w-7 text-ink-soft/60" aria-hidden />
        <p className="mt-3 font-display text-lg text-ink">No inquiries yet</p>
        <p className="mt-1 text-sm text-ink-soft">
          Add items to your inquiry list and submit a quote request to see it here.
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex rounded-full bg-espresso px-5 py-2.5 text-sm text-paper transition-colors hover:bg-espresso-deep"
        >
          Browse the catalog
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {inquiries.map((inquiry) => {
        const { pieces, estimate } = totals(inquiry.inquiry_items);
        const names = inquiry.inquiry_items
          .map((i) => i.name)
          .slice(0, 3)
          .join(", ");
        const extra = inquiry.inquiry_items.length - 3;
        return (
          <li
            key={inquiry.id}
            className="rounded-2xl bg-paper ring-1 ring-line p-5 shadow-[0_18px_48px_-30px_rgba(60,45,30,0.3)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={inquiry.status} />
                <time className="text-xs text-ink-soft">
                  {DATE_FMT.format(new Date(inquiry.created_at))}
                </time>
              </div>
              <span className="text-sm tabular-nums text-ink-soft">
                {inquiry.inquiry_items.length} item
                {inquiry.inquiry_items.length === 1 ? "" : "s"} · {pieces.toLocaleString()} pcs · est. $
                {estimate.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            {names && (
              <p className="mt-3 truncate text-sm text-ink">
                {names}
                {extra > 0 ? `, +${extra} more` : ""}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
