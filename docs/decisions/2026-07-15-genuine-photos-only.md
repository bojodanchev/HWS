# Decision: Genuine photos only on product cards

**Date**: 2026-07-15
**Status**: accepted

## Context
Only ~4 of 17 catalog products have real photos on SBI's own sites. Early build borrowed adjacent scene photos (barrier photo on a control panel, grille close-up on motors), which misrepresents the product.

## Decision
A product shows a photo only if the photo genuinely depicts that product (BFT Mitto remote, Moovi barrier, Novoferm NovoPort, tube link). Everything else gets `images: []` and renders an honest "Photo to follow" tile — the design is specs-first, so cards still carry the buying information. Category tiles and page sections may use scene imagery (doors, installs) since they are navigational.

## Alternatives Considered
- Keep borrowed photos — misleading; installers identify parts visually.
- AI-generate product images — fabricated product representation on a commercial site; rejected.

## Consequences
- Motors/control panels/safety products need real photography from Alex-Shon or the factory before the site feels complete.
- Adding a photo = one `images` array entry in `src/content/catalog.ts` + file under `public/images/products/`.
