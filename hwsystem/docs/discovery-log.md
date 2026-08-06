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
