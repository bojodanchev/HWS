# Decision: Import shared commercial workbooks through the audited SKU loader

- Date: 2026-08-07
- Status: Implemented
- Scope: HWS commercial product data, pricing, provenance and release validation

## Context

After the initial BFT and Controls links were supplied, read-only Gmail
notifications revealed four additional owner-shared workbooks: REC, REA, ICC
and HA PRO. The source files needed to become one canonical product projection
without losing source rows, source currencies, or unresolved conflicts.

## Decision

- Store the reviewed snapshot in
  `hwsystem/src/content/somfy-controls-catalog.json` and project it through
  `hwsystem/src/content/somfy-controls-catalog.ts`.
- Resolve overlapping commercial rows in this order: REC, REA, ICC, HA PRO,
  then Controls. Exact BFT SKUs already represented by the image-backed BFT
  loader remain owned by that loader; the commercial projection filters vendor
  duplicates before `src/content/catalog.ts` exports the canonical array.
- Keep source price, purchase cost and public price separate. EUR source
  values use the catalogue boundary `0.8572` EUR to GBP; public values are
  GBP ex VAT, while `purchaseCostExVat` is retained only in the internal
  snapshot and stripped by the public catalogue boundary.
- Do not convert ICC BGN rows without an approved BGN-to-GBP rate. They remain
  quote-only. SKU `1871148` has conflicting ICC BGN and EUR rows, so both raw
  rows remain in the audit while the SKU is excluded from the public projection.
- Empty source-image arrays are an explicit state. The shared Google Sheets
  contained no usable image cells or embedded media; no replacement imagery is
  invented.

## Evidence

- The import retains 178 source rows and 154 unique SKU keys, selecting 150
  products: 143 GBP-priced and 7 quote-only. The BFT workbook matched the
  existing 203 common records with zero name, cost or RRP mismatches; its 3
  local-only SKUs and 206 image-backed product snapshot remain intact.
- Validation passed with 15 tests, TypeScript, lint with four pre-existing
  warnings, and a production build generating 1,681 static pages.
- Commit `860f0a2` was pushed to `origin/main`. Vercel deployment
  `dpl_H3N9nkgqwYnRwYsN5iVq2ZRCTpvw` reached Ready; the canonical OXIMO SKU
  route and sitemap were verified at `https://hwsystem.vercel.app`.

## Follow-up

The imported commercial rows still need approved product imagery and a review
of the blocked `1871148` identity/price conflict before being treated as
image-complete catalogue content.
