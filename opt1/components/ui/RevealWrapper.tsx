"use client";

import { useReveal } from "@/hooks/useReveal";

interface RevealWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** Applies the `.rise` reveal animation when scrolled into view. */
export function RevealWrapper({
  children,
  className = "",
  delay = 0,
}: RevealWrapperProps) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${revealed ? "rise" : "opacity-0"} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
