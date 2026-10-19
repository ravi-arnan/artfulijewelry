export type Currency = "IDR" | "USD";

export const DEFAULT_CURRENCY: Currency = "USD";

// Fallback conversion rate if discrete prices are missing (e.g. legacy items)
export const USD_TO_IDR_RATE = 16000;

/**
 * Format an amount in the specified currency.
 * IDR: Rp 750.000 (no decimals)
 * USD: $48 or $48.50 (shows 2 decimal places if cents exist, otherwise clean integer)
 */
export function formatCurrency(amount: number, currency: Currency): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return currency === "IDR" ? "Rp 0" : "$0";
  }

  if (currency === "IDR") {
    const rounded = Math.round(amount);
    const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `Rp ${formatted}`;
  }

  const hasCents = amount % 1 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export interface PriceHolders {
  priceIdr?: number | null;
  priceUsd?: number | null;
  priceFrom?: number | null;
}

/**
 * Resolves discrete pricing first (priceIdr / priceUsd),
 * falling back to converting priceFrom using the standard rate.
 */
export function resolveProductPrice(
  item: PriceHolders,
  currency: Currency
): { amount: number; formatted: string } {
  let amount = 0;

  if (currency === "IDR") {
    if (typeof item.priceIdr === "number" && item.priceIdr > 0) {
      amount = item.priceIdr;
    } else if (typeof item.priceUsd === "number" && item.priceUsd > 0) {
      amount = Math.round(item.priceUsd * USD_TO_IDR_RATE);
    } else if (typeof item.priceFrom === "number" && item.priceFrom > 0) {
      amount = Math.round(item.priceFrom * USD_TO_IDR_RATE);
    }
  } else {
    if (typeof item.priceUsd === "number" && item.priceUsd > 0) {
      amount = item.priceUsd;
    } else if (typeof item.priceIdr === "number" && item.priceIdr > 0) {
      amount = Math.round((item.priceIdr / USD_TO_IDR_RATE) * 100) / 100;
    } else if (typeof item.priceFrom === "number" && item.priceFrom > 0) {
      amount = item.priceFrom;
    }
  }

  return {
    amount,
    formatted: formatCurrency(amount, currency),
  };
}
