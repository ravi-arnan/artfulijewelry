"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";

interface LocaleCurrencySwitcherProps {
  className?: string;
  compact?: boolean;
}

export function LocaleCurrencySwitcher({
  className = "",
  compact = false,
}: LocaleCurrencySwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  const handleLanguageChange = (nextLang: "en" | "id") => {
    setLanguage(nextLang);
    // Auto-align default pairing: EN with USD, ID with IDR
    if (nextLang === "id" && currency === "USD") {
      setCurrency("IDR");
    } else if (nextLang === "en" && currency === "IDR") {
      setCurrency("USD");
    }
  };

  return (
    <div
      className={`locale-currency-bar ${compact ? "is-compact" : ""} ${className}`}
      role="region"
      aria-label="Language and Currency Preferences"
    >
      {/* Language Selector */}
      <div className="locale-segment" role="group" aria-label="Select Language">
        <button
          type="button"
          onClick={() => handleLanguageChange("en")}
          className={`locale-btn ${language === "en" ? "is-active" : ""}`}
          aria-pressed={language === "en"}
          title="English"
        >
          EN
        </button>
        <span className="locale-sep" aria-hidden="true">
          /
        </span>
        <button
          type="button"
          onClick={() => handleLanguageChange("id")}
          className={`locale-btn ${language === "id" ? "is-active" : ""}`}
          aria-pressed={language === "id"}
          title="Bahasa Indonesia"
        >
          ID
        </button>
      </div>

      <span className="locale-dot" aria-hidden="true">
        ·
      </span>

      {/* Currency Selector */}
      <div className="locale-segment" role="group" aria-label="Select Currency">
        <button
          type="button"
          onClick={() => setCurrency("USD")}
          className={`locale-btn ${currency === "USD" ? "is-active" : ""}`}
          aria-pressed={currency === "USD"}
          title="US Dollar ($)"
        >
          USD
        </button>
        <span className="locale-sep" aria-hidden="true">
          /
        </span>
        <button
          type="button"
          onClick={() => setCurrency("IDR")}
          className={`locale-btn ${currency === "IDR" ? "is-active" : ""}`}
          aria-pressed={currency === "IDR"}
          title="Indonesian Rupiah (Rp)"
        >
          IDR
        </button>
      </div>
    </div>
  );
}
