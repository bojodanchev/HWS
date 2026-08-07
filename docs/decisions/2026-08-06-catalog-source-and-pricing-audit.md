# Catalog source and pricing audit — 2026-08-06

> Access status was superseded on 2026-08-07 by
> [`2026-08-07-commercial-workbook-import.md`](2026-08-07-commercial-workbook-import.md).
> The pricing, provenance and image-quality rules below remain in force.

## Scope

This decision records the first auditable catalog pass for the six supplied
spreadsheets and the Nice Gate & Door catalogue. It keeps source data,
purchase cost and public presentation separate so a missing or stale price
cannot silently become a production sale price.

## Source access

- The BFT workbook is accessible and was downloaded as `Copy of BFT COMMERCIAL
  PRICELIST 2026_BG DONE.xlsx`. It contains one worksheet, 207 reference rows,
  206 unique references after removing the duplicated `2600216` row, 234
  embedded images and Bulgarian source descriptions.
- The five remaining spreadsheet links currently return HTTP 401 to the
  authenticated `bojodanchev@gmail.com` export/API path (and Drive reports
  them as not found for that account). They must be shared with that account
  or supplied as `.xlsx/.csv` before ICC, REC and “Garage door promotion” data
  can be imported or deduplicated across all files.
- The supplied Nice PDF is the official **Nice Gate & Door 2026 Catalogue**,
  222 pages: [nice_gate_door_catalogue_en.pdf](https://www.niceforyou.com/sites/default/files/upload/catalogues-brochures/nice_gate_door_catalogue_en.pdf).
  It is used for English product-family descriptions and UK category planning,
  not as a current UK price list.

## Pricing policy

The BFT workbook publishes recommended end-customer prices in EUR including
VAT and a formula for the corporate purchase price in EUR excluding VAT:

`purchase EUR ex VAT = recommended EUR inc VAT / 1.20 × (1 − 0.52)`

The import records both the source/recommended value and the hidden corporate
purchase cost. Public BFT prices are normalised to GBP ex VAT using the ECB
reference rate on 5 August 2026 (`1 EUR = £0.85720`):
[ECB reference rates](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html).
The 52% discount is not exposed as a customer-facing price claim.

The UK standard VAT rate is configured as 20%, in line with
[GOV.UK VAT rates](https://www.gov.uk/vat-rates). Every known public price is
rendered as ex VAT, `+ VAT`, and inc VAT. Quote-only products explicitly say
that VAT is calculated on the confirmed quote.

The requested “Garage door promotion” file and its sale-margin instruction
are not yet accessible. No 60% margin is applied until that file is available
and the meaning of “60% margin” is confirmed as gross margin rather than
markup.

## Catalog quality rules

- Product identity is SKU/reference first; normalized duplicate references are
  removed before products reach the runtime catalog.
- Public product copy is English at the loader boundary. HTML entities are
  decoded, the requested Somfy expert strings become `SBI`, and legacy
  non-English supplier paragraphs fall back to an English product/category
  description while retaining source tags and structured specifications.
- Workbook images are extracted only for the BFT rows that contain them, with
  a local SKU manifest. ICC and REC image mapping is intentionally pending the
  missing files and exact product references.
- Nice garage-door families are quote-only until the owner supplies current UK
  commercial prices. The current UK-facing category comparison supports
  garage-door motors, sectional doors, up-and-over/counterweight doors and
  rolling/industrial doors as distinct merchandising paths.
- “Recommended for this installation” uses curated SKU links. A conservative
  same-brand/category fallback is labelled “Related products”; no unsupported
  “frequently bought together” claim is made without order data.
- The strings `Become Somfy Expert` and `Become an Expert` are normalised to
  `SBI` at the vendor-copy boundary.

## Open source-dependent checks

FP/MF comparison, cross-file deduplication, ICC/REC image sourcing and the
garage-door promotion price calculation remain open until the five missing
spreadsheets are readable.
