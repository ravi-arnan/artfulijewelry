"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { Product } from "@/lib/data";
import { type InquiryItem, toInquiryItem } from "@/lib/inquiry";
import { mergeCarts } from "@/lib/cart-merge";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

const SAVE_DEBOUNCE_MS = 800;

const STORAGE_KEY = "bh-inquiry";

function isValidItem(x: unknown): x is InquiryItem {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.productId === "string" &&
    typeof o.name === "string" &&
    typeof o.minOrder === "number" &&
    typeof o.quantity === "number" &&
    typeof o.priceFrom === "number"
  );
}

interface InquiryState {
  items: InquiryItem[];
  hydrated: boolean;
}

type InquiryAction =
  | { type: "ADD"; product: Product }
  | { type: "SET_QTY"; productId: string; quantity: number }
  | { type: "REMOVE"; productId: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: InquiryItem[] };

function reducer(state: InquiryState, action: InquiryAction): InquiryState {
  switch (action.type) {
    case "ADD": {
      if (state.items.some((i) => i.productId === action.product.id)) {
        return state;
      }
      return { ...state, items: [...state.items, toInquiryItem(action.product)] };
    }
    case "SET_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: Math.max(i.minOrder, Math.round(action.quantity) || i.minOrder) }
            : i,
        ),
      };
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.productId),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "HYDRATE":
      return { items: action.items, hydrated: true };
    default:
      return state;
  }
}

interface InquiryContextValue {
  items: InquiryItem[];
  itemCount: number;
  hydrated: boolean;
  isInInquiry: (productId: string) => boolean;
  add: (product: Product) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const InquiryContext = createContext<InquiryContextValue | null>(null);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], hydrated: false });
  const { user } = useAuth();

  // Latest items, readable inside the sign-in effect without making that effect
  // re-run on every cart change.
  const itemsRef = useRef(state.items);
  useEffect(() => {
    itemsRef.current = state.items;
  }, [state.items]);

  // Read persisted list once on mount (avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      const items = Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
      dispatch({ type: "HYDRATE", items });
    } catch {
      dispatch({ type: "HYDRATE", items: [] });
    }
  }, []);

  // Persist after hydration so the initial empty state never clobbers storage.
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // storage full or unavailable — non-fatal
    }
  }, [state.items, state.hydrated]);

  // Tracks which user's saved cart has been merged into local state, so the
  // one-time sign-in merge runs once per user and the save effect waits for it.
  const mergedUserRef = useRef<string | null>(null);

  // On sign-in: pull the saved cart, merge it with the local list, and adopt the
  // union. Guarded so it no-ops cleanly when signed out, offline, or before the
  // saved_carts migration is applied (the query simply errors and we keep local).
  useEffect(() => {
    if (!state.hydrated) return;
    if (!user) {
      mergedUserRef.current = null;
      return;
    }
    if (mergedUserRef.current === user.id) return;
    mergedUserRef.current = user.id;

    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("saved_carts")
          .select("items")
          .eq("user_id", user.id)
          .maybeSingle();
        if (error || cancelled || !data) return;
        const remote = Array.isArray(data.items)
          ? (data.items as unknown[]).filter(isValidItem)
          : [];
        if (remote.length === 0) return;
        dispatch({ type: "HYDRATE", items: mergeCarts(itemsRef.current, remote) });
      } catch {
        // Table missing / network error: stay on the local list.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, state.hydrated]);

  // While signed in (and after the initial merge), persist changes to the saved
  // cart, debounced. No-ops cleanly when the table is absent.
  useEffect(() => {
    if (!state.hydrated || !user) return;
    if (mergedUserRef.current !== user.id) return;
    const handle = setTimeout(() => {
      try {
        const supabase = createClient();
        void supabase
          .from("saved_carts")
          .upsert({
            user_id: user.id,
            items: state.items,
            updated_at: new Date().toISOString(),
          })
          .then(
            () => {},
            () => {},
          );
      } catch {
        // ignore
      }
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [state.items, state.hydrated, user]);

  const value = useMemo<InquiryContextValue>(
    () => ({
      items: state.items,
      itemCount: state.items.length,
      hydrated: state.hydrated,
      isInInquiry: (productId) =>
        state.items.some((i) => i.productId === productId),
      add: (product) => dispatch({ type: "ADD", product }),
      setQuantity: (productId, quantity) =>
        dispatch({ type: "SET_QTY", productId, quantity }),
      remove: (productId) => dispatch({ type: "REMOVE", productId }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state.items, state.hydrated],
  );

  return (
    <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
  );
}

export function useInquiry(): InquiryContextValue {
  const ctx = useContext(InquiryContext);
  if (!ctx) {
    throw new Error("useInquiry must be used within an InquiryProvider");
  }
  return ctx;
}
