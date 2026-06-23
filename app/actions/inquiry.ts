"use server";

import { createClient } from "@/lib/supabase/server";

// Payload sent from the inquiry page. Mirrors lib/inquiry.ts InquiryItem, but is
// re-validated here because a Server Action is a public, untrusted boundary.
export interface InquiryItemInput {
  productId: string;
  name: string;
  material?: string;
  priceFrom?: number;
  minOrder?: number;
  quantity: number;
}

export interface InquiryInput {
  name: string;
  email: string;
  company?: string;
  message?: string;
  items: InquiryItemInput[];
}

export type SubmitInquiryResult =
  | { ok: true; id: string | null; persisted: boolean }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ITEMS = 200;

function isConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function validate(input: unknown): InquiryInput | null {
  if (typeof input !== "object" || input === null) return null;
  const v = input as Record<string, unknown>;

  const name = typeof v.name === "string" ? v.name.trim() : "";
  const email = typeof v.email === "string" ? v.email.trim() : "";
  if (name.length < 1 || name.length > 120) return null;
  if (!EMAIL_RE.test(email) || email.length > 160) return null;

  const company =
    typeof v.company === "string" ? v.company.trim().slice(0, 160) : "";
  const message =
    typeof v.message === "string" ? v.message.trim().slice(0, 2000) : "";

  if (!Array.isArray(v.items) || v.items.length < 1 || v.items.length > MAX_ITEMS)
    return null;

  const items: InquiryItemInput[] = [];
  for (const raw of v.items) {
    if (typeof raw !== "object" || raw === null) return null;
    const it = raw as Record<string, unknown>;
    const productId = typeof it.productId === "string" ? it.productId : "";
    const itemName = typeof it.name === "string" ? it.name : "";
    const quantity = Number(it.quantity);
    if (!itemName || !Number.isFinite(quantity) || quantity < 1) return null;
    items.push({
      productId,
      name: itemName.slice(0, 200),
      material: typeof it.material === "string" ? it.material : undefined,
      priceFrom: Number.isFinite(Number(it.priceFrom))
        ? Number(it.priceFrom)
        : undefined,
      minOrder: Number.isFinite(Number(it.minOrder))
        ? Number(it.minOrder)
        : undefined,
      quantity: Math.round(quantity),
    });
  }

  return { name, email, company, message, items };
}

// Persists a wholesale inquiry (lead + items) via the security-definer
// submit_inquiry RPC. Runs in addition to the WhatsApp/email handoff: if the
// backend is not configured yet, it no-ops cleanly so the handoff still carries
// the lead.
export async function submitInquiry(
  input: InquiryInput,
): Promise<SubmitInquiryResult> {
  const parsed = validate(input);
  if (!parsed) {
    return { ok: false, error: "Please check your name, email and item list." };
  }

  if (!isConfigured()) {
    return { ok: true, id: null, persisted: false };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("submit_inquiry", {
      p_name: parsed.name,
      p_email: parsed.email,
      p_company: parsed.company ?? "",
      p_message: parsed.message ?? "",
      p_items: parsed.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        material: i.material ?? "",
        priceFrom: i.priceFrom ?? null,
        minOrder: i.minOrder ?? null,
        quantity: i.quantity,
      })),
    });

    if (error) {
      return {
        ok: false,
        error:
          "We could not save your inquiry. Please use the WhatsApp or email option below.",
      };
    }

    return { ok: true, id: (data as string) ?? null, persisted: true };
  } catch {
    return {
      ok: false,
      error:
        "Something went wrong saving your inquiry. Please try WhatsApp or email.",
    };
  }
}
