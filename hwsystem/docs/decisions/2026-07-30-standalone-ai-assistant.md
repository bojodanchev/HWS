# Decision: Keep the customer assistant standalone

- Date: 2026-07-30
- Status: Accepted
- Scope: Customer assistant, catalogue evidence and support follow-up

## Context

The first assistant implementation was coupled conceptually to a future
WooCommerce catalogue and used broad fallback search. In the deployed preview,
an SBI remote compatibility question also recommended unrelated BFT products,
including a barrier. The business requires the assistant to work before any
WooCommerce integration and to avoid unsupported compatibility claims.

## Decision

The assistant uses `src/content/catalog.ts` as its canonical product evidence
through a server-only public projection. WooCommerce remains an optional future
commerce adapter and is not imported by the assistant path.

Compatibility answers are generated deterministically from explicit
`Product.compatibility` entries. OpenAI is optional and may phrase other
retrieved answers through the Responses API, but its output is accepted only
after identifier, price and trade-data grounding checks.

Conversation history is server-owned and persisted in libSQL. Insufficient
evidence creates a consented human-handoff flow, a transcript and one linked
support ticket.

## Consequences

### Positive

- The assistant works with no WooCommerce connection and no OpenAI key.
- Compatibility behavior is testable and cannot drift with model output.
- Public catalogue and trade-price boundaries are explicit.
- Support agents receive the customer contact and the complete transcript.
- A future CMS or commerce source can replace the catalogue adapter behind the
  same public assistant projection.

### Trade-offs

- Product changes currently require editing the typed catalogue source and
  deploying the site; a future admin CMS is a separate feature.
- Durable production transcripts require Turso or another persistent libSQL
  database.
- Deterministic compatibility answers are less conversational by design.
- Native cart, checkout and order ingestion are outside this decision.

## Guardrails

- Do not import `src/lib/woo.ts` from assistant modules.
- Do not send trade tiers, price breaks or exact internal stock quantities to
  the assistant or browser.
- Do not accept client-provided history.
- Preserve the SBI/BFT regression test.
- Treat unknown catalogue evidence as a human-follow-up case.
