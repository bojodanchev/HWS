<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# HWSystem project rules

Before writing any code, read `docs/PRD.md`, `docs/DESIGN.md`, `docs/DATA_MODEL.md` and follow `docs/RULES.md` (mirrored at `.cursor/rules.md`) exactly. Build one component per request. Types live in `src/types/catalog.ts` — never invent product fields. Trade prices must never reach an unauthenticated client (filter via `priceForViewer` in `src/lib/woo.ts`). Design tokens are defined in `src/app/globals.css` — no arbitrary hex or spacing values.

For customer-assistant work, also read `docs/AI_ASSISTANT.md`, `docs/gotchas.md`
and `docs/decisions/2026-07-30-standalone-ai-assistant.md`. The assistant's
catalogue path must remain independent of `src/lib/woo.ts`.
<!-- END:nextjs-agent-rules -->
