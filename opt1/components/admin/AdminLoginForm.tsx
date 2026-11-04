"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowDown,
  Check,
  Eye,
  EyeOff,
  Loader2,
  MessageSquare,
  X,
} from "lucide-react";
import { loginAdminAction } from "@/app/actions/adminAuth";

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

  const oauthError = searchParams.get("error");
  const oauthEmail = searchParams.get("email");

  let initialError: string | null = null;
  if (oauthError === "google_not_configured") {
    initialError =
      "Google SSO requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local. Please sign in with your administrator password below.";
  } else if (oauthError === "unauthorized_email") {
    initialError = `Account ${oauthEmail ? `(${oauthEmail})` : ""} is not in the authorized administrator whitelist.`;
  } else if (oauthError === "oauth_failed" || oauthError === "invalid_state") {
    initialError = "Google sign-in was cancelled or failed. Please try again.";
  }

  const [email, setEmail] = useState("admin@bali-handmade.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await loginAdminAction(password);
      if (!res.ok) {
        setError(res.error || "Password administrator salah.");
        return;
      }

      router.push(next);
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-screen w-full bg-white font-sans overflow-hidden relative selection:bg-neutral-200">
      {/* Brand Header Floating Top Left: Emblem + Artfuli Jewelry Wordmark seperti di Navbar */}
      <div className="absolute top-7 left-7 z-50">
        <Link
          href="/"
          className="flex items-center gap-3 px-2 py-1.5 transition-opacity hover:opacity-90"
          aria-label="Artfuli Jewelry Storefront"
        >
          <img
            src="/images/artfuli-emblem.png"
            alt="Artfuli Balinese Spiral Emblem"
            className="h-10 w-10 object-contain"
          />
          <img
            src="/images/artfuli-wordmark.png"
            alt="Artfuli Jewelry"
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      {/* SISI KIRI: Form Area (Centered 50% dengan jarak terukur presisi) */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center px-6 sm:px-12 lg:px-16 pt-24 pb-8 lg:py-16 relative z-20 bg-white min-h-screen h-screen overflow-y-auto">
        <div className="w-full max-w-[380px] flex flex-col">
          {/* 1. Welcome Heading Group */}
          <div className="text-left" style={{ marginBottom: "32px" }}>
            <h1 className="text-[36px] font-normal text-[#111827] tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-[14px] text-[#6B7280] leading-relaxed">
              Please sign in to your account
            </p>
          </div>

          {/* 2. Continue with Google */}
          <div>
            <a
              href="/api/auth/google"
              className="h-[52px] cursor-pointer w-full flex items-center justify-center gap-3 bg-white border border-[#E0E0E0] hover:border-[#C8C8C8] hover:bg-[#FAFAFA] text-[#111827] font-medium rounded-[16px] transition-all active:scale-[0.98] text-[15px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] no-underline"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </a>

            {/* 3. Divider 'or' dengan jarak vertikal lega yang terjamin */}
            <div
              className="flex items-center gap-3"
              style={{ marginTop: "24px", marginBottom: "28px" }}
            >
              <div className="flex-1 h-px bg-[#EBEBEB]" />
              <span className="text-[12px] text-[#9CA3AF] font-medium">or</span>
              <div className="flex-1 h-px bg-[#EBEBEB]" />
            </div>
          </div>

          {/* 4. Form Fields */}
          <form
            onSubmit={handleSubmit}
            method="POST"
            className="flex flex-col"
            style={{ gap: "20px" }}
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="admin-email"
                className="text-[12px] font-medium text-[#6B7280] ml-2 block"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email"
                className="h-[52px] w-full bg-[#F5F5F7] border-0 outline-none rounded-[16px] pl-7 pr-5 text-[14px] focus:ring-1 focus:ring-[#9CA3AF] transition-all placeholder:text-[#9CA3AF] text-[#111827]"
                style={{ paddingLeft: "26px", paddingRight: "20px" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="admin-password"
                className="text-[12px] font-medium text-[#6B7280] ml-2 block"
              >
                Password
              </label>
              <div className="relative group">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-[52px] w-full bg-[#F5F5F7] border-0 outline-none rounded-[16px] pl-7 pr-12 text-[14px] focus:ring-1 focus:ring-[#9CA3AF] transition-all placeholder:text-[#9CA3AF] text-[#111827]"
                  style={{ paddingLeft: "26px", paddingRight: "48px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" aria-hidden />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-[14px] border border-red-200 bg-red-50/90 p-3 text-xs leading-relaxed text-red-700"
              >
                {error}
              </div>
            )}

            {/* 5. Tombol Sign In dengan margin-top ekstra */}
            <div style={{ marginTop: "12px" }}>
              <button
                type="submit"
                disabled={pending}
                className="h-[52px] w-full bg-[#121212] hover:bg-black text-white font-medium rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98] text-[15px] cursor-pointer flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    <span>Signing In...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          {/* 6. Link Return to storefront */}
          <div
            className="text-center text-[13px] font-medium text-[#6B7280]"
            style={{ marginTop: "40px" }}
          >
            <Link
              href="/"
              className="text-[#6B7280] hover:text-[#111827] transition-colors inline-flex items-center gap-1.5"
            >
              &larr; Return to public storefront
            </Link>
          </div>
        </div>
      </div>

      {/* SISI KANAN: Oil Painting & Floating ICP Card (100% Identik Leedlime) */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-end ml-0 h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {/* Authentic Oil Painting Landscape */}
          <img
            src="/images/painting1.jpg"
            alt="Pastoral Oil Painting Background"
            className="h-full w-full object-cover"
          />

          {/* Floating Glassmorphic Card (Proporsi & Styling Presisi Leedlime) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[450px]">
            <div className="rounded-[28px] bg-white/35 p-2 backdrop-blur-md border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
              <div className="rounded-[20px] bg-white p-7 shadow-sm flex flex-col">
                {/* Top Section: ICP */}
                <h3 className="text-[11px] font-semibold tracking-widest text-[#a7a7bb] uppercase mb-4">
                  ICP
                </h3>
                <ul className="space-y-3.5 mb-6">
                  {["SaaS", "50-200 employees", "VP Sales", "Series A"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-3">
                        <Check
                          className="w-4 h-4 text-[#84cc16] shrink-0"
                          strokeWidth={3}
                          aria-hidden
                        />
                        <span className="text-[13px] font-medium text-[#4b5563]">
                          {item}
                        </span>
                      </li>
                    )
                  )}
                </ul>

                {/* Divider with Arrow Down */}
                <div className="relative flex items-center justify-center py-2 mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#f3f4f6]" />
                  </div>
                  <div className="relative bg-white border border-[#f3f4f6] rounded-full p-1.5 flex items-center justify-center shadow-xs">
                    <ArrowDown
                      className="w-3 h-3 text-[#d1d5db]"
                      aria-hidden
                    />
                  </div>
                </div>

                {/* Bottom Section: LEADS */}
                <h3 className="text-[11px] font-semibold tracking-widest text-[#a7a7bb] uppercase mb-4">
                  LEADS
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "John Welsh", match: "98% Match", ok: true },
                    { name: "Emily Woods", match: "95% Match", ok: true },
                    { name: "Jim Wharton", match: "92% Match", ok: true },
                    { name: "Sarah Connor", match: "89% Match", ok: true },
                    { name: "Joe Martin", match: "30% Match", ok: false },
                  ].map((lead) => (
                    <div
                      key={lead.name}
                      className="flex items-center justify-between border border-[#f3f4f6] rounded-[12px] p-3 shadow-xs bg-white"
                    >
                      <span className="text-[13px] font-medium text-[#4b5563]">
                        {lead.name}
                      </span>
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${
                          lead.ok
                            ? "bg-[#ecfccb]/70 text-[#65a30d]"
                            : "bg-[#ffe4e6]/70 text-[#e11d48]"
                        }`}
                      >
                        <span className="text-[11px] font-semibold">
                          {lead.match}
                        </span>
                        {lead.ok ? (
                          <Check
                            className="w-3 h-3"
                            strokeWidth={3}
                            aria-hidden
                          />
                        ) : (
                          <X
                            className="w-3 h-3"
                            strokeWidth={3}
                            aria-hidden
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Concierge Chat trigger Bottom Right */}
        <div className="absolute bottom-6 right-6 z-20">
          <a
            href="https://wa.me/6287883992277?text=Hello%20Bali%20Handmade"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct Atelier Concierge Support"
            className="w-12 h-12 bg-[#18181b] hover:bg-black rounded-full flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
