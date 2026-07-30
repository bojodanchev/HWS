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

> **Current implementation note (2026-07-30):** the checked-in public
> catalogue and customer assistant are standalone and use the typed local
> catalogue. WooCommerce is an optional future CMS/commerce adapter, not a
> runtime requirement for browsing, chat or support follow-up. See
> `docs/decisions/2026-07-30-standalone-ai-assistant.md`.

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
