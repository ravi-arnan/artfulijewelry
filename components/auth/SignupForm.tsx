"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fieldClass } from "./authStyles";

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!CONFIGURED) {
      setError("Accounts are not enabled yet. Please check back soon.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    startTransition(async () => {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { company: company.trim() || null } },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      // Email confirmation enabled -> no session yet.
      if (!data.session) {
        setCheckEmail(true);
        return;
      }
      // Best-effort: store company on the profile row created by the trigger.
      if (company.trim() && data.user) {
        await supabase
          .from("profiles")
          .update({ company: company.trim() })
          .eq("id", data.user.id);
      }
      router.push("/");
      router.refresh();
    });
  }

  if (checkEmail) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paper-deep">
          <MailCheck className="h-6 w-6 text-gold-deep" />
        </div>
        <h2 className="mt-5 font-display text-2xl text-ink">Confirm your email</h2>
        <p className="mt-2 text-sm text-ink-soft">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your wholesale account, then log in.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex text-sm text-gold-deep hover:underline"
        >
          Go to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="company" className="mb-1.5 block text-sm text-ink">
          Company <span className="text-ink-soft">(optional)</span>
        </label>
        <input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
          className={fieldClass}
        />
      </div>
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
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm text-ink">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={6}
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
        Create account
      </button>

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="text-gold-deep hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
