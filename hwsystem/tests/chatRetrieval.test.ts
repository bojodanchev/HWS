import { describe, expect, it } from "vitest";
import { products } from "@/content/catalog";
import { formatGBP } from "@/lib/catalog";
import {
  deterministicCatalogAnswer,
  retrieveChatProducts,
} from "@/lib/chatRetrieval";

describe("standalone assistant catalogue retrieval", () => {
  it("does not recommend a barrier for an SBI remote compatibility question", () => {
    const result = retrieveChatProducts(
      "Кои дистанционни са съвместими със SBI?",
      products,
    );

    expect(result.confidence).toBe("high");
    expect(result.products.map((product) => product.sku)).toEqual([
      "SBI-RM4-433",
    ]);

    const fallback = deterministicCatalogAnswer(result, "bg", formatGBP);
    expect(fallback.answer).toContain("SBI-RM4-433");
    expect(fallback.answer).not.toContain("BFT-MOOVI-30");
    expect(fallback.needsFollowUp).toBe(false);
  });

  it("returns the exact product for an SKU price question", () => {
    const result = retrieveChatProducts(
      "What is the public price of BFT-MITTO-B2?",
      products,
    );
    expect(result.products.map((product) => product.sku)).toEqual([
      "BFT-MITTO-B2",
    ]);
    expect(result.intent).toBe("price");
  });

  it("fails closed when the catalogue has no evidence", () => {
    const result = retrieveChatProducts(
      "Is the unknown ZX-999 controller compatible with my door?",
      products,
    );
    const fallback = deterministicCatalogAnswer(result, "en", formatGBP);

    expect(result.products).toHaveLength(0);
    expect(fallback.needsFollowUp).toBe(true);
    expect(fallback.answer).toContain("checked answer");
  });

  it("returns only public assistant fields", () => {
    const result = retrieveChatProducts("SBI-RM4-433", products);
    const fallback = deterministicCatalogAnswer(result, "en", formatGBP);
    const assistantProduct = fallback.products[0];

    expect(assistantProduct).toMatchObject({
      sku: "SBI-RM4-433",
      price: "£18.50 ex VAT (+ VAT £3.70; £22.20 inc VAT)",
    });
    expect(assistantProduct).not.toHaveProperty("tradeTiers");
    expect(assistantProduct).not.toHaveProperty("priceBreaks");
  });

  it("does not invent price or availability for public vendor metadata", () => {
    const result = retrieveChatProducts(
      "What is the public price of 1810803?",
      products,
    );
    const answer = deterministicCatalogAnswer(result, "en", formatGBP);

    expect(answer.products[0]).toMatchObject({
      sku: "1810803",
      price: "price on request",
      stock: "availability on request",
    });
  });
});
