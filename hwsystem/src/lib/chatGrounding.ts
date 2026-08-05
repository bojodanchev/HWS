import type { AssistantCatalogResult } from "@/lib/assistantCatalog";

/**
 * Reject model output that introduces identifiers or public prices which are
 * absent from the retrieved catalogue slice. Compatibility answers bypass the
 * model entirely and use the deterministic catalogue formatter.
 */
export function isGroundedCatalogAnswer(
  answer: string,
  catalog: AssistantCatalogResult,
): boolean {
  if (answer.length < 8 || /trade price/i.test(answer)) return false;
  const context = catalog.products
    .map((product) =>
      [
        product.name,
        product.sku,
        product.brand,
        product.compatibility.join(" "),
        product.price,
      ].join(" "),
    )
    .join(" ")
    .toUpperCase();

  const identifiers = answer.match(
    /\b(?:[A-Z]{2,8}|[A-Z]{2,}\d+|[A-Z0-9]{2,}(?:-[A-Z0-9]{2,})+)\b/g,
  );
  if (identifiers?.some((token) => !context.includes(token.toUpperCase()))) {
    return false;
  }

  const allowedPrices = new Set(
    catalog.products.map((product) =>
      Number(product.price.replace(/[^\d.]/g, "")).toFixed(2),
    ),
  );
  const prices = [...answer.matchAll(/£\s*([\d,.]+)/g)].map((match) =>
    Number(match[1].replace(/,/g, "")).toFixed(2),
  );
  return prices.every((price) => allowedPrices.has(price));
}
