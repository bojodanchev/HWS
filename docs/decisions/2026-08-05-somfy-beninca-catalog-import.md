# Decision: Somfy Pro UK + Beninca public-metadata import

**Date**: 2026-08-05
**Status**: integrated under a public-metadata-only boundary; data integrity, tests, lint, and the production build pass, with push and public production verification remaining as the release gate

## Context

The owner asked for Somfy Pro UK and Beninca products to be added to the local HWS project. The HWS app is currently a static, typed catalog: `hwsystem/src/content/catalog.ts` is the MVP data layer, components read through `hwsystem/src/lib/catalog.ts`, and the WooCommerce client in `hwsystem/src/lib/woo.ts` still has intentionally unimplemented raw-to-domain mappers until the WP attribute schema is finalised.

The source inventory below is the 2026-08-05 official-site spot-check posted in the Buzz channel. The owner later authorized the full two-site public metadata import, with no login, account-gated commercial values, invented commercial fields, or unapproved assets. The implementation handoff below records the current shared-worktree state without treating isolated UI validation as combined acceptance.

## Source inventory

### Somfy Pro UK

- Canonical catalogue/search surface: <https://www.somfypro.co.uk/e-catalogue>. The observed public surface reported **1,092 products** and showed net prices behind “Log in to view your net prices”. An earlier channel estimate said approximately 1,094; treat the discrepancy as unresolved and do not use either number as an exact import target without a fresh recheck.
- Garage-door category: <https://www.somfypro.co.uk/catalog/garage-doors>, observed at **167 products**.
- Remote-controls/wall-switch category: <https://www.somfypro.co.uk/catalog/remote-controls-wall-switch>, observed at **326 products**, including **78** tagged for the garage-door application.
- Representative public references: `1241570` Dexxo Smart 1000 io, `1216539` Dexxo Smart 800 io, `1051357` RDO 50 CSI Vectran 50Nm/12rpm, and `1045550` RDO 50 CSI Helios 30Nm/17rpm.
- Representative product pages: <https://www.somfypro.co.uk/products/1241570> and <https://www.somfypro.co.uk/products/1037012-lt50-jet-10-17-csi-vvf-3m>.
- Fields observed on product pages: reference, title, description, warranty, applications/compatibilities, technical characteristics, images, and installation/document links. Public net pricing is not available in the spot-check.
- Latest read-only scope baseline: <https://www.somfypro.co.uk/robots.txt> permits public crawling and points to <https://www.somfypro.co.uk/sitemap.xml>; <https://www.somfypro.co.uk/search/%2A?page=1> reported approximately **1,097 products** at the later check time. Canonical category examples are `/catalog/motors`, `/catalog/controls`, `/catalog/sensors`, and `/catalog/accessories`.
- Latest representative public SSR product: <https://www.somfypro.co.uk/products/1810803-rs485-rts-transmitter>. The observed page exposed SKU/slug/name, attributes, tags, logistics, images, and documents, while net prices/order behavior required login. The earlier 1,092 e-catalogue and approximately 1,094 estimates are historical surface-specific observations; do not merge them into one exact count.

### Beninca

- Canonical English category: <https://www.beninca.com/en/beninca-products/automations-for-garage-industrial-doors.html>. It exposes filters for regulation, use, application, and power supply, plus product cards and links to product pages, manuals, and product sheets.
- `MARK`: <https://www.beninca.com/en/product/automations-for-garage-industrial-doors/mark.html> — observed fields include 24 Vdc, maximum torque 300 Nm, maximum door area 8 m² for one motor, IP20, and a 433.92 MHz receiver.
- `JACK24.50`: <https://www.beninca.com/en/product/automations-for-garage-industrial-doors/jack24-50.html> — observed fields include 24 Vdc side operator, maximum torque 50 Nm, maximum door area 20 m², IP40, and a 433.92 MHz receiver.
- `VN.S20`: <https://www.beninca.com/en/product/automations-for-garage-industrial-doors/vn-s20.html> — observed fields include 230 Vac, maximum torque 130 Nm, maximum door area 35 m², IP40, and industrial sectional/rolling-door use.
- Technical specifications and download links were public in the spot-check; no public price was visible. Image and PDF reuse rights were not established. Until that is confirmed, import factual fields and source links in project documentation only; do not copy or hotlink assets.
- Latest English catalogue hub: <https://www.beninca.com/en/catalogue.html>. Main public families include <https://www.beninca.com/en/beninca-products/automations-for-swinging-gates.html>, <https://www.beninca.com/en/beninca-products/automations-for-sliding-gates.html>, <https://www.beninca.com/en/beninca-products/automations-for-garage-industrial-doors.html>, and <https://www.beninca.com/en/beninca-products/road-barriers-car-park-saver.html>, plus accessory subcategories.
- Later bounded read-only inventory found **132 unique detail URLs** across four main families and **73** across 12 accessory sections, or at least **205 public detail URLs**. This is a public-detail scope baseline, not a claim of a complete brand catalog. Additional representative pages: <https://www.beninca.com/en/product/transmitters/iri-tx4va.html>, <https://www.beninca.com/en/product/automations-for-swinging-gates/bob21m.html>, and <https://www.beninca.com/en/product/road-barriers-car-park-saver/diva-3.html>.
- The official catalogue link <https://ftp.benincagroup.com/alias/beninca-eng-cat> returned session HTML during the read-only check rather than a direct PDF. Do not bulk-copy catalogue artwork or documents until rights and source format are confirmed.

## Decision

1. Implement the smallest compatible quote-only/availability-unknown domain and UI change, then import all publicly exposed Somfy Pro UK and Beninca product metadata within the verified source scope. Keep the import reviewable and local.
2. Normalize brands to the closed HWS union: `Somfy` and `Beninca`; never create a `Somfy Pro UK` facet value.
3. Map every product to an existing category slug, use stable unique `id`/`slug` values, and flatten each sellable variation to its own SKU because the current UI does not render or select `variants`.
4. Map only verified fields represented by the current `SpecKey` enum. Compatibility and replacement relationships must be explicit source evidence, not inference. Unsupported facts may remain in plain description or be omitted.
5. Keep provenance in this decision/source note. Do not invent a `sourceUrl` field in `Product`.
6. Do not guess or import account-gated net/trade prices, missing public RRP, stock, next-day eligibility, price breaks, unsupported specifications, or unlicensed images/PDFs. The selected implementation path is a deliberate quote-only plus availability-unknown schema/UI extension; unknown commercial values must remain unknown, never defaults. Use `images: []` and `documents: []` where assets are not approved.

### Owner override and current acceptance gate

The owner scope update at `2026-08-05T19:58:35Z` supersedes the earlier pending-choice state: proceed with the full two-site public metadata import and implement quote-only plus availability-unknown support. Images/documents remain on hold because reuse rights are not established. Account-gated net/trade prices, RRP, stock, next-day values, and price breaks remain out of scope unless explicitly approved as commercial mappings.

Implementation is authorized but not yet accepted. At the pre-override UI checkpoint at `2026-08-05T19:59:03Z`, the HWS app had 17 products and no new source rows or UI/schema changes. Post-override implementation is now integrated and its production build has passed; imported-data integrity, release, and public-result evidence remain pending. Acceptance requires:

- quote-only and unknown-availability rendering through the existing catalog boundary;
- source-attributed public metadata with normalized brands, supported specs, stable unique routes/SKUs/slugs, and empty unapproved assets;
- no trade-price leakage, correct product JSON-LD, category/search/sitemap behavior, accessibility, and full lint/build evidence; and
- no deployment, credential, or provider configuration changes.

## Implementation handoff

Evidence timestamps: UI handoff `2026-08-05T20:16:08Z`; integrated build `2026-08-05T20:22:52Z`.

- Final shared contract: `Price.rrp`, `currency`, and `vatIncluded` are optional; quote-only records use exactly `{ quoteOnly: true }` with no RRP/currency/VAT/trade fields; `StockStatus` includes `unknown`, and unknown stock omits `nextDayEligible`.
- Data handoff in `/Users/bojodanchev/HWS/hwsystem` is integrated through `src/types/catalog.ts`, `src/content/catalog.ts`, `src/content/vendor-catalog.ts`, and `src/content/vendor-catalog.json`; the generated `supplierCatalog.ts` file is no longer used.
- The public snapshot reports **1,097 Somfy Pro UK + 205 Beninca = 1,302 records**, with per-record canonical source URLs/public facts, `images: []`, `documents: []`, `price: { quoteOnly: true }`, and `stock: { status: "unknown" }`.
- Quote-only and unknown-availability rendering covers product JSON-LD, `ProductCard`, `PriceBlock`, `StockBadge`, product empty states, and catalog display/sorting helpers. Quote-only records render “Price on request”; unknown stock renders “Availability on request”; empty image/document fallbacks remain accessible; trade-tier stripping remains intact.
- Combined validation passed `npm test` (9 tests), `npm run lint` (6 existing warnings, 0 errors), the catalog integrity checks (counts, unique SKU/slug, HTTPS provenance, empty assets, closed spec keys), `git diff --check`, and `npm run build` with TypeScript clean and **1,358 static pages**, including **1,319 product routes** (17 baseline + 1,302 imported). The only reported build warning is the existing multiple-lockfile workspace-root inference. Push and public production verification remain pending.
- No login, credentials, or unapproved assets were used. The main app has now been combined-validated locally; deployment and public-result verification remain pending.

## HWS constraints and consequences

- `hwsystem/src/types/catalog.ts` is the catalog contract. `Brand`, `SpecKey`, and `DocumentType` remain closed; `Price` and `Stock` now carry the minimal quote-only/unknown states needed for public metadata without inventing commercial values.
- Category routes call `getCategory()` and return not-found for unknown slugs. Every imported row therefore needs an existing category mapping before it can render.
- `hwsystem/src/lib/catalog.ts` is the component-facing data boundary. `hwsystem/src/lib/woo.ts` is server-only and its `mapProduct`/`mapCategory` functions deliberately throw until the WordPress attribute schema is agreed.
- Product pages statically generate one route per product and category pages render their full result set. The observed Somfy scope is approximately 1,097 public records and the observed Beninca scope is at least 205 public detail URLs; the import must address static-array scale, search, sitemap, and route generation rather than silently treating it as a small subset.
- The baseline product model required a public RRP and known stock; the current data-side change adds explicit quote-only and availability-unknown states. Product images require local/approved URLs and dimensions, and `next.config.ts` has no remote image host configuration. Do not hotlink manufacturer images.
- Category facets currently extract only `torque`, `tubeDiameter`, `voltage`, and `frequency`; other verified source attributes can display but will not become filters without coordinated UI/schema work. Compatibility strings are rendered verbatim, participate in search, and feed the deterministic assistant, so they must be concise, deduplicated, and explicitly evidenced.
- `ProductDocument` only supports the fixed document types/languages and the current document list presents every item as a PDF. Import actual approved PDFs only; HTML, ZIP, or other source downloads need a separate content/UI decision.
- `ProductCard.tsx` hardcodes “ex VAT” while `PriceBlock.tsx` respects `vatIncluded`. A verified VAT-inclusive source price would be mislabelled on cards until that UI mismatch is fixed; do not silently normalize or invent VAT semantics.
- The HWS parent checkout already contains unrelated modified documentation and QA artifacts. Any future import work must preserve those changes and report exact files/counts before completion.

## Safe operating path

1. Read the official public Somfy Pro UK and Beninca pages and record only fields visibly published there. Do not log in, use account-gated data, download/copy assets without confirmed reuse rights, or change provider credentials.
2. Implement the approved quote-only/availability-unknown support and public metadata import only in the local HWS checkout, primarily through `hwsystem/src/content/catalog.ts` and the existing catalog boundary. Keep provenance in this note or a linked source note, and preserve unrelated parent-checkout changes.
3. Run `npm run lint` and `npm run build` from `/Users/bojodanchev/HWS/hwsystem`; inspect the diff and report exact files/counts.
4. Do not alter Vercel configuration, `WOO_*` or other credentials, or claim production delivery from a local build. The owner has now explicitly requested the release; Operations must still record the final commit/push and public-result evidence before this note marks production delivered.

## Resume context and open questions

- Coding Engineer owns the public metadata/data-layer import; UI Engineer owns matching quote-only/unknown-availability rendering. The integrated handoff and isolated UI commit are recorded above; Operations owns the remaining imported-data checks and final release evidence.
- After integration, re-check exact SKU/slug/category uniqueness, empty-image/document behavior, ProductCard VAT labeling, SEO JSON-LD, category/search/sitemap behavior, accessibility, the Somfy count discrepancy, image/PDF licensing, and large-feed rendering.
- This note records the owner override and current handoff; production readiness is not claimed until combined validation, diff review, commit/push, and public-result verification are documented.

## Evidence

- Official-site source spot-check and import guardrails: Buzz event `34c6a5998a8844d9119c09a976970f80a2970f084675a0bfa985e2dac9477f65`.
- UI/schema review: Buzz event `9dc85f61f011f52c52e6af9f0754c5c9c9248a9734dad9143760eb8fbe9cd047`.
- UI review validation at HWS commit `151decba`: `npm run lint` passed and `npm run build` passed, generating 45 static pages including 17 product routes. The only reported warning was Next.js inferring `/Users/bojodanchev` as the workspace root because both the parent and HWS have lockfiles; no HWS source files changed and unrelated parent files were preserved. Buzz event `1dcee474bcf00bf32af21eba7a3511933eac29e6e014f4ab5b8047e5b0709887`.
- Bounded-subset acceptance and validation request: Buzz event `920ea15bd07ea07c692012e1860dc091fc86bc55e3ab3afdabbfcab50be7acee`.
- Knowledge-base acceptance and no-deploy/no-credential-change requirement: Buzz event `d4ac774b3bff5c341239730f0b00ca8c0cdb7b904cba4ad18ec409aaeb037baf`.
- Acceptance review and commercial-data block: Buzz event `4f81f26de87e75cf0e68610090ddc999d7a624cbdb5ef1abf4608a6f0cb94047` at `2026-08-05T19:55:48Z`.
- Owner scope override authorizing public metadata import and quote-only/availability-unknown support: Buzz event `56c71cd789e425ea3b9cfec6bdbd3ed7ea31edecdbcf97258a6c7a228571a40a` at `2026-08-05T19:58:35Z`.
- UI acceptance checklist for the pre-import checkout and post-approval gates: Buzz event `234d436f569f59aacb40f6eeabe41afef9708c243918e125f94a58ca467c1aaf` at `2026-08-05T19:59:03Z`.
- Data handoff with exact 1,302-record manifest and main-worktree files: Buzz events `d7bdc368bc5f9acc73e41d59cd8eb881d6eb1ee7c0cfeee5278f67281e7b70f6` and `b64100891dc45c04b84930e8edb1b9cc67f3509abf0ab91e785e24a740d21ec3` at `2026-08-05T20:13:20Z` and `2026-08-05T20:13:57Z`.
- UI integration commit and isolated validation: Buzz event `64c08a1621e4611a29589b3d52b92eb6ce11c974ca3ec21b11b97c7442943093` at `2026-08-05T20:16:08Z`; commit `44e5fca477b2560381370cb33744f3c25aa62d17`.
- Transient implementation hold pending an explicit option choice: Buzz event `9400265d43d42c89c8de5a15e19a076c0ebf9471cad21b548c48d58691efd484` at `2026-08-05T19:59:22Z`; superseded by the owner reply below.
- Final owner option-1 confirmation: Buzz event `68bf244dd4b8a7760a684e3f90ce6424ad1aae5aa6c2089e37a4775de24c221f` at `2026-08-05T20:00:14Z`.
- Conflict resolution and final acceptance-gate reminder: Buzz event `3e0cc16b5439dccdf94ae0a8b1100626ade9b5d0a13773fbbaa3e8c48ece00e0` at `2026-08-05T20:01:47Z`.
- Integrated build milestone: `npm run build` passed at HEAD `68b280eff5ec596941464b6b62cdb45d471f88fc`, generating 1,350 static pages including 1,319 product routes; only the existing multiple-lockfile workspace-root warning was reported. Buzz event `28203bb260fd05890e024ae80532086ee55fcf4c20c7b89d12a512edc96c06ba` at `2026-08-05T20:22:52Z`.
- Evidence capture timestamp: `2026-08-05T20:22:52Z` (latest integrated-build milestone; imported-data integrity, release, and public production evidence remain pending).
- Local code evidence reviewed on 2026-08-05: `hwsystem/src/content/catalog.ts`, `hwsystem/src/lib/catalog.ts`, `hwsystem/src/lib/woo.ts`, `hwsystem/src/types/catalog.ts`, `hwsystem/src/app/products/[category]/page.tsx`, `hwsystem/src/app/products/[category]/[slug]/page.tsx`, and `hwsystem/src/components/ProductCard.tsx`.
