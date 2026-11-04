import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getAllProducts } from "@/lib/products";
import {
  ProductEditRow,
  type EditableProduct,
} from "@/components/admin/ProductEditRow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false },
};

const PAGE_SIZE = 50;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login?next=/admin/products");

  const q = (await searchParams).q?.trim().toLowerCase() ?? "";

  const allProducts = await getAllProducts();
  const filtered = q
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.metal.toLowerCase().includes(q),
      )
    : allProducts;

  const products: EditableProduct[] = filtered.slice(0, PAGE_SIZE).map((p) => ({
    id: p.id,
    name: p.name,
    category_slug: p.category ?? null,
    metal: p.metal,
    price_from: p.priceFrom ?? 0,
    min_order: p.minOrder ?? 1,
    is_new: Boolean(p.isNew),
    is_sale: Boolean(p.isSale),
  }));

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
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden
          />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name, metal, or ID..."
            className="w-full rounded-full border border-line bg-paper py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </label>
      </form>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_18px_48px_-30px_rgba(60,45,30,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper-deep/60 text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Metal</th>
                <th className="px-5 py-3.5">Price from ($)</th>
                <th className="px-5 py-3.5">Min order</th>
                <th className="px-5 py-3.5 text-center">New</th>
                <th className="px-5 py-3.5 text-center">On sale</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-ink-soft">
                    {q ? "No products matching your search." : "No products found."}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <ProductEditRow key={product.id} product={product} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
