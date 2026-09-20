import { describe, expect, it } from "vitest";
import { products } from "@/content/catalog";
import { vendorCategory } from "@/content/vendor-category";
import { priceForViewer, productForViewer } from "@/lib/publicPrice";
import type { Price } from "@/types/catalog";

describe("catalogue refresh regression checks", () => {
  it("does not expose supplier costs or nested variant trade prices", () => {
    const price: Price = { rrp: 100, purchaseCostExVat: 48, tradeTiers: { bronze: 80, silver: 75, gold: 70 } };
    const product = { ...products[0], price, variants: [{ id: "test", sku: "TEST", name: "Test variant", specs: [], stock: { status: "unknown" as const }, price }] };
    const publicProduct = productForViewer(product);
    expect(publicProduct.price).toEqual({ rrp: 100 });
    expect(publicProduct.variants?.[0].price).toEqual({ rrp: 100 });
    expect(priceForViewer(price, "gold")).not.toHaveProperty("purchaseCostExVat");
    expect(product.price.purchaseCostExVat).toBe(48);
  });

  it("uses manufacturer gate categories and distinguishes accessories from motors", () => {
    expect(vendorCategory({ name: "Geared motor BOB21M", category: "side-motors", sourceCategoryUrl: "https://www.beninca.com/en/beninca-products/automations-for-swinging-gates.html" })).toBe("swing-gates");
    expect(products.find(p => p.sku === "9021027")?.category).toBe("accessories");
    expect(products.find(p => p.sku === "1870600")?.category).toBe("control-panels");
    expect(products.find(p => p.sku === "BEN-BOB21M")?.category).toBe("swing-gates");
    expect(products.find(p => p.sku === "1245945")?.category).toBe("tubular-motors");
    expect(products.find(p => p.sku === "1041386")?.category).toBe("tubular-motors");
    expect(products.find(p => p.sku === "1003293")?.category).toBe("blind-and-curtain-automation");
    expect(products.find(p => p.sku === "9132087")?.category).toBe("accessories");
    expect(products.find(p => p.sku === "9015801")?.category).toBe("accessories");
    expect(vendorCategory({name:"TAHOMA DIN Rail V2",category:"accessories"})).toBe("control-panels");
  });

  it("uses exact manufacturer imagery and keeps unpriced products quote-only", () => {
    const charger = products.find(p => p.sku === "9021027");
    expect(charger?.images[0].url).toMatch(/^https:\/\/asset\.somfy\.com\/Image\//);
    expect(charger?.price).toEqual({ quoteOnly: true });
    expect(products.every(p => p.relatedSkus.every(sku => sku !== p.sku))).toBe(true);
  });
});
