import { describe, expect, it } from "vitest";
import { bftCatalogSnapshot, bftProducts } from "@/content/bft-catalog";
import { products } from "@/content/catalog";
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
