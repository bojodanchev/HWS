# AIR performance benchmark — Lucy versus our treatment

## Decision to support

Determine whether our treatment agent produces better customer outcomes than
the incumbent Lucy configuration without degrading transfer quality, lead
capture, privacy, recording disclosure or cost.

## Current incumbent baseline

The user-authenticated RingCentral Admin Portal provided the following baseline
snapshot for the **Last 30 days** filter:

- AIR Call history: **18 Lucy rows**, 11 **Ended by caller** and 7
  **Transferred**.
- AIR Analytics: **16 calls handled**, 7 **Resolved** (44%), 9 **Unresolved**
  (56%), 2 resolved using the knowledge base and 5 context transfers.
- AIR usage: **18 minutes used / 100 purchased**.
- Lead capture: one response with three questions.

The 18-row history count and 16-call analytics count are not the same
denominator. They must remain separate until a provider-level reconciliation
key is available. The account-level call-log API is a third dataset and shows
zero direct ApplicationExtension attribution for Lucy; it is not a substitute
for AIR Call history.

The account call-log API has larger windows (234 rows in 60 days and 627 rows
in 90 days), but it includes all account traffic and its extension filters did
not narrow the result. For a valid larger incumbent pool, use AIR Studio’s
authenticated custom date range rather than the broader account log.

The AIR-specific custom ranges are now available: 25 Call History rows / 21
Analytics-handled calls for 03 July–31 August, and 32 Call History rows / 28
Analytics-handled calls for 03 June–31 August. All handled calls in both ranges
are attributed to Lucy; the two Amelia history rows are not Analytics-handled.
Use the 90-day AIR range as the primary incumbent baseline and the 60-day range
as a recency sensitivity check. Four lead responses appear in 60 days and ten
in 90 days, but the Leads view does not expose a stable provider call-id join.

The saved control snapshot, anonymized scenario suite and treatment design are
maintained in the [HWS evaluation directory](../evals/README.md).

## Primary outcome KPI

**Verified resolution rate** = conversations judged resolved or correctly
completed by the agent without an unnecessary human transfer, divided by
eligible conversations with enough transcript evidence to judge the intent.

For every arm, report the numerator, denominator and exclusions. “Ended by
caller” is not automatically a failure, and “Transferred” is not automatically
a success.

## Secondary metrics

| Metric | Definition | Why it matters |
| --- | --- | --- |
| Correct transfer rate | Transfers sent to the right destination and accepted by the human/queue | Protects the handoff experience |
| Knowledge correctness | Reviewer confirms the answer is supported by the approved source | Detects hallucination and stale claims |
| Lead-capture completion | Required fields captured correctly when the caller qualifies | Measures operational value |
| Unresolved rate | Calls marked unresolved by the provider, plus reviewer-confirmed misses | Finds gaps hidden by short calls |
| Caller-ended rate | Caller ends before a verified resolution or transfer | Early friction signal |
| Conversation duration | Agent and recording duration, reported separately | Efficiency without rewarding premature endings |
| Response latency | p50/p90 time to first and subsequent responses where available | Voice experience quality |
| Recording/transcript coverage | Eligible calls with a usable recording/transcript | Evidence completeness |
| Cost per verified resolution | Minutes and platform/telephony/LLM cost divided by verified resolutions | Unit economics |

## Guardrails

- No unsupported prices, lead times, warranties or service promises.
- Recording/AI disclosure must be present and accurate.
- No wrong department or failed escalation.
- No PII sent to an unapproved system; lead fields must be captured only for
  the agreed purpose.
- No increase in caller-ended/abandoned calls beyond the pre-set tolerance.
- No treatment route change to the live main number without an explicit
  activation decision.

## Transcript review rubric

Score each eligible conversation from **0 (failed), 1 (partial), 2 (strong)**:

1. **Intent** — identified the caller’s real request.
2. **Accuracy** — answer grounded in the approved HWS/SBI source.
3. **Completion** — resolved the request or gave a concrete next step.
4. **Handoff** — transferred only when appropriate and to the right destination,
   with useful context.
5. **Lead capture** — asked the required questions and preserved the answers
   correctly.
6. **Conversation** — clear, concise, natural and not prematurely terminating.
7. **Safety/compliance** — recording disclosure and no unsupported claims.

Keep the binary primary outcome separate from this quality score so a polished
but incorrect answer cannot look successful.

## Fair comparison design

1. Freeze and snapshot Lucy’s current configuration: route, hours, greeting,
   English (UK) voice, backup extension, knowledge source, lead questions and
   recording behavior.
2. The new treatment **SBI HWS Treatment (Ext. 1007)** is now created and
   disconnected. Keep telephony, language, greeting/disclosure, hours, backup
   and lead fields constant; vary one prompt, knowledge or workflow change at a
   time.
3. Use a dedicated number, queue or deterministic IVR/cohort. If the treatment
   is ElevenLabs, use its branch/traffic tooling inside ElevenLabs or a verified
   RingCentral SIP/Twilio route; do not claim a cross-platform percentage split
   without an external assignment layer.
4. Run a small offline/manual scenario set first, then live traffic. Do not
   declare a winner from the current **28 Analytics-handled / 32 history-row
   90-day snapshot**; pre-specify a minimum sample (for example, 50 eligible
   calls per arm) and revisit statistical power if volume permits.
5. Review every treatment call during the first guardrail window. After the
   initial window, score a blinded or independently reviewed sample from both
   arms using the same rubric.

## Normalized evaluation ledger

One row per conversation:

`platform`, `arm`, `agent_version`, `provider_call_id`, `start_time`,
`duration_sec`, `provider_outcome`, `reviewer_outcome`, `transfer_destination`,
`knowledge_used`, `lead_capture_complete`, `recording_available`,
`transcript_available`, `quality_score`, `guardrail_flags`, `minutes`, `cost`,
`review_notes`.

Do not join RingCentral account call-log rows to AIR Studio history by caller
number or time alone. Preserve provider IDs and document any manual match.

## Access and evidence boundary

RingCentral’s AIR product exposes call history, transcripts/recordings and
analytics in the Admin Portal. The Create new flow forced a fresh SSO login,
which the user completed; the treatment profile now exists but remains
disconnected. No credentials were retained or entered by the agent. ElevenLabs
provides simulation tests, success evaluations, branch traffic and branch
analytics when that treatment is built.

## Recommended decision rule

Promote our treatment only if it improves verified resolution rate and/or lead
capture while staying within the guardrail tolerances for wrong transfers,
unsupported claims, caller-ended calls, latency, recording coverage and cost.
If the two provider dashboards disagree, the normalized ledger and transcript
review control the decision.

## Vendor references

- [RingCentral AIR setup and updating](https://assets.ringcentral.com/us/guide/settingup-updating-your-ai-receptionist.pdf)
- [RingCentral AIR release notes](https://support.ringcentral.com/au/en/release-notes/ai-receptionist.html)
- [ElevenLabs Agent testing](https://elevenlabs.io/docs/eleven-agents/customization/agent-testing)
- [ElevenLabs experiments](https://elevenlabs.io/docs/eleven-agents/operate/experiments)
- [ElevenLabs analytics](https://elevenlabs.io/docs/eleven-agents/dashboard)
