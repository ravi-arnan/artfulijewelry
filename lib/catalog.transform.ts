// Pure, IO-free catalog transforms shared by the product loader and the tests.
// No "server-only" import here so it can run under `node --test`.
import type { Product } from "./data";

// The source catalog names are machine-generated and stutter badly, e.g.
//   "Caps Brass Brass Caps"               -> "Caps Brass"
//   "Silver Ring Mountings Silver Mountings" -> "Silver Ring Mountings"
//   "Alphabet Bronze Bronze Yellow Gold Bronze" -> "Alphabet Bronze Yellow Gold"
// Strategy: keep the first occurrence of each word (case-insensitive), collapse
// whitespace. Order and original casing of the first hit are preserved.
export function cleanName(name: string): string {
  const seen = new Set<string>();
  const words: string[] = [];
  for (const word of name.trim().split(/\s+/)) {
    const key = word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    words.push(word);
  }
  return words.join(" ");
}

// Deterministic hash so synthesized flags are stable across renders/builds.
export function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

// Taxonomy normalization applied to whatever source loaded (live Supabase or the
// generated seed) so the catalog is consistent everywhere. Idempotent: re-running
// on already-normalized data is a no-op.
//   - The source lumps brass + bronze under metal "bronze"; split by name.
//   - "Mountings" pieces are grouped into their own category.
//   - Stuttering machine names are de-duplicated.
export function normalize(products: Product[]): Product[] {
  return products.map((p) => {
    let metal = p.metal;
    let material = p.material;
    if (metal === "bronze") {
      if (/brass/i.test(p.name)) {
        metal = "brass";
        material = "Solid Brass";
      } else {
        material = "Solid Bronze";
      }
    }
    const category = /mountings/i.test(p.name) ? "mountings" : p.category;
    return { ...p, name: cleanName(p.name), metal, material, category };
  });
}

// Neither the generated seed nor the live products table currently carries
// stock/restock data, so synthesize stable placeholder flags here — for whatever
// source loaded — so the Restocked / Out-of-stock facets are demonstrable. Any
// value the source DOES provide is preserved (?? guards), so this becomes a no-op
// once real stock columns exist. Out-of-stock is rare; restocked never overlaps
// "new".
export function enrich(products: Product[]): Product[] {
  return products.map((p) => {
    const h = hashId(p.id);
    const inStock = p.inStock ?? h % 17 !== 0; // ~6% out of stock
    const isRestocked = p.isRestocked ?? (inStock && !p.isNew && h % 11 === 0);
    return { ...p, inStock, isRestocked };
  });
}
