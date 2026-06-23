import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { getAdminContext } from "@/lib/supabase/adminContext";
import {
  ProductEditRow,
  type EditableProduct,
} from "@/components/admin/ProductEditRow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false },
};

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const PAGE_SIZE = 50;
const COLUMNS = "id,name,category_slug,metal,price_from,min_order,is_new,is_sale";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!CONFIGURED) {
    return <p className="text-ink-soft">Backend is not configured.</p>;
  }

  const { supabase, user, isAdmin } = await getAdminContext();
  if (!user) redirect("/login?next=/admin/products");
  if (!isAdmin) {
    return (
      <p className="text-ink-soft">This area is for store administrators only.</p>
    );
  }

  const q = (await searchParams).q?.trim() ?? "";

  let query = supabase.from("products").select(COLUMNS);
  if (q) {
    // Escape PostgREST's reserved characters in the user term before ilike.
    const term = q.replace(/[%,()]/g, " ");
    query = query.or(`name.ilike.%${term}%,id.ilike.%${term}%`);
  }
  const { data } = await query.order("id", { ascending: true }).limit(PAGE_SIZE);
  const products = (data ?? []) as EditableProduct[];

  return (
    <>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Dashboard
      </Link>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Products</h1>
      <p className="mt-2 text-ink-soft">
        Edit wholesale price, minimum order, and the New / On sale flags. Changes
        surface on the storefront after the next deploy.
      </p>

      <form method="get" className="mt-6 max-w-md">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden
          />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name or ID"
            className="w-full rounded-full border border-line bg-paper py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-gold focus:outline-none"
          />
        </label>
      </form>

      <p className="mt-5 text-xs uppercase tracking-widest text-ink-soft">
        {q ? `Results for "${q}"` : "All products"} · showing {products.length}
        {products.length === PAGE_SIZE ? ` (first ${PAGE_SIZE}, refine your search)` : ""}
      </p>

      {products.length === 0 ? (
        <p className="mt-6 text-ink-soft">No products match that search.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {products.map((product) => (
            <ProductEditRow key={product.id} product={product} />
          ))}
        </ul>
      )}
    </>
  );
}
