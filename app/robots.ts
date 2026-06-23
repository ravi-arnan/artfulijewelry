import type { MetadataRoute } from "next";

const BASE_URL = "https://bali-handmade.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep account/admin and the inquiry workspace out of the index.
      disallow: ["/admin", "/login", "/signup", "/inquiry"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
