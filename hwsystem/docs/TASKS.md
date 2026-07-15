# Tasks

> **Rule:** One component per prompt. Never "build the website".
> After each component → review prompt (see bottom).

---

## Milestone 0 — Foundation (Day 1–2)

- [ ] `npx create-next-app@latest hwsystem` (TS, ESLint, Tailwind, App Router, Turbopack)
- [ ] `npx shadcn@latest init`
- [ ] `npm i framer-motion lucide-react react-hook-form zod @hookform/resolvers`
- [ ] Tailwind config: colors and spacing from DESIGN.md as tokens
- [ ] Fonts via `next/font` (Inter, Inter Tight, JetBrains Mono)
- [ ] `.cursor/rules.md`
- [ ] `src/types/catalog.ts` — entire DATA_MODEL.md as types
- [ ] `src/lib/woo.ts` — typed client for WooCommerce API
- [ ] `.env.example`

---

## Milestone 1 — Catalog (Priority #1, Week 1–2)

- [ ] `ProductCard` (most important component — build first)
- [ ] `ProductGrid` (responsive, skeleton loading)
- [ ] `FilterSidebar` (desktop) + `FilterDrawer` (mobile)
- [ ] `SortSelect`
- [ ] `/products` — server component, filters in URL search params
- [ ] `/products/[category]` — SSG + ISR
- [ ] `/products/[category]/[slug]` — product page
  - [ ] Gallery
  - [ ] `SpecTable` (structured specs)
  - [ ] `PriceBlock` (rrp / trade gate / price breaks)
  - [ ] `StockBadge` (in stock / next day)
  - [ ] `DocumentList` (DoP, UKCA, manual)
  - [ ] `CompatibilityList` + `Replaces` section
  - [ ] `RelatedProducts`
- [ ] `SearchBar` in header (SKU-first)
- [ ] `/search` results

---

## Milestone 2 — Brand Presence (Week 2–3)

- [ ] `Header` (sticky, search, trade login, cart)
- [ ] `Hero`
- [ ] `TrustBar` (next day · UKCA · own factory · trade accounts)
- [ ] `CategoryGrid` (entry to catalog from homepage)
- [ ] `WhyUs`
- [ ] `Gallery` (real installations)
- [ ] `/about`
- [ ] `/compliance` (EN 13241, EN 12453, UKCA, DoP — this sells to B2B)
- [ ] `/delivery` (cutoff time, next-day promise)
- [ ] `Footer`

---

## Milestone 3 — Leads (Week 3)

- [ ] `QuoteForm` (max 5 fields, zod validation)
- [ ] `/quote`
- [ ] `/doors` — SBI doors, lead page, not ecom
- [ ] API route → email + Slack/SMS notification
- [ ] Honeypot + Cloudflare Turnstile
- [ ] Thank-you page + GA4 conversion event

---

## Milestone 4 — Trade (Week 4–6)

- [ ] `/trade` — value + benefits
- [ ] `TradeRegisterForm` (company, VAT, volume, references)
- [ ] Manual approval in WP admin
- [ ] Auth (Woo/JWT session)
- [ ] Trade pricing — **filtered on server**, never in client bundle
- [ ] `/account` — orders, tier, "Order again"
- [ ] Trade price breaks on product page

---

## Milestone 5 — Commerce

- [ ] `CartDrawer`
- [ ] `/cart`
- [ ] Checkout (Woo Store API or redirect in MVP)
- [ ] VAT display toggle (ex/inc VAT — trade wants ex, B2C wants inc)
- [ ] Email confirmations

---

## Milestone 6 — SEO & Launch

- [ ] `generateMetadata` on every dynamic page
- [ ] JSON-LD: Product, Offer, BreadcrumbList, Organization
- [ ] OpenGraph + Twitter cards
- [ ] `robots.ts`, `sitemap.ts` (dynamic from Woo)
- [ ] `noindex` on filtered combinations
- [ ] Lighthouse ≥ 95 on all 4 categories
- [ ] Vercel deploy + domain
- [ ] GA4 + Clarity

---

## Prompt Template (Use Exactly This)

```
Read docs/PRD.md, docs/DESIGN.md, docs/DATA_MODEL.md.

Build ONLY the <ComponentName> component.

- Do not edit any other file.
- Use the types from src/types/catalog.ts. Do not invent new fields.
- Use only design tokens from DESIGN.md. No arbitrary hex values.
- Reusable, typed, accessible (WCAG 2.1 AA).
- Server component unless interactivity is required.
- Production ready.
```

---

## Review Prompt (After EVERY Component)

```
Review the code you just wrote.

Check:
- Does it violate DESIGN.md (colors, radius, animation rules)?
- Are trade prices ever sent to unauthenticated clients?
- Any 'any' types? Any hardcoded content?
- Accessibility: keyboard nav, focus visible, aria labels, contrast
- Performance: unnecessary 'use client'? unoptimized images?
- SEO: semantic HTML, heading hierarchy

Fix everything. List what you changed.
```

---

