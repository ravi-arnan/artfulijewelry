"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Mail, Clock, Inbox } from "lucide-react";
import { updateInquiryStatus, type InquiryStatus } from "@/app/actions/admin";
import {
  StatusBadge,
  STATUS_DOT,
  STATUS_LABEL,
} from "@/components/inquiry/StatusBadge";

export interface AdminInquiryItem {
  name: string;
  material: string | null;
  quantity: number;
  price_from: number | string | null;
  min_order: number | null;
}

export interface AdminInquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  status: InquiryStatus;
  inquiry_items: AdminInquiryItem[];
}

const STATUSES: InquiryStatus[] = ["new", "contacted", "closed"];
type Filter = "all" | InquiryStatus;
const FILTERS: Filter[] = ["all", "new", "contacted", "closed"];

// Deterministic UTC formatting so the server-rendered HTML matches client
// hydration (locale/timezone-free), and the timestamp is unambiguous.
const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
function formatDate(iso: string): string {
  return `${DATE_FMT.format(new Date(iso))} UTC`;
}

function itemTotals(items: AdminInquiryItem[]): { pieces: number; estimate: number } {
  return items.reduce(
    (acc, item) => ({
      pieces: acc.pieces + item.quantity,
      estimate: acc.estimate + item.quantity * Number(item.price_from ?? 0),
    }),
    { pieces: 0, estimate: 0 },
  );
}

export function InquiryBoard({ initial }: { initial: AdminInquiry[] }) {
  const [inquiries, setInquiries] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: inquiries.length,
      new: 0,
      contacted: 0,
      closed: 0,
    };
    for (const inquiry of inquiries) base[inquiry.status] += 1;
    return base;
  }, [inquiries]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries.filter((inquiry) => {
      if (filter !== "all" && inquiry.status !== filter) return false;
      if (!q) return true;
      return (
        inquiry.name.toLowerCase().includes(q) ||
        inquiry.email.toLowerCase().includes(q) ||
        (inquiry.company?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [inquiries, filter, query]);

  function handleStatus(id: string, next: InquiryStatus) {
    const previous = inquiries.find((i) => i.id === id)?.status;
    if (!previous || previous === next) return;

    setErrorId(null);
    setBusyId(id);
    setInquiries((cur) =>
      cur.map((i) => (i.id === id ? { ...i, status: next } : i)),
    );

    startTransition(async () => {
      const result = await updateInquiryStatus(id, next);
      if (!result.ok) {
        setInquiries((cur) =>
          cur.map((i) => (i.id === id ? { ...i, status: previous } : i)),
        );
        setErrorId(id);
      }
      setBusyId(null);
    });
  }

  if (inquiries.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-line bg-paper-deep/50 px-6 py-16 text-center">
        <Inbox className="mx-auto h-8 w-8 text-ink-soft/60" aria-hidden />
        <p className="mt-3 font-display text-lg text-ink">No inquiries yet</p>
        <p className="mt-1 text-sm text-ink-soft">
          Wholesale quote requests will appear here as buyers submit them.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap gap-1.5"
          role="tablist"
          aria-label="Filter inquiries by status"
        >
          {FILTERS.map((value) => {
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                  active
                    ? "bg-ink text-paper"
                    : "bg-paper-deep text-ink-soft ring-1 ring-line hover:text-ink"
                }`}
              >
                {value}
                <span
                  className={`rounded-full px-1.5 text-[0.65rem] tabular-nums ${
                    active ? "bg-paper/20 text-paper" : "bg-paper text-ink-soft"
                  }`}
                >
                  {counts[value]}
                </span>
              </button>
            );
          })}
        </div>

        <label className="relative block sm:w-64">
          <span className="sr-only">Search inquiries</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, company"
            // A search box should never attract password managers; these hints
            // tell 1Password / LastPass / Proton Pass to skip it (and avoid the
            // extension-injected-attribute hydration warning they cause).
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            data-protonpass-ignore="true"
            className="w-full rounded-full border border-line bg-paper py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-gold focus:outline-none"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-center text-sm text-ink-soft">
          No inquiries match this view.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {visible.map((inquiry) => {
            const { pieces, estimate } = itemTotals(inquiry.inquiry_items);
            return (
              <li
                key={inquiry.id}
                className="overflow-hidden rounded-2xl bg-paper ring-1 ring-line shadow-[0_18px_48px_-28px_rgba(60,45,30,0.3)]"
              >
                <div
                  className={`h-1 w-full ${STATUS_DOT[inquiry.status]} opacity-80`}
                  aria-hidden
                />
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={inquiry.status} />
                        <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
                          <Clock className="h-3 w-3" aria-hidden />
                          {formatDate(inquiry.created_at)}
                        </span>
                      </div>
                      <p className="mt-2 font-display text-lg text-ink">
                        {inquiry.name}
                        {inquiry.company ? (
                          <span className="text-ink-soft"> · {inquiry.company}</span>
                        ) : null}
                      </p>
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="inline-flex items-center gap-1.5 text-sm text-gold-deep hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" aria-hidden />
                        {inquiry.email}
                      </a>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div
                        className="inline-flex rounded-full bg-paper-deep p-0.5 ring-1 ring-line"
                        role="group"
                        aria-label={`Set status for ${inquiry.name}`}
                      >
                        {STATUSES.map((option) => {
                          const active = inquiry.status === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleStatus(inquiry.id, option)}
                              disabled={busyId === inquiry.id}
                              aria-pressed={active}
                              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors disabled:opacity-50 ${
                                active
                                  ? "bg-ink text-paper"
                                  : "text-ink-soft hover:text-ink"
                              }`}
                            >
                              {STATUS_LABEL[option]}
                            </button>
                          );
                        })}
                      </div>
                      {errorId === inquiry.id && (
                        <span className="text-xs text-red-700">
                          Update failed. Try again.
                        </span>
                      )}
                    </div>
                  </div>

                  {inquiry.message && (
                    <p className="mt-3 rounded-xl bg-paper-deep/60 px-3.5 py-2.5 text-sm text-ink-soft">
                      {inquiry.message}
                    </p>
                  )}

                  <div className="mt-4 border-t border-line pt-3">
                    <div className="flex items-center justify-between text-xs uppercase tracking-widest text-ink-soft">
                      <span>
                        {inquiry.inquiry_items.length} item
                        {inquiry.inquiry_items.length === 1 ? "" : "s"}
                      </span>
                      <span className="tabular-nums">
                        {pieces.toLocaleString()} pcs · est. ${estimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <ul className="mt-2 divide-y divide-line text-sm">
                      {inquiry.inquiry_items.map((item, index) => (
                        <li
                          key={`${inquiry.id}-${index}`}
                          className="flex items-center justify-between gap-4 py-2"
                        >
                          <span className="min-w-0 truncate text-ink">
                            {item.name}
                            {item.material ? (
                              <span className="text-ink-soft"> · {item.material}</span>
                            ) : null}
                          </span>
                          <span className="shrink-0 tabular-nums text-ink-soft">
                            qty {item.quantity.toLocaleString()}
                            {item.price_from != null
                              ? ` · from $${Number(item.price_from).toFixed(2)}`
                              : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
