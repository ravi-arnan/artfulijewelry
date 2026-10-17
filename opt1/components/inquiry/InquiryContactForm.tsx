"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import type { InquiryItem } from "@/lib/inquiry";
import { submitInquiry } from "@/app/actions/inquiry";
import { InquirySubmitButtons } from "./InquirySubmitButtons";

interface InquiryContactFormProps {
  items: InquiryItem[];
}

type Status =
  | { kind: "idle" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export function InquiryContactForm({ items }: InquiryContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "idle" });
    startTransition(async () => {
      const result = await submitInquiry({
        name,
        email,
        company,
        message,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          material: i.material,
          priceFrom: i.priceFrom,
          minOrder: i.minOrder,
          quantity: i.quantity,
        })),
      });
      if (result.ok) {
        setStatus({ kind: "saved" });
      } else {
        setStatus({ kind: "error", message: result.error });
      }
    });
  }

  const saved = status.kind === "saved";

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label htmlFor="inq-name" className="sr-only">
            Your name
          </label>
          <input
            id="inq-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Your name"
            className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div>
          <label htmlFor="inq-email" className="sr-only">
            Email address
          </label>
          <input
            id="inq-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="Email address"
            className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div>
          <label htmlFor="inq-company" className="sr-only">
            Company (optional)
          </label>
          <input
            id="inq-company"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="organization"
            placeholder="Company (optional)"
            className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div>
          <label htmlFor="inq-message" className="sr-only">
            Message (optional)
          </label>
          <textarea
            id="inq-message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Notes for your quote (optional)"
            className="w-full resize-none rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-espresso px-7 py-3 text-sm font-medium text-paper transition-colors hover:bg-espresso-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending.
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4" />
              Inquiry sent
            </>
          ) : (
            "Send inquiry"
          )}
        </button>
      </form>

      <div aria-live="polite" className="mt-3 min-h-[1.25rem] text-xs">
        {status.kind === "saved" && (
          <p className="text-ink-soft">
            Thank you. Our team will reply with availability and shipping. You can
            also reach us directly below.
          </p>
        )}
        {status.kind === "error" && (
          <p className="text-red-700">{status.message}</p>
        )}
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ink-soft">
          Or send directly
        </p>
        <InquirySubmitButtons items={items} />
      </div>
    </div>
  );
}
