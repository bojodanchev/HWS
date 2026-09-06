# Gotchas & Lessons Learned

## RingCentral AIR (2026-09-06)

- `Enabled` in extension inventory does not mean connected to a number.
- Native AIR questionnaires allow five custom questions plus mandatory name/phone.
- Internal chat tests can create real Leads entries; synthetic-only test data
  and stored-field read-back are required. Corrections must persist in the record.
- Company-description instructions may not control every skill; targeted FAQ
  corrections must be tested against actual responses.
- Chat transfer announcements and recording switches are not proof of working
  telephone handoffs or usable recordings.
- Full workflow and known limits:
  [AIR setup decision](decisions/2026-09-06-ringcentral-air-setup-and-validation.md).

## Sources & Content
- **hwsystem.co.uk is an empty shell**: the live WP site has no products, no images, Woo Store API returns `[]`. All real imagery comes from SBI's sites (sbigaragedoors.co.uk, sbi-bg.com).
- **sbi-bg.com needs `curl -k`**: TLS chain fails silently otherwise (empty download, no error).
- **sbigaragedoors.co.uk Woo Store API 404s** (old Woo); its `product-sitemap.xml` works and lists the 5 real products (Novoferm iSO20/NovoPort, BFT remote, Moovi 30 barrier, sectional doors, up-and-over).
- **Image integrity rule**: never put a photo on a product it doesn't depict (a barrier photo on a control panel, a grille on a motor). Products without genuine photos use the "Photo to follow" tile. `tube-link.jpg` is a white roller-grille close-up — looks like a blank gray tile in small screenshots but is a real photo.
- **Placeholder facts still on the site**: phone `+44 (0)330 123 4567`, "Bristol BS16" address, 500+/95%/24hr stats come from Alex-Shon's mockup. Confirm with him before real-domain launch.
- **No fabricated testimonials**: the mockup had fake named customers; deliberately not implemented.

## Catalogue migration
- Gmail share notifications may reveal more files than the owner initially
  names. On 2026-08-07, the two supplied Sheets were joined by REC, REA, ICC
  and HA PRO; search the personal Gmail account before declaring source coverage.
- Use manufacturer SKU as identity. The shared import found 178 raw rows and
  154 unique keys, but `1871148` appeared twice in ICC with conflicting EUR
  and BGN values; preserve both audit rows and exclude the SKU until reviewed.
- Do not convert BGN prices with an assumed FX rate. Keep them quote-only.
  For EUR rows, use the established `0.8572` boundary and keep purchase cost
  out of the public projection.
- Check new spreadsheet SKUs against the image-backed BFT snapshot before
  adding them. `9011069` was already canonical in BFT and would have created
  a final duplicate if the commercial projection had not excluded it.
- Google Sheets exports may contain no images or embedded workbook media. An
  empty image array is an honest source state; do not fill it with guessed or
  borrowed photography.
- The reviewed snapshot lives in
  `hwsystem/src/content/somfy-controls-catalog.json`; the typed loader and
  vendor-override composition live in `src/content/somfy-controls-catalog.ts`
  and `src/content/catalog.ts`.


## Build & Tooling

- **Next.js 16 breaking changes**: read `node_modules/next/dist/docs/` before nontrivial work (per hwsystem/AGENTS.md). `params`/`searchParams` are Promises — always `await`.
- **Tailwind v4**: no `tailwind.config.*`; tokens go in `@theme` in `globals.css`. `components.json` has `tailwind.config: ""`.
- **shadcn CLI init can't run headless** (interactive component-library prompt swallows piped input). `components.json` was hand-written; `npx shadcn add <component>` works from there.
- **Stale `next start` processes cause phantom 404s**: an old server on the same port serves the old build. `pkill -f "next start"` before re-testing local prod.
- **`vercel logs` requires a linked project** (`vercel link --yes --project hwsystem`) and only streams NEW logs — start streaming, then trigger the request.
- **useSearchParams needs `<Suspense>`** around the client filter/sort components on server-rendered pages.

## Lead Scraping (2026-07-16 run)
- **Overpass API returns 406 for default python-requests UA**: set a descriptive `User-Agent` with contact email. curl works out of the box.
- **All 3 Overpass mirrors (overpass-api.de, kumi.systems, private.coffee) 504/timeout under evening EU load**: queries eventually land after 1-5 retries. For long runs: rotate mirrors, capped exponential backoff (15s→240s), and checkpoint each query result to disk atomically — a first version that only wrote at the end lost 7 categories to a restart.
- **business.bg URL anatomy**: `o-N/` = sector, `k-N/` = keyword category, `f-N/` = firm page, `c-N/` = city filter. Search via `index.php?act=search&srchstr=<kw>&srchcity=all&s=<page>`. Firm pages expose `tel:`/`mailto:` links, `itemprop="streetAddress"`, and the city inside the meta description after " - ".
- **Fake BG "directories"**: bgcatalog.com and firmite.bg are WordPress shells with no firm data; zlatnistranici.bg is dead. business.bg is the real one.
- **craft=handyman is unused in OSM** (0 results in both BG and GB); the installer segment comes from craft=carpenter/joiner/window_construction and shop=locksmith instead.

## Browser Automation
- **Telegram Web K**: navigating with a `#chatId` hash into a fresh SPA load doesn't open the chat; set `location.hash` again via JS after load. Messages live in `.bubbles-group .bubble` (dataset.mid, `.name`, `.message`, `.time-inner[title]`).
- **computer type+Tab into React forms is unreliable** (hydration timing); use `find` refs + `form_input` instead — it sets values that React registers.
