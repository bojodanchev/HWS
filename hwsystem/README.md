# HWSystem

Standalone Next.js catalogue, lead operations and customer support application
for HWSystem. The public catalogue is a typed local source; neither the site nor
the AI customer assistant requires WooCommerce.

## Customer assistant

The floating English/Bulgarian assistant:

- retrieves only public product fields from the standalone catalogue;
- fails closed when compatibility evidence is insufficient;
- stores server-owned conversations and human follow-up requests in libSQL;
- rate-limits public requests and never accepts client-supplied conversation
  history;
- uses the OpenAI Responses API when `OPENAI_API_KEY` is configured and falls
  back to a deterministic catalogue answer when it is not.

See [docs/AI_ASSISTANT.md](docs/AI_ASSISTANT.md) for architecture, environment
variables and validation.

## Project knowledge

- [Architecture](docs/architecture.md)
- [Environment and operations](docs/environment.md)
- [Known gotchas](docs/gotchas.md)
- [Discovery log](docs/discovery-log.md)
- [Standalone assistant decision](docs/decisions/2026-07-30-standalone-ai-assistant.md)

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm audit --omit=dev
```
