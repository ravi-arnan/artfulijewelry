"use client";

import { useState, useTransition } from "react";
import {
  updateInquiryStatus,
  type InquiryStatus,
} from "@/app/actions/admin";

interface InquiryStatusControlProps {
  id: string;
  status: InquiryStatus;
}

const OPTIONS: InquiryStatus[] = ["new", "contacted", "closed"];

export function InquiryStatusControl({
  id,
  status: initial,
}: InquiryStatusControlProps) {
  const [status, setStatus] = useState<InquiryStatus>(initial);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as InquiryStatus;
    const previous = status;
    setStatus(next);
    setError(false);
    startTransition(async () => {
      const result = await updateInquiryStatus(id, next);
      if (!result.ok) {
        setStatus(previous);
        setError(true);
      }
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <label className="sr-only" htmlFor={`status-${id}`}>
        Inquiry status
      </label>
      <select
        id={`status-${id}`}
        value={status}
        onChange={handleChange}
        disabled={pending}
        className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-ink focus:border-gold focus:outline-none disabled:opacity-60"
      >
        {OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-700">failed</span>}
    </span>
  );
}
