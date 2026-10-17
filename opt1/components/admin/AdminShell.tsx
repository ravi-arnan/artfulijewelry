"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Dedicated chrome for the store admin console. Deliberately NOT the public
// SiteShell: no announcement bar, no shop navigation, no marketing footer. The
// dark espresso bar signals "you are in the back office", distinct from the
// light storefront.
export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="sticky top-0 z-40 border-b border-espresso-deep bg-espresso text-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-5">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="font-display text-lg leading-none tracking-tight">
                Bali Handmade
              </span>
              <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-gold">
                Admin
              </span>
            </Link>
            <nav className="hidden items-center gap-4 text-sm text-paper/70 sm:flex">
              <Link href="/admin" className="transition-colors hover:text-paper">
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="transition-colors hover:text-paper"
              >
                Products
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-paper/70 transition-colors hover:text-paper"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">View store</span>
            </Link>
            {user?.email && (
              <span className="hidden max-w-[14rem] truncate text-sm text-paper/50 md:inline">
                {user.email}
              </span>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1.5 text-sm text-paper transition-colors hover:bg-paper/20"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main id="content" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        {children}
      </main>

      <footer className="border-t border-line py-5 text-center text-xs text-ink-soft">
        Bali Handmade store admin. Internal use only.
      </footer>
    </div>
  );
}
