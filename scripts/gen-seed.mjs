// Generates supabase/seed.sql from the generated catalog files.
// The generated arrays are emitted as JSON literals, so we extract and parse them.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function extractArray(file, constName) {
  const text = readFileSync(join(root, file), "utf8");
  const marker = text.indexOf("=", text.indexOf(constName));
  const start = text.indexOf("[", marker);
  // find matching close bracket (arrays here contain no bracket chars in strings)
  let depth = 0;
  let end = -1;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "[") depth++;
    else if (text[i] === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  return JSON.parse(text.slice(start, end + 1));
}

const q = (v) =>
  v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`;
const b = (v) => (v ? "true" : "false");
const n = (v) => (v === null || v === undefined ? "null" : Number(v));

const categories = extractArray("lib/catalog.categories.generated.ts", "CATEGORIES");
const products = extractArray("lib/catalog.products.generated.ts", "PRODUCTS");

const FINISHES = [
  ["BR", "Bright Silver", "Polished 925 sterling in its natural bright finish.", "oklch(82% 0.01 250)", 0],
  ["VR", "Gold Vermeil", "24K gold layered over sterling to the FTC vermeil standard.", "oklch(74% 0.1 80)", 1],
  ["RG", "Rose Gold", "18K rose-gold plating for a warm pink tone.", "oklch(72% 0.09 40)", 2],
  ["WG", "White Gold", "Rhodium plated for a bright, cool white-gold look.", "oklch(88% 0.006 250)", 3],
  ["BG", "Black Gold", "Black rhodium plating for a dark, contemporary finish.", "oklch(30% 0.01 250)", 4],
  ["BSO", "Black Oxidised", "Solid black oxidation that deepens detail and patina.", "oklch(25% 0.015 60)", 5],
];

let sql = "-- AUTO-GENERATED seed. Run after 0001_init.sql.\nbegin;\n\n";

categories.forEach((c, i) => {
  sql += `insert into public.categories (slug,name,blurb,metal,image,item_count,sort) values (${q(c.slug)},${q(c.name)},${q(c.blurb)},${q(c.metal)},${q(c.image ?? null)},${n(c.itemCount)},${i}) on conflict (slug) do update set name=excluded.name, blurb=excluded.blurb, metal=excluded.metal, image=excluded.image, item_count=excluded.item_count, sort=excluded.sort;\n`;
});
sql += "\n";

FINISHES.forEach(([code, name, desc, swatch, sort]) => {
  sql += `insert into public.finishes (code,name,description,swatch,sort) values (${q(code)},${q(name)},${q(desc)},${q(swatch)},${sort}) on conflict (code) do update set name=excluded.name, description=excluded.description, swatch=excluded.swatch, sort=excluded.sort;\n`;
});
sql += "\n";

products.forEach((p) => {
  sql += `insert into public.products (id,name,category_slug,metal,material,price_from,min_order,image,is_new,is_sale) values (${q(p.id)},${q(p.name)},${q(p.category)},${q(p.metal)},${q(p.material)},${n(p.priceFrom)},${n(p.minOrder)},${q(p.image ?? null)},${b(p.isNew)},${b(p.isSale)}) on conflict (id) do update set name=excluded.name, category_slug=excluded.category_slug, metal=excluded.metal, material=excluded.material, price_from=excluded.price_from, min_order=excluded.min_order, image=excluded.image, is_new=excluded.is_new, is_sale=excluded.is_sale;\n`;
});

sql += "\ncommit;\n";

writeFileSync(join(root, "supabase/seed.sql"), sql);
console.log(`seed.sql written: ${categories.length} categories, ${FINISHES.length} finishes, ${products.length} products`);
