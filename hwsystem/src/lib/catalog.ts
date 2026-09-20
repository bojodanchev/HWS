/**
 * Catalog data access. Components import ONLY from here — the backing
 * store (the standalone typed content source today, with optional adapters
 * later) is an implementation detail.
 *
 * Trade prices are stripped before data leaves this module unless an
 * authenticated trade tier is supplied. There is no trade auth yet, so
 * nothing ships trade pricing to the client.
 */

import { categories, products } from "@/content/catalog";
import { productForViewer as publicProduct } from "@/lib/publicPrice";
import type {
  Category,
  FilterKey,
  Price,
  Product,
  Stock,
  StockStatus,
  TradeTier,
} from "@/types/catalog";

export const STANDARD_VAT_RATE = 0.2;

/** Public rendering view for products with no safe RRP. */
export type DisplayPrice = Omit<Price, "rrp" | "purchaseCostExVat" | "tradeTiers"> & {
  rrp?: number;
  quoteOnly?: boolean;
};

export type PriceBreakdown = {
  exVat: number;
  vat: number;
  incVat: number;
  vatRate: number;
};

export type DisplayStockStatus = StockStatus | "unknown";

export type DisplayStock = Omit<Stock, "status"> & {
  status: DisplayStockStatus;
};

export function hasPublicPrice(
  price: DisplayPrice,
): price is DisplayPrice & { rrp: number } {
  return price.quoteOnly !== true && typeof price.rrp === "number" && Number.isFinite(price.rrp);
}

export function hasKnownStock(stock: DisplayStock): boolean {
  return stock.status !== "unknown";
}

export function getPriceBreakdown(price: DisplayPrice): PriceBreakdown | undefined {
  if (!hasPublicPrice(price)) return undefined;

  const vatRate =
    typeof price.vatRate === "number" && Number.isFinite(price.vatRate)
      ? price.vatRate
      : STANDARD_VAT_RATE;
  const exVat = price.vatIncluded === true ? price.rrp / (1 + vatRate) : price.rrp;
  const vat = exVat * vatRate;

  return {
    exVat,
    vat,
    incVat: exVat + vat,
    vatRate,
  };
}

export function formatVatRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export function getCategories(): Category[] {
  const used = new Set<string>();
  return categories.map(category => {
    if (category.slug === "doors") return category;
    const image = products
      .filter(product => product.category === category.slug)
      .flatMap(product => product.images)
      .find(candidate => !used.has(candidate.url));
    if (image) used.add(image.url);
    return { ...category, image: image?.url ?? "" };
  });
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
      list.sort((a, b) => comparePrices(a.price, b.price));
      break;
    case "price-desc":
      list.sort((a, b) => comparePrices(b.price, a.price));
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  return list.map((p) => publicProduct(p, tier));
}

function comparePrices(a: DisplayPrice, b: DisplayPrice): number {
  const aValue = hasPublicPrice(a) ? a.rrp : undefined;
  const bValue = hasPublicPrice(b) ? b.rrp : undefined;

  if (aValue === undefined && bValue === undefined) return 0;
  if (aValue === undefined) return 1;
  if (bValue === undefined) return -1;
  return aValue - bValue;
}

export function getProductBySlug(slug: string, tier?: TradeTier): Product | undefined {
  const p = products.find((x) => x.slug === slug);
  return p ? publicProduct(p, tier) : undefined;
}

export function getProductsBySkus(skus: string[], tier?: TradeTier): Product[] {
  const bySku = new Map(products.map((product) => [product.sku, product]));
  return skus
    .map((sku) => bySku.get(sku))
    .filter((product): product is Product => Boolean(product))
    .map((product) => publicProduct(product, tier));
}

export type RecommendationGroups = {
  curated: Product[];
  related: Product[];
};

/**
 * Return curated add-ons first, then a conservative same-brand/category
 * fallback for imported products that do not yet have relationship data.
 * The fallback is deliberately labelled as related, never as purchase history.
 */
export function getRecommendationGroups(
  product: Product,
  tier?: TradeTier,
): RecommendationGroups {
  const curated = getProductsBySkus(product.relatedSkus, tier).slice(0, 4);
  const selected = new Set([product.sku, ...curated.map((item) => item.sku)]);
  const productSpecValues = new Set(
    product.specs
      .filter((spec) => ["voltage", "frequency", "tubeDiameter"].includes(spec.key))
      .map((spec) => `${spec.key}:${String(spec.value).toLowerCase()}`),
  );

  const related = products
    .filter((candidate) => !selected.has(candidate.sku))
    .map((candidate) => {
      let score = 0;
      if (candidate.brand === product.brand) score += 3;
      if (candidate.category === product.category) score += 3;
      for (const spec of candidate.specs) {
        if (productSpecValues.has(`${spec.key}:${String(spec.value).toLowerCase()}`)) {
          score += 1;
        }
      }
      return { candidate, score };
    })
    .filter(({ score }) => score >= 3)
    .sort(
      (left, right) =>
        right.score - left.score || left.candidate.name.localeCompare(right.candidate.name),
    )
    .slice(0, 4)
    .map(({ candidate }) => publicProduct(candidate, tier));

  return { curated, related };
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
