import type { Metal } from "@/lib/data";

const METAL_CLASS: Record<Metal, string> = {
  silver: "metal-silver",
  gold: "metal-gold",
  brass: "metal-brass",
  bronze: "metal-bronze",
};

interface MetalTileProps {
  metal: Metal;
  label?: string;
  className?: string;
  rounded?: string;
}

/**
 * Designed metallic placeholder standing in for product photography.
 * Reads as an intentional silver/gold/bronze surface with a hover shimmer.
 */
export function MetalTile({
  metal,
  label,
  className = "",
  rounded = "rounded-2xl",
}: MetalTileProps) {
  return (
    <div
      className={`relative overflow-hidden ${rounded} ${METAL_CLASS[metal]} shimmer ${className}`}
      aria-hidden={!label}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <div className="absolute inset-0 mix-blend-overlay opacity-30 [background-image:radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] [background-size:14px_14px]" />
    </div>
  );
}
