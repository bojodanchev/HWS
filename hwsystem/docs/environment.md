# Environment and operations

Copy `.env.example` to `.env.local` for local overrides. Never commit real
credentials.

## Variables

| Variable | Requirement | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical metadata, robots and sitemap base URL |
| `TURSO_DATABASE_URL` | Production persistence | Canonical libSQL/Turso database URL |
| `TURSO_AUTH_TOKEN` | With Turso URL | Turso authentication token |
| `DATABASE_URL` | Optional alias | Alternative libSQL-compatible URL |
| `DATABASE_AUTH_TOKEN` | With alias URL | Authentication for `DATABASE_URL` |
| `OPENAI_API_KEY` | Optional | Enables the Responses API phrasing layer |
| `OPENAI_CHAT_MODEL` | Optional | Defaults to `gpt-5.6-luna` |
| `SLACK_WEBHOOK_URL` | Optional | Lead notification delivery |
| `RESEND_API_KEY` | Optional | Lead email delivery |
| `LEAD_INBOX_EMAIL` | With Resend | Lead notification recipient |
| `WOO_URL` and Woo keys | Optional future adapter | Not used by the standalone catalogue or assistant |

Database precedence in `src/lib/db.ts` is:

```text
TURSO_DATABASE_URL
  -> DATABASE_URL
  -> file:/tmp/hws-admin.db on Vercel
  -> data/hws-admin.db locally
```

The Vercel `/tmp` fallback is functional but ephemeral per serverless instance.
It is acceptable for a preview smoke test, not for durable customer follow-up.
Production must configure Turso or another persistent libSQL deployment.
Rate-limit counters use the same database and inherit the same persistence
characteristics.

## Local workflow

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without `OPENAI_API_KEY`, the assistant still answers from the deterministic
catalogue. Without database variables, local development creates the ignored
file `data/hws-admin.db`.

## External catalogue inputs

The complete product migration depends on access to the sister-site files and
Drive folders requested by the owner. That access was still pending on
2026-08-06. The six supplied spreadsheet links and the Nice catalogue are
source inputs, not a replacement for the current Drive exports that will be
provided later.

When access is available, preserve raw exports and source URLs in an import
snapshot/audit, then commit only the reviewed, normalised catalogue artifacts.
Do not put Drive credentials, private share tokens or browser-side Drive URLs
in the repository. The runtime should consume the checked-in source snapshot
or a server-side CMS adapter, never a client-side Drive fetch.

## Validation

Run these from the `hwsystem/` directory:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm audit --omit=dev
git diff --check
```

For a release or PR, also exercise the exact deployed SHA:

1. Open the assistant in English and Bulgarian.
2. Ask `Кои дистанционни са съвместими със SBI?`.
3. Confirm the result contains `SBI-RM4-433` and no BFT barrier.
4. Ask about an unknown identifier and submit the consented contact form.
5. Sign into the admin panel and confirm the transcript and linked ticket.
6. Repeat at a 390 × 844 viewport and check the browser console.

## Known temporary security boundary

`src/lib/adminAuth.ts` still uses a hardcoded shared admin credential. It is
acceptable only for the current internal prototype and must be replaced by
real environment-backed authentication before a public production launch.
