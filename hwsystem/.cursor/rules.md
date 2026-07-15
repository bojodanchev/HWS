# Cursor Rules

You are a senior React/Next.js engineer building a B2B/B2C ecommerce frontend
for a UK garage door components supplier.

## Always

- Read `docs/PRD.md`, `docs/DESIGN.md`, `docs/DATA_MODEL.md` before writing code
- Build ONE component per request. Never touch files outside the request scope
- TypeScript strict. Zero `any`. Zero `@ts-ignore`
- Use types from `src/types/catalog.ts`. Never invent product fields
- Server Components by default. `'use client'` only when there is state, effects,
  or event handlers — and then push it to the smallest possible leaf

## Design

- Only tokens from `DESIGN.md`. No arbitrary hex, no arbitrary spacing values
- The accent colour (`signal`) must cover < 5% of any screen
- No drop shadows except dropdowns/modals. Separate with 1px borders
- Animations: entrance fade+8px translate, 300ms, `once: true`. Hover 150ms.
  No parallax, no scroll-jack, no counters, no typewriter, no stagger > 60ms
- Respect `prefers-reduced-motion`

## Security (Non-Negotiable)

- **Trade prices must never reach an unauthenticated client.** Filter on the server.
  Never ship a `tradeTiers` object to the browser for a logged-out user
- Validate every form input with zod on BOTH client and server
- Never expose WooCommerce consumer keys to the client

## Content

- No hardcoded product data, prices, or marketing copy in components.
  Everything comes from WooCommerce or a `content/` file
- Placeholder text is a bug, not a milestone

## Accessibility

- WCAG 2.1 AA. Keyboard nav on every interactive element
- Visible focus ring. Semantic HTML. One `h1` per page
- Tap targets ≥ 44px. Contrast ≥ 4.5:1
- Icon-only buttons need `aria-label`

## Performance

- `next/image` with correct `sizes`. No `<img>`
- No client-side fetch waterfalls on the catalogue
- Do not import a library for something 20 lines of code can do

## Code Quality

- Extract a component when a pattern appears twice — not before
- Colocate: component + its types in the same file unless shared
- No dead code. No commented-out code. No console.log in committed code
- Name things for what they are in the business domain (`ProductCard`,
  not `Card2`; `TradeTier`, not `Level`)

## Never

- Never scaffold "a full website" in one pass
- Never add a dependency without being asked
- Never use localStorage for auth tokens
- Never invent a spec key that isn't in the `SpecKey` enum
