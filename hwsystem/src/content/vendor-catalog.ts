import rawCatalog from "@/content/vendor-catalog.json";
import type { Product, Spec } from "@/types/catalog";

type VendorCatalogRecord = {
  source: "somfy-pro-uk" | "beninca";
  sourceUrl: string;
  sourceSearchUrl?: string;
  sourceCategoryUrl?: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  specs: Spec[];
};

/**
 * Snapshot metadata for the public-only vendor source. The full record set
 * lives in vendor-catalog.json; Product intentionally has no sourceUrl field.
 */
export const vendorCatalogSnapshot = {
  retrievedAt: "2026-08-05T20:15:08.250Z",
  sources: {
    somfySearch: "https://www.somfypro.co.uk/search/%2A?page=1",
    somfyCatalogue: "https://www.somfypro.co.uk/e-catalogue",
    benincaCatalogue: "https://www.beninca.com/en/catalogue.html",
  },
  counts: { somfy: 1097, beninca: 205, total: 1302 },
} as const;

const sourceRecords = (rawCatalog as unknown as { products: VendorCatalogRecord[] }).products;

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function toProduct(record: VendorCatalogRecord): Product {
  return {
    id: `vendor-${record.source}-${slugify(record.sku)}`,
    sku: record.sku,
    name: record.name,
    slug: slugify(record.slug),
    brand: record.source === "somfy-pro-uk" ? "Somfy" : "Beninca",
    category: record.category,
    shortDescription: record.shortDescription,
    description: record.description,
    images: [],
    specs: record.specs,
    compatibility: [],
    documents: [],
    price: { quoteOnly: true },
    stock: { status: "unknown" },
    relatedSkus: [],
    replacesSkus: [],
  };
}

export const vendorProducts: Product[] = sourceRecords.map(toProduct);
