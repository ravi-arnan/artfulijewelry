"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fieldClass } from "@/components/auth/authStyles";

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

function sanitizeNext(raw: string | null): string {
  if (
    !raw ||
    !raw.startsWith("/") ||
    raw.startsWith("//") ||
    raw.includes("\\") ||
    raw.startsWith("/\\")
  ) {
    return "/admin";
  }
  return raw;
}

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeNext(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!CONFIGURED) {
      setError(
        "Supabase authentication is not configured in this environment. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable administrator login.",
      );
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message || "Invalid administrator credentials.");
        return;
      }

      if (data.user) {
        router.push(next);
        router.refresh();
      }
    });
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-paper-deep/50 p-8 shadow-[0_20px_50px_-25px_rgba(40,30,20,0.25)] backdrop-blur-sm sm:p-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-gold-deep">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          <span>Atelier Backoffice</span>
        </div>
        <h1 className="font-display text-2xl font-normal tracking-tight text-ink sm:text-3xl">
          Admin Console
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft sm:text-sm">
          Sign in with authorized administrator credentials to manage inquiries,
          catalog pricing, and atelier orders.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="admin-email"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-soft"
          >
            Administrator Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="admin@bali-handmade.com"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-soft"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            className={fieldClass}
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs leading-relaxed text-red-700"
          >
            {error}
          </div>
        )}

        {!CONFIGURED && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[0.75rem] leading-relaxed text-amber-900">
            <span className="font-semibold">Local Environment Notice:</span>{" "}
            Supabase auth keys are not set. Add{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[0.7rem] text-amber-950">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            to <code className="font-mono text-[0.7rem]">.env.local</code> to activate live login.
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-espresso px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-espresso-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-gold" aria-hidden />
              <span>Enter Admin Dashboard</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-line/80 pt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-ink-soft transition-colors hover:text-ink hover:underline"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden />
          <span>Return to Public Storefront</span>
        </Link>
      </div>
    </div>
  );
}
