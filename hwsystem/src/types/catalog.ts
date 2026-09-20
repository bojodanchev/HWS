/**
 * Catalog domain types — the single source of truth for product data.
 * Mirrors docs/DATA_MODEL.md exactly. Never invent fields outside this file.
 *
 * Hierarchy: Category → Subcategory → Product → Variant (SKU)
 */

export type Brand = "Somfy" | "Nice" | "Beninca" | "BFT" | "Teleco" | "SBI" | "Generic";

export type FilterKey =
  | "brand"
  | "category"
  | "torque"
  | "tubeDiameter"
  | "voltage"
  | "frequency"
  | "inStock"
  | "nextDay"
  | "priceRange";

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
  parent?: string;
  /** Which filters are relevant for this category */
  filters: FilterKey[];
};

export type SpecKey =
  | "torque" // Nm
  | "tubeDiameter" // 45 | 59 | 70
  | "voltage" // 230V AC | 24V DC
  | "power" // W
  | "speed" // rpm
  | "limitSwitch" // mechanical | electronic
  | "ipRating"
  | "frequency" // 433.92 MHz | 868 MHz
  | "channels"
  | "maxDoorArea" // m²
  | "maxGateWeight" // kg
  | "cableLength"
  | "material"
  | "warrantyYears";

/** Structured, filterable. Free text belongs in Product.description. */
export type Spec = {
  key: SpecKey;
  value: string | number;
  unit?: string;
};

export type Image = {
  url: string;
  alt: string;
  width: number;
  height: number;
  /** Visible qualification for a family or representative image. */
  caption?: string;
};

export type DocumentType =
  | "DoP"
  | "UKCA"
  | "CE"
  | "manual"
  | "wiring"
  | "datasheet"
  | "warranty";

/** Compliance = product. DoP/UKCA PDFs sell to B2B. */
export type ProductDocument = {
  type: DocumentType;
  title: string;
  url: string;
  language: "en" | "bg";
};

export type TradeTier = "bronze" | "silver" | "gold";

/**
 * Heart of the B2B/B2C hybrid.
 * `tradeTiers` is visible ONLY after login — filter on the server,
 * never ship it to an unauthenticated client.
 */
export type Price = {
  /** Public sale price, always normalised to GBP ex VAT. */
  rrp?: number;
  /** Currency and VAT semantics are omitted when the price is quote-only. */
  currency?: "GBP";
  vatIncluded?: boolean;
  /** VAT rate as a decimal; UK standard-rated products use 0.2 by default. */
  vatRate?: number;
  /** True when a public RRP is not available and a quote is required. */
  quoteOnly?: boolean;
  /** Corporate purchase cost; stripped before public rendering. */
  purchaseCostExVat?: number;
  tradeTiers?: Record<TradeTier, number>;
  priceBreaks?: { qty: number; price: number }[]; // 1 / 5 / 10 / 25
};

export type StockStatus = "in_stock" | "low" | "backorder" | "out" | "unknown";

export type Stock = {
  status: StockStatus;
  /** Show only "10+ in stock", never the exact number */
  qty?: number;
  /** The key promise; omitted when public availability is unknown. */
  nextDayEligible?: boolean;
  leadTimeDays?: number;
};

export type Variant = {
  id: string;
  sku: string;
  name: string;
  specs: Spec[];
  price: Price;
  stock: Stock;
};

export type Product = {
  id: string;
  /** Key: installers search by SKU */
  sku: string;
  name: string;
  slug: string;
  brand: Brand;
  category: string;
  shortDescription: string;
  /** Rich text from WP */
  description: string;
  images: Image[];
  /** Structured, FILTERABLE */
  specs: Spec[];
  /** Which systems/models it works with */
  compatibility: string[];
  documents: ProductDocument[];
  price: Price;
  stock: Stock;
  purchasePolicy?: PurchasePolicy;
  variants?: Variant[];
  relatedSkus: string[];
  /** "Replaces old model X" — big SEO/UX win */
  replacesSkus: string[];
};

export type TradeAccountStatus = "pending" | "approved" | "suspended";

/** Registration requires manual approval. No one gets trade prices automatically. */
export type TradeAccount = {
  companyName: string;
  vatNumber?: string;
  tier: TradeTier;
  status: TradeAccountStatus;
  approvedAt?: Date;
  creditTerms?: "prepay" | "net30";
};

export type PurchaseAudience = "public" | "trade-account";

export type PurchasePolicy = {
  audience: PurchaseAudience;
  minQuantity?: number;
};
