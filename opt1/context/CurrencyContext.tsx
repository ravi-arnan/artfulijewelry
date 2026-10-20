"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Currency,
  DEFAULT_CURRENCY,
  formatCurrency,
  PriceHolders,
  resolveProductPrice,
} from "@/lib/currency";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (amount: number) => string;
  resolvePrice: (item: PriceHolders) => { amount: number; formatted: string };
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const STORAGE_KEY = "artfuli_currency";
const COOKIE_NAME = "artfuli_currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

  useEffect(() => {
    // Read from localStorage or cookie on client mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Currency | null;
      if (stored === "IDR" || stored === "USD") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrencyState(stored);
        return;
      }
      const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
      if (match && (match[2] === "IDR" || match[2] === "USD")) {
         
        setCurrencyState(match[2] as Currency);
      }
    } catch {
      // Storage access may fail in restricted iframes
    }
  }, []);

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `${COOKIE_NAME}=${next};path=/;max-age=31536000;SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  const toggleCurrency = () => {
    setCurrency(currency === "USD" ? "IDR" : "USD");
  };

  const formatPrice = (amount: number) => {
    return formatCurrency(amount, currency);
  };

  const resolvePrice = (item: PriceHolders) => {
    return resolveProductPrice(item, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        formatPrice,
        resolvePrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
