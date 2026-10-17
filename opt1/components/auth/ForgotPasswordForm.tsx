"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fieldClass } from "./authStyles";

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!CONFIGURED) {
      setError("Accounts are not enabled yet. Please check back soon.");
      return;
    }
    startTransition(async () => {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paper-deep">
          <MailCheck className="h-6 w-6 text-gold-deep" />
        </div>
        <h2 className="mt-5 font-display text-2xl text-ink">Check your email</h2>
        <p className="mt-2 text-sm text-ink-soft">
          If an account exists for <strong>{email}</strong>, we sent a link to
          reset your password.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex text-sm text-gold-deep hover:underline"
        >
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={fieldClass}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full bg-espresso px-7 py-3 text-sm font-medium text-paper transition-colors hover:bg-espresso-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Send reset link
      </button>

      <p className="text-center text-sm text-ink-soft">
        Remembered it?{" "}
        <Link href="/login" className="text-gold-deep hover:underline">
          Back to log in
        </Link>
      </p>
    </form>
  );
}
