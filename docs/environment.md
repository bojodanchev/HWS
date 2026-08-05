# Environment

## Prerequisites
- Node 22 (nvm), npm
- `gh` CLI (authed as bojodanchev), `vercel` CLI (authed as bojodanchev-7298)

## Setup
```bash
cd ~/HWS/hwsystem
npm install
cp .env.example .env.local   # only needed once Woo/lead delivery is configured
```

## Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build (SSGs all product pages) |
| `npm run start -- -p <port>` | Serve prod build locally |
| `npm run lint` | ESLint |
| `git push` | **Deploys to production** (Vercel push-to-deploy) |
| `vercel logs hwsystem.vercel.app` | Stream function logs (needs `.vercel` link; streams NEW logs only) |

## Deployment
- **Live**: https://hwsystem.vercel.app
- Vercel project `hwsystem` (id `prj_aaUQy1MWLyM0yB0oIvXA4m9BjPkF`), team bojidars-projects-2603784f, **rootDirectory=`hwsystem`**, connected to GitHub `bojodanchev/HWS` main.
- Production deploys ONLY via `git push` (house rule — never `vercel --prod`). Vercel CLI is for config/logs.
- Project was created via REST API (`POST /v11/projects` with `gitRepository` + `rootDirectory`); CLI token lives at `~/Library/Application Support/com.vercel.cli/auth.json`.

## Environment Variables (all optional today)
| Var | Purpose |
|-----|---------|
| `WOO_URL`, `WOO_CONSUMER_KEY`, `WOO_CONSUMER_SECRET` | Headless WooCommerce (server-only; unused until mappers implemented) |
| `SLACK_WEBHOOK_URL` | Lead delivery to Slack |
| `RESEND_API_KEY` + `LEAD_INBOX_EMAIL` | Lead delivery by email |
| `NEXT_PUBLIC_SITE_URL` | Canonical base for metadata/sitemap (defaults to hwsystem.vercel.app) |
| `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` | Admin panel database (house convention, same as the other Vercel projects; `DATABASE_URL`/`DATABASE_AUTH_TOKEN` accepted as fallback). Unset: local dev uses `hwsystem/data/hws-admin.db` (gitignored); Vercel falls back to `file:/tmp` — functional but ephemeral per serverless instance, so set these for durable production storage |

Leads always land in Vercel function logs as `[lead] {...}` even with nothing configured, and are persisted to the admin database (with an auto-opened support ticket) by the form API routes.

## External Services
- Real-brand sites (image/content sources): sbigaragedoors.co.uk, sbi-bg.com (needs `curl -k`), hwsystem.co.uk (WP "coming soon" shell — the eventual Woo backend)
- Benchmarks: swrtradespares.com, ellard.co.uk
