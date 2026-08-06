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

function normalizePublicCopy(value: string): string {
  return value
    .replace(/&rsquo;|&#8217;/gi, "’")
    .replace(/&trade;|&#8482;/gi, "™")
    .replace(/&hellip;|&#8230;/gi, "…")
    .replace(/Become Somfy Expert/gi, "SBI")
    .replace(/Become an Expert/gi, "SBI");
}

const FOREIGN_COPY_PATTERN =
  /[æå]|\b(?:rækkevidde|markise|motoren|lydniveau|grænse|afbryder|fjedrende|udendørs|indfældet|udvendig|tætsluttende|dugspændingssystem|lærreder|forpakning|vægt|stræben|kontormiljø|solafskærmningen|rullegardinrør|persiennelist|løbehjulsbeslag)\b/i;

const CATEGORY_LABELS: Record<string, string> = {
  accessories: "automation accessory",
  "control-panels": "automation control product",
  remotes: "remote control",
  safety: "automation safety product",
  "side-motors": "side motor",
  "tubular-motors": "tubular motor",
};

function publicDescriptions(record: VendorCatalogRecord): {
  shortDescription: string;
  description: string;
} {
  const shortDescription = normalizePublicCopy(record.shortDescription);
  const description = normalizePublicCopy(record.description);
  if (!FOREIGN_COPY_PATTERN.test(`${shortDescription} ${description}`)) {
    return { shortDescription, description };
  }

  const categoryLabel = CATEGORY_LABELS[record.category] ?? "automation product";
  const sourceTags = description.match(/Public source tags:.*$/i)?.[0];
  const fallbackShort = `${record.name} ${categoryLabel} for professional installations.`;
  const fallbackDescription = [
    `${record.name} is listed in the ${categoryLabel} range for professional installations.`,
    fallbackShort,
    sourceTags,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    shortDescription: FOREIGN_COPY_PATTERN.test(shortDescription) ? fallbackShort : shortDescription,
    description: fallbackDescription,
  };
}

function toProduct(record: VendorCatalogRecord): Product {
  const copy = publicDescriptions(record);
  return {
    id: `vendor-${record.source}-${slugify(record.sku)}`,
    sku: record.sku,
    name: normalizePublicCopy(record.name),
    slug: slugify(record.slug),
    brand: record.source === "somfy-pro-uk" ? "Somfy" : "Beninca",
    category: record.category,
    shortDescription: copy.shortDescription,
    description: copy.description,
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
