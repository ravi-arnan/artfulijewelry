"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LANGUAGE, getTranslation, Language } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "artfuli_language";
const COOKIE_NAME = "artfuli_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    // Read from localStorage or cookie on client mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === "en" || stored === "id") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguageState(stored);
        return;
      }
      const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
      if (match && (match[2] === "en" || match[2] === "id")) {
         
        setLanguageState(match[2] as Language);
      }
    } catch {
      // Storage access may fail in restricted iframes
    }
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `${COOKIE_NAME}=${next};path=/;max-age=31536000;SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  const t = (path: string, fallback?: string) => {
    return getTranslation(language, path, fallback);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
