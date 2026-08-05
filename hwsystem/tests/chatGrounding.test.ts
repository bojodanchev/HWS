import { describe, expect, it } from "vitest";
import { isGroundedCatalogAnswer } from "@/lib/chatGrounding";
import type { AssistantCatalogResult } from "@/lib/assistantCatalog";

const catalog: AssistantCatalogResult = {
  answer: "Catalogue answer",
  needsFollowUp: false,
  intent: "price",
  confidence: "high",
  products: [
    {
      name: "SBI 4-channel rolling-code remote",
      sku: "SBI-RM4-433",
      brand: "SBI",
      category: "remotes",
      shortDescription: "Remote",
      compatibility: ["SBI CP1 control panel"],
      price: "£18.50 ex VAT",
      stock: "in stock",
      specs: [],
      url: "/products/remotes/sbi-rm4-433",
    },
  ],
};

describe("model answer grounding", () => {
  it("accepts identifiers and prices from the retrieved catalogue slice", () => {
    expect(
      isGroundedCatalogAnswer(
        "SBI-RM4-433 is £18.50 ex VAT and works with the SBI CP1 control panel.",
        catalog,
      ),
    ).toBe(true);
  });

  it("rejects a hallucinated brand, SKU or public price", () => {
    expect(
      isGroundedCatalogAnswer(
        "Try the BFT MITTO-B2 remote for £28.00.",
        catalog,
      ),
    ).toBe(false);
  });
});
