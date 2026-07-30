import "server-only";

import { formatGBP, getProducts } from "@/lib/catalog";
import {
  deterministicCatalogAnswer,
  retrieveChatProducts,
} from "@/lib/chatRetrieval";
import type { AssistantProduct, ChatLocale } from "@/types/chat";

export interface AssistantCatalogResult {
  answer: string;
  needsFollowUp: boolean;
  products: AssistantProduct[];
  intent: "compatibility" | "price" | "stock" | "product";
  confidence: "high" | "medium" | "none";
}

/**
 * Standalone catalogue retrieval. This reads the typed local content source
 * and deliberately never imports or calls the optional WooCommerce client.
 */
export function queryAssistantCatalog(
  message: string,
  locale: ChatLocale,
): AssistantCatalogResult {
  const retrieval = retrieveChatProducts(message, getProducts());
  const fallback = deterministicCatalogAnswer(retrieval, locale, formatGBP);
  return {
    ...fallback,
    intent: retrieval.intent,
    confidence: retrieval.confidence,
  };
}

export function buildAssistantContext(products: AssistantProduct[]): string {
  return products
    .map((product) =>
      [
        product.name,
        `SKU ${product.sku}`,
        product.price,
        `stock: ${product.stock}`,
        `compatibility: ${product.compatibility.join(", ") || "not listed"}`,
        product.specs.join(", "),
        `URL: ${product.url}`,
      ].join(" | "),
    )
    .join("\n");
}
