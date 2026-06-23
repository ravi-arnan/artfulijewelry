import type { MetadataRoute } from "next";
import { CATEGORIES, COLLECTIONS } from "@/lib/data";
import { getAllProducts } from "@/lib/products";

const BASE_URL = "https://bali-handmade.com";

const STATIC_PATHS = [
  "",
  "/shop",
  "/about",
  "/shipping",
  "/certificate",
  "/help",
  "/testimonials",
  "/terms",
  "/inquiry",
  "/login",
  "/signup",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE_URL}/shop?category=${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const collectionEntries: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${BASE_URL}/shop?collection=${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/shop/${p.id}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...categoryEntries, ...collectionEntries, ...productEntries];
}
