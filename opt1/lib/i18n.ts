import en from "../locales/en.json" with { type: "json" };
import id from "../locales/id.json" with { type: "json" };

export type Language = "en" | "id";

export const DEFAULT_LANGUAGE: Language = "en";

export const DICTIONARIES = {
  en,
  id,
} as const;

/**
 * Access nested dictionary keys safely, e.g. "nav.collections" or "trust.guarantee_title"
 */
export function getTranslation(
  lang: Language,
  path: string,
  fallback?: string
): string {
  const dict = DICTIONARIES[lang] || DICTIONARIES.en;
  const parts = path.split(".");

  let current: unknown = dict;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      // Fallback to English dictionary if key missing in target language
      let fallbackCurrent: unknown = DICTIONARIES.en;
      for (const fallbackPart of parts) {
        if (
          fallbackCurrent &&
          typeof fallbackCurrent === "object" &&
          fallbackPart in fallbackCurrent
        ) {
          fallbackCurrent = (fallbackCurrent as Record<string, unknown>)[
            fallbackPart
          ];
        } else {
          return fallback || path;
        }
      }
      return typeof fallbackCurrent === "string"
        ? fallbackCurrent
        : fallback || path;
    }
  }

  return typeof current === "string" ? current : fallback || path;
}
