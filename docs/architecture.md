# Architecture

## Phone voice assistant

The SBI phone agent is hosted in RingCentral AIR and is separate from the Next.js
customer-assistant UI. `integrations/ringcentral/` is a local read-first Platform
bridge; it does not host the voice runtime or publish AIR skills. `evals/` stores
configuration receipts and test evidence. Leads from the native voice agent stay
in RingCentral; no connection to the website's lead database or external CRM was
added in this setup. See the
[AIR setup decision](decisions/2026-09-06-ringcentral-air-setup-and-validation.md).

## Tech Stack
- Next.js 16 (App Router, Turbopack, `src/` dir), TypeScript strict
- Tailwind CSS v4 (CSS-first config — tokens in `@theme` in `globals.css`, no `tailwind.config`)
- framer-motion (one `Reveal` entrance animation only), lucide-react, react-hook-form + zod
- shadcn base (`components.json` hand-written; `cn` util in `src/lib/utils.ts`)
- Hosting: Vercel (project `hwsystem`, rootDirectory=`hwsystem`), private GitHub repo `bojodanchev/HWS`
- Future backend: headless WooCommerce on existing WP hosting (not wired yet)

## Directory Structure
```
~/HWS/
├── PROJECT.md              # Master spec: PRD + data model + design system + tasks + rules
├── docs/                   # Repo-level knowledge base (this dir) + telegram context + reference screenshots
└── hwsystem/               # The Next.js app
    ├── docs/               # PROJECT.md split: PRD, DESIGN, DATA_MODEL, TASKS, RULES (.cursor/rules.md mirrors RULES)
    ├── public/images/      # 39 real assets scraped from sbigaragedoors.co.uk + sbi-bg.com
    │   ├── doors/ products/ finishes/ slats/ brand/
    ├── public/docs/placeholder.pdf   # honest interim doc-library PDF
    └── src/
        ├── content/catalog.ts   # canonical composition of typed catalogue loaders
        ├── content/somfy-controls-catalog.json/.ts # audited REC/REA/ICC/HA/Controls import
        ├── content/somfy-image-manifest.json       # image provenance and local asset mapping
        ├── lib/catalog.ts       # ONLY data access components use; strips tradeTiers server-side
        ├── lib/woo.ts           # server-only Woo client (mappers throw until WP schema final)
        ├── lib/leads.ts         # lead delivery: always logs; Slack/Resend if env set
        ├── types/catalog.ts     # entire data model as strict types (closed SpecKey enum)
        ├── components/          # Header, Footer, ProductCard, ProductGrid, FilterControls,
        │                        # SpecTable, PriceBlock, StockBadge, DocumentList, QuoteForm, TradeForm, Reveal
        └── app/                 # /, /products(+category/slug SSG), /search, /trade, /quote,
                                 # /doors, /about, /delivery, /compliance, /contact,
                                 # api/quote, api/trade-application, sitemap.ts, robots.ts
```

## Key Patterns & Conventions
- **Data-layer swap seam**: components import only from `src/lib/catalog.ts`. Replacing mock content with WooCommerce means implementing the mappers in `src/lib/woo.ts` — zero component changes.
- **Trade-price security (non-negotiable)**: `tradeTiers` never reach an unauthenticated client. `publicPrice()` strips them inside the data layer before anything crosses to a component.
- **Design tokens only**: palette (`ink/steel/mist/concrete/line/signal/...`), radii (4/6/8px), and type scale live as Tailwind v4 `@theme` vars in `src/app/globals.css`. No arbitrary hex/spacing in components. Accent `signal` < 5% of any screen.
- **Fonts**: Inter (body), Inter Tight (headings via `font-heading`), JetBrains Mono (SKUs/specs) via `next/font`.
- **Animation discipline**: only `Reveal` (fade + 8px up, 300ms, once) and 150ms hovers. `prefers-reduced-motion` kills everything.
- **Specs-first cards**: ProductCard always shows spec chips; products without a genuine photo render a "Photo to follow" tile — never a borrowed image.
- **Filters/sort are URL search params** (server-rendered lists, client controls in `FilterControls.tsx` wrapped in `Suspense`).
- **Forms**: react-hook-form + zod on client, same zod schema re-validated in the API route, honeypot field (`company_website`), success → dedicated thank-you page.

## Important Files
- `hwsystem/src/content/catalog.ts` — all product/category data (edit here until Woo)
- `hwsystem/src/content/somfy-controls-catalog.json` + `.ts` — source snapshot,
  provenance audit and typed projection for the owner-shared commercial workbooks
- `hwsystem/src/content/somfy-image-manifest.json` +
  `hwsystem/public/images/vendor/somfy/` — manufacturer image provenance and
  local media used by the commercial projection
- `hwsystem/src/lib/catalog.ts` — filtering, search scoring (SKU > replaces > name), facets, GBP formatting
- `hwsystem/docs/RULES.md` + `hwsystem/AGENTS.md` — coding rules every session must follow
- `PROJECT.md` — the authoritative spec (do not drift from it silently)
