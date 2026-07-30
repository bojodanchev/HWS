# Architecture

## Current system boundary

HWSystem is a Next.js App Router application with three current data paths:

1. The public catalogue reads typed products from `src/content/catalog.ts`
   through `src/lib/catalog.ts`.
2. Leads, support tickets, orders and AI conversations use the libSQL seam in
   `src/lib/db.ts`.
3. `src/lib/woo.ts` is an optional future commerce adapter. The current public
   catalogue and customer assistant do not call it.

The current order dashboard is a consumer of the generic `orders` table. A
native checkout is not implemented in this repository; an order source can be
added later without changing the assistant boundary.

## Customer assistant

The detailed assistant design and runbook live in
[`AI_ASSISTANT.md`](AI_ASSISTANT.md). Its load-bearing path is:

```text
src/components/CustomerAssistant.tsx
  -> POST /api/chat
  -> src/lib/rateLimit.ts
  -> src/lib/chatStore.ts
  -> src/lib/chatRetrieval.ts
  -> src/lib/assistantCatalog.ts
  -> deterministic compatibility answer
     or optional src/lib/openaiAssistant.ts
  -> chat_conversations + chat_messages
```

Human handoff uses `POST /api/chat/contact`. A follow-up updates the same
conversation and creates or updates one support ticket linked by `source_ref`.
Admin users inspect the result at `/admin/support` and
`/admin/support/chats/[id]`.

## Architectural invariants

- Trade tiers and price breaks never enter assistant context or browser
  responses.
- Compatibility claims are formatted deterministically from explicit
  `Product.compatibility` evidence. They do not pass through a language model.
- The server owns conversation history. The browser may send only the current
  message, locale and opaque conversation ID.
- Unknown or weak catalogue evidence fails closed and opens the human handoff
  path.
- OpenAI is an optional phrasing layer, not a catalogue, database or uptime
  dependency.
- WooCommerce is not required for catalogue rendering, chat answers,
  conversation persistence or support follow-up.

## Related documents

- [`environment.md`](environment.md) — variables and deployment persistence
- [`DATA_MODEL.md`](DATA_MODEL.md) — catalogue and operational support records
- [`gotchas.md`](gotchas.md) — failure modes and regression traps
- [`decisions/2026-07-30-standalone-ai-assistant.md`](decisions/2026-07-30-standalone-ai-assistant.md)
