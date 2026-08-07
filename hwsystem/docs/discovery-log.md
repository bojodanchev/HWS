# Discovery log

## 2026-07-30 — PR #2 assistant review and hardening

- Reviewed GitHub PR #2, `Add bilingual AI customer assistant`, originally at
  `8bb96ba`.
- The chat was visible only on the PR preview because the PR was still open,
  explaining why it was absent from the main deployment.
- Reproduced a blocking false positive: the Bulgarian SBI compatibility
  question returned an SBI remote, a BFT remote and the unrelated
  `BFT-MOOVI-30` barrier.
- Found that the original route accepted browser-supplied history, had no rate
  limit or upstream timeout, and created a resolved zero-minute ticket for the
  first message without a transcript or contact.
- Reworked the assistant around the standalone typed catalogue, server-owned
  history, deterministic compatibility answers, optional grounded Responses
  API output and consented human handoff.
- Added admin conversation listing and transcript routes, plus one
  conversation-linked ticket per follow-up.
- Updated Next.js to `16.2.12` and cleared production dependency audit
  findings.
- Added request body limits, database-backed throttling, honeypots, strict Zod
  schemas and an eight-second OpenAI timeout.
- Validated locally with eight tests, typecheck, build, production audit,
  API/database smoke tests, desktop browser QA and 390 × 844 mobile QA.
- Pushed commit `904a850` to
  `codex/add-ai-chat-for-client-support`.
- Verified Vercel deployment
  `hwsystem-4nowigu4k-bojidars-projects-2603784f.vercel.app` was READY for the
  exact commit and reproduced the correct Bulgarian SBI answer there with zero
  browser console warnings.

## 2026-08-06 — full product migration is the primary HWS objective

- The owner clarified that the main purpose of HWS is to migrate the actual
  products from the sister websites and the forthcoming Drive files, including
  complete product information and images. The earlier floating-support UI
  work is secondary to this catalogue objective.
- The current checkout contains `206` BFT product records in
  `src/content/bft-catalog.json` and `1,302` vendor records in
  `src/content/vendor-catalog.json` (`1,097` Somfy and `205` Beninca).
- `public/images/vendor/` currently contains `230` local image files, while
  the vendor loader intentionally emits no images for its 1,302 records.
  `nice-catalog.ts` contains selected Nice families with empty images and
  quote-only prices pending current UK commercial confirmation.
- `src/content/catalog.ts` composes the BFT, Nice and vendor loaders, and
  `src/lib/catalog.ts` remains the only public data-access boundary. The
  catalogue is therefore structurally ready for a larger import, but the
  product migration is not complete.
- The next source dependency is Drive access. Once granted, raw exports must
  be normalised into one SKU-first catalogue with deduplication, source
  provenance, approved imagery, English copy, structured specs and verified
  pricing before being presented as sellable products.

## 2026-08-07 — shared commercial workbooks imported

- Read the owner-approved Google Sheets with the personal `gog` account
  `bojodanchev@gmail.com`. In addition to the supplied BFT and Controls sheets,
  Gmail showed four newly shared workbooks: REC, REA, ICC and HA PRO.
- The five Somfy/BFT commercial workbooks contain 178 source rows and 154
 unique SKU keys. The canonical import selects 150 products after excluding
 3 SKUs already present in the image-backed BFT snapshot: 143 EUR-derived
 GBP-priced records and 7 quote-only records.
- The supplied BFT workbook matches the existing 203 common SKU records with
  zero name, cost or RRP mismatches; the existing 3 local-only SKUs and the
  206-product BFT image-backed snapshot are retained.
- EUR values use the existing catalogue conversion boundary of `0.8572` EUR to
  GBP, with public price as ex VAT and purchase cost retained only in the
  source audit. ICC BGN sections remain quote-only because no approved BGN to
  GBP conversion was supplied.
- SKU `1871148` has conflicting ICC rows in BGN and EUR and is excluded from
  the public projection pending review. REC takes precedence over older
  Controls values for overlapping commercial records, including the previously
  unpriced `1811685` record.
- None of these Google Sheets contained source images or embedded workbook
  media. The import preserves empty image arrays and records the gap rather
  than presenting catalogue rows as image-complete.
