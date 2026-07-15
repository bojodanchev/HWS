/**
 * Catalog data access. Components import ONLY from here — the backing
 * store (src/content today, WooCommerce via src/lib/woo.ts later) is an
 * implementation detail.
 *
 * Trade prices are stripped before data leaves this module unless an
 * authenticated trade tier is supplied. There is no trade auth yet, so
 * nothing ships trade pricing to the client.
 */

import { categories, products } from "@/content/catalog";
import type {
  Category,
  FilterKey,
  Price,
  Product,
  TradeTier,
} from "@/types/catalog";

function publicPrice(price: Price, tier?: TradeTier): Price {
  if (tier && price.tradeTiers) return price;
  const { tradeTiers: _hidden, ...rest } = price;
  return rest;
}

function publicProduct(p: Product, tier?: TradeTier): Product {
  return { ...p, price: publicPrice(p.price, tier) };
}

export function getCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export type CatalogFilters = Partial<Record<FilterKey, string>> & {
  sort?: "relevance" | "price-asc" | "price-desc" | "name";
};

function specValue(p: Product, key: string): string | number | undefined {
  return p.specs.find((s) => s.key === key)?.value;
}

export function getProducts(filters: CatalogFilters = {}, tier?: TradeTier): Product[] {
  let list = [...products];

  if (filters.category) {
    list = list.filter((p) => p.category === filters.category);
  }
  if (filters.brand) {
    list = list.filter((p) => p.brand.toLowerCase() === filters.brand!.toLowerCase());
  }
  if (filters.torque) {
    list = list.filter((p) => String(specValue(p, "torque")) === filters.torque);
  }
  if (filters.tubeDiameter) {
    list = list.filter((p) => String(specValue(p, "tubeDiameter")) === filters.tubeDiameter);
  }
  if (filters.voltage) {
    list = list.filter((p) => specValue(p, "voltage") === filters.voltage);
  }
  if (filters.frequency) {
    list = list.filter((p) => specValue(p, "frequency") === filters.frequency);
  }
  if (filters.inStock === "true") {
    list = list.filter((p) => p.stock.status === "in_stock" || p.stock.status === "low");
  }
  if (filters.nextDay === "true") {
    list = list.filter((p) => p.stock.nextDayEligible);
  }

  switch (filters.sort) {
    case "price-asc":
      list.sort((a, b) => a.price.rrp - b.price.rrp);
      break;
    case "price-desc":
      list.sort((a, b) => b.price.rrp - a.price.rrp);
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  return list.map((p) => publicProduct(p, tier));
}

export function getProductBySlug(slug: string, tier?: TradeTier): Product | undefined {
  const p = products.find((x) => x.slug === slug);
  return p ? publicProduct(p, tier) : undefined;
}

export function getProductsBySkus(skus: string[], tier?: TradeTier): Product[] {
  return products
    .filter((p) => skus.includes(p.sku))
    .map((p) => publicProduct(p, tier));
}

/** SKU-first search: SKU, replacesSkus, then name/brand/compatibility. */
export function searchProducts(query: string, tier?: TradeTier): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = products
    .map((p) => {
      let score = 0;
      if (p.sku.toLowerCase() === q) score += 100;
      else if (p.sku.toLowerCase().includes(q)) score += 60;
      if (p.replacesSkus.some((s) => s.toLowerCase().includes(q))) score += 50;
      if (p.name.toLowerCase().includes(q)) score += 30;
      if (p.brand.toLowerCase() === q) score += 20;
      if (p.compatibility.some((c) => c.toLowerCase().includes(q))) score += 10;
      if (p.shortDescription.toLowerCase().includes(q)) score += 5;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((x) => publicProduct(x.p, tier));
}

/** Distinct facet values present in a product set, for filter UIs. */
export function getFacets(list: Product[]): {
  brands: string[];
  torques: number[];
  tubeDiameters: number[];
  voltages: string[];
  frequencies: string[];
} {
  const brands = new Set<string>();
  const torques = new Set<number>();
  const tubeDiameters = new Set<number>();
  const voltages = new Set<string>();
  const frequencies = new Set<string>();

  for (const p of list) {
    brands.add(p.brand);
    const t = specValue(p, "torque");
    if (typeof t === "number") torques.add(t);
    const d = specValue(p, "tubeDiameter");
    if (typeof d === "number") tubeDiameters.add(d);
    const v = specValue(p, "voltage");
    if (typeof v === "string") voltages.add(v);
    const f = specValue(p, "frequency");
    if (typeof f === "string") frequencies.add(f);
  }

  return {
    brands: [...brands].sort(),
    torques: [...torques].sort((a, b) => a - b),
    tubeDiameters: [...tubeDiameters].sort((a, b) => a - b),
    voltages: [...voltages].sort(),
    frequencies: [...frequencies].sort(),
  };
}

export function formatGBP(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}
