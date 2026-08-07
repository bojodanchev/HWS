# Discovery Log

Reverse-chronological. Most recent first.

## [2026-08-07] Shared commercial workbooks imported and released
**Context**: Read-only `gog` access under `bojodanchev@gmail.com` exposed the
two supplied Sheets plus four additional Gmail share notifications: REC, REA,
ICC and HA PRO.
**Learnings**:
- `hwsystem/src/content/somfy-controls-catalog.json` preserves 178 raw rows,
  154 unique SKU keys, source currencies, source rows, pricing audit and the
  unresolved `1871148` ICC conflict. Its typed loader selects 150 products:
  143 GBP-priced and 7 quote-only.
- The import precedence is REC, REA, ICC, HA PRO, then Controls. Existing
  image-backed BFT records remain canonical for overlaps, including `9011069`.
  The BFT workbook matched 203 existing records with zero name, cost or RRP
  mismatches; the 3 local-only records were retained.
- The shared Sheets contained no usable source images or embedded media. BGN
  rows remain quote-only, and no image or currency conversion was invented.
**Validation**: 15 tests, TypeScript, lint (four pre-existing warnings) and a
1,681-page production build passed. Commit `860f0a2` was pushed to `main`;
Vercel deployment `dpl_H3N9nkgqwYnRwYsN5iVq2ZRCTpvw` reached Ready and the
canonical OXIMO route plus sitemap returned HTTP 200.
**Communication**: Progress was posted as a Codex agent message in the HWS
topic `Abundance → SBI/Jidoro/HWS/Vectra`, Telegram message `2567`.


## [2026-08-05] Integrated public-metadata release verified
**Context**: Owner-approved option 1 was implemented and released for the full public Somfy Pro UK and Beninca metadata import.
**Handoff**:
- Main HWS worktree contains the data-side changes in `hwsystem/src/types/catalog.ts`, `hwsystem/src/content/catalog.ts`, `hwsystem/src/content/vendor-catalog.ts`, and the 1,302-record `hwsystem/src/content/vendor-catalog.json` snapshot. The generated `supplierCatalog.ts` file is no longer used.
- Manifest reports 1,097 Somfy Pro UK records + 205 Beninca records = 1,302 total, with canonical source URLs/public facts, empty images/documents, quote-only pricing, and unknown stock.
- Quote-only and unknown-availability UI support is integrated in main; the equivalent isolated UI patch has the same patch identity as the main quote-support commit.
- Combined validation on the reconciled tree: the 1,302-record integrity check passed; `npm test` passed (9 tests); `npm run lint` passed with 0 errors and 6 existing warnings; and `npm run build` passed with TypeScript clean and 1,358 static pages, including 1,319 product routes (17 baseline + 1,302 imported). The only build warning is the existing multiple-lockfile workspace-root inference.
- Route, sitemap, and public product checks passed after pushing `main` at `b58d991a871c481fc1d4dcc8d8e15b096b74ed6e`. Vercel deployment `dpl_9ioWY3GgG69TzUZavWNt2vK67mA7` reached Ready and aliases `https://hwsystem.vercel.app`; homepage, imported SKU page, and sitemap returned HTTP 200, with quote-only and unknown-availability copy visible on the imported page.
**Boundary**: No login, gated or fabricated commercial values, unapproved assets, or credential changes were used. Production deployment followed the owner-requested `main` push.

## [2026-08-05] Owner authorized full public-metadata import with unknown-commercial states
**Context**: Operations recorded the owner scope update for the two-site Somfy Pro UK + Beninca import.
**Decision**:
- Import all publicly exposed product metadata and provenance after adding quote-only and availability-unknown support compatible with the existing HWS catalog boundary.
- Do not log in, use account-gated net prices, invent RRP/stock/next-day values, copy or hotlink images/PDFs without reuse approval, deploy, or change credentials.
- Public scope baseline is approximately 1,097 Somfy records on the later search surface and at least 205 Beninca detail URLs across the bounded inventory; exact post-import counts must be reported.
**Acceptance**: stable unique IDs/SKUs/slugs, existing category routing, closed SpecKey values, empty unapproved assets, provenance, ProductCard/PriceBlock/StockBadge/JSON-LD/category/search/sitemap/accessibility checks, full lint/build, and dirty-parent diff preservation.
**Evidence**: Buzz event `56c71cd789e425ea3b9cfec6bdbd3ed7ea31edecdbcf97258a6c7a228571a40a` at `2026-08-05T19:58:35Z`.
**Follow-up**: Owner option 1 was explicitly confirmed at `2026-08-05T20:00:14Z`; final shared field names, imported counts, and post-import validation remain pending.

## [2026-08-05] Somfy Pro UK + Beninca catalog source inventory captured
**Context**: Owner requested the Somfy Pro UK and Beninca catalogs be added to the local HWS project.
**Learnings**:
- Official public pages expose category/product references and technical fields, but Somfy net prices are account-gated and no public Beninca price was visible in the spot-check.
- HWS remains a static typed catalog. This pre-override checkpoint held all rows pending a commercial-data decision; the later owner override selected quote-only/availability-unknown support for the full public metadata import.
- Do not guess price, stock, compatibility, unsupported specs, or next-day eligibility. Do not copy/hotlink images or PDFs until reuse rights are confirmed. Full evidence and constraints: [decision note](decisions/2026-08-05-somfy-beninca-catalog-import.md).
**Validation**: Baseline HWS commit `151decba` passed `npm run lint` and `npm run build` (45 static pages, 17 product routes); only the existing Next workspace-root warning was reported.

## [2026-07-16] 1,000-lead list built for BG + UK outreach
**Context**: Bojo asked for a 1,000-lead list for HWS: BG/UK distributors, магазини за части, garden/repair shops, and self-employed installers/handymen.
**Learnings**:
- Delivered `hws_leads_top1000.csv` (segment-balanced, 100% have phone or email) and `hws_leads.csv` (full 10,978-lead deduped database: 1,770 BG + 9,208 UK) in the repo root (untracked).
- Two sources worked: **business.bg** (BG's real business catalog — 1,104 firms across железария/обков/брави/панти/крепежи/врати/ключари keywords; 99% phones, 85% emails) and **OpenStreetMap Overpass** (24 country×category queries: shop=hardware/doityourself/trade/garden_centre/locksmith/doors + craft=carpenter/joiner/window_construction/metal_construction/locksmith/handyman).
- Dead ends: bgcatalog.com and firmite.bg are WordPress shells, not directories; zlatnistranici.bg doesn't resolve; MyBuilder/Checkatrade/maistorplus block scraping — the handyman/freelancer segment is structurally thin in public data (craft=handyman returned 0 in both countries).
- Segment mix of full DB: UK retail 5,920 / UK trade 1,940 / UK installers 1,348 / BG trade 1,016 / BG retail 576 / BG installers 178. 3,563 have direct phone/email; ~3,500 more have websites (future email-enrichment crawl possible).
- Scraper scripts (fetch_osm2.py, fetch_businessbg.py, merge.py, run_osm_hardened.sh) live in the session scratchpad only — the CSVs are the durable artifact.
**Files touched**: hws_leads.csv, hws_leads_top1000.csv (repo root, untracked).

## [2026-07-15] MVP built, deployed, validated end-to-end
**Context**: `/goal` run — implement PROJECT.md fully, deploy to Vercel, close validation loop with real imagery.
**Learnings**:
- hwsystem.co.uk is a "Pardon our dust" WP shell (no products, Store API `[]`); all 39 real images scraped from sbigaragedoors.co.uk + sbi-bg.com (`curl -k` for the BG site). Their genuinely photographed products: BFT Mitto remote, Moovi 30 barrier, Novoferm NovoPort/iSO20, sectional doors.
- Competitor positioning: SWR Trade Spares = brand-first nav, price breaks, free delivery £99+, 7-day returns; Ellard = "The Home of Motors & Controls", solution segmentation (industrial/garage/blinds). Both informed catalog structure.
- Alex-Shon's mockup screenshots (docs/reference-screenshots/) match PROJECT.md exactly; the build replicates them with real photos replacing gray placeholders. Fake testimonials from the mockup deliberately omitted.
- Vercel project created via REST API with `rootDirectory: "hwsystem"`; deploys on push to main. Live at https://hwsystem.vercel.app.
- Validated in prod browser: filters (URL params), SKU search ranking, product page, doors page (range/exploded view/finishes/RAL), quote submit → thank-you, `[lead]` visible in `vercel logs`.
- Placeholder contact details + stats pending confirmation from Alex-Shon.
**Files touched**: entire `hwsystem/` app (first implementation), `docs/` knowledge base.

## [2026-07-15] Project context scraped from Telegram
**Context**: Bojo asked to scrape the "SBI/Jidoro/HWS/Vectra" topic (Abundance group) for project context.
**Learnings**:
- Brand portfolio: SBI Group International (Bristol, family factory since 1997, "powered by Somfy", empty Woo shop), HWSystem.co.uk (this rebuild), Jidoro (coming soon), Vectra (coming in months). BG site sbi-bg.com ("protection dropped").
- Benchmark per Alex-Shon: SWR Trade Spares (not a generic funnel); Ellard = market gatekeeper; Nice UK distribution is closed (via Linkcare).
- Full transcript: docs/telegram-context-2026-07-15.md.
**Files touched**: docs/telegram-context-2026-07-15.md, PROJECT.md (pre-existing spec, committed as-is).
