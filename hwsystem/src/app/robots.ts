import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hwsystem.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/quote/thank-you", "/trade/thank-you"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
