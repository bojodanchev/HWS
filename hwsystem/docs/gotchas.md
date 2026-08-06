# Gotchas

## Assistant retrieval and grounding

- A category match is not compatibility evidence. The original fallback mixed
  an SBI remote with unrelated BFT products because broad text search returned
  the first three category matches.
- Keep compatibility responses deterministic. Do not route them through
  OpenAI, even when an API key is configured.
- `src/lib/chatGrounding.ts` rejects unknown uppercase identifiers, SKU-like
  tokens, public prices and trade-price language. Rejection is expected and
  must fall back to the deterministic answer.
- `src/lib/assistantCatalog.ts` must not import `src/lib/woo.ts`. It projects
  public fields only from the typed local catalogue.

## Conversation integrity

- Never accept client-supplied message history. A caller could invent assistant
  turns and poison grounding or ticket logic.
- Conversation IDs are opaque `CHAT-<UUID>` values. The server reloads history
  from `chat_messages`.
- Do not create a resolved ticket for every first chat message. A ticket opens
  only when catalogue evidence is insufficient or the visitor requests human
  follow-up.
- `tickets.source_ref` has a partial unique index. Contact submission must
  update the existing conversation-linked ticket rather than duplicate it.

## Persistence and deployment

- Vercel's `file:/tmp/hws-admin.db` is ephemeral. A successful preview request
  does not prove durable storage across instances or deployments.
- Database-backed rate limits are only as durable as the configured database.
- OpenAI timeout, upstream failure or rejected output is not a chat outage; the
  deterministic catalogue path must remain usable.
- Protected Vercel previews may require an authenticated or temporary share
  URL. Verify the deployment metadata still points to the exact Git SHA.

## Validation traps

- Keep the Bulgarian SBI regression test in
  `tests/chatRetrieval.test.ts`.
- Production dependency risk is checked with `npm audit --omit=dev`; review
  development-only advisories separately instead of reporting them as runtime
  exposure.
- Existing lint warnings in quote, trade, catalogue and optional Woo seams are
  pre-existing. New assistant code should introduce zero lint errors or
  warnings.

## Existing project risk

- Admin authentication is still a hardcoded shared-password prototype in
  `src/lib/adminAuth.ts`. Do not treat it as production-grade authentication.

## Catalogue migration

- `vendor-catalog.ts` currently maps the 1,302 public Somfy/Beninca records to
  `images: []`, `price: { quoteOnly: true }` and unknown stock. This is useful
  discovery metadata, not completed commercial catalogue content.
- Do not deduplicate by product name or source-specific `id`. Normalise the
  manufacturer SKU/part number first; retain a conflict report when the same
  SKU appears in multiple workbooks or sites.
- A 52% corporate discount is a pricing input, not a public price. Keep source
  price, corporate purchase cost and public GBP sale price separate, and keep
  `purchaseCostExVat` server-only through `src/lib/catalog.ts`.
- Interpret the garage-door instruction as a commercial rule that needs an
  explicit margin/markup formula recorded in the audit. “60% profit margin on
  purchase cost” must not be silently converted to a different markup model.
- The old Nice PDF is a product/content reference. It must not be treated as
  current UK pricing; current Nice prices require owner confirmation.
- Use original supplied images where available and manufacturer/official web
  images for missing-image tables, while retaining source URL and review
  status. Never replace missing photography with an unverified or fabricated
  image.
- Do not mark the migration complete while records still contain placeholder
  descriptions, empty images, unresolved duplicate identities, or quote-only
  pricing where an approved current price exists.
