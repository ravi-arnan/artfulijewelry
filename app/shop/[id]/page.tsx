import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCategory } from "@/lib/data";
import { getAllProducts, getProductById } from "@/lib/products";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductMeta } from "@/components/product/ProductMeta";
import { FinishSelector } from "@/components/product/FinishSelector";
import { ProductInquiryCTA } from "@/components/product/ProductInquiryCTA";
import { ProductRelated } from "@/components/product/ProductRelated";

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} — Wholesale ${product.material}`,
    description: `${product.name} in ${product.material}. Wholesale from $${product.priceFrom.toFixed(
      2,
    )} per piece, minimum order ${product.minOrder} pcs. Handmade in Bali.`,
    openGraph: {
      title: product.name,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const category = getCategory(product.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    material: product.material,
    image: product.image ? `https://bali-handmade.com${product.image}` : undefined,
    category: category?.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.priceFrom,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 text-sm text-ink-soft"
          >
            <Link href="/shop" className="hover:text-gold-deep">
              Shop
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden />
            {category && (
              <>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="hover:text-gold-deep"
                >
                  {category.name}
                </Link>
                <ChevronRight className="h-4 w-4" aria-hidden />
              </>
            )}
            <span aria-current="page" className="text-ink">
              {product.name}
            </span>
          </nav>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery product={product} />
            <div>
              <ProductMeta product={product} category={category} />
              {product.metal === "silver" && <FinishSelector />}
              <ProductInquiryCTA product={product} />
            </div>
          </div>
        </div>

        <ProductRelated categorySlug={product.category} excludeId={product.id} />
      </main>
      <Footer />
    </>
  );
}
