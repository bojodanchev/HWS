import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/catalog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hwsystem.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/products",
    "/trade",
    "/quote",
    "/doors",
    "/about",
    "/delivery",
    "/compliance",
    "/contact",
    "/search",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryRoutes = getCategories()
    .filter((c) => c.slug !== "doors")
    .map((c) => ({
      url: `${BASE}/products/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const productRoutes = getProducts().map((p) => ({
    url: `${BASE}/products/${p.category}/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
