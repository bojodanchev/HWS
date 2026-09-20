/**
 * Typed WooCommerce REST client (server-only).
 *
 * Consumer keys must never reach the browser — this module throws if
 * imported from client code. Trade pricing is filtered here, on the
 * server, before anything is returned to a component.
 */

import "server-only";

import type { Category, Product } from "@/types/catalog";
export { priceForViewer } from "@/lib/publicPrice";

const WOO_URL = process.env.WOO_URL;
const WOO_CONSUMER_KEY = process.env.WOO_CONSUMER_KEY;
const WOO_CONSUMER_SECRET = process.env.WOO_CONSUMER_SECRET;

function assertConfig(): { url: string; key: string; secret: string } {
  if (!WOO_URL || !WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
    throw new Error(
      "WooCommerce is not configured. Set WOO_URL, WOO_CONSUMER_KEY and WOO_CONSUMER_SECRET (see .env.example).",
    );
  }
  return { url: WOO_URL, key: WOO_CONSUMER_KEY, secret: WOO_CONSUMER_SECRET };
}

type WooFetchOptions = {
  /** Query string params appended to the endpoint */
  params?: Record<string, string | number | boolean>;
  /** Next.js revalidation window in seconds (default 5 min) */
  revalidate?: number;
};

async function wooFetch<T>(
  endpoint: string,
  { params = {}, revalidate = 300 }: WooFetchOptions = {},
): Promise<T> {
  const { url, key, secret } = assertConfig();
  const target = new URL(`/wp-json/wc/v3/${endpoint}`, url);
  for (const [k, v] of Object.entries(params)) {
    target.searchParams.set(k, String(v));
  }

  const res = await fetch(target, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`,
    },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`WooCommerce ${endpoint} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Strip trade pricing unless the caller has an authenticated trade tier.
 * Call this on EVERY product before it crosses to a component.
 */
export type ProductQuery = {
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
};

/*
 * Raw Woo product/category payloads are mapped into the domain types from
 * src/types/catalog.ts here — components never see WooCommerce shapes.
 * Mapping is implemented alongside the catalog milestone once the WP
 * attribute schema (specs, documents, trade tiers) is finalised.
 */

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const raw = await wooFetch<unknown[]>("products", {
    params: {
      per_page: query.perPage ?? 24,
      page: query.page ?? 1,
      ...(query.category ? { category: query.category } : {}),
      ...(query.search ? { search: query.search } : {}),
    },
  });
  return raw.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const raw = await wooFetch<unknown[]>("products", { params: { slug } });
  const first = raw[0];
  return first ? mapProduct(first) : null;
}

export async function getCategories(): Promise<Category[]> {
  const raw = await wooFetch<unknown[]>("products/categories", {
    params: { per_page: 100, hide_empty: false },
  });
  return raw.map(mapCategory);
}

function mapProduct(_raw: unknown): Product {
  throw new Error(
    "mapProduct not implemented — finalise the WP attribute schema first (Milestone 1).",
  );
}

function mapCategory(_raw: unknown): Category {
  throw new Error(
    "mapCategory not implemented — finalise the WP attribute schema first (Milestone 1).",
  );
}
