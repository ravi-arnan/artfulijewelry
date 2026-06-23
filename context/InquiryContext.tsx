"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Product } from "@/lib/data";
import { type InquiryItem, toInquiryItem } from "@/lib/inquiry";

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
