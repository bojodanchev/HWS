# Standalone customer assistant

> Architecture decision:
> [`decisions/2026-07-30-standalone-ai-assistant.md`](decisions/2026-07-30-standalone-ai-assistant.md).
> Environment and deployment details: [`environment.md`](environment.md).

## Boundary

The customer assistant does not import or call `src/lib/woo.ts`.

Its product evidence comes from:

```text
src/content/catalog.ts
  -> src/lib/catalog.ts (removes trade-only pricing)
  -> src/lib/chatRetrieval.ts (deterministic retrieval)
  -> src/lib/assistantCatalog.ts (public assistant projection)
```

WooCommerce can remain as an optional future commerce adapter. It is not needed
to render the catalogue, answer chat questions, persist conversations or
collect support follow-ups.

## Request flow

```text
CustomerAssistant
  -> POST /api/chat
  -> database-backed rate limit
  -> server-owned conversation history
  -> deterministic public-catalogue retrieval
  -> deterministic compatibility answer
     or OpenAI Responses API when configured
  -> grounded-output validation
  -> deterministic catalogue fallback
  -> libSQL conversation + message persistence
  -> open support ticket only when human follow-up is needed
```

The browser sends only the current message, locale and an opaque conversation
ID. It cannot supply assistant history. This prevents a caller from injecting
fake assistant turns or bypassing first-message handling.

## Environment

Required for persistent production conversations:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

Optional AI enhancement:

- `OPENAI_API_KEY`
- `OPENAI_CHAT_MODEL` — defaults to `gpt-5.6-luna`

Without an OpenAI key or during an upstream timeout, the assistant remains
functional through its deterministic catalogue answer. Without Turso locally,
the existing SQLite development database is used. Vercel's `/tmp` fallback is
ephemeral and is not suitable for durable production follow-up.

The OpenAI path uses the Responses API with `store: false`, an eight-second
timeout and a small, retrieved public-product context. Compatibility answers
always use the deterministic catalogue formatter. The default Luna model
matches this high-volume, latency-sensitive support role for the remaining
intents. Model output is discarded if it introduces an unknown identifier,
public price or trade-pricing claim.

## Human follow-up

Every conversation is visible under:

```text
/admin/support
/admin/support/chats/[conversationId]
```

When catalogue evidence is insufficient, the conversation is marked
`needs_follow_up` and an open `ai_chat` support ticket is created. The customer
can provide name, email and phone with explicit consent; those details update
the existing conversation and ticket rather than creating duplicates.

## Safety controls

- public message limit: 12 requests per 10 minutes per hashed IP/user-agent
- contact limit: 5 requests per hour
- request body caps before validation
- shared strict Zod schemas
- working honeypot fields
- no client-provided history
- public catalogue projection only; no trade tiers
- fail-closed compatibility behaviour
- OpenAI timeout and deterministic fallback

## Validation

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm audit --omit=dev
```

The regression suite includes the previously failing Bulgarian compatibility
question and ensures a BFT barrier cannot be recommended as an SBI remote.
