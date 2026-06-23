"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const AuthContext = createContext<AuthState>({
  user: null,
  loading: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Only "loading" when there is a backend to ask; otherwise resolve to
  // logged-out immediately so the static site renders without flicker.
  const [loading, setLoading] = useState(CONFIGURED);

  const supabase = useMemo(() => (CONFIGURED ? createClient() : null), []);

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      signOut: async () => {
        await supabase?.auth.signOut();
      },
    }),
    [user, loading, supabase],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
