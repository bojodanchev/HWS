# PROJECT.md — HWSystem.co.uk

> Premium B2B/B2C e-commerce за компоненти и автоматика за гаражни врати и ролетни щори в UK.

---

## Table of Contents
1. [PRD](#prd)
2. [Data Model](#data-model)
3. [Design System](#design-system)
4. [Tasks](#tasks)
5. [Cursor Rules](#cursor-rules)

---

# PRD

## 1. Business Goals

HWSystem е търговски канал за компоненти и автоматика за гаражни врати и ролетни щори в UK.

**Цели по приоритет:**
1. Придобиване на **trade клиенти** (монтажници, фирми) с повтарящи се поръчки — това е основният приход
2. B2C продажба на резервни части и мотори (по-висок марж, ниска честота)
3. Лийдове за SBI Group врати (голяма стойност, продават се по телефон)

**Бенчмарк:** SWR Trade Spares (swrtradespares.com), Ellard (ellard.co.uk)

**Диференциация:** собствена фабрика (SBI, БГ) → по-добра цена; пълна compliance документация; премиум presentation, каквато конкурентите нямат.

---

## 2. Target Audience

| Персона | Нужда | Поведение |
|---------|-------|-----------|
| **Монтажник / trade** (основен) | Намира точната част бързо, вижда trade цена, поръчва до cutoff за next-day | Мобилен, на обект, без търпение. Търси по номер/модел. |
| **Малка фирма за врати** | Обем, кредит, ценово ниво | Регистрира акаунт, поръчва седмично |
| **Собственик на дом (B2C)** | Резервно дистанционно, мотор, ролетна врата | Търси в Google, сравнява, иска яснота |
| **Architect / specifier** | DoP, EN 13241, UKCA сертификати | Сваля PDF-и, изпраща запитване |

---

## 3. Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind, shadcn/ui, Framer Motion (пестеливо) |
| **Backend / CMS / Commerce** | WooCommerce (headless), WooCommerce Store API + WPGraphQL |
| **Trade функционалност** | B2BKing или Wholesale Suite плъгин (роли, скрити цени, ценови нива, quote requests) |
| **Хостинг** | Vercel (frontend) + съществуващ WP хостинг (backend) |
| **Search** | Algolia или Typesense (каталог е search-first, не browse-first) |
| **Forms** | react-hook-form + zod |
| **Analytics** | GA4 + Microsoft Clarity |

> **Правило:** Всичко, което търговският екип трябва да променя (продукти, цени, PDF-и, съдържание), живее в WordPress. Никога в кода.

---

## 4. Pages

| Route | Цел |
|-------|-----|
| `/` | Премиум hero, доверие, вход към каталога, trade CTA |
| `/products` | Каталог: филтри, search, sort |
| `/products/[category]` | Категория (Motors, Controls, Remotes, Springs, Cables, Locks, Safety) |
| `/products/[category]/[slug]` | Продукт: спекове, наличност, цена (или "Login for trade price"), DoP/PDF |
| `/search` | Резултати (Algolia) |
| `/trade` | Защо да отвориш trade акаунт + форма за регистрация |
| `/account` | Поръчки, ценово ниво, повторна поръчка ("Order again") |
| `/cart`, `/checkout` | Woo checkout (headless или redirect в MVP) |
| `/quote` | Заявка за оферта (врати, големи проекти) |
| `/doors` | SBI врати — лийд генерация, не ecom |
| `/about`, `/delivery`, `/compliance`, `/contact` | Доверие + compliance пакет |

---

## 5. Key Features

### MVP (седмици 1–3)
- Каталог с филтри (категория, бранд, тип, спекове) и search
- Продуктова страница със структурирани спекове
- Премиум brand presence (hero, about, gallery)
- Quote форма → имейл + Slack/SMS известие (**реално звъни телефона**)
- Мобилно първо

### Phase 2 (седмици 4–8)
- Trade регистрация с ръчно одобрение
- Скрити цени за неавтентикирани (`Login to view trade price`)
- Ценови нива (Bronze / Silver / Gold)
- Кошница + checkout (B2C + trade)
- "Order again" от история

### Phase 3
- Мобилен опит за терен (part finder по модел мотор)
- PDF compliance пакет на продукт
- Bulk order (CSV / бърза таблица)

---

## 6. SEO Requirements

- Всяка продуктова и категорийна страница: уникален title, meta, H1
- JSON-LD: `Product`, `Offer`, `BreadcrumbList`, `Organization`, `LocalBusiness`
- Long-tail: "somfy tubular motor 50nm replacement", "roller shutter photocell kit uk"
- `sitemap.xml` генериран динамично от Woo продуктите
- Каноничен URL; без duplicate между филтрирани изгледи (`noindex` за filter combos)
- Blog / knowledge base: "How to identify your roller shutter motor" — това е трафикът

---

## 7. Performance Thresholds

| Metric | Target |
|--------|--------|
| LCP (4G mobile) | < 2.0s |
| CLS | < 0.05 |
| Rendering | Server-rendered, no client-side fetch waterfall |
| Images | `next/image`, AVIF/WebP, exact `sizes` |
| Framer Motion | **Only** hero and card hover. No scroll-jack effects. |

---

## 8. Animation Rules

**Премиум = сдържаност, не движение.**

| Allowed | Forbidden |
|---------|-----------|
| Fade + 8px translate-up при viewport entry (once) | Parallax |
| Hover: 150ms, transform + border, no bounce | Scroll hijack |
| | Counters, typewriter, particles |

---

## 9. Color Palette

**Industrial premium, not "SaaS purple"**

| Token | Hex | Usage |
|-------|-----|-------|
| `ink` | `#101418` | Text, dark sections |
| `steel` | `#5A6673` | Secondary text |
| `mist` | `#9AA3AD` | Muted text |
| `concrete` | `#F4F5F6` | Background |
| `line` | `#E2E5E8` | Borders |
| `white` | `#FFFFFF` | — |
| `signal` | `#D93A1E` | **Single accent** — CTA, availability |
| `signal-hover` | `#BF3018` | Hover state |
| `success` | `#1D7A4D` | In stock |
| `warning` | `#B8791B` | Low stock |
| `danger` | `#C4342A` | Errors |

> **Rule:** Accent covers < 5% of the screen. If you have 3 red buttons on one screen, you've made a mistake.

---

## 10. Success Metrics (90 days)

| Metric | Target |
|--------|--------|
| Registered trade accounts | 40 |
| Active trade buyers / month | 20 |
| Repeat purchase (trade, 60 days) | > 50% |
| Quote requests / month | 25 |
| Conversion (trade, logged in) | > 6% |
| LCP mobile | < 2.0s |

---

## 11. Technical Requirements

- TypeScript strict; no `any`
- Every product attribute is typed (see Data Model)
- No hardcoded prices, products, or text in code
- Accessibility: WCAG 2.1 AA, keyboard nav, focus visible
- Error boundaries on catalog and checkout
- Rate limit on forms; honeypot + Turnstile

---

# Data Model

> This document is written BEFORE any component. The catalog IS the business.
> If this model is wrong, the entire frontend gets rewritten.

## Hierarchy

```
Category → Subcategory → Product → Variant (SKU)
```

## Category

```typescript
type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
  parent?: string;
  filters: FilterKey[];   // which filters are relevant for this category
};
```

### Initial Categories

| Slug | Name |
|------|------|
| `tubular-motors` | Tubular motors |
| `side-motors` | Side / axial motors |
| `control-panels` | Control panels & receivers |
| `remotes` | Remotes & handsets |
| `safety` | Photocells, safety edges |
| `springs` | Springs & counterbalance |
| `cables` | Cables & wire rope |
| `locks` | Locks & anti-lift |
| `profiles` | Slats, guides, hoods |
| `accessories` | Accessories |
| `doors` | Doors (lead-gen, not ecom) |

---

## Product

```typescript
type Product = {
  id: string;
  sku: string;                 // key: installers search by SKU
  name: string;
  slug: string;
  brand: Brand;                // Somfy | Nice | Beninca | Teleco | SBI | Generic
  category: string;
  shortDescription: string;
  description: string;         // rich text from WP
  images: Image[];
  specs: Spec[];               // structured, FILTERABLE
  compatibility: string[];     // which systems/models it works with
  documents: Document[];       // DoP, UKCA, manual, wiring diagram
  price: Price;
  stock: Stock;
  variants?: Variant[];
  relatedSkus: string[];
  replacesSkus: string[];      // "replaces old model X" — big SEO/UX win
};

type Brand = 'Somfy' | 'Nice' | 'Beninca' | 'Teleco' | 'SBI' | 'Generic';

type Image = {
  url: string;
  alt: string;
  width: number;
  height: number;
};
```

---

## Spec (Typed, Not Free Text)

```typescript
type Spec = {
  key: SpecKey;
  value: string | number;
  unit?: string;
};

type SpecKey =
  | 'torque'        // Nm
  | 'tubeDiameter'  // 45 | 59 | 70
  | 'voltage'       // 230V AC | 24V DC
  | 'power'         // W
  | 'speed'         // rpm
  | 'limitSwitch'   // mechanical | electronic
  | 'ipRating'
  | 'frequency'     // 433.92 MHz | 868 MHz
  | 'channels'
  | 'maxDoorArea'   // m²
  | 'cableLength'
  | 'material'
  | 'warrantyYears';
```

> **Rule:** If a spec isn't in this enum, it's not shown as a filter. Free text goes in `description`.

---

## Price (Heart of B2B/B2C Hybrid)

```typescript
type Price = {
  rrp: number;                        // always visible (B2C)
  currency: 'GBP';
  vatIncluded: boolean;
  tradeTiers?: {                      // VISIBLE ONLY AFTER LOGIN
    bronze: number;
    silver: number;
    gold: number;
  };
  priceBreaks?: { qty: number; price: number }[];  // 1 / 5 / 10 / 25
};
```

**Frontend Logic:**
- Unauthenticated → show `rrp` + button `Log in for trade price`
- Trade user → show price for their tier + price breaks
- **Never** send `tradeTiers` to client if not logged in. Filter on server.

---

## Stock

```typescript
type Stock = {
  status: 'in_stock' | 'low' | 'backorder' | 'out';
  qty?: number;                // show only "10+ in stock", not exact number
  nextDayEligible: boolean;    // key promise
  leadTimeDays?: number;
};
```

---

## Document (Compliance = Product)

```typescript
type Document = {
  type: 'DoP' | 'UKCA' | 'CE' | 'manual' | 'wiring' | 'datasheet' | 'warranty';
  title: string;
  url: string;
  language: 'en' | 'bg';
};
```

---

## TradeAccount

```typescript
type TradeAccount = {
  companyName: string;
  vatNumber?: string;
  tier: 'bronze' | 'silver' | 'gold';
  status: 'pending' | 'approved' | 'suspended';
  approvedAt?: Date;
  creditTerms?: 'prepay' | 'net30';
};
```

> Registration requires **manual approval**. No one gets trade prices automatically.

---

## FilterKey

```typescript
type FilterKey =
  | 'brand'
  | 'category'
  | 'torque'
  | 'tubeDiameter'
  | 'voltage'
  | 'frequency'
  | 'inStock'
  | 'nextDay'
  | 'priceRange';
```

---

## Search (Algolia Index)

Index: `sku`, `name`, `brand`, `replacesSkus`, `compatibility`, `specs`.

> Searching by SKU and by "what it replaces" is the most common use case on-site. Optimize for it.

---

# Design System

## Principle

Target audience: installer with dirty hands on-site, and specifier checking certificates.

**Premium here = precision, information density, clarity. Not luxury lifestyle.**

**References by feel:** Festool, Hilti, Snickers Workwear, Bosch Professional. Not Apple, not SaaS landing.

---

## Typography

| Role | Font |
|------|------|
| Headings | `Inter Tight` (600) — tight, industrial |
| Body | `Inter` (400/500) |
| Numerics / SKU / specs | `JetBrains Mono` (500) — SKU must be recognizable instantly |

| Token | Size (desk/mob) | Line Height | Weight |
|-------|-----------------|-------------|--------|
| `display` | 56/40 | 1.05 | 600 |
| `h1` | 40/32 | 1.15 | 600 |
| `h2` | 28/24 | 1.25 | 600 |
| `h3` | 20/18 | 1.35 | 600 |
| `body` | 16 | 1.6 | 400 |
| `small` | 14 | 1.5 | 400 |
| `mono` | 14 | 1.4 | 500 |

**Sentence case everywhere.** No ALL CAPS except eyebrow labels (12px, tracking 0.08em).

---

## Colors (Tailwind Tokens)

```javascript
const colors = {
  ink:          '#101418',
  steel:        '#5A6673',
  mist:         '#9AA3AD',
  concrete:     '#F4F5F6',
  line:         '#E2E5E8',
  white:        '#FFFFFF',
  signal:       '#D93A1E',
  'signal-hover': '#BF3018',
  success:      '#1D7A4D',
  warning:      '#B8791B',
  danger:       '#C4342A',
};
```

> **Rule: Accent occupies < 5% of screen.** If you have 3 red buttons on one screen, you've failed.

---

## Spacing (4px base)

`1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32` → 4px…128px

- Sections: `py-20` mobile, `py-32` desktop
- Container: `max-w-[1280px]`, gutter 24px

---

## Radius

| Token | Value |
|-------|-------|
| `sm` | 4px — inputs, badges |
| `md` | 6px — buttons, cards |
| `lg` | 8px — modals |

> Nothing above 8px. Rounded corners are a soft signal; here we want instrumental.

---

## Elevation

No drop shadows by default. Separate with `border: 1px solid line`.

Shadow only on dropdown/modal: `0 8px 24px rgba(16,20,24,0.10)`.

---

## Buttons

| Variant | Style |
|---------|-------|
| `primary` | bg `signal`, text white, radius md, h-11, px-6, weight 500 |
| `secondary` | bg `ink`, text white |
| `outline` | border `line`, text `ink`, hover bg `concrete` |
| `ghost` | text `steel`, hover text `ink` |

All buttons:
- `transition: 150ms ease`
- Focus ring: 2px `signal`, offset 2px
- Disabled: opacity 40%, cursor not-allowed

---

## ProductCard (Most Important Component)

```
┌──────────────────────────────┐
│  [image, 4:3, object-contain, bg concrete]
│  SOMFY              ← eyebrow, 12px, steel
│  LT50 CSI 50/12     ← h3, ink
│  SKU: 1043523       ← mono, 13px, mist
│  50 Nm · Ø45 · 230V ← specs chips, 13px
│  ─────────────────────────────
│  £128.40 ex VAT     ← 20px, 600
│  or [ Log in for trade price ]
│  ● In stock · Next day   ← success dot
│  [ Add to basket ]
└──────────────────────────────┘
```

**Rules:**
- Border `line`, hover → border `ink`
- No scale, no shadow
- Specs always visible in card — installer chooses by specs, not photo

---

## Forms

- Label above field, 14px, weight 500, ink
- Input h-11, border `line`, focus border `ink` + ring
- Error: 13px `danger` below field, icon `alert-circle`
- Never placeholder as label
- Quote form: max 5 fields. Each additional field = -10% conversion.

---

## Icons

`lucide-react`, stroke 1.5, 20px inline / 24px standalone.

No emoji. No filled icons.

---

## Layout

- Grid: 12 columns, gap 24px
- Catalog: 4 columns desktop / 2 tablet / 1 mobile
- Sidebar filters desktop; bottom sheet drawer on mobile (**not** accordion in flow)
- Sticky: header (64px) + filter bar on catalog

---

## Animations

| Type | Spec |
|------|------|
| Entrance | `opacity 0→1`, `translateY 8px→0`, 300ms `ease-out`, `once: true` |
| Hover | 150ms, only `border-color` / `background` |

**Forbidden:** parallax, scroll-jack, counters, typewriter, stagger > 60ms, `whileInView` on every card separately

`prefers-reduced-motion` disables everything.

---

## Mobile is First-Class, Not Adaptation

Installer is on-site with one hand.
- Tap targets ≥ 44px
- Search accessible from every screen
- Price and availability visible without scroll

---

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
