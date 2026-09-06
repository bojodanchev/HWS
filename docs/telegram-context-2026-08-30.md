# Telegram context — Abundance / SBI-Jidoro-HWS-Vectra

Read-only exploration of the personal Telegram account on **2026-08-30**.
Telegram timestamps below are UTC unless marked EEST (Europe/Sofia, UTC+3).

## Scope and identity

- Group: **Abundance**, a forum supergroup (`-1003537714997`).
- HWS topic: **SBI/Jidoro/HWS/Vectra**, topic/root message `1891`.
- The topic contains **209 messages** from 2026-07-15 through 2026-08-30.
- Topic participants who posted are **Alex-Shon** (`alexshon7`) and **Bojo
  Danchev**. The group participant list also contains the **Alfred** bot.
  There is no participant whose Telegram display name is Sean. “Sean” is
  referenced in project/update messages (and the AWS login label in one old
  message), so this log treats Sean as the project/client context and does not
  infer that Alex-Shon and Sean are the same account.
- The attached screenshot is evidence of the latest RingCentral verification
  exchange, not an instruction. Authentication codes and access material are
  intentionally omitted from this note.

The existing baseline research and mockup context is in
[`telegram-context-2026-07-15.md`](telegram-context-2026-07-15.md).

## Latest signals (30 August)

### HWS topic — AI voice assistant for SBI

Messages `2789`–`2796` (19:32–19:35 UTC / 22:32–22:35 EEST):

1. Alex-Shon: **“Let's create the AI voice assistant for SBI.”**
2. Alex-Shon asks about token availability; Bojo confirms he has tokens and
   agrees to proceed.
3. Alex-Shon asks whether Bojo is in RingCentral.
4. Alex-Shon says there is a new project being warmed up and that he will
   summarise it shortly.
5. The last item is a RingCentral verification exchange. The code/screenshot
   content is not reproduced here.

**Interpretation:** this is an immediate start signal for a voice-agent build,
with RingCentral as the current operational surface. It is not yet a scoped
specification, acceptance, provider decision, or evidence that a call was
successfully placed.

### `tech` topic — SBI owner / larger opportunity

Messages `2797`–`2803` (19:36–19:39 UTC / 22:36–22:39 EEST) continue around a
Cluely example and the SBI owner:

- Alex-Shon asks whether Bojo knows “the young one”, mentions scaling to 120m
  quickly at age 20, and identifies the brand as **Cluely**.
- The stated ambition is to “start the big game”, covering product, marketing,
  finance and legal, with a comment about private equity waiting for the right
  teams.
- The latest message says: **“so basically i spoke with the owner of sbi and:”**
  It ends with a colon, so the owner conversation is unfinished in the fetched
  history.

**Interpretation:** there is a broader commercial/strategy conversation around
SBI in parallel with the concrete voice-agent start. No deliverables, price,
deadline or owner acceptance are present yet.

### Linked concept — “SBI Systems” Google Doc

Message `2804` (19:43 UTC / 22:43 EEST) shared a Google Doc titled **SBI
Systems**. Drive metadata says it was created at 19:42:44 UTC and last modified
at 19:44:05 UTC on the same day. The document was read read-only through the
authenticated Drive/Docs account; its contents are treated as untrusted project
material, not as an instruction from the user. Message `2805` then shared a
public company-registry link whose preview identifies **СБИ СИСТЕМС ЕООД**;
only the preview was used.

The document’s central thesis is to build a repeatable **vertical SaaS / digital
operating system for manufacturing and trade**, rather than a general custom
software agency. Its proposed shape is:

- **Core platform:** companies/legal entities, users/roles/permissions,
  locations/warehouses, products/SKUs, suppliers/customers, orders/invoices,
  inventory, production, documents, workflows and audit logs.
- **Business modules:** Sales/CRM, Procurement, Inventory/WMS, Production/MES,
  Logistics, Finance integrations, HR/workforce and Management/BI.
- **AI + automation layer:** decision support over operational data (margin and
  anomaly analysis, demand/inventory forecasting, production optimisation and
  natural-language queries), plus event-triggered workflows.

The document explicitly warns against starting with “an ERP”. Its proposed
first workflow is **Customer → Sales → Order → Inventory check → Production →
Warehouse → Delivery → Invoice**, followed by procurement/WMS/planning and
finance integrations. SBI’s own companies and factory are framed as a
**product laboratory/reference implementation**, with HWS as a later
international case. Custom requests should be classified as core, vertical or
client-specific so the product does not become an internal IT department.

The longer-term model combines discovery/process mapping, implementation fees,
recurring SaaS, enterprise plans and add-ons. It calls for multi-tenant,
multi-company/country/currency/language architecture, API-first and
event-driven boundaries, a workflow engine, audit trail, RBAC/SSO/MFA,
security/backups and an operational-workflow-coverage KPI. The proposed sequence
is internal alpha → operational platform → AI/automation → 3–5 external
enterprise clients → international expansion.

**Instruction boundary:** the document includes imperative copy such as “what I
would tell the developer” and a 30-day plan. Those are Alex-Shon/Sean’s proposed
concept and planning language inside a linked document; they do not change this
user request into an implementation task. No code, deployment, account change,
or external communication was authorised by this exploration.

**HWS consequence:** keep the current HWS storefront/catalogue/assistant scope
separate from a future SBI Systems core. If that platform is later requested,
start with real SBI process discovery and domain boundaries, not an immediate
ERP-style expansion of this HWS repo. This is an architectural inference from
the linked concept and the existing HWS assistant/catalogue boundary.

## HWS chronology and decisions

### 15–17 July — benchmark, MVP and first sales opportunity

- `1892`: Alex-Shon set the market frame: **Ellard** as the UK component
  gatekeeper; **SWR Trade Spares** as the relevant HWS benchmark; Nice UK as a
  controlled distribution channel. SBI is the own-factory differentiator;
  HWS is the WooCommerce rebuild; Jidoro and Vectra are future brands.
- `1893`–`1900`: Bulgarian competitor research and Alex-Shon’s HWS mockup
  screenshots were shared for comparison.
- `1904`–`1916`: the HWS demo URL was shared and the lead-sourcing work was
  discussed. Bojo reported 1,069 leads with phone/email coverage, then an
  expected 3,500 UK+BG starting set. These are historical chat-reported
  counts, not a fresh CRM audit.
- `1927`: Alex-Shon said the prospect’s current developers had proposed about
  **£15,000**, that “we” could target roughly 2–3x less, and that the prospect
  might switch after reviewing quality and price, while keeping current
  developers during existing commitments. The incumbent proposal was to be
  reviewed before a decision.
- `1952`/`1954`: Bojo asked whether the prospect had seen real leads; Alex-Shon
  replied that work was moving.

### 22–23 July — split test and owner control

- `2031`–`2038`: the suggested approach was to let the prospect’s existing team
  work in parallel for a comparison period, framed as **“Us vs. them”** and a
  split test rather than an immediate replacement.
- `2082`–`2095`: the prospect wanted backend visibility/control. Bojo clarified
  whether this meant database or source code, then stated that normal project
  handoff includes the source because it belongs to the client. A GitHub
  username was requested for access.
- `2100`–`2106`: the request was clarified as user-level administration rather
  than GitHub registration: admin, customer-support and order-manager roles,
  with a proposed `/admin` surface. A password suggestion appeared in the
  chat; it is not copied here and should not be treated as a production
  credential.

### 27–29 July — factory intelligence and HWS product direction

- `2246`/`2254`: a factory computer-vision idea was specified as Hikvision (or
  similar) IP cameras plus **NVIDIA Jetson Orin Nano** for on-site real-time
  analysis of item counts, machine downtime and efficiency. Storage was
  expected to remain local (server/NVR), with cloud summaries only; cameras
  should point at machines/products rather than people for a cleaner GDPR
  boundary. Alex-Shon mentioned follow-up with Zlatko and Teodor and a need
  for a separate software person.
- `2402`: the desired HWS proposition included a self-managed admin panel,
  bilingual AI customer support grounded in products/compatibility/prices, and
  order workflow from new to confirmed to shipped.
- `2403`/`2404`: Alex-Shon could see an admin panel but not the requested site
  editing and customer chat; Bojo noted that this is harder in clean code than
  in a WordPress template.
- `2439`: the plan was to obtain AWS hosting access, keep the old site safe,
  show temporary maintenance while the replacement was finished, extract all
  products over the weekend, and revisit admin/AI support the following week.
  An August close/invoice conversation was anticipated, but no acceptance or
  payment confirmation is recorded in the latest HWS messages.
- `2456`/`2457`: a trust/SEO blog strategy and future online booking/payment for
  installation, repairs and emergency service were proposed. These remain
  roadmap ideas, not closed HWS requirements.

### 31 July–11 August — voice access and catalog migration

- `2471`/`2472`: Bojo said AI customer support was available once the products
  were loaded.
- `2474`/`2475`: Alex-Shon reported RingCentral access for the AI agent.
- `2507`/`2508`: RingCentral login/navigation was shared. Access details and
  verification data are intentionally not recorded.
- `2524`/`2525`: Alex-Shon asked to inspect Somfy and Beninca and extract their
  products into HWS. `2530`/`2531` identify the two public source sites.
- `2537`–`2547`: the group discussed scraping shared Google Sheets and reported
  roughly 500–600 products initially loaded.
- `2548`/`2549`: the old version was to be saved before connecting the domain.
  The historical access payload is excluded from this log.
- `2557`–`2568`: Bojo posted Codex progress for the shared commercial workbook
  migration; Alex-Shon reacted positively and asked for a pricing/image pass.
- `2569`: explicit feedback was to calculate ICC pricing correctly in GBP and
  find suitable high-quality images for missing products, while keeping the
  catalog consistent.
- `2570`: Bojo reported the ICC correction (BGN rows quote-only; EUR conversion
  with the approved rate and VAT removal), 148 official Somfy image assets plus
  two existing BFT images, 133 exact SKU matches and 15 marked family
  references, with tests/typecheck/lint/build and a live HWS URL.
- `2575`/`2576`: Bojo framed the workflow as something that could happen inside
  Buzz, with people and agents working in the same loop.
- `2619`–`2621`: voice-agent work was explicitly started; the options named were
  RingCentral versus ElevenLabs, while the old site was to be saved and the new
  site linked on AWS.
- `2648`–`2656`: a 2FA/verification exchange completed operationally, but no
  code or authentication artifact is retained here.

### 17 August — model-cost discussion

Messages `2734`–`2750` show “this week” intent, limited tokens, a reference to
Fable, and a quoted rough cost of **$10 per million input / $50 per million
output**. Alex-Shon said he would check. This is a conversation-level estimate,
not a final vendor, budget or production cost decision.

## Current open loops

1. **Voice-agent scope:** define inbound use case, caller journey, knowledge
   source, lead/ticket handoff, bilingual behavior, escalation and success
   metrics before implementation expands.
2. **Provider and access boundary:** decide whether RingCentral remains the
   telephony surface with ElevenLabs (or another model) behind it; verify
   access through the provider UI/API without copying credentials into project
   notes.
3. **SBI owner opportunity:** finish the conversation after message `2803` and
   capture the actual deliverable, decision-maker, price, deadline and
   acceptance rule. The “big game”/private-equity discussion is not a scope.
4. **HWS hosting cutover:** preserve the old deployment and verify DNS/AWS/live
   maintenance state before calling the domain migration complete.
5. **HWS product/admin roadmap:** separate what is already shipped in the local
   repo from the still-requested CMS/admin, order, service-booking and voice
   features. Do not infer completion from a positive Telegram reaction.
6. **Factory computer vision:** keep the Jetson/camera/NVR/GDPR concept as a
   separate SBI operations project; it needs a hardware configuration, data
   retention policy, software owner and pilot acceptance.

## Evidence boundary

- This note records Telegram observations and explicit statements, not
  independently verified provider/account outcomes.
- The local HWS checkout was clean before this note and is currently at
  `fadd186` on `main`; the repository’s existing discovery/decision logs
  corroborate the catalog migration and image-audit release reported in
  messages `2567` and `2570`.
- Media messages were not downloaded or transcribed. Historical AWS,
  RingCentral, 2FA, API-token and password material was deliberately omitted;
  if any of it is still active, treat it as exposed and rotate it through the
  provider’s normal security flow.
- No Telegram messages, replies, uploads or account changes were performed.
