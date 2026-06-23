"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import type { Metal, Product } from "@/lib/data";
import { STATUS_KEYS, STATUS_LABEL, type StatusKey } from "@/lib/productStatus";
import { ProductCard } from "@/components/ui/ProductCard";

export type SortKey = "featured" | "price-asc" | "price-desc";
export type { StatusKey };

interface CategoryFacet {
  slug: string;
  name: string;
  count: number;
}

interface ShopCatalogProps {
  products: Product[];
  categories: CategoryFacet[];
  category: string | null;
  metal: Metal | null;
  sort: SortKey;
  status: StatusKey | null;
  page: number;
  pageSize: number;
  total: number;
  headingOverride?: { eyebrow: string; title: string; blurb: string };
}

type HrefState = {
  category: string | null;
  metal: Metal | null;
  sort: SortKey;
  status: StatusKey | null;
  page: number;
};

const METALS: { key: Metal; label: string }[] = [
  { key: "silver", label: "Silver" },
  { key: "gold", label: "Gold" },
  { key: "brass", label: "Brass" },
  { key: "bronze", label: "Bronze" },
];

function buildHref(base: HrefState, changes: Partial<HrefState>): string {
  const next = { ...base, ...changes };
  const sp = new URLSearchParams();
  if (next.category) sp.set("category", next.category);
  if (next.metal) sp.set("metal", next.metal);
  if (next.status) sp.set("status", next.status);
  if (next.sort && next.sort !== "featured") sp.set("sort", next.sort);
  if (next.page && next.page > 1) sp.set("page", String(next.page));
  const qs = sp.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

const STATUS_COPY: Record<StatusKey, { eyebrow: string; title: string; blurb: string }> = {
  new: {
    eyebrow: "Fresh from the bench",
    title: "New arrivals",
    blurb: "The latest designs added to the catalog, at wholesale prices.",
  },
  sale: {
    eyebrow: "Limited",
    title: "On sale",
    blurb: "Current wholesale offers across the collection.",
  },
  restocked: {
    eyebrow: "Back in stock",
    title: "Restocked",
    blurb: "Popular designs we have just produced again and are ready to ship.",
  },
  "out-of-stock": {
    eyebrow: "Made to order",
    title: "Out of stock",
    blurb: "Currently between runs, message us to reserve the next batch.",
  },
};

export function ShopCatalog({
  products,
  categories,
  category,
  metal,
  sort,
  status,
  page,
  pageSize,
  total,
  headingOverride,
}: ShopCatalogProps) {
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilters = (category ? 1 : 0) + (metal ? 1 : 0) + (status ? 1 : 0);
  const base: HrefState = { category, metal, sort, status, page };
  const heading = headingOverride ?? (status ? STATUS_COPY[status] : null);
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const firstShown = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastShown = Math.min(page * pageSize, total);

  // Precompute chip props (href + active) outside JSX to keep attributes simple.
  const metalChips = [
    { label: "All metals", href: buildHref(base, { metal: null, page: 1 }), active: metal === null },
    ...METALS.map((m) => {
      const nextMetal = metal === m.key ? null : m.key;
      return { label: m.label, href: buildHref(base, { metal: nextMetal, page: 1 }), active: metal === m.key };
    }),
  ];
  const categoryChips = [
    { label: "All categories", href: buildHref(base, { category: null, page: 1 }), active: category === null },
    ...categories.map((c) => {
      const nextCategory = category === c.slug ? null : c.slug;
      return {
        label: `${c.name} (${c.count})`,
        href: buildHref(base, { category: nextCategory, page: 1 }),
        active: category === c.slug,
      };
    }),
  ];
  const statusChips = [
    { label: "All items", href: buildHref(base, { status: null, page: 1 }), active: status === null },
    ...STATUS_KEYS.map((s) => {
      const nextStatus = status === s ? null : s;
      return { label: STATUS_LABEL[s], href: buildHref(base, { status: nextStatus, page: 1 }), active: status === s };
    }),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="border-b border-line pb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
          {heading ? heading.eyebrow : "Wholesale catalog"}
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          {heading ? heading.title : "Shop the collection"}
        </h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          {heading
            ? heading.blurb
            : "Browse handmade sterling silver, gold and bronze components. Prices shown are wholesale, available to everyone."}
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="shop-filters-panel"
            className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 text-sm font-medium text-ink lg:pointer-events-none lg:border-0 lg:px-0 lg:py-0"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gold-deep" />
              Filters
              {activeFilters > 0 && (
                <span className="rounded-full bg-gold px-2 py-0.5 text-xs text-espresso-deep">
                  {activeFilters}
                </span>
              )}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform lg:hidden ${filtersOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            id="shop-filters-panel"
            className={`${filtersOpen ? "block" : "hidden"} lg:block`}
          >
            <FilterGroup label="Metal">
              {metalChips.map((ch) => (
                <FilterChip key={ch.label} href={ch.href} active={ch.active}>
                  {ch.label}
                </FilterChip>
              ))}
            </FilterGroup>

            <FilterGroup label="Category">
              {categoryChips.map((ch) => (
                <FilterChip key={ch.label} href={ch.href} active={ch.active}>
                  {ch.label}
                </FilterChip>
              ))}
            </FilterGroup>

            <FilterGroup label="Availability">
              {statusChips.map((ch) => (
                <FilterChip key={ch.label} href={ch.href} active={ch.active}>
                  {ch.label}
                </FilterChip>
              ))}
            </FilterGroup>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="text-sm text-ink-soft">
              {total === 0
                ? "No designs match these filters"
                : `${firstShown}–${lastShown} of ${total} designs`}
            </p>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              Sort
              <select
                value={sort}
                onChange={(e) =>
                  router.push(buildHref(base, { sort: e.target.value as SortKey, page: 1 }))
                }
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink focus:border-gold focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>

          {products.length > 0 ? (
            <>
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {lastPage > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mt-12 flex items-center justify-center gap-2"
                >
                  <PageLink
                    href={buildHref(base, { page: page - 1 })}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </PageLink>
                  <span className="px-4 text-sm text-ink-soft">
                    Page {page} of {lastPage}
                  </span>
                  <PageLink
                    href={buildHref(base, { page: page + 1 })}
                    disabled={page >= lastPage}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </PageLink>
                </nav>
              )}
            </>
          ) : (
            <p className="mt-16 text-center text-ink-soft">
              No designs match these filters yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const labelId = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div role="group" aria-labelledby={labelId} className="mt-6">
      <p id={labelId} className="mb-3 text-xs uppercase tracking-widest text-ink-soft">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-pressed={active}
      className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
        active
          ? "bg-espresso text-paper"
          : "border border-line text-ink-soft hover:border-gold hover:text-gold-deep"
      }`}
    >
      {children}
    </Link>
  );
}

function PageLink({
  href,
  disabled,
  children,
  ...rest
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
  "aria-label": string;
}) {
  if (disabled) {
    return (
      <span
        {...rest}
        aria-disabled
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft opacity-40"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      scroll={false}
      {...rest}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-gold hover:text-gold-deep"
    >
      {children}
    </Link>
  );
}
