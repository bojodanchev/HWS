# HWS task-list review — 21 September 2026

## Continuation checkpoint

The table below is the earlier review, retained as history. As of the latest continuation:

- Production `742fe8e` persists voice enquiries and website leads before reporting success. The real ElevenLabs webhook test persisted one corrected enquiry without duplication; synthetic test records were closed.
- ElevenLabs Main version `agtvrsn_8601m30kjtpqftcs7fy3rtm5sbeb` introduces Sam, a warm, transparent AI persona. All four branch simulations passed and the merged conversation configuration matched the tested version exactly. Main receives 100% of traffic, has no draft, and the UK number resolves to Main. Recording is disclosed with seven-day retention.
- The website continuation has 1,600/1,637 products with image references, including 44 explicitly labelled illustrative substitutions. The remaining 37 need suitable source images. `representative-images.csv` and the source manifests preserve the reference for each substitution. Presence of an image is not proof of exhaustive model identity review.
- Nine-second popup with 24-hour dismissal, email-or-phone capture, Special order catalogue tabs, corrected category rules, and a dedicated admin enquiry inbox have been implemented. The popup and inbox passed an isolated local UI/database check. Status changes for voice enquiries update their linked support ticket atomically.
- Installation is a noindex preview-only draft for Alex-Shon's team review. It remains unavailable in production until confirmed service facts and publication approval.
- Checks: 29 tests pass, production build passes, lint has zero errors and three pre-existing warnings. The local photo/caption rendering was visually checked.
- Still open: precise notification destination and human transfer numbers; 52% customer-discount interpretation; door model costs and approved trade-account enforcement; confirmed stock/payment/shipping terms before checkout; company and installation facts; complete legacy product-claim and compatibility review. Legacy product content still contains stock, warranty and compatibility claims requiring source confirmation.
- RingCentral's authenticated UI expired to SSO. Owner sign-in is required to continue the isolated HWS treatment; Lucy and company routing remain unchanged.

Follow-up is active every 30 minutes through `hws-alex-shon-follow-up`. `docs/hws-followup-state.json` records the verified Telegram sender, decisions, cursor and pending questions. Sends are read back before advancing the receipt. The website continuation's deployment receipt follows in `docs/production-release-2026-09-21.md`.

## Earlier review

**Verdict: the full task list is not complete.** Reviewed against Abundance topic 1891, messages 2892–2909; current branch 4456199; live Vercel deployment and ElevenLabs reads. Existing passing checks are reused for unchanged code.

| Requested outcome | Reviewed status | Remaining acceptance gate |
| --- | --- | --- |
| New ElevenLabs UK number | Working inbound pilot: +442045774094, correctly assigned; owner test plus completed five-second inbound SIP call | Longer real qualification test; contact corrections and persisted lead review |
| Agent knowledge | 356 commercial product entries, indexed RAG; grounded-price and uncertainty simulations passed | Broader verified knowledge; operational lead recipient and real transfer destinations |
| Somfy-style menu | Grouped menu implemented and visible on Ready preview | Stakeholder visual acceptance and production release |
| BFT GBP prices and English | All 206 imported BFT records have positive GBP price values and no Cyrillic in name/short/full description | Current commercial approval of retained source/FX basis; production release |
| Correct category for every product | 556 vendor category corrections; source/category rules and samples checked | Exhaustive identity/category validation is not established by heuristic rules |
| 52% admin / pro discount | Supplier-discount basis and existing costs displayed on a read-only admin page | Clarify whether “pro” is the same supplier basis or customer pricing; no editable discount administration or authenticated pro-price application is implemented. Preview admin secret is absent |
| VAT removed from final price | Known prices normalised to GBP ex VAT; explicit VAT and inc-VAT display | Quote-only prices need a confirmed GBP base |
| Every product has a correct image | 1,348 of 1,637 products have image references; 289 lack images | Source the missing assets and review exact identity of existing family-reference imagery |
| Remove duplicates | Zero duplicate normalized SKU keys; 13 identical BFT gallery images removed; category images revised | Same-model aliases under different SKUs need semantic review; shared manufacturer family imagery is not automatically an error |
| Compatible complementary products, excluding kit contents | Listed recommendations on 293 products; manufacturer links imported; explicit included SKU references excluded | Full compatibility coverage and kit-content checks, especially kits described without SKU lists |
| Trade-only garage doors, minimum five | Quote form and API require five when declared as garage-door and a nonempty account-number string | No approved-account lookup or checkout; category declaration is not proof of a purchase restriction |
| Door cost +60%, then VAT | Formula documented in admin copy | Actual cost/model data and implemented quote/order calculation are absent |
| Every product has price; ask if missing | 364 priced, 1,273 quote-only; exact missing-price CSV generated | Owner accepted quote-only temporarily; source prices and ICC currency/conflict resolution still required |
| Conversion popup | UI and endpoint exist; mobile automatic interruption reduced | Real persistence/notification journey not verified in this review. Preview has only Turso environment keys listed, no separate email/Slack delivery configuration |
| Calmer copy / premium experience | Broad delivery, response-time, stock/customer and compliance claims removed; preview visually checked | Full product-claim review remains; a certification badge still exists on the doors page and needs source-backed acceptance |
| Website release | Preview Ready on commit 4456199 | Production remains on 205a2b2; admin deployment secret and production release pending |
| Opravimikolata ads | Not executed in this HWS run | Separate brief, campaign destination, creative, budget and launch scope |

## Evidence

- Preview: https://hwsystem-6b42nwczs-bojidars-projects-2603784f.vercel.app/
- `evals/catalogue-2026-09-20/catalogue-audit.json` (fresh audit)
- `evals/catalogue-2026-09-20/missing-prices.csv`
- `integrations/elevenlabs/call-verification.json` plus fresh provider read confirming the same number/agent and only the end-call tool
- `hwsystem/src/app/admin/(panel)/catalogue/page.tsx`: read-only pricing display
- `hwsystem/src/app/api/quote/route.ts`: account string validation, no account authorization or order calculation
- Live Vercel preview environment listing: no `HWS_ADMIN_PASSWORD`; values not retained in this review
- Existing verification: 19 tests, successful local and Vercel builds, lint with three pre-existing warnings

No new production mutations or real lead submissions were made merely to perform this review.
