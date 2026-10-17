// Subcategories derived from product names (the source catalog has no explicit
// subcategory field). A product belongs to the first subcategory whose keyword
// appears in its name. Pure module (type-only import) so it is testable and
// client-safe. Keep the most specific keywords first.
import type { Product } from "./data";

export interface Subcategory {
  slug: string;
  label: string;
  keywords: string[];
}

export const SUBCATEGORIES: Record<string, Subcategory[]> = {
  beads: [
    { slug: "round", label: "Round", keywords: ["round"] },
    { slug: "filigree", label: "Filigree", keywords: ["filigree"] },
    { slug: "large-hole", label: "Large Hole", keywords: ["large hole"] },
    { slug: "stamped", label: "Stamped", keywords: ["stamped"] },
    { slug: "cylinders", label: "Cylinders", keywords: ["cylinder"] },
    { slug: "brushed", label: "Brushed", keywords: ["brushed"] },
    { slug: "carved", label: "Carved", keywords: ["carved"] },
    { slug: "casted", label: "Casted", keywords: ["casted"] },
    { slug: "plain", label: "Plain", keywords: ["plain"] },
  ],
  caps: [
    { slug: "cones", label: "Cones", keywords: ["cone"] },
    { slug: "end-caps", label: "End Caps", keywords: ["end"] },
    { slug: "granulated", label: "Granulated", keywords: ["granulated"] },
    { slug: "wired", label: "Wired", keywords: ["wired"] },
    { slug: "lentil", label: "Lentil", keywords: ["lentil"] },
    { slug: "casted", label: "Casted", keywords: ["casted"] },
    { slug: "plain", label: "Plain", keywords: ["plain"] },
  ],
  charms: [
    { slug: "alphabet", label: "Alphabet", keywords: ["alphabet"] },
    { slug: "love", label: "Love", keywords: ["love"] },
    { slug: "animal", label: "Animal", keywords: ["animal"] },
    { slug: "nature", label: "Nature", keywords: ["nature"] },
    { slug: "angel", label: "Angel", keywords: ["angel"] },
    { slug: "fashion", label: "Fashion", keywords: ["fashion"] },
    { slug: "lacquer", label: "Lacquer", keywords: ["lacquer"] },
    { slug: "assorted", label: "Assorted", keywords: ["assorted"] },
    { slug: "fancy", label: "Fancy", keywords: ["fancy"] },
  ],
  clasps: [
    { slug: "toggles", label: "Toggles", keywords: ["toggle"] },
    { slug: "lobster-claw", label: "Lobster Claw", keywords: ["lobster"] },
    { slug: "hook", label: "Hook", keywords: ["hook"] },
    { slug: "ornament", label: "Ornament", keywords: ["ornament"] },
    { slug: "twisted", label: "Twisted", keywords: ["twisted"] },
    { slug: "multi-strand", label: "Multi Strand", keywords: ["multi strand", "multi"] },
    { slug: "wired", label: "Wired", keywords: ["wired"] },
    { slug: "simple", label: "Simple", keywords: ["simple"] },
  ],
  findings: [
    { slug: "connectors", label: "Connectors", keywords: ["connector"] },
    { slug: "bar", label: "Bar", keywords: ["bar"] },
    { slug: "bead-crimp", label: "Bead Crimp", keywords: ["crimp"] },
    { slug: "ear-nuts", label: "Ear Nuts", keywords: ["nut"] },
    { slug: "druzy", label: "Druzy", keywords: ["druzy"] },
    { slug: "component", label: "Component", keywords: ["component"] },
  ],
  mountings: [
    { slug: "ring-mountings", label: "Ring Mountings", keywords: ["ring"] },
    { slug: "bezel", label: "Bezel", keywords: ["bezel"] },
  ],
  spacers: [
    { slug: "connectors", label: "Connectors", keywords: ["connector"] },
    { slug: "granular", label: "Granular", keywords: ["granular"] },
    { slug: "wired", label: "Wired", keywords: ["wired"] },
    { slug: "flat", label: "Flat", keywords: ["flat"] },
    { slug: "plain", label: "Plain", keywords: ["plain"] },
  ],
  pendants: [
    { slug: "bails", label: "Bails", keywords: ["bail"] },
    { slug: "prayer-box", label: "Prayer Box", keywords: ["prayer", "box"] },
    { slug: "harmony", label: "Harmony Balls", keywords: ["harmony", "ball"] },
    { slug: "druzy", label: "Druzy", keywords: ["druzy"] },
  ],
  rings: [
    { slug: "earrings", label: "Earrings", keywords: ["earring"] },
    { slug: "jump-ring", label: "Jump Rings", keywords: ["jump"] },
    { slug: "springring", label: "Spring Rings", keywords: ["springring"] },
    { slug: "tribal", label: "Tribal", keywords: ["tribal"] },
  ],
  "wire-chains": [
    { slug: "byzantine", label: "Byzantine", keywords: ["byzantine"] },
    { slug: "snake", label: "Snake", keywords: ["snake"] },
    { slug: "earwires", label: "Earwires", keywords: ["earwire"] },
    { slug: "chain", label: "Chain", keywords: ["chain"] },
  ],
};

export function getSubcategories(category: string | null): Subcategory[] {
  if (!category) return [];
  return SUBCATEGORIES[category] ?? [];
}

export function deriveSubcategory(
  category: string,
  name: string,
): string | undefined {
  const subs = SUBCATEGORIES[category];
  if (!subs) return undefined;
  const lower = name.toLowerCase();
  for (const sub of subs) {
    if (sub.keywords.some((k) => lower.includes(k))) return sub.slug;
  }
  return undefined;
}

export function getProductSubcategory(product: Product): string | undefined {
  return deriveSubcategory(product.category, product.name);
}
