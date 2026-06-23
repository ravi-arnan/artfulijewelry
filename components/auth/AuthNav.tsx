"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, UserRound, ShoppingBag, CircleUser } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GoogleSignInButton } from "./GoogleSignInButton";

interface AuthNavProps {
  variant?: "icon" | "full";
  onNavigate?: () => void;
}

export function AuthNav({ variant = "icon", onNavigate }: AuthNavProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the account menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    onNavigate?.();
    router.refresh();
  }

  if (loading) return null;

  if (variant === "full") {
    if (!user) {
      return (
        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <GoogleSignInButton next="/" />
          <div className="grid grid-cols-2 gap-2">
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
        </div>
      );
    }
    return (
      <div className="mt-4 space-y-3 border-t border-line pt-4">
        <Link
          href="/account"
          onClick={onNavigate}
          className="flex items-center gap-2 text-sm text-ink transition-colors hover:text-gold-deep"
        >
          <CircleUser className="h-4 w-4" />
          <span className="truncate">{user.email}</span>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
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
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.email}`}
        className="rounded-full p-2 text-gold-deep transition-colors hover:text-espresso"
      >
        <UserRound className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-paper shadow-xl"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="text-xs text-ink-soft">Signed in as</p>
            <p className="truncate text-sm font-medium text-ink">{user.email}</p>
          </div>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm text-ink transition-colors hover:bg-paper-deep"
          >
            <CircleUser className="h-4 w-4 text-ink-soft" />
            My account
          </Link>
          <Link
            href="/inquiry"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm text-ink transition-colors hover:bg-paper-deep"
          >
            <ShoppingBag className="h-4 w-4 text-ink-soft" />
            My inquiry list
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 border-t border-line px-4 py-3 text-left text-sm text-ink transition-colors hover:bg-paper-deep"
          >
            <LogOut className="h-4 w-4 text-ink-soft" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
