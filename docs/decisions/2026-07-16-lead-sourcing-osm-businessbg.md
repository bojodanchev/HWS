# Decision: Source leads from OSM + business.bg, not trade platforms or paid data

**Date**: 2026-07-16
**Status**: accepted

## Context
HWS needs a 1,000+ outreach list covering BG + UK: parts/hardware distributors, shop owners, garden/repair retailers, and self-employed installers/handymen. Options ranged from scraping trade marketplaces to paid lead providers.

## Decision
Combine two free, legally unproblematic public sources:
- **business.bg** keyword search (железария, обков, брави, панти, крепежни елементи, заключващи системи, врати, ключар, градински център, инструменти) for the BG distributor/trade segment — richest contact data (99% phones, 85% emails).
- **OpenStreetMap Overpass** for both countries (shop=hardware/doityourself/trade/garden_centre/locksmith/doors, craft=carpenter/joiner/window_construction/metal_construction/locksmith) — volume and UK coverage.
Merge, dedupe by normalized name+city and by phone, rank by contactability, deliver a segment-balanced top-1000 plus the full database.

## Alternatives Considered
- **MyBuilder / Checkatrade / maistorplus.com**: best fit for the freelancer-installer segment but actively block scraping (ToS + technical). Rejected; outreach through those platforms directly or a paid provider is the follow-up if that segment needs depth.
- **UK Companies House API by SIC code**: registered-office data only, no operational phones/emails; needs an API key. Skipped.
- **Yell.com / paid B2B data (e.g. Apollo)**: anti-scraping / costs money; not needed once OSM+business.bg exceeded target 10×.

## Consequences
- 10,978-lead database delivered at zero cost; the top-1000 cut is fully contactable.
- Installer/handyman segment is the thinnest (public data gap, craft=handyman unused in OSM) — accepted limitation.
- ~3,500 OSM leads have websites but no phone/email; a contact-page crawl can enrich them later.
- OSM data quality varies (some names without any contact field); the full CSV keeps them for address-based or lookup-based outreach.
