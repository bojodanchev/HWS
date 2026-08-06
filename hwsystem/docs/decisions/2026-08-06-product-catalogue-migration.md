# Decision: Make the complete product catalogue migration the primary workstream

- Date: 2026-08-06
- Status: Accepted
- Scope: HWS product data, images, pricing, product pages and recommendations

## Context

HWS currently has a typed catalogue boundary and a partial import. The BFT
workbook has structured records and image assets, while the public Somfy Pro UK
and Beninca snapshot is primarily metadata. Nice has selected families from the
supplied old catalogue, but current UK prices and product photography are not
complete. The owner has requested access to additional sister-site and Drive
files and clarified that populating the site with real products, complete
information and images is the main purpose of this project.

## Decision

The migration will produce one canonical, SKU-first product catalogue behind
`src/content/catalog.ts` and `src/lib/catalog.ts`. All source files, sister
website snapshots and Drive exports will be ingested through source artifacts
and typed loaders, with provenance and conflicts retained in the import audit.

Product identity is based on the manufacturer SKU/part number. Products that
appear in multiple sources are merged into one public record; duplicate names,
source IDs or near-matching descriptions are not sufficient identity evidence.
Unresolved SKU/specification conflicts block publication rather than being
silently overwritten.

Source precedence is:

1. current owner-approved commercial data and current sister-site/Drive data;
2. structured spreadsheet source data;
3. official manufacturer product/content sources;
4. the old Nice catalogue as a product and content reference only.

For pricing, the source price, 52% corporate purchase discount, public GBP sale
price and VAT calculation are separate values. Public pages show GBP ex VAT,
the VAT amount and the inc-VAT total; internal purchase cost never reaches an
unauthenticated client. Garage doors remain Trade Account-only with a minimum
quantity of five, and their purchase-cost/margin formula must be recorded
explicitly before publication. Current Nice prices require direct owner
confirmation.

Every sellable record must have professional English copy, structured specs,
compatibility/replacement information where evidenced, the correct category,
appropriate original or official manufacturer imagery, and a source review
status. Related products may use explicit compatibility/accessory mappings and
conservative category fallbacks, but the site must not claim purchase history
without real order data.

## Consequences

### Positive

- The website can become a reliable product destination rather than a mixture
  of mock, metadata-only and sellable records.
- SKU-first deduplication protects search, URLs, pricing and assistant answers.
- Source provenance makes future Drive refreshes auditable and repeatable.
- Pricing and image gaps are visible before they reach customers.

### Trade-offs

- The import pipeline must retain audit metadata in addition to the public
  `Product` projection.
- Missing images, uncertain specs and unresolved commercial conflicts may leave
  products blocked or quote-only until reviewed.
- The old Nice catalogue cannot provide current prices by itself.

## Completion gate

The catalogue migration is complete only after source coverage, SKU duplicate
checks, English/content QA, image coverage, pricing/VAT checks, product-page
rendering, search, recommendations and production data-path validation all
pass for the imported set.
