# Discovery Log

Reverse-chronological. Most recent first.

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
