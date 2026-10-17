"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { FINISHES, FTC_VERMEIL_NOTE } from "@/lib/data";

export function FinishSelector() {
  const [active, setActive] = useState(FINISHES[0].code);
  const selected = FINISHES.find((f) => f.code === active) ?? FINISHES[0];

  return (
    <div className="mt-8 border-t border-line pt-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs uppercase tracking-widest text-ink-soft">
          Available finishes
        </h2>
        <span className="text-xs text-ink-soft">made to order</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {FINISHES.map((f) => {
          const isActive = f.code === active;
          return (
            <button
              key={f.code}
              type="button"
              onClick={() => setActive(f.code)}
              aria-pressed={isActive}
              title={f.name}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-espresso text-paper"
                  : "border border-line text-ink-soft hover:border-gold hover:text-gold-deep"
              }`}
            >
              <span
                className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                style={{ background: f.swatch }}
                aria-hidden
              />
              {f.code}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-sm text-ink-soft">
        <span className="font-medium text-ink">{selected.name}.</span>{" "}
        {selected.description}
      </p>

      {selected.code === "VR" && (
        <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" aria-hidden />
          {FTC_VERMEIL_NOTE}
        </p>
      )}
    </div>
  );
}
