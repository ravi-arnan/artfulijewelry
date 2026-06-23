"use client";

import Link from "next/link";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthNavProps {
  variant?: "icon" | "full";
  onNavigate?: () => void;
}

export function AuthNav({ variant = "icon", onNavigate }: AuthNavProps) {
  const { user, loading, signOut } = useAuth();

  if (loading) return null;

  if (variant === "full") {
    if (!user) {
      return (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/login"
            onClick={onNavigate}
            className="rounded-lg bg-paper-deep px-3 py-2 text-center text-sm text-ink"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            onClick={onNavigate}
            className="rounded-lg bg-espresso px-3 py-2 text-center text-sm text-paper"
          >
            Create account
          </Link>
        </div>
      );
    }
    return (
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-4">
        <span className="truncate text-sm text-ink-soft">{user.email}</span>
        <button
          type="button"
          onClick={() => {
            void signOut();
            onNavigate?.();
          }}
          className="inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-gold-deep"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        aria-label="Log in"
        className="rounded-full p-2 text-ink-soft transition-colors hover:text-gold-deep"
      >
        <LogIn className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      aria-label={`Signed in as ${user.email}. Sign out.`}
      title={`Signed in as ${user.email}`}
      className="rounded-full p-2 text-gold-deep transition-colors hover:text-espresso"
    >
      <UserRound className="h-5 w-5" />
    </button>
  );
}
