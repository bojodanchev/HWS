# RingCentral AIR treatment design — HWS benchmark

## Decision

Keep Lucy (Ext. 1003) as the incumbent control and use **SBI HWS Treatment
(Ext. 1007)** as an isolated treatment. The treatment already exists in the
Admin Portal but is **Not connected**, with no phone number, queue or company
call-handling rule. No live routing should change until the treatment passes
offline review and an action-time activation decision is approved.

The objective is not to make a more verbose receptionist. It is to increase
reviewer-confirmed correct resolutions and useful leads while reducing
avoidable unresolved calls and wrong or context-free transfers.

## What the baseline says

Use the 90-day AIR window as the primary control and the 60-day window as a
recency check. Lucy has:

| Measure | 60 days | 90 days |
| --- | ---: | ---: |
| AIR Analytics handled | 21 | 28 |
| Resolved | 9 (42.9%) | 12 (42.9%) |
| Unresolved | 12 (57.1%) | 16 (57.1%) |
| Knowledge-base resolutions | 2 | 2 |
| Context transfers | 7 | 10 |
| AIR Call history rows | 25 | 32 |
| Call history transferred | 9 (36.0%) | 12 (37.5%) |
| Call history ended by caller | 15 (60.0%) | 15 (46.9%) |
| Lead responses | 4 | 10 |

These are directional aggregate counters. The history and Analytics surfaces
have different denominators, and neither proves that an answer was correct.
The full baseline is in
[ringcentral-air-lucy-incumbent-2026-08-31.json](ringcentral-air-lucy-incumbent-2026-08-31.json).

## Treatment setup changes

For the first comparison, keep the voice and telephony conditions constant so
the measured difference comes from knowledge, orchestration and capture
discipline rather than a different voice persona.

| Layer | Lucy control | HWS treatment proposal | Why it should help |
| --- | --- | --- | --- |
| Voice and language | English (UK), Lucy voice, Neutral personality, Balanced detail | Same initial voice/language/personality/detail | Isolates prompt and workflow effects; voice can be a later experiment |
| Knowledge | One completed website source assigned to Lucy | Curated, versioned HWS/SBI source set with product boundaries, quote-only rules and an explicit unknown-answer policy | Reduces stale or invented claims and makes answer review auditable |
| Conversation flow | Skill cards for greeting, hours, FAQ, knowledge base and lead capture; no transfer-by-context skill created | Deterministic intent → grounded answer → qualification → read-back → transfer/close flow | Prevents the agent from answering, collecting fields and transferring in an unpredictable order |
| Lead capture | Enabled, but only 4 responses in 60 days and 10 in 90 days; completeness is not observable from the aggregate view | Ask one field at a time, normalize speech-to-text, repeat back postcode/contact/dimensions, confirm completeness before closing | Turns a response into an operationally usable lead rather than a partial form |
| Transfer | Analytics shows context transfers, but destination correctness is unverified; name transfer is unused | Explicit context mapping with department, reason and captured fields passed to the receiving team; deterministic fallback to Ext. 11 | Fewer wrong transfers and less caller repetition |
| Hours | Company route and location-skill weekend schedules do not match | Reconcile routing hours and answer-hours before activation; use one approved schedule in the knowledge source | Avoids promising availability when the route is closed |
| Recording/AI disclosure | Recording disclosure appears in greeting; bytes/transcript quality not yet reviewed | Keep disclosure exact and test it in every opening path, including after-hours and transfer paths | Protects trust and provides comparable evidence |
| Measurement | Provider counters only; history and Analytics are not reconciled | External one-row-per-call ledger plus transcript rubric and guardrail flags | Makes a cross-arm decision possible instead of relying on a single dashboard label |

## Conversation policy

The treatment prompt should be short, structured and action-oriented:

1. **Identify intent.** Ask one clarifying question when the request is
   ambiguous. Classify it as quote/lead, product or hours information,
   existing distributor, technical support, billing, or out of scope.
2. **Ground the answer.** Use only the approved HWS/SBI source. If the source
   does not contain a price, lead time, warranty or compatibility answer, say
   that it is quote-dependent and collect the information needed for the next
   step. Never fill a gap with a plausible guess.
3. **Qualify only when useful.** For an estimate request, collect name,
   postcode, phone or email, product type and approximate dimensions. Ask one
   question at a time and do not ask for a field that the caller already gave.
4. **Read back and confirm.** Repeat each high-risk field in a natural summary,
   spelling email addresses or postcodes when needed. If speech-to-text is
   uncertain, ask for correction rather than silently storing it.
5. **Resolve or transfer.** Complete grounded informational requests. Transfer
   only when the request requires a person or the source cannot safely answer.
   State what will be passed to the receiving team.
6. **Close clearly.** Give the agreed next step, avoid promises about timing
   unless the source supports them, and end the call only after confirmation.

## Transfer map to configure and verify

The treatment should use the existing departmental destinations only after the
Admin Portal exposes and confirms their current ownership:

- General enquiries → Ext. 4
- Existing distributors → Ext. 5
- Technical support → Ext. 6
- Billing and accounts → Ext. 7
- No answer, closed team or uncertain destination → reviewed fallback Ext. 11

The destination, transfer reason and confirmed lead fields belong in the
evaluation ledger. A transfer counts as successful only when the reviewer
confirms that it was appropriate and reached the right destination.

## Knowledge-base design

Create a small canonical source rather than relying on an unreviewed crawl:

- company identity, UK service footprint and contact/route policy;
- product families and the questions each family can answer;
- automation/Somfy facts that are explicitly supported by source material;
- quote-only fields for price, availability, lead time, warranty and project
  suitability when no current value is approved;
- approved transfer destinations and hours;
- a version, owner, source URL and review date for each source item.

Add a retrieval or answer citation internally to the ledger as
`knowledge_used`; callers should receive a concise answer, not internal
source jargon. Retire a source version when a product or schedule changes.

## KPI contract and provisional targets

The primary metric is **verified resolution rate**, not the provider's
`Resolved` label. It is reviewer-confirmed correct resolution or correct
completion without an unnecessary transfer, divided by eligible conversations
with enough transcript evidence to judge the request.

Provisional treatment targets are anchored to Lucy's 90-day observed 42.9%
rate. They are decision thresholds, not promises:

| KPI | Initial treatment bar | Guardrail/qualification |
| --- | ---: | --- |
| Verified resolution | ≥52.9% (+10 percentage points) | At least 50 eligible calls per arm; report numerator and exclusions |
| Reviewer-confirmed unresolved | ≤47.1% | Do not relabel a transfer as resolved without a correct handoff |
| Correct transfer | ≥95% of transfers | Set the final denominator after baseline transcript review; zero critical wrong-destination events |
| Lead-capture completeness | ≥80% of qualified estimate calls | Required fields must be accurate after read-back; baseline rate is currently unavailable |
| Recording/AI disclosure | 100% of eligible openings | Any miss is a release blocker until corrected |
| Groundedness/safety | 100% pass on critical claims | No unsupported price, lead-time, warranty, compatibility or privacy claims |
| Unit economics | Cost per verified resolution no worse than Lucy | Include minutes, telephony and model/provider costs where available |

The 90-day and 60-day samples are overlapping and small. Do not pool them or
claim statistical victory from the current snapshot. Use the 90-day window as
the control reference and the 60-day window to detect recency drift.

## Evaluation sequence

1. Freeze a read-only snapshot of Lucy's prompt-relevant configuration, hours,
   route, backup, disclosure and knowledge version.
2. Configure the treatment knowledge, flow, lead read-back and transfer map
   without connecting it to live traffic.
3. Run the scenario suite in
   [ringcentral-air-scenarios-2026-08-31.json](ringcentral-air-scenarios-2026-08-31.json)
   manually or through a vendor-supported test path. Record pass/fail and
   transcript evidence.
4. Activate only a dedicated number, queue or deterministic IVR cohort. Keep
   Lucy on the company main-number control route.
5. Review every treatment call in the initial guardrail window, then score a
   blinded or independently reviewed sample from both arms.
6. Reconcile provider counters to the ledger by provider call ID when exposed;
   never join by caller number or time alone.
7. Compare the pre-registered KPIs and guardrails. Keep the treatment isolated
   if any critical safety, disclosure or transfer guardrail fails.

## Why this is a credible path to outperforming Lucy

The design directly attacks the two largest observable weaknesses: a 57.1%
Analytics-unresolved share and incomplete evidence about transfer and lead
quality. It also avoids optimizing a misleading proxy. A shorter call is not a
win if it ended before the caller was helped, and a transfer is not a win if it
went to the wrong team. Outperformance must be demonstrated by the same
transcript-level rubric, not inferred from a higher raw transfer or lead count.

## Guardrails and open items

- Do not connect Ext. 1007 to the main number without explicit approval.
- Do not use unsupported prices, lead times, warranties, product compatibility
  or service promises.
- Do not send caller PII to an unapproved system; keep this repository free of
  identifiers, recordings and transcript text.
- Reconcile the company weekend route (shown as 00:00–00:00) with the location
  skill's weekend schedule (shown as 08:00–20:00 Europe/Lisbon).
- Confirm the real destination and current availability of Exts. 4, 5, 6, 7
  and 11 before enabling transfers.
- Verify recording bytes, transcript availability and retention behavior in a
  reviewed test call before production traffic.
- The treatment profile is prepared, but the public Platform API/local CLI do
  not expose documented AIR Studio CRUD, skill, analytics or routing APIs; use
  the authenticated Admin Portal for those settings.
