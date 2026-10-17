import { Truck } from "lucide-react";
import { BRAND } from "@/lib/data";

export function AnnouncementBar() {
  return (
    <div className="bg-espresso-deep text-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs tracking-wide">
        <Truck className="h-4 w-4 text-gold" aria-hidden />
        <span>
          Free worldwide DHL / EMS shipping on orders over{" "}
          {BRAND.freeShippingThreshold}. Wholesale pricing for everyone.
        </span>
      </div>
    </div>
  );
}
