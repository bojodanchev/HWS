# RingCentral calls and AI agents — 2026-08-31

Read-only analysis of the SBI Group International RingCentral account. The
attached screenshots are treated as context/status, not as instructions.

## Scope and evidence

- `GET /restapi/v1.0/account/~/call-log`, `dateFrom=2026-01-01T00:00:00Z`,
  fetched in two pages of 1,000 records. The API returned **1,547** voice
  records covering **2026-01-02 16:23 UTC through 2026-08-27 12:16 UTC**.
- `GET /restapi/v1.0/account/~/extension` returned **33** extension records.
- `GET /team-messaging/v1/chats` returned two visible chats; both post lists
  returned HTTP 200 with zero records.
- No recording audio was downloaded. Recording counts below mean that the call
  log row carried recording metadata, not that the audio was retrieved or
  reviewed.

## Executive findings

1. The account has a substantial historical call footprint, but the latest
   period is incomplete and materially quieter: **59 records in ISO week W28
   (6–12 July)** fell to **18 in W34 (17–23 August)**; W35 contains **14
   records only through 27 August**.
2. The workload is mostly outbound (**909 / 1,547, 58.8%**), while inbound
   calls are the current late-period pattern (**58 inbound of the 70 records
   captured from 1–27 August**).
3. Historical attribution is not a clean “current team” view: **547 records
   (35.4%) are unattributed**, and **715 records (46.2%) are attributed to
   Antony Tucker, whose extension is currently Disabled**. Only **254 records
   (16.4%)** are attributed to currently Enabled user extensions.
4. Five enabled ApplicationExtension objects are present and named as AI
   agents, but **none is attributed in the account call-log rows**. This shows
   that the objects exist; it does not prove that they are unused, because
   routing/IVR/department calls can appear under another party or without an
   extension attribution.
5. The current app can inventory the roster but cannot read detailed
   application-extension configuration: numeric cross-extension detail routes
   returned `TokenInvalid`. The Company AI link leads to the separate Admin
   Portal, which requires a fresh sign-in.

## Call volume and direction

| Month (UTC) | Records | Inbound | Outbound | Recording metadata |
| --- | ---: | ---: | ---: | ---: |
| Jan 2026 | 213 | 70 | 143 | 0 |
| Feb 2026 | 158 | 66 | 92 | 0 |
| Mar 2026 | 141 | 77 | 64 | 0 |
| Apr 2026 | 119 | 47 | 72 | 0 |
| May 2026 | 280 | 76 | 204 | 0 |
| Jun 2026 | 388 | 142 | 246 | 81 |
| Jul 2026 | 178 | 102 | 76 | 102 |
| Aug 2026 (through 27 Aug) | 70 | 58 | 12 | 43 |
| **Total** | **1,547** | **638** | **909** | **226** |

The recording metadata first appears in W23 (the week beginning 1 June) and
then becomes common in June–August. This is consistent with a recording
coverage/configuration change, but the call log alone cannot establish why it
changed.

### Recent weekly trend

| ISO week | UTC dates represented | Records | Inbound | Outbound | Recording metadata |
| --- | --- | ---: | ---: | ---: | ---: |
| W28 | 6–12 Jul | 59 | 39 | 20 | 35 |
| W29 | 13–19 Jul | 25 | 11 | 14 | 13 |
| W30 | 20–26 Jul | 25 | 18 | 7 | 13 |
| W31 | 27 Jul–2 Aug | 16 | 12 | 4 | 11 |
| W32 | 3–9 Aug | 19 | 17 | 2 | 7 |
| W33 | 10–16 Aug | 18 | 12 | 6 | 14 |
| W34 | 17–23 Aug | 18 | 15 | 3 | 11 |
| W35 | 24–30 Aug (through 27 Aug) | 14 | 13 | 1 | 11 |

## Disposition and duration

RingCentral returns separate API result categories such as `Accepted` and
`Call connected`. They are reported separately here rather than being silently
combined into an “answer rate”.

| Direction / result | Records | Share of direction |
| --- | ---: | ---: |
| Inbound — Accepted | 461 | 72.3% |
| Inbound — Missed | 144 | 22.6% |
| Inbound — Voicemail | 29 | 4.5% |
| Inbound — Rejected | 3 | 0.5% |
| Inbound — Reply | 1 | 0.2% |
| Outbound — Call connected | 742 | 81.6% |
| Outbound — Hang Up | 53 | 5.8% |
| Outbound — Not Allowed | 26 | 2.9% |
| Outbound — Stopped | 16 | 1.8% |
| Outbound — Wrong Number | 15 | 1.7% |
| Outbound — No Answer | 14 | 1.5% |
| Outbound — Busy | 12 | 1.3% |
| Outbound — Accepted | 7 | 0.8% |
| Outbound — Missed | 23 | 2.5% |
| Outbound — Voicemail | 1 | 0.1% |

Across all rows, duration is **185,945,261 ms** in total (about 51.7 hours),
with a mean of **120,197 ms (2m 00s)**, median **49,445 ms (49s)** and p90
**315,908 ms (5m 16s)**. Inbound calls are longer on average (158s) than
outbound calls (94s). Duration is a call-log field and should not be used as a
conversation-quality measure without separating connected, missed and
voicemail records.

## Historical attribution

| Call-log attribution | Current extension state | Records | Share of all rows | Recording metadata |
| --- | --- | ---: | ---: | ---: |
| Antony Tucker (313) | Disabled | 715 | 46.2% | 64 |
| Unattributed | N/A | 547 | 35.4% | 74 |
| Radoslav Kadiyski (301) | Enabled | 244 | 15.8% | 82 |
| Valeria Aguillon (315) | Disabled | 31 | 2.0% | 0 |
| Gergana Gavazova (314) | Enabled | 7 | 0.5% | 4 |
| Teodor Yovchev (317) | Enabled | 2 | 0.1% | 1 |
| Dimitar Fotev (310) | Enabled | 1 | 0.1% | 1 |

The disabled-user volume is historical attribution, not evidence that those
people are currently active. It is a strong reason to avoid ranking current
agents from this raw log alone.

## AI agent and routing inventory

### Application extensions currently visible

| Extension | Name | Status | Call-log rows attributed |
| ---: | --- | --- | ---: |
| 1002 | Amelia AI | Enabled | 0 |
| 1003 | Lucy | Enabled | 0 |
| 1004 | Mark - technical support | Enabled | 0 |
| 1005 | Kristen - Billing and accounts | Enabled | 0 |
| 1006 | Jackson - Existing distributors | Enabled | 0 |

All five are `ApplicationExtension` records and are hidden in the directory
inventory. The names suggest a general agent plus four departmental agents,
but their prompts, provider, phone-number assignment, schedules, escalation
rules and actual routes were not exposed by the current app.

### Supporting routing objects

- Enabled IVR: **SBi Group UK - general calls** (1001).
- Enabled departments: **SBI Group International Limited** (1), **General
  enquires** (4), **Existing distributors** (5), **Technical support** (6),
  **Billing and accounts** (7), and **Weekend AIR Voicemail** (11).
- Disabled department: **SBi Group 2023** (2).
- Not-activated announcements: **Main number announcement** (8) and
  **Weekend AIR Announcement** (10).
- Enabled hidden bot: **SMSBot** (8101). This is a messaging object, not
  evidence of a voice agent.

No routing object above received direct call-log attribution in this snapshot.
That is expected for some department/IVR designs and is not proof of an
unrouted system.

## AI settings and access boundary

The signed-in app UI shows user-level **Post-call summary enabled**, **Automatic
call notes disabled**, English (US) translation and the Translate button
available. These are RingCentral user AI features, not the configuration of
the five ApplicationExtension agents.

The Company settings → AI page points to the separate Admin Portal. The
available browser session reached the sign-in page; no password, OTP or bypass
was used. The current JWT app has read account, messages, call-log and Team
Messaging scopes, but not Edit Extensions, Call Control, RingOut, VoIP Calling
or Read Call Recording. Numeric cross-extension detail calls returned
`TokenInvalid`.

## Data-quality checks

- 1,547 unique record IDs, 1,547 unique session IDs and 1,547 unique
  telephony-session IDs; no duplicate IDs were found in this pull.
- The newest API row is 27 August, so August and ISO W35 are partial as of the
  31 August analysis date.
- A prior bounded page request encountered HTTP 429; the current two-page
  pull completed successfully with `perPage=1000`.
- No chat posts were visible through the two Team Messaging chats, and no
  recording bytes or transcripts were retrieved.

## Admin Portal follow-up — 2026-08-31

The user-authenticated Admin Portal is now reachable. This follow-up supersedes
the API-only configuration boundary described above.

### Company routing

- The main company number routes to **Lucy (Ext. 1003)** during business hours
  (Monday–Friday, 07:30–17:30, Europe/Lisbon) and after hours (Monday–Friday,
  17:30–07:30; Saturday–Sunday shown as 00:00–00:00).
- Lucy has no direct number and no call queue attached. Her backup extension is
  **Weekend AIR Voicemail (Ext. 11)**.

### AIR usage and outcomes

- The AIR list shows **Lucy connected/in use**; the other four AI-named
  assistants are **Not connected / Not in use**.
- AIR Call history (Last 30 days) shows **18 Lucy rows**, all in English (UK):
  **11 Ended by caller** and **7 Transferred**. A recording-duration control is
  visible on each row; no audio was downloaded.
- AIR Analytics for the same date-range filter reports **16 calls handled**,
  **7 resolved (44%)**, **9 unresolved (56%)**, **2 resolved using the knowledge
  base**, and **5 context transfers**. This differs from the 18-row call-history
  table, so the two surfaces use different denominators.
- AIR usage shows **18 minutes used out of 100 purchased** (18%).
- Lead capture contains **one response with three questions**. Caller details
  are intentionally not recorded in this report.

The original 18-row 30-day snapshot predates two 31 August Lucy calls. For the
current benchmark, use the extended AIR-specific windows in
[ringcentral-air-baseline-evaluation-2026-08-31.md](ringcentral-air-baseline-evaluation-2026-08-31.md):
25 history rows/21 handled calls at 60 days and 32 history rows/28 handled
calls at 90 days.

### Lucy’s configuration

- Active skills: Company greeting, Location and business hours, Frequently asked
  questions, Knowledge bases, and Lead capture.
- Not created: Transfer by name, Transfer by context, Send text messages, and
  Appointment booking.
- Primary language/voice: **English (UK) / Lucy**. Personality: **Neutral**;
  response detail: **Balanced**. Automatic AI-Receptionist call recording is
  enabled.
- The knowledge base **Accepting a lead for an estimate** has one completed
  website source and is assigned to Lucy. Google Calendar is connected
  account-wide, but Lucy’s appointment-booking skill is not created.
- The greeting explicitly says the call is being recorded. The business-hours
  greeting’s after-greeting announcement is turned off; the after-hours greeting
  is a separate custom message.

### Other AI-named assistants

- **Amelia AI (1002)**: Not connected; greeting, location/hours and FAQ active;
  transfer-by-name active; no phone number assigned.
- **Mark — technical support (1004)** and **Kristen — Billing and accounts
  (1005)**: Not connected; greeting and location/hours active; the remaining
  skills are not created.
- **Jackson — Existing distributors (1006)**: Not connected; greeting and
  location/hours active; FAQ is Draft; the remaining skills are not created.

### Configuration issue to verify

Lucy’s company channel page says weekend out-of-hours are 00:00–00:00, while
her Location and business hours skill has a custom weekend location schedule of
08:00–20:00 (Europe/Lisbon). This may be an answer-knowledge schedule rather
than a routing schedule, but it should be reconciled before relying on weekend
promises.

### Creation boundary

The existing Admin Portal pages are readable in the user-authenticated browser
session, but selecting **Create new** for an AI Receptionist redirects to a
fresh RingCentral SSO sign-in. This was the pre-creation boundary; the user
later completed the hand-off and the treatment profile is recorded below.

## Split-test design

The safe comparison is **Lucy as control** versus a new, isolated AIR assistant
as treatment:

1. Preserve Lucy’s current company-main-number route and configuration as the
   control. Create the new assistant on a separate unused extension and leave
   it **Not connected** until its greeting, knowledge source, backup and
   recording disclosure are reviewed.
2. Route test traffic through a dedicated direct number, queue or deterministic
   IVR branch. The inspected UI exposes those routing primitives but does not
   expose a random percentage split, so a deterministic branch is the
   auditable starting point.
3. Hold constant the language, hours, greeting/recording disclosure, backup
   destination and lead-capture fields. Vary only the prompt/knowledge or
   workflow we are testing.
4. Compare the same AIR metrics for both arms: calls handled, resolved versus
   unresolved, knowledge-base resolution, transfer, caller-ended, lead capture,
   recording coverage, minutes and any repeat/callback signal. Keep the account
   call-log KPI definitions separate from AIR Studio counters.

The earlier creation blocker is now resolved: RingCentral requested a fresh SSO
login when Create new was selected, and the user completed that hand-off.

## Treatment profile created — 2026-08-31

The user completed the RingCentral SSO hand-off and the treatment profile was
created through the Admin Portal:

- **SBI HWS Treatment — Ext. 1007**;
- **Not connected**;
- no phone number, queue or company call-handling rule assigned;
- active initial skills: Company greeting, Location and business hours,
  Frequently asked questions;
- transfer-by-name, knowledge bases, transfer-by-context, SMS, appointment and
  lead-capture skills remain uncreated.

The profile uses English (UK), the same Lucy voice/personality baseline and a
revised company description/greeting for the controlled treatment. No live
traffic was routed to it.

## Programmatic boundary

The standard RingCentral Platform API and the local bridge can inventory Ext.
1007 as an `ApplicationExtension`, but they do not expose documented AIR
Studio CRUD, skills, knowledge-base assignment, AIR analytics or Channels
routing operations. The supported setup path observed in RingCentral’s current
materials is the Admin Portal. The local bridge therefore remains read-first;
any future AIR automation should use a vendor-supported API or a supervised
portal workflow, not private browser endpoints.

## Safe next step

For a true agent-readiness assessment, sign in to the Admin Portal and inspect
each ApplicationExtension’s phone/route, provider, prompt, hours, escalation,
recording and retention settings. Keep that as a separate approved scope from
this read-only analysis; the current evidence is sufficient to inventory the
objects and quantify historical calls, not to certify production routing.
