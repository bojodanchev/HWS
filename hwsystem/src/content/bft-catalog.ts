import rawCatalog from "@/content/bft-catalog.json";
import imageManifest from "@/content/bft-image-manifest.json";
import type { Product, Spec } from "@/types/catalog";

type BftSourcePrice = {
  recommendedExVatGbp: number;
  purchaseExVatGbp: number;
};

type BftSourceRecord = {
  id: string;
  sku: string;
  slug: string;
  category: "sliding-gates" | "swing-gates" | "garage-door-motors" | "barriers" | "controls-and-safety" | "accessories";
  name: string;
  shortDescription: string;
  description: string;
  specs: {
    voltage?: string;
    maxKg?: number;
    details?: string[];
  };
  sourcePriceAudit: BftSourcePrice;
  sourceRow: number;
  sourceReference: string;
  imageCount: number;
};

type BftImageManifest = {
  products: Record<string, string[]>;
};

const sourceRecords = (rawCatalog as unknown as { products: BftSourceRecord[] }).products;
const imagesBySku = (imageManifest as unknown as BftImageManifest).products;

function normalizeSku(sku: string): string {
  return sku.trim().replace(/\.0$/, "");
}

function getImageUrls(sku: string): string[] {
  const exact = imagesBySku[sku];
  if (exact) return exact;
  const prefixed = Object.entries(imagesBySku).find(
    ([key]) => key.startsWith(sku) && /^\s/.test(key.slice(sku.length)),
  );
  return prefixed?.[1] ?? [];
}

function parseSpecs(record: BftSourceRecord): Spec[] {
  const specs: Spec[] = [];
  const voltage = record.specs.voltage?.trim();
  if (voltage) specs.push({ key: "voltage", value: voltage });
  if (typeof record.specs.maxKg === "number") {
    specs.push({ key: "maxGateWeight", value: record.specs.maxKg, unit: "kg" });
  }

  for (const detail of record.specs.details ?? []) {
    const ipRating = detail.match(/\bIP\d{2}\b/i)?.[0];
    if (ipRating && !specs.some((spec) => spec.key === "ipRating")) {
      specs.push({ key: "ipRating", value: ipRating.toUpperCase() });
    }

    const speed = detail.match(/Speed up to ([\d.]+)\s*(m\/min|mm\/sec)/i);
    if (speed && !specs.some((spec) => spec.key === "speed")) {
      specs.push({ key: "speed", value: Number(speed[1]), unit: speed[2] });
    }

    const doorArea = detail.match(/Max door area ([\d.]+)\s*m2/i);
    if (doorArea && !specs.some((spec) => spec.key === "maxDoorArea")) {
      specs.push({ key: "maxDoorArea", value: Number(doorArea[1]), unit: "m²" });
    }
  }

  return specs;
}

function toProduct(record: BftSourceRecord): Product {
  const sku = normalizeSku(record.sku);
  const imageUrls = getImageUrls(sku);

  return {
    id: record.id,
    sku,
    name: record.name,
    slug: record.slug,
    brand: "BFT",
    category: record.category === "garage-door-motors" ? "garage-door-automation" : record.category,
    shortDescription: record.shortDescription,
    description: record.description,
    images: imageUrls.map((url, index) => ({
      url,
      alt: `${record.name} — BFT product image ${index + 1}`,
      width: 800,
      height: 600,
    })),
    specs: parseSpecs(record),
    compatibility: [],
    documents: [],
    price: {
      // The workbook's recommended end-customer price is the public ex-VAT
      // selling baseline. The 52% corporate cost is retained server-side.
      rrp: record.sourcePriceAudit.recommendedExVatGbp,
      currency: "GBP",
      vatIncluded: false,
      vatRate: 0.2,
      purchaseCostExVat: record.sourcePriceAudit.purchaseExVatGbp,
    },
    stock: { status: "unknown" },
    relatedSkus: [],
    replacesSkus: [],
  };
}

export const bftCatalogSnapshot = {
  source: "BFT 2026 workbook / ACCESS OEMs & SPECIALIZED INSTA",
  sourceProductRows: 207,
  uniqueProducts: 206,
  corporateDiscountRate: 0.52,
  imageManifestProducts: Object.keys(imagesBySku).length,
  duplicateSku: "2600216",
} as const;

export const bftProducts: Product[] = sourceRecords.map(toProduct);
