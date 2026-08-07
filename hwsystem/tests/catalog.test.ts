import { describe, expect, it } from "vitest";
import { bftCatalogSnapshot, bftProducts } from "@/content/bft-catalog";
import { products } from "@/content/catalog";
import {
  somfyCommercialCatalogSnapshot,
  somfyCommercialImageAuditSnapshot,
  somfyCommercialImageManifest,
  somfyCommercialProducts,
  somfyCommercialSourceRecords,
} from "@/content/somfy-controls-catalog";
import {
  getPriceBreakdown,
  getProductBySlug,
  getRecommendationGroups,
} from "@/lib/catalog";
import { quoteSchema } from "@/components/QuoteForm";

describe("catalog imports and commercial rules", () => {
  it("imports the deduplicated BFT workbook with public GBP pricing and source images", () => {
    expect(bftCatalogSnapshot).toMatchObject({
      sourceProductRows: 207,
      uniqueProducts: 206,
      corporateDiscountRate: 0.52,
    });
    expect(bftProducts).toHaveLength(206);
    expect(new Set(bftProducts.map((product) => product.sku)).size).toBe(206);

    const productWithImage = bftProducts.find((product) => product.images.length > 0);
    expect(productWithImage?.images[0].url).toMatch(/^\/images\/vendor\/bft\//);
    expect(productWithImage?.price).toMatchObject({
      currency: "GBP",
      vatIncluded: false,
      vatRate: 0.2,
    });
    expect(productWithImage?.price.purchaseCostExVat).toBeGreaterThan(0);
  });

  it("keeps VAT explicit and never exposes corporate purchase cost", () => {
    const bftProduct = bftProducts[0];
    const breakdown = getPriceBreakdown(bftProduct.price);
    expect(breakdown).toMatchObject({ exVat: bftProduct.price.rrp, vatRate: 0.2 });
    expect(breakdown?.incVat).toBeCloseTo((bftProduct.price.rrp ?? 0) * 1.2, 6);

    const publicBft = getProductBySlug(bftProduct.slug);
    expect(publicBft?.price).not.toHaveProperty("purchaseCostExVat");
  });

  it("imports the shared commercial workbooks with precedence and audit gates", () => {
    expect(somfyCommercialCatalogSnapshot).toMatchObject({
      rawSourceRecordCount: 178,
      uniqueSkuCount: 154,
      selectedProductCount: 150,
      pricedProductCount: 141,
      quoteOnlyProductCount: 9,
      rowsWithSourceImage: 0,
    });
    expect(somfyCommercialProducts).toHaveLength(150);
    expect(new Set(somfyCommercialProducts.map((product) => product.sku)).size).toBe(150);
    expect(somfyCommercialImageAuditSnapshot).toMatchObject({
      productCount: 150,
      exactProductCount: 133,
      familyReferenceProductCount: 15,
      suppliedSourceImageProductCount: 2,
    });
    expect(somfyCommercialProducts.every((product) => product.images.length === 1)).toBe(true);
    expect(
      Object.values(somfyCommercialImageManifest.products).every(
        (image) => !image.sourceImageUrl || !image.sourceImageUrl.includes("noimage"),
      ),
    ).toBe(true);
    expect(somfyCommercialCatalogSnapshot.unresolvedSkuConflicts).toEqual(
      expect.arrayContaining([expect.objectContaining({ sku: "1871148" })]),
    );
    expect(somfyCommercialCatalogSnapshot.skippedExistingBftSkus).toEqual(
      expect.arrayContaining(["9011069"]),
    );

    const recOverride = somfyCommercialProducts.find((product) => product.sku === "1811685");
    expect(recOverride?.price).toMatchObject({
      currency: "GBP",
      vatIncluded: false,
      vatRate: 0.2,
    });
    expect(recOverride?.price.rrp).toBeGreaterThan(0);
    expect(somfyCommercialProducts.find((product) => product.sku === "9013451")?.price).toEqual({
      quoteOnly: true,
    });
    expect(products.filter((product) => product.sku === "1824035")).toHaveLength(1);
    expect(new Set(products.map((product) => product.sku)).size).toBe(products.length);
    expect(products.find((product) => product.sku === "1824035")?.price.quoteOnly).not.toBe(true);
    const publicCommercial = getProductBySlug(
      products.find((product) => product.sku === "1824035")!.slug,
    );
    expect(publicCommercial?.price).not.toHaveProperty("purchaseCostExVat");
  });

  it("audits every ICC source row before GBP projection", () => {
    const iccRecords = somfyCommercialSourceRecords.filter((record) => record.source === "icc");
    expect(iccRecords).toHaveLength(47);
    const roundGbp = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

    for (const record of iccRecords) {
      const audit = record.sourcePriceAudit;
      if (audit.sourceCurrency === "BGN") {
        expect(audit).toMatchObject({
          eurToGbpRate: null,
          purchaseExVatGbp: null,
          recommendedExVatGbp: null,
          quoteOnly: true,
        });
        continue;
      }

      expect(audit.sourceCurrency).toBe("EUR");
      expect(audit.eurToGbpRate).toBe(0.8572);
      expect(audit.purchaseExVatGbp).toBe(roundGbp(audit.sourcePurchaseExVat! * 0.8572));
      expect(audit.recommendedExVatGbp).toBe(
        roundGbp((audit.sourceRecommendedIncVat! / 1.2) * 0.8572),
      );
      expect(audit.quoteOnly).toBe(false);
    }
  });

  it("provides related fallback recommendations without claiming purchase history", () => {
    const product = products.find((candidate) => candidate.relatedSkus.length > 0);
    expect(product).toBeDefined();
    const groups = getRecommendationGroups(product!);
    expect(groups.curated.length).toBeGreaterThan(0);
    expect(groups.related.every((candidate) => candidate.sku !== product!.sku)).toBe(true);
  });

  it("keeps imported public copy in English", () => {
    const legacyForeignCopy =
      /[æå]|\b(?:rækkevidde|markise|motoren|lydniveau|grænse|afbryder|fjedrende|udendørs|indfældet|udvendig|tætsluttende|dugspændingssystem|lærreder|forpakning|vægt|stræben|kontormiljø|solafskærmningen|rullegardinrør|persiennelist|løbehjulsbeslag)\b/i;
    expect(
      products.filter((product) =>
        legacyForeignCopy.test(
          `${product.shortDescription} ${product.description}`,
        ),
      ),
    ).toHaveLength(0);
  });
});

describe("garage door quote gate", () => {
  const validGarageDoorRequest = {
    name: "Ada Lovelace",
    phone: "+44 7700 900123",
    email: "ada@example.com",
    postcode: "SW1A 1AA",
    message: "Five sectional doors for a trade installation.",
    productType: "garage-door" as const,
    quantity: 5,
    tradeAccountNumber: "TRADE-123",
  };

  it("requires a trade account and at least five doors", () => {
    expect(quoteSchema.safeParse(validGarageDoorRequest).success).toBe(true);
    expect(
      quoteSchema.safeParse({ ...validGarageDoorRequest, quantity: 4 }).success,
    ).toBe(false);
    expect(
      quoteSchema.safeParse({ ...validGarageDoorRequest, tradeAccountNumber: "" }).success,
    ).toBe(false);
  });
});
