import type { Price, Product, TradeTier } from "@/types/catalog";

/** Supplier cost is never a customer price, including for trade accounts. */
export function priceForViewer(price: Price, tier?: TradeTier): Price {
  const result = { ...price };
  delete result.purchaseCostExVat;
  if (!tier) delete result.tradeTiers;
  return result;
}

export function productForViewer(product: Product, tier?: TradeTier): Product {
  return {
    ...product,
    price: priceForViewer(product.price, tier),
    documents: product.documents.filter(document => !document.url.includes("placeholder")),
    ...(product.variants ? {
      variants: product.variants.map((variant) => ({
        ...variant,
        price: priceForViewer(variant.price, tier),
      })),
    } : {}),
  };
}
