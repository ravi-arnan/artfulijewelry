// Flattens inquiries (with their line items) into a CSV for admin export.
// One row per line item, with the inquiry-level fields repeated, so the export
// drops straight into a spreadsheet or CRM. Pure and unit-tested.
import { toCsv } from "./csv";

export interface ExportInquiryItem {
  name: string;
  material: string | null;
  quantity: number;
  price_from: number | string | null;
  min_order: number | null;
}

export interface ExportInquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  status: string;
  inquiry_items: ExportInquiryItem[];
}

const HEADERS = [
  "inquiry_id",
  "created_at",
  "status",
  "customer",
  "email",
  "company",
  "message",
  "item",
  "material",
  "quantity",
  "price_from",
  "min_order",
  "line_estimate",
];

export function inquiriesToCsv(inquiries: readonly ExportInquiry[]): string {
  const rows: unknown[][] = [];

  for (const inq of inquiries) {
    const lead = [
      inq.id,
      inq.created_at,
      inq.status,
      inq.name,
      inq.email,
      inq.company ?? "",
      inq.message ?? "",
    ];

    if (inq.inquiry_items.length === 0) {
      rows.push([...lead, "", "", "", "", "", ""]);
      continue;
    }

    for (const item of inq.inquiry_items) {
      const price = item.price_from == null ? null : Number(item.price_from);
      const lineEstimate = price == null ? "" : (price * item.quantity).toFixed(2);
      rows.push([
        ...lead,
        item.name,
        item.material ?? "",
        item.quantity,
        price ?? "",
        item.min_order ?? "",
        lineEstimate,
      ]);
    }
  }

  return toCsv(HEADERS, rows);
}
