"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll via IntersectionObserver. Fires once, then disconnects.
 * Reduced-motion is handled globally in globals.css, so no JS guard needed.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, revealed };
}
