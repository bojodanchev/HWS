# Decision: Audit ICC currency sections and import provenance-preserving product imagery

- Date: 2026-08-07
- Status: Implemented
- Scope: HWS commercial catalogue pricing and product media

## Context

Sean asked for the commercial migration to use the ICC price list correctly,
convert only approved EUR values into GBP, and fill the imported rows that
were missing product imagery with consistent, high-quality assets.

## Decision

- ICC rows 65–68 are BGN rows, not EUR rows. They remain quote-only until an
  approved BGN-to-GBP rate is supplied; their raw source values are preserved.
- EUR projections use the existing `0.8572` EUR-to-GBP boundary, remove the
  20% VAT from the recommended inc-VAT price, and round GBP values to two
  decimals using half-up currency rounding. The unresolved `1871148` source
  conflict remains excluded from the public projection.
- Store image provenance in
  `hwsystem/src/content/somfy-image-manifest.json` and local approved assets in
  `hwsystem/public/images/vendor/somfy/`. Every imported product receives one
  local image path in the typed product projection.
- Prefer exact Somfy manufacturer product assets. When an exact SKU asset is
  not available, use the best official Somfy family reference and mark it
  `family-reference`; do not present it as an exact SKU image. Existing BFT
  package images retain their `supplied-source-image` status.
- Reject `noimage` placeholders and preserve the source page and source asset
  URL for every remotely sourced image in the manifest.

## Result

- The commercial snapshot contains 150 selected products: 141 GBP-priced and
  9 quote-only after the ICC currency correction.
- The image manifest covers all 150 products: 133 exact manufacturer assets,
  15 explicitly marked family references, and 2 existing supplied BFT assets.
- All 150 referenced local files exist and pass the image-file check; no
  manifest entry points to a `noimage` placeholder.

## Validation

- `npm test`: 16 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with four pre-existing warnings and zero errors.
- The image audit confirmed 150 manifest paths, zero missing files and zero
  invalid files.
