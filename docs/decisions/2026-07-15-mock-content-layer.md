# Decision: Mock content layer now, headless WooCommerce later

**Date**: 2026-07-15
**Status**: accepted

## Context
PROJECT.md specifies headless WooCommerce as the commerce backend, but hwsystem.co.uk is an empty WP shell with no products and no agreed attribute schema (specs, documents, trade tiers). Waiting on that would block shipping anything.

## Decision
Ship the MVP on a typed in-repo data layer: `src/content/catalog.ts` (9 categories, 17 realistic products) accessed exclusively through `src/lib/catalog.ts`. Keep `src/lib/woo.ts` as a server-only Woo client whose raw→domain mappers deliberately throw until the WP attribute schema is finalised.

## Alternatives Considered
- Wire Woo now against the empty store — nothing to render, schema would churn.
- Hardcode data in components — violates PROJECT.md rules, unswappable later.

## Consequences
- Swap path is one file: implement `mapProduct`/`mapCategory` in woo.ts and change the import in lib/catalog.ts. Components untouched.
- Prices/stock are illustrative until Woo — fine for a validation-stage site where checkout is quote-first anyway.
