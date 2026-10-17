import type { InquiryStatus } from "@/app/actions/admin";

// Shared status presentation for inquiries, used by both the admin board and the
// buyer's account history. On-brand palette: gold for new (needs attention), a
// restrained blue for in-progress, muted neutral for closed.
const STYLE: Record<InquiryStatus, { label: string; pill: string; dot: string }> = {
  new: {
    label: "New",
    pill: "bg-gold/15 text-gold-deep ring-gold/30",
    dot: "bg-gold-deep",
  },
  contacted: {
    label: "Contacted",
    pill: "bg-[oklch(95%_0.03_240)] text-[oklch(45%_0.1_245)] ring-[oklch(82%_0.05_240)]",
    dot: "bg-[oklch(55%_0.12_245)]",
  },
  closed: {
    label: "Closed",
    pill: "bg-paper-deep text-ink-soft ring-line",
    dot: "bg-ink-soft",
  },
};

export const STATUS_DOT: Record<InquiryStatus, string> = {
  new: STYLE.new.dot,
  contacted: STYLE.contacted.dot,
  closed: STYLE.closed.dot,
};

export const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: STYLE.new.label,
  contacted: STYLE.contacted.label,
  closed: STYLE.closed.label,
};

export function StatusBadge({ status }: { status: InquiryStatus }) {
  const style = STYLE[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium ring-1 ${style.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden />
      {style.label}
    </span>
  );
}
