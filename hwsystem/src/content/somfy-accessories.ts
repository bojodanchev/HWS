import rawEvidence from "@/content/somfy-product-evidence.json";

const evidence = rawEvidence.products as Record<string, {
  accessorySkus?: string[]; compatibleSkus?: string[]; kitContent?: unknown;
}>;

/** Only manufacturer accessory/compatibility links; exclude stated kit SKUs. */
export function somfyAccessorySkus(sku: string): string[] {
  const source = evidence[sku];
  const included = String(source?.kitContent ?? "");
  return [...new Set([...(source?.accessorySkus ?? []), ...(source?.compatibleSkus ?? [])])]
    .filter(candidate => candidate !== sku && !included.includes(candidate));
}
