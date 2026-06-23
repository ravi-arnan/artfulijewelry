// Content model for the Bali Handmade redesign.
// Brand facts (contact, story) are taken from the live site. PRODUCTS and
// CATEGORIES are auto-generated from the live catalog in ./catalog.generated.ts
// (real names/images/categories; prices are synthesized placeholders).

export type Metal = "silver" | "gold" | "brass" | "bronze";

export interface Category {
  slug: string;
  name: string;
  blurb: string;
  metal: Metal;
  itemCount: number;
  subcategories: string[];
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  metal: Metal;
  material: string;
  priceFrom: number;
  minOrder: number;
  image?: string;
  isNew?: boolean;
  isSale?: boolean;
  isRestocked?: boolean;
  /** Defaults to true everywhere it is not explicitly set to false. */
  inStock?: boolean;
}

export interface Service {
  title: string;
  description: string;
}

export interface Finish {
  code: string;
  name: string;
  description: string;
  swatch: string; // CSS color for the swatch dot
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

// CATEGORIES is small and safe to ship to the client (used by the Header).
// PRODUCTS (the full ~928-item catalog) lives in lib/products.ts so it is only
// ever imported by Server Components — never bundled into client JS.
import { CATEGORIES } from "./catalog.categories.generated";
export { CATEGORIES };

export const BRAND = {
  name: "Bali Handmade",
  tagline: "Wholesale Prices for Everyone",
  slogan: "High quality with reasonable price",
  since: 2004,
  instagram: "@artfulijewelry",
  freeShippingThreshold: "$2,000",
} as const;

export const CONTACT = {
  whatsapp: [
    { label: "Fuli", number: "+62 878 8399 2277", href: "https://wa.me/6287883992277" },
    { label: "Fajar", number: "+62 812 399 2277", href: "https://wa.me/628123992277" },
  ],
  telegram: [
    { label: "Fuli", number: "+62 878 8399 2277", href: "https://t.me/+6287883992277" },
    { label: "Fajar", number: "+62 812 399 2277", href: "https://t.me/+628123992277" },
  ],
  emails: [
    { label: "Sales", address: "sales@bali-handmade.com" },
    { label: "Custom orders", address: "fulinandhina@gmail.com" },
    { label: "General", address: "balihandmade@gmail.com" },
  ],
  shipping: ["DHL", "EMS"],
} as const;

export const SERVICES: Service[] = [
  { title: "3D Design & CAD", description: "Turn a sketch or reference into a production-ready model with computerized design." },
  { title: "Casting", description: "Imported casting machines reproduce your master in silver, bronze or brass at volume." },
  { title: "Plating & Vermeil", description: "Gold, rhodium and vermeil finishes applied to any component or finished piece." },
  { title: "Engraving & Laser", description: "Computerized laser engraving for logos, hallmarks and personalization." },
  { title: "Micro & Stone Setting", description: "Pavé, micro and bezel setting by bench artisans for gemstone work." },
  { title: "Oxidation & Antiquing", description: "Oxidised, sandblasted and antique finishes to bring out detail and patina." },
];

export const VALUE_PROPS = [
  { title: "Solid 925 Sterling", text: "Every piece is cast and finished in genuine 925 sterling silver. No plating shortcuts." },
  { title: "Wholesale for Everyone", text: "Wholesale pricing for all buyers. No reseller licence or minimum account required." },
  { title: "Free Worldwide Shipping", text: `Free DHL/EMS shipping on orders above ${BRAND.freeShippingThreshold} to the US, Europe, Asia-Pacific and beyond.` },
  { title: "One-Stop Manufacturing", text: "From 3D design to casting, plating and stone setting under one roof since 2004." },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

// Top-level "lines" the live site exposes as umbrella groupings over several
// catalog categories (e.g. Fine Jewelry). Modelled as collections rather than
// duplicate categories so a product is never counted twice.
export interface Collection {
  slug: string;
  name: string;
  blurb: string;
  categorySlugs: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "fine-jewelry",
    name: "Fine Jewelry",
    blurb:
      "Finished sterling silver jewelry — rings, earrings, bracelets, necklaces and brooches, ready to wear or rebrand.",
    categorySlugs: ["rings", "earrings", "bracelets", "necklaces", "brooches"],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

// Finishes offered across the sterling range, made to order per piece.
export const FINISHES: Finish[] = [
  { code: "BR", name: "Bright Silver", description: "Polished 925 sterling in its natural bright finish.", swatch: "oklch(82% 0.01 250)" },
  { code: "VR", name: "Gold Vermeil", description: "24K gold layered over sterling to the FTC vermeil standard.", swatch: "oklch(74% 0.1 80)" },
  { code: "RG", name: "Rose Gold", description: "18K rose-gold plating for a warm pink tone.", swatch: "oklch(72% 0.09 40)" },
  { code: "WG", name: "White Gold", description: "Rhodium plated for a bright, cool white-gold look.", swatch: "oklch(88% 0.006 250)" },
  { code: "BG", name: "Black Gold", description: "Black rhodium plating for a dark, contemporary finish.", swatch: "oklch(30% 0.01 250)" },
  { code: "BSO", name: "Black Oxidised", description: "Solid black oxidation that deepens detail and patina.", swatch: "oklch(25% 0.015 60)" },
];

export const FTC_VERMEIL_NOTE =
  "Our vermeil meets the FTC standard: at least 100 millionths of an inch of fine gold over solid sterling silver.";

// Independent precious-metal assay (XRF scan) certificates offered as part of the
// one-stop service. Mirrors the live site's Certificate sub-section.
export interface Certificate {
  code: string;
  name: string;
  metal: string;
  description: string;
  swatch: string; // CSS color for the swatch dot
}

export const CERTIFICATES: Certificate[] = [
  {
    code: "GSC",
    name: "Gold Certificate",
    metal: "Yellow & White Gold",
    description:
      "XRF scan certificate documenting the karat and fineness of yellow- and white-gold pieces. Send the finished item and we return the assay report.",
    swatch: "oklch(74% 0.1 80)",
  },
  {
    code: "SSC",
    name: "Silver Certificate",
    metal: "925 Sterling Silver",
    description:
      "Assay scan certificate confirming solid 925 sterling content — proof of purity to pass on to your own customers.",
    swatch: "oklch(80% 0.012 250)",
  },
  {
    code: "PTSC",
    name: "Platinum Certificate",
    metal: "Platinum",
    description:
      "Independent scan certificate verifying platinum purity for fine and bridal work.",
    swatch: "oklch(86% 0.004 250)",
  },
  {
    code: "PLSC",
    name: "Palladium Certificate",
    metal: "Palladium",
    description:
      "Scan certificate documenting palladium content for white-metal and alloy pieces.",
    swatch: "oklch(78% 0.008 250)",
  },
];

// Illustrative testimonials for the redesign concept (not real customer quotes).
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The granulation work is genuinely hand-finished. Our customers can feel the difference, and the wholesale pricing lets us keep healthy margins.",
    name: "Marisa Lindqvist",
    role: "Founder, Nordic Silverworks",
  },
  {
    quote:
      "We send a sketch, they send back a production-ready sample in weeks. The one-stop casting and plating under one roof saves us so much coordination.",
    name: "Daniel Okafor",
    role: "Product Lead, Atelier Mara",
  },
  {
    quote:
      "Consistent quality across reorders, and the vermeil holds up. Twenty years in and they still reply on WhatsApp within the day.",
    name: "Priya Nair",
    role: "Buyer, Coastline Jewelry Co.",
  },
];
