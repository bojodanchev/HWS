import rawCatalog from "@/content/somfy-controls-catalog.json";
import rawImageManifest from "@/content/somfy-image-manifest.json";
import type { Brand, Product, Spec } from "@/types/catalog";
import { somfyAccessorySkus } from "@/content/somfy-accessories";

type CommercialSource = "rec" | "rea" | "icc" | "ha" | "controls";
type SourceCurrency = "EUR" | "BGN";

type SourcePriceAudit = {
  sourceCurrency: SourceCurrency;
  sourcePurchaseExVat: number | null;
  sourceRecommendedIncVat: number | null;
  sourceQuantityOrLeadTime: number | null;
  sourceQuantityOrLeadTimeLabel: "packageQuantity" | "deliveryDays";
  eurToGbpRate: number | null;
  purchaseExVatGbp: number | null;
  recommendedExVatGbp: number | null;
  quoteOnly: boolean;
};

type SourceRecord = {
  source: CommercialSource;
  sourceRow: number;
  sourceSection: string;
  sourceSku: string;
  sku: string;
  sourceName: string;
  sourceDescription: string;
  sourcePriceAudit: SourcePriceAudit;
};

type CommercialRecord = SourceRecord & {
  brand: Brand;
  category: string;
  name: string;
  shortDescription: string;
  description: string;
  specs: Spec[];
  compatibility: string[];
  images: string[];
};

type CommercialImageAudit = {
  status: "exact" | "family-reference" | "supplied-source-image";
  matchedSku: string;
  sourcePageUrl: string | null;
  sourceImageUrl: string | null;
  localPath: string;
  sourceNote?: string;
};

type CommercialImageManifest = {
  generatedAt: string;
  policy: string;
  sourcePriority: string[];
  products: Record<string, CommercialImageAudit>;
};

type CommercialCatalog = {
  sourceMetadata: readonly unknown[];
  importPolicy: {
    publicPriceCurrency: "GBP";
    eurToGbpRate: number;
    vatRate: number;
    bgnHandling: string;
    imageHandling: string;
  };
  audit: {
    rawSourceRecordCount: number;
    uniqueSkuCount: number;
    selectedProductCount: number;
    pricedProductCount: number;
    quoteOnlyProductCount: number;
    rowsWithSourceImage: number;
    rowsWithoutSourceImage: number;
    unresolvedSkuConflicts: Array<{ sku: string; reason: string }>;
    skippedExistingBftSkus: string[];
  };
  sourceRecords: SourceRecord[];
  products: CommercialRecord[];
};

const catalog = rawCatalog as unknown as CommercialCatalog;
const imageManifest = rawImageManifest as unknown as CommercialImageManifest;

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function toProduct(record: CommercialRecord): Product {
  const audit = record.sourcePriceAudit;
  const imageAudit = imageManifest.products[record.sku];
  const imageUrls = imageAudit ? [imageAudit.localPath] : record.images;
  const hasPrice =
    !audit.quoteOnly &&
    typeof audit.recommendedExVatGbp === "number" &&
    typeof audit.purchaseExVatGbp === "number";

  return {
    id: `commercial-${record.source}-${slugify(record.sku)}`,
    sku: record.sku,
    name: record.name,
    slug: slugify(`${record.name}-${record.sku}`),
    brand: record.brand,
    category: record.category,
    shortDescription: record.shortDescription,
    description: record.description,
    images: imageUrls.map((url, index) => ({
      url,
      alt: `${record.name} — product image ${index + 1}`,
      width: 800,
      height: 600,
    })),
    specs: record.specs,
    compatibility: record.compatibility,
    documents: [],
    price: hasPrice
      ? {
          rrp: audit.recommendedExVatGbp!,
          currency: "GBP",
          vatIncluded: false,
          vatRate: 0.2,
          purchaseCostExVat: audit.purchaseExVatGbp!,
        }
      : { quoteOnly: true },
    stock: { status: "unknown" },
    relatedSkus: record.brand === "Somfy" ? somfyAccessorySkus(record.sku) : [],
    replacesSkus: [],
  };
}

export const somfyCommercialCatalogSnapshot = {
  ...catalog.audit,
  sourceMetadata: catalog.sourceMetadata,
  importPolicy: catalog.importPolicy,
} as const;

export const somfyCommercialSourceRecords = catalog.sourceRecords;
export const somfyCommercialProducts: Product[] = catalog.products.map(toProduct);
export const somfyCommercialImageManifest = imageManifest;
export const somfyCommercialImageAuditSnapshot = {
  generatedAt: imageManifest.generatedAt,
  productCount: Object.keys(imageManifest.products).length,
  exactProductCount: Object.values(imageManifest.products).filter(
    (entry) => entry.status === "exact",
  ).length,
  familyReferenceProductCount: Object.values(imageManifest.products).filter(
    (entry) => entry.status === "family-reference",
  ).length,
  suppliedSourceImageProductCount: Object.values(imageManifest.products).filter(
    (entry) => entry.status === "supplied-source-image",
  ).length,
} as const;
