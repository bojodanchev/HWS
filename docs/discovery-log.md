# Discovery Log

Reverse-chronological. Most recent first.

## [2026-09-06] HWS treatment configured and tested in AIR chat

Owner approved the reviewed extension-1007 setup. Saved knowledge attachment,
four departmental transfer rules, lead questionnaire, voicemail-11 fallback,
automatic recording and FAQ corrections; settings and six active skills were
read back. All twelve scenario categories were exercised in internal chat.
A synthetic lead was verified in RingCentral Leads with the corrected dimensions.
Ambiguous-request behavior required a targeted FAQ; the final retest asks a
clarifying question. Provider limits require five custom lead questions, so
callback timing and confirmation share the fifth question.

Lucy remains on the company main-number route. The treatment has no direct
number and remains Not connected. No unassigned numbers are available; a pilot
number/routing decision and actual telephone/audio/handoff/recording tests remain.

Full evidence and limits:
[configuration receipt](../evals/ringcentral-air-configuration-receipt-2026-09-06.md).

## [2026-08-31] Incumbent evaluation artifacts and treatment design saved
**Context**: The owner asked to preserve the current agent's results as a
benchmark and specify what our voice agent should do differently.
**Results**:
- Saved the PII-free 60-day and 90-day Lucy control snapshot as
  [evals/ringcentral-air-lucy-incumbent-2026-08-31.json](../evals/ringcentral-air-lucy-incumbent-2026-08-31.json).
- Saved an anonymized scenario suite for offline/manual scoring and a treatment
  design covering grounded knowledge, deterministic intent flow, lead
  read-back, context transfers, schedule consistency, disclosure and ledger
  instrumentation.
- Set a provisional practical bar of **52.9% reviewer-verified resolution**
  versus Lucy's 42.9% observed 90-day rate, with at least 50 eligible calls per
  arm and no critical guardrail regression. This is a directional target, not a
  guaranteed lift.
**Boundary**: No live route, number, queue, skill, permission or recording
  setting was changed. Ext. 1007 remains Not connected. Transcript/recording
  review is still required before any winner claim.
**Artifacts**: [evals/README.md](../evals/README.md),
[treatment design](../evals/ringcentral-air-treatment-design-2026-08-31.md).

## [2026-08-31] AIR 60/90-day incumbent pool pulled
**Context**: The user requested a larger agent-specific benchmark than the
original 18-row/30-day snapshot.
**Results**:
- AIR Call History custom range **03 Jul–31 Aug (60 days)** returned **25 rows**:
  23 Lucy and 2 Amelia. AIR Analytics returned **21 handled**, **9 resolved**,
  **12 unresolved**, 2 knowledge-base resolutions and 7 context transfers.
- AIR Call History custom range **03 Jun–31 Aug (90 days)** returned **32 rows**:
  30 Lucy and 2 Amelia. AIR Analytics returned **28 handled**, **12 resolved**,
  **16 unresolved**, 2 knowledge-base resolutions and 10 context transfers.
- AIR Analytics agent filters show all handled calls in both windows belong to
  Lucy; Amelia’s two history rows and the other AIRs contribute zero handled
  calls. Lead capture shows 4 responses in 60 days and 10 in 90 days; caller
  details were not logged.
- Resolution is stable at **42.9%** in both windows, but the intervals remain
  wide. Use 90 days as the primary baseline and 60 days as the recency check;
  do not pool overlapping windows.
**Full evaluation**: [ringcentral-air-baseline-evaluation-2026-08-31.md](ringcentral-air-baseline-evaluation-2026-08-31.md).

## [2026-08-31] SBI HWS Treatment AIR created safely
**Context**: The user completed the RingCentral SSO hand-off and continued the
prepared treatment-agent setup.
**Results**:
- **SBI HWS Treatment (Ext. 1007)** was created and verified in both AIR Studio
  and the standard extension inventory.
- The profile is **Not connected** with no number, queue or company
  call-handling rule, so Lucy’s live route was not changed.
- Initial active skills are Company greeting, Location and business hours, and
  Frequently asked questions. Transfer, knowledge-base, context-transfer, SMS,
  appointment and lead-capture skills remain uncreated.
- The setup uses English (UK), the same Lucy voice/personality baseline and a
  revised company description/greeting for the treatment.
- The supported programmatic boundary remains account/extension/call-log reads
  through the local bridge; AIR Studio CRUD/skills/analytics/routing are not
  exposed as documented public API/CLI operations.
**Safety**: No test call was placed, no number or route was assigned, and no
existing assistant or permission was changed.
**Full boundary note**: [ringcentral-programmatic-boundary-2026-08-31.md](ringcentral-programmatic-boundary-2026-08-31.md).

## [2026-08-31] Longer RingCentral windows checked for AIR benchmarking
**Context**: Owner asked whether 60/90 days could provide a larger evaluation
pool than the 18 AIR rows in the last 30 days.
**Results**:
- The broader account call log contains **234 rows in 60 days** and **627 rows
  in 90 days** through 27 August, but these are all-account records, not an AIR
  cohort.
- Extension filters on that account endpoint returned the same period totals,
  so they are not a trustworthy way to isolate Lucy/AIR traffic.
- The valid larger pool must be pulled from AIR Studio’s authenticated custom
  date range for Call history and Analytics. The AIR-specific 60/90-day pull is
  now complete and is the valid larger pool.
**Decision**: Do not use the 234/627 all-account rows as a proxy for AIR
performance. Keep account-log rows separate from AIR denominators; the
AIR-specific 60/90-day pull supersedes that proxy.

## [2026-08-31] RingCentral AIR incumbent baseline evaluated
**Context**: Owner asked for a benchmark using the existing AIR statistics before
creating our treatment agent.
**Results**:
- AIR Call history: 18 Lucy rows in the Last 30 days, 11 caller-ended and 7
  transferred; visible recording duration on every row.
- AIR Analytics: 16 handled, 7 resolved (43.8%), 9 unresolved (56.3%), 2
  knowledge-base resolutions and 5 context transfers; 18 of 100 AIR minutes
  used.
- Lead capture: 1 response with 3 questions. Current evidence is too small to
  judge lead quality or answer correctness.
- Wilson intervals and denominator conflict checks show this is a directional
  baseline, not a winner decision. The 18 history rows and 16 analytics calls
  must remain separate until reconciled.
**Full evaluation**: [ringcentral-air-baseline-evaluation-2026-08-31.md](ringcentral-air-baseline-evaluation-2026-08-31.md).

## [2026-08-31] AIR evaluation and benchmark plan defined
**Context**: Owner wants to benchmark the incumbent AIR configuration against
our treatment agent.
**Plan**:
- Use Lucy’s AIR Call history and AIR Analytics as the incumbent baseline, but
  keep their 18-row history and 16-call analytics denominators separate.
- Judge each eligible conversation with one primary outcome (verified
  resolution) plus transcript rubric scores for intent, factual accuracy,
  completion, handoff, lead capture, conversation quality and safety.
- Keep routing, language, greeting/disclosure, hours, backup, lead fields and
  recording behavior constant; vary one prompt, knowledge or workflow variable
  at a time.
- Use a dedicated number/queue/IVR cohort for the treatment and do not call a
  winner from the current 18-call sample. Normalize both providers into a
  one-row-per-conversation ledger before comparing.
**Full plan**: [ringcentral-air-benchmark-plan-2026-08-31.md](ringcentral-air-benchmark-plan-2026-08-31.md).

## [2026-08-31] RingCentral AIR versus ElevenLabs comparison scoped
**Context**: Compared the current RingCentral AI Receptionist baseline with
ElevenLabs Agents for the proposed incumbent-versus-our-work pilot.
**Decision**:
- Use Lucy on the existing RingCentral route as the control. RingCentral is the
  lowest-risk operational path because the number, call rules, backup, AIR
  history and AIR analytics already exist.
- Use a separate RingCentral number/queue/IVR cohort for a treatment. If the
  treatment is ElevenLabs, use a dedicated Twilio number or a verified
  RingCentral SIP path; ElevenLabs adds telephony/integration work but provides
  native branches, percentage traffic deployment, automated tests, success
  evaluations and branch analytics.
- Hold routing, language, greeting/recording disclosure, backup and lead fields
  constant; vary one prompt, knowledge or workflow variable at a time. Align
  denominators before comparing metrics.
**Full comparison**: [ringcentral-vs-elevenlabs-voice-agent-comparison-2026-08-31.md](ringcentral-vs-elevenlabs-voice-agent-comparison-2026-08-31.md).

## [2026-08-31] Admin Portal follow-up exposed the live AI receptionist setup
**Context**: The user’s authenticated RingCentral browser session was used to
re-test the Admin Portal boundary, with read-only navigation only.
**Learnings**:
- Company call handling routes both business-hours and after-hours main-number
  traffic to **Lucy (Ext. 1003)**. Lucy has backup **Weekend AIR Voicemail
  (Ext. 11)**, no direct number and no queue attached.
- AIR Call history shows 18 Lucy rows in the last 30 days (11 caller-ended, 7
  transferred). AIR Analytics reports 16 handled calls (7 resolved, 9
  unresolved, 2 knowledge-base resolutions, 5 context transfers), so the two
  surfaces use different denominators.
- Lucy is the only connected/in-use assistant. Amelia, Mark, Kristen and
  Jackson are not connected; their skill readiness is recorded in the analysis.
- Lucy has active greeting/location/FAQ/knowledge-base/lead-capture skills, a
  completed website knowledge source, automatic AI-call recording enabled and a
  Weekend AIR Voicemail backup. Transfer, SMS and appointment skills are not
  created. Google Calendar is connected account-wide.
- A schedule mismatch needs review: company routing shows weekend 00:00–00:00,
  while Lucy’s custom location skill shows weekend 08:00–20:00 (Europe/Lisbon).
**Safety**: No password, PIN, audio, message, route, permission or assistant
configuration was changed. Caller PII from the Leads view was not logged.
The Create new AIR flow requested a fresh SSO sign-in; no credentials were
entered.
After explicit user approval, the browser sign-in step was submitted once; the
saved credential did not autofill and RingCentral returned “Enter a password”.
The password was not read or transmitted, and setup remains paused for manual
sign-in.
**Split-test decision**: Preserve Lucy as the control. Build the new assistant
on an unused extension and keep it disconnected until reviewed, then use a
dedicated number, queue or deterministic IVR branch as the treatment arm; do
not percentage-split the live main number without first verifying the routing
semantics.
**Full analysis**: [ringcentral-call-analysis-2026-08-31.md](ringcentral-call-analysis-2026-08-31.md).

## [2026-08-31] RingCentral calls and AI-agent inventory analyzed
**Context**: Read-only account call-log and extension-inventory analysis after
the SBI Voice Assistant Bridge was connected.
**Learnings**:
- The account call log contains 1,547 rows from 2 January through 27 August
  2026 (UTC), with no duplicate record/session/telephony-session IDs.
- Volume is mostly outbound overall (909 rows), but the partial August capture
  is mostly inbound (58 of 70 rows). Weekly volume falls from 59 in W28 to 18
  in W34; W35 is partial through 27 August.
- Attribution is stale for current staffing: 547 rows are unattributed and 715
  are assigned to disabled extension 313 (Antony Tucker). The five enabled
  ApplicationExtensions named Amelia AI, Lucy, Mark, Kristen and Jackson have
  zero direct call-log attribution in this snapshot.
- Detailed application-extension configuration remains outside the current API
  boundary (`TokenInvalid` on numeric detail routes); Company AI points to the
  separately authenticated Admin Portal.
**Full analysis**: [ringcentral-call-analysis-2026-08-31.md](ringcentral-call-analysis-2026-08-31.md).

## [2026-08-30] Abundance/HWS Telegram context refreshed
**Context**: Read-only exploration of the `Abundance` forum group and its
`SBI/Jidoro/HWS/Vectra` topic, with the latest `tech` messages checked for
SBI-related context.
**Learnings**:
- The HWS topic has 209 messages from 2026-07-15 through 2026-08-30. The
  latest concrete signal is to start an SBI AI voice assistant, using
  RingCentral as the current operational surface; provider, scope and success
  criteria are still open.
- A parallel `tech` thread ends with Alex-Shon saying he spoke with the SBI
  owner, then shares a Google Doc titled `SBI Systems` and a company-registry
  link. The surrounding “big game”/private-equity language is strategy context,
  not an accepted deliverable.
- The linked concept proposes a vertical manufacturing/trade SaaS: core business
  objects, modular Sales/Procurement/Inventory/Production/Logistics/Finance/BI,
  an AI/automation layer, and a first Order → Inventory → Production → Delivery
  workflow. It explicitly says not to start with a full ERP and to keep
  client-specific work separate from the reusable product.
- Earlier HWS commitments cover split-testing against the incumbent team,
  client-owned source handoff, admin/customer-support/order workflows, AWS
  cutover with old-site preservation, Somfy/Beninca extraction, and the
  commercial workbook/image migration. The local repo’s existing release logs
  corroborate the catalog/image portions; Telegram alone does not prove hosting
  or provider-side success.
- The group participant list is Alex-Shon, Bojo and the Alfred bot; no separate
  Sean account is a participant. “Sean” appears as project/client context in
  update messages, so identity is not inferred.
**Safety**: Historical auth material (AWS/RingCentral/2FA/API/password) and
media payloads were omitted. No outbound Telegram action was performed.
**Full log**: [telegram-context-2026-08-30.md](telegram-context-2026-08-30.md).

## [2026-08-30] RingCentral bridge connected and account probed
**Context**: The private `SBI Voice Assistant Bridge` REST API app and an
app-restricted JWT were created, then exercised through the local bridge.
**Learnings**:
- JWT exchange and account/extension/Team Messaging reads succeeded. The
  authenticated user is Trevon Shone on extension 318 with Super Admin role.
- The account exposes 33 extensions, including existing AI application
  extensions Amelia AI, Lucy, Mark (technical support), Kristen (Billing and
  accounts) and Jackson (Existing distributors), plus an IVR and departmental
  routing resources. The two visible Team Messaging chats returned no posts.
- The account call log returned at least 100 voice records (80 inbound, 20
  outbound; 59 with recording metadata on the first page). Further paging was
  stopped after a provider HTTP 429. Numeric cross-extension message/detail
  routes returned `TokenInvalid`, so Admin Portal access or additional app
  scopes are still needed for assistant configuration.
**Safety**: No chat post, SMS, call, routing change, recording download or
credential export was performed. Credentials remain in the ignored local
`.env` file with mode 0600.
**Full log**: [ringcentral-probe-2026-08-30.md](ringcentral-probe-2026-08-30.md).

## [2026-08-07] ICC audit corrected and commercial imagery imported
**Context**: Sean asked for a second pass over ICC pricing and for missing
commercial product images to be sourced with consistent provenance.
**Learnings**:
- ICC source rows 65–68 are under the BGN price header. They are now
  quote-only; the snapshot reports 141 GBP-priced and 9 quote-only products.
- EUR rows use the established `0.8572` EUR-to-GBP rate, remove 20% VAT from
  recommended inc-VAT prices, and use two-decimal half-up currency rounding.
- Official Somfy BG, Somfy Pro and Somfy master catalogue sources produced
  133 exact SKU image matches and 15 explicitly marked family references.
  The two existing BFT package images remain supplied-source assets.
- `somfy-image-manifest.json` retains source page URLs, source asset URLs,
  review status and local paths. All 150 product paths exist locally and no
  `noimage` placeholder remains.
**Validation**: 16 tests, TypeScript, lint (four pre-existing warnings), the
  complete image-file audit, and the 1,681-page production build passed.
  Commit `7972964` was pushed to `main`; Vercel deployment
  `dpl_BrW7LMGPFsovBTsJsAdA79pLd9c6` reached Ready and the canonical
  `hwsystem.vercel.app` OXIMO, Scenario Player and direct image routes returned
  HTTP 200.
**Communication**: Completion was posted as a Codex agent message in the HWS
  topic `Abundance → SBI/Jidoro/HWS/Vectra`, Telegram message `2570`.


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
