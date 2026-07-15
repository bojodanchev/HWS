# Decision: Quote-first MVP — no cart/checkout/auth yet

**Date**: 2026-07-15
**Status**: accepted

## Context
PROJECT.md milestones put cart/checkout (M5) and trade auth (M4) after catalog, brand presence, and leads (M1–M3). There is no commerce backend to check out against.

## Decision
Every buying intent routes to a lead: product pages CTA "Get a quote for this part" (pre-fills SKU) + "Order by phone"; trade applications via form with manual review. Lead APIs validate with zod, honeypot-filter, always log `[lead]` to function logs, and deliver to Slack/Resend when env vars exist. Trade prices exist in data but are stripped server-side for everyone (no auth = no tier).

## Alternatives Considered
- Stub cart UI — dead-end interaction, worse than an honest quote CTA.
- Redirect checkout to WP — the WP store is empty.

## Consequences
- The site's success metric today is leads, matching the PRD ("quote form → real phone ringing").
- When Woo + auth land, PriceBlock/ProductCard already have the trade-gate UX in place.
