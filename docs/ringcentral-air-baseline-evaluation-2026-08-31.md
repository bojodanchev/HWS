# RingCentral AIR baseline evaluation — 2026-08-31

## Overall assessment: Share with caveats

The existing RingCentral statistics are sufficient to establish an operational
benchmark for the incumbent Lucy setup. They are **not** sufficient to judge
answer correctness or conversation quality without transcript review.

## Evidence and grain

Two AIR Studio surfaces were captured with the **Last 30 days** filter:

- **AIR Call history**: 18 Lucy conversation rows, all in English (UK), dated
  18–27 August 2026. Eleven ended by caller and seven transferred. A recording
  duration control was visible on every row; no audio was downloaded.
- **AIR Analytics**: 16 calls handled, 7 resolved and 9 unresolved; 2 resolved
  using the knowledge base and 5 transferred by context. AIR usage was 18
  minutes out of 100 purchased.
- **Lead capture**: one response with three questions. Caller details were not
  retained in this artifact.

The account-level RingCentral call log is a separate dataset (1,547 rows from
January–27 August) and has different attribution/grain. It is not joined to
AIR history in this evaluation.

## Longer-window availability

The broader account call log does provide a larger pool: **234 rows in the last
60 days** (from 2 July) and **627 rows in the last 90 days** (from 2 June),
through the newest provider row on 27 August. Those rows include all account
traffic and cannot be treated as Lucy/AIR calls. Attempts to narrow that API
resource with extension filters returned the same period totals, so the
filters did not provide a trustworthy AIR cohort.

The valid 60/90-day AIR pool comes from AIR Studio’s authenticated Call history
and Analytics custom date range. The pull is now complete for both windows; do
not substitute the 234/627 account rows for the AIR benchmark.

## AIR-specific extended windows — captured 2026-08-31

The authenticated AIR Studio custom ranges provide a larger, agent-specific
pool. The end date is 31 August and the current day is partial.

| Window | Call History rows | Lucy rows | Amelia rows | Analytics handled | Resolved | Unresolved | Knowledge-base resolutions | Context transfers | Lead responses |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 03 Jul–31 Aug (60 days) | 25 | 23 | 2 | 21 | 9 | 12 | 2 | 7 | 4 |
| 03 Jun–31 Aug (90 days) | 32 | 30 | 2 | 28 | 12 | 16 | 2 | 10 | 10 |

AIR Analytics agent filtering confirms that all 21 60-day and all 28 90-day
handled calls belong to **Lucy**. Amelia’s two Call History rows are both
caller-ended and contribute zero handled calls in Analytics. Jackson, Kristen,
Mark and the new SBI HWS Treatment have zero handled calls in both windows.

The extended windows are consistent on the main outcome rate: **42.9% resolved**
in both 60 days (9/21) and 90 days (12/28). This is a more stable directional
baseline than the original 16-call snapshot, but it is still too small for a
strong winner claim. Lead responses are counted separately because the Leads
view has no stable provider call-id join in the current export.

The machine-readable control snapshot is saved at
[evals/ringcentral-air-lucy-incumbent-2026-08-31.json](../evals/ringcentral-air-lucy-incumbent-2026-08-31.json).
The proposed treatment configuration and its decision thresholds are in
[evals/ringcentral-air-treatment-design-2026-08-31.md](../evals/ringcentral-air-treatment-design-2026-08-31.md).

### Extended-window uncertainty

| Metric | 60-day observed (Wilson 95%) | 90-day observed (Wilson 95%) |
| --- | --- | --- |
| Analytics resolved | 42.9% (24.5–63.5%) | 42.9% (26.5–60.9%) |
| Analytics unresolved | 57.1% (36.5–75.5%) | 57.1% (39.1–73.5%) |
| Call History transferred | 36.0% (20.2–55.5%) | 37.5% (22.9–54.7%) |
| Call History caller-ended | 60.0% (40.7–76.6%) | 46.9% (30.9–63.6%) |

Do not combine the overlapping 60- and 90-day windows; use 90 days as the
primary incumbent baseline and 60 days as a recency sensitivity check.

## Quantitative baseline

Wilson 95% intervals are shown because the sample is small; they describe
uncertainty around this snapshot, not a guarantee of future performance.

| Metric | Numerator / denominator | Observed | Wilson 95% interval | Interpretation |
| --- | ---: | ---: | ---: | --- |
| AIR Analytics resolved | 7 / 16 | 43.8% | 23.1–66.8% | Primary baseline, low precision |
| AIR Analytics unresolved | 9 / 16 | 56.3% | 33.2–76.9% | Main improvement opportunity |
| Knowledge-base resolution | 2 / 16 | 12.5% | 3.5–36.0% | Limited signal, not an accuracy rate |
| Context transfer (Analytics) | 5 / 16 | 31.3% | 14.2–55.6% | Handoff driver |
| Transferred (Call history) | 7 / 18 | 38.9% | 20.3–61.4% | History outcome, different denominator |
| Ended by caller (Call history) | 11 / 18 | 61.1% | 38.6–79.7% | Guardrail to monitor |
| Lead-capture response | 1 / 18 | 5.6% | 1.0–25.8% | Too little volume to target yet |
| Recording control visible | 18 / 18 | 100.0% | 82.4–100% | Evidence appears available; bytes unverified |

Duration from the 18 history rows totals **753 seconds**, mean **41.8s** and
median **44s**. The visible recording durations total **865 seconds**, mean
**48.1s** and median **48s**. AIR usage is **1.125 minutes per Analytics
handled call** and **2.57 minutes per Analytics resolved call**.

## Current setup evaluation

| Area | Status | Evidence | Confidence |
| --- | --- | --- | --- |
| Reachability | Verified active | Lucy is connected to the company main-number route and has 18 history rows | High |
| Outcome | Needs improvement baseline | 7/16 resolved; 9/16 unresolved | Medium-low |
| Handoff | Mixed | 7/18 history transfers; Analytics reports 5 context transfers | Medium |
| Knowledge usage | Limited | 2/16 Analytics resolutions credited to knowledge base | Low |
| Lead capture | Enabled but unproven | 1 response, 3 questions | Low |
| Recording evidence | Available | Recording-duration control visible on all 18 history rows | Medium |
| Measurement integrity | Needs reconciliation | 18 history rows vs 16 handled; roster card says 5 calls in last 7 days while Call history showed 6 | High |

## What the stats can and cannot tell us

### Supported now

- Lucy is receiving real traffic and handing off a meaningful share of calls.
- The current setup has a measurable unresolved/transfer/caller-ended baseline.
- Usage and lead-capture signals can be tracked consistently during a treatment
  pilot.

### Not supported yet

- Whether Lucy’s answers are factually correct.
- Whether a transfer was appropriate or reached the right team.
- Whether caller-ended calls were caused by a successful short interaction,
  caller impatience, technical failure or missing knowledge.
- Whether the lead response was complete or operationally useful.
- A statistically reliable winner decision from 18 history rows.

## Benchmark contract for our agent

Use the same date filter, same route class and same definitions for both arms.
For each eligible conversation, record:

`arm`, `agent_version`, `provider_call_id`, `start_time`, `duration_sec`,
`provider_outcome`, `reviewer_outcome`, `transfer_destination`,
`knowledge_used`, `lead_capture_complete`, `recording_available`,
`transcript_available`, `quality_score`, `guardrail_flags`, `minutes`, `cost`.

The primary reviewer outcome is **verified resolution**: the request was
resolved correctly or transferred correctly, with no unnecessary handoff. Score
the transcript separately on intent, factual accuracy, completion, handoff,
lead capture, conversational quality and safety (0 = failed, 1 = partial,
2 = strong).

## Provisional decision rule

Use **+10 percentage points in verified resolution** as an initial practical
improvement bar, provided there is no regression in wrong transfers, unsupported
claims, caller-ended calls, recording disclosure, latency or cost. Do not make a
production decision until at least **50 eligible calls per arm** are available;
revisit statistical power if traffic permits.

## Required next evaluation pass

1. Preserve this baseline snapshot and Lucy’s configuration as the control.
2. Keep **SBI HWS Treatment (Ext. 1007)** disconnected until its greeting,
   knowledge, backup and recording behavior are reviewed.
3. Run the same controlled scenario set in
   [evals/ringcentral-air-scenarios-2026-08-31.json](../evals/ringcentral-air-scenarios-2026-08-31.json)
   against both agents.
4. Use a separate number, queue or deterministic IVR cohort for live treatment
   calls; do not change the main-number route while gathering baseline data.
5. Review transcripts/recordings for a blinded sample and append per-call rubric
   scores to the normalized ledger.

## Access boundary

This benchmark uses the statistics already captured from AIR Studio. A fresh
SSO sign-in was required for the Create new flow; the treatment profile now
exists as Ext. 1007 but remains disconnected. No caller PII, password, PIN,
audio or transcript content was retained.

## References

- [RingCentral AIR setup and updating](https://assets.ringcentral.com/us/guide/settingup-updating-your-ai-receptionist.pdf)
- [RingCentral AIR release notes](https://support.ringcentral.com/gb/en/release-notes/ai-receptionist/release-notes-june-2026.html)
- [AIR benchmark plan](ringcentral-air-benchmark-plan-2026-08-31.md)
- [Machine-readable incumbent evaluation](../evals/ringcentral-air-lucy-incumbent-2026-08-31.json)
- [Treatment design](../evals/ringcentral-air-treatment-design-2026-08-31.md)
