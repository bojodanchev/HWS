# Project: HWS — HWSystem.co.uk rebuild

Premium B2B/B2C ecommerce for UK garage-door components (motors, controls, remotes, safety) + SBI complete doors. Partner: Alex-Shon (Telegram "Abundance" → "SBI/Jidoro/HWS/Vectra"). (Next.js 16, TS strict, Tailwind v4, quote-first MVP.)

**Live: https://hwsystem.vercel.app** · GitHub `bojodanchev/HWS` (private) · `git push` = production deploy.

## Quick Start
```bash
cd ~/HWS/hwsystem
npm install
npm run dev
```

## Key Commands
| Command | Purpose |
|---------|---------|
| `npm run build` | Prod build (SSGs all product pages) |
| `npm run lint` | ESLint |
| `git push` | Deploy to production (never `vercel --prod`) |
| `vercel logs hwsystem.vercel.app` | Stream NEW function logs (leads appear as `[lead]`) |

## Project Structure
- `PROJECT.md` — master spec (PRD, data model, design system, tasks, rules). Authoritative.
- `hwsystem/` — the Next.js app; its `docs/{PRD,DESIGN,DATA_MODEL,TASKS,RULES}.md` are the spec split for per-component work; `AGENTS.md` has the coding rules.
- `hwsystem/src/content/catalog.ts` — canonical catalogue composition; source snapshots and typed loaders live in `src/content/`
- `hwsystem/src/lib/catalog.ts` — the ONLY data access components use
- `docs/` — this knowledge base + Telegram context + Alex-Shon's mockup screenshots

## Architecture Pointers
> Deep dive: [docs/architecture.md](docs/architecture.md)

- **Trade prices never reach unauthenticated clients** — stripped server-side in `lib/catalog.ts`. Non-negotiable.
- Data-layer swap seam: implement mappers in `lib/woo.ts` when the WP schema lands; components untouched.
- Design tokens only (Tailwind v4 `@theme` in `globals.css`); accent `signal` < 5% of screen; radii ≤ 8px; one entrance animation (`Reveal`).
- Filters/sort/search are URL params; forms are RHF+zod, re-validated in API routes, honeypot-protected.
- Next.js 16: `params`/`searchParams` are Promises; read `node_modules/next/dist/docs/` when unsure.

## Environment
> Details: [docs/environment.md](docs/environment.md)

No env vars required to run. Optional: `SLACK_WEBHOOK_URL` / `RESEND_API_KEY`+`LEAD_INBOX_EMAIL` (lead delivery), `WOO_*` (future), `NEXT_PUBLIC_SITE_URL`. Vercel project `hwsystem` has rootDirectory=`hwsystem`.

## Rules & Style
- Follow `hwsystem/docs/RULES.md`: one component per request, types from `src/types/catalog.ts` only, no invented spec keys, no hardcoded prices/copy in components, WCAG 2.1 AA, server components by default.
- Sentence case everywhere; no emoji in UI; lucide icons stroke 1.5.
- No fabricated content: no fake testimonials, no borrowed product photos ("Photo to follow" tile instead).

## Gotchas (Top 5)
> Full list: [docs/gotchas.md](docs/gotchas.md)

- hwsystem.co.uk (the real WP site) is an empty shell — real imagery comes from sbigaragedoors.co.uk / sbi-bg.com (`curl -k` for the BG site).
- Contact details on the site (phone, Bristol address) and 500+/95%/24hr stats are mockup placeholders — confirm with Alex-Shon before real-domain launch.
- shadcn CLI init is interactive-only; `components.json` is hand-written and `shadcn add` works fine.
- Stale `next start` servers cause phantom 404s — `pkill -f "next start"` before local prod tests.
- `vercel logs` needs the project linked and only streams new logs — start stream, then trigger.

## Recent Decisions
> History: [docs/decisions/](docs/decisions/)

- [2026-08-05] Somfy Pro UK + Beninca: 1,302-record public-metadata import integrated and pushed to production; combined tests, lint, build, and public route checks pass ([decision](docs/decisions/2026-08-05-somfy-beninca-catalog-import.md))
- [2026-08-06] Complete sister-site and Drive product migration is the primary workstream; current imports are partial and must be completed with SKU-first deduplication, reviewed imagery and verified commercial data ([decision](hwsystem/docs/decisions/2026-08-06-product-catalogue-migration.md))
- [2026-07-16] Lead sourcing via OSM Overpass + business.bg (free/public) over trade platforms & paid data
- [2026-07-15] Mock content layer now, Woo later — swap seam in `lib/woo.ts`
- [2026-07-15] Quote-first MVP — no cart/checkout/auth until Woo backend exists
- [2026-07-15] Genuine photos only on product cards — honest "Photo to follow" otherwise

## Active Context
MVP live and validated e2e (2026-07-15). Complete product migration is now the primary workstream; Drive access and additional sister-site source files are pending. Outreach lead lists built (2026-07-16): `hws_leads_top1000.csv` + full `hws_leads.csv` (10,978 BG+UK, untracked, repo root). Milestones 4–5 (trade auth, cart/checkout) remain unstarted by design.

## Discovery Log (Recent)
> Full log: [docs/discovery-log.md](docs/discovery-log.md)

- [2026-08-05] Main worktree contains the integrated 1,302-record handoff (1,097 Somfy + 205 Beninca) via `hwsystem/src/content/vendor-catalog.json` and the typed loader; data checks, tests, lint, build, and public production checks pass, with assets/commercial values constrained.
- [2026-08-06] The 1,302-record vendor handoff is discovery metadata rather than a complete sellable catalogue: the loader has empty images and quote-only pricing; full migration waits on Drive access and reviewed source enrichment.
- [2026-07-16] 1,000-lead BG+UK list delivered from business.bg + OSM; handyman segment thin in public data.
- [2026-07-15] MVP built/deployed/validated; competitor cues (SWR, Ellard) and Telegram context captured.
