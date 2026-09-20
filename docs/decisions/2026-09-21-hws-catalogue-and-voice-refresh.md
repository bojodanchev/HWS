# HWS catalogue and ElevenLabs refresh

## Scope and source

Owner request: execute the SBI/Jidoro/HWS/Vectra topic in Abundance, using the six supplied workbooks. Topic 1891, messages 2892 and 2899 supply the task and sources. Messages 2904–2908 add calmer copy, a more premium experience, duplicate category imagery and product-by-product category/image/price/compatibility review. The owner subsequently chose a new ElevenLabs number and supplied +442045774094.

All six workbooks were read through the connected Google Sheets API, including the empty tail ranges through row 1000. The 178 existing Somfy commercial source rows match their current source rows and recommended prices after whitespace normalization. ICC BGN values and SKU 1871148's conflicting rows remain blocked from automatic GBP pricing. The existing FX boundary is retained rather than silently repricing the catalogue.

## Implemented

- Grouped product navigation inspired by Somfy Pro's installation/product-type menu, preserving the existing design system.
- Category corrections use Beninca's source category URLs, explicit product families and accessory names. Old product-category URLs redirect to the current category.
- Read 1,097 Somfy manufacturer pages and retained 1,054 exact-page image references plus explicit accessory/compatibility links. Twelve pages return 404. Import deliberately excludes manufacturer stock and account/pricing payloads.
- Recommendations use explicit manufacturer relationships where available and exclude SKU references explicitly mentioned in kit contents. A related-products fallback is still separately labelled; it is not proof of compatibility. Kit descriptions without SKU references still need manual review.
- Removed 13 byte-identical repeated images within BFT galleries. Category visuals choose distinct images from products actually in the category. Categories without a source-backed product image use text instead of an unrelated photo.
- Replaced blanket next-day, one-hour response, universal compliance and unsupported customer/stock claims with specific enquiry wording. Removed invented commercial tier benefits. Reduced decorative badges and panel density. Mobile contact capture no longer interrupts after a timer.
- Replaced the placeholder telephone across the website with the owner-supplied UK number.
- Added authenticated catalogue/pricing administration, including the 52% supplier discount basis and the door quotation formula (cost × 1.60, then VAT). The discount remains an internal commercial input, not a public 52% offer.
- Supplier costs and trade tiers are stripped recursively from public variant prices. Placeholder compliance PDFs are no longer presented as valid documents.
- Admin authentication now fails closed without `HWS_ADMIN_PASSWORD` (minimum 16 characters), replacing the known hardcoded password. Configure a unique deployment secret before releasing this change; no real production credential was changed in this run.

## Voice configuration and evidence

The isolated `SBI HWS — UK pilot` ElevenLabs agent is `agent_2801m309e67weanb0ky1gd5414zk`; its inbound SIP number resource is `phnum_6101m309h986efhsv23c0hkss2py` for +442045774094. Authenticated web sessions are required. No outbound trunk is configured. No RingCentral routes or existing personal number were changed.

The owner saved the per-number Zadarma forwarding and reported a successful test. API read-back independently confirms conversation `conv_5401m30ac7atf23srw8ddm2z34dj`, inbound to +442045774094 on the HWS agent, completed after five seconds. This proves the phone-to-agent path and greeting, not a full qualification/transfer workflow.

The attached, successfully indexed RAG document contains 356 commercial product entries, with public GBP prices only. A simulation retrieved SKU 1241058 at £467.17 ex VAT / £560.60 inc VAT and refused to guarantee delivery. Unknown-price and supplier-cost-disclosure checks passed. An initial compatibility simulation gave an overbroad negative answer; the prompt was tightened to preserve uncertainty and retested. Synthetic simulation evidence lives in `integrations/elevenlabs/`.

Lead summary/contact extraction is configured in ElevenLabs. External lead delivery and human transfers remain unconfigured until their destinations/owner are supplied. The agent explicitly avoids claiming these actions occurred. Recording is disabled; retention is seven days for this pilot. A longer real-call qualification test is still needed.

## Remaining catalogue work

The audit has 1,637 unique SKUs, no duplicate normalized SKU keys, 1,273 products without an approved GBP public price, and 289 products without images. The owner explicitly instructed us to keep unpriced products quote-only and list them. See `evals/catalogue-2026-09-20/missing-prices.csv` and `catalogue-audit.json`.

Missing images include 205 Beninca records (manufacturer endpoint returned 504/timeouts), 43 Somfy, 15 BFT, 14 Nice, nine SBI and three Generic records. Existing family-reference images are not equivalent to exact-SKU photography. Similar model names with different SKUs are not automatically merged. The full catalogue must not be described as completely image-, compatibility- or price-verified yet.

Garage-door costs and exact models are absent from the six sheets. Minimum five doors and trade-account details are enforced in the quote request; actual approved-account checkout is not implemented and must not be claimed. The 60% markup can be applied only after an approved cost is supplied.

The thread's separate `opravimikolata` advertising item lacks campaign specifics, budget and launch authority here; no ads were launched.

## Verification and release

19 tests passed; TypeScript/build passed; lint reports only three existing unused-variable warnings. A local production server verified unauthenticated admin redirects, rejection of the old default password, authenticated supplier-pricing rendering and public cost-field exclusion. Browser checks covered the menu at mobile/intermediate/desktop sizes, the new image on SKU 9021027 and its old-category redirect.

Production remains on the existing Git-push release path. Preview/review changes are separate from production activation. Preserve the pre-existing domain-cutover edits and rollback assets.

## Sources

- https://www.somfypro.co.uk/e-catalogue
- https://zadarma.com/en/support/instructions/elevenlabs/
- https://zadarma.com/en/support/instructions/twilio/ (published source IPs)
- https://www.niceforyou.com/sites/default/files/upload/catalogues-brochures/nice_cat_gate_door_en.pdf (Hyppo family)
- https://www.niceforyou.com/sites/default/files/upload/catalogues-brochures/nice_product_news.pdf (Sumo/Soon applications)
