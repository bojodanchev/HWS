# Gotchas & Lessons Learned

## Sources & Content
- **hwsystem.co.uk is an empty shell**: the live WP site has no products, no images, Woo Store API returns `[]`. All real imagery comes from SBI's sites (sbigaragedoors.co.uk, sbi-bg.com).
- **sbi-bg.com needs `curl -k`**: TLS chain fails silently otherwise (empty download, no error).
- **sbigaragedoors.co.uk Woo Store API 404s** (old Woo); its `product-sitemap.xml` works and lists the 5 real products (Novoferm iSO20/NovoPort, BFT remote, Moovi 30 barrier, sectional doors, up-and-over).
- **Image integrity rule**: never put a photo on a product it doesn't depict (a barrier photo on a control panel, a grille on a motor). Products without genuine photos use the "Photo to follow" tile. `tube-link.jpg` is a white roller-grille close-up — looks like a blank gray tile in small screenshots but is a real photo.
- **Placeholder facts still on the site**: phone `+44 (0)330 123 4567`, "Bristol BS16" address, 500+/95%/24hr stats come from Alex-Shon's mockup. Confirm with him before real-domain launch.
- **No fabricated testimonials**: the mockup had fake named customers; deliberately not implemented.

## Build & Tooling
- **Next.js 16 breaking changes**: read `node_modules/next/dist/docs/` before nontrivial work (per hwsystem/AGENTS.md). `params`/`searchParams` are Promises — always `await`.
- **Tailwind v4**: no `tailwind.config.*`; tokens go in `@theme` in `globals.css`. `components.json` has `tailwind.config: ""`.
- **shadcn CLI init can't run headless** (interactive component-library prompt swallows piped input). `components.json` was hand-written; `npx shadcn add <component>` works from there.
- **Stale `next start` processes cause phantom 404s**: an old server on the same port serves the old build. `pkill -f "next start"` before re-testing local prod.
- **`vercel logs` requires a linked project** (`vercel link --yes --project hwsystem`) and only streams NEW logs — start streaming, then trigger the request.
- **useSearchParams needs `<Suspense>`** around the client filter/sort components on server-rendered pages.

## Browser Automation
- **Telegram Web K**: navigating with a `#chatId` hash into a fresh SPA load doesn't open the chat; set `location.hash` again via JS after load. Messages live in `.bubbles-group .bubble` (dataset.mid, `.name`, `.message`, `.time-inner[title]`).
- **computer type+Tab into React forms is unreliable** (hydration timing); use `find` refs + `form_input` instead — it sets values that React registers.
