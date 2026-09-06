# RingCentral AI Receptionist vs ElevenLabs Agents — 2026-08-31

## Decision summary

- **RingCentral AI Receptionist (AIR)** is the lowest-risk operational path for
  SBI because it already owns the RingEX number, company call handling, backup
  extension, recordings, lead capture and AIR analytics.
- **ElevenLabs Agents** is the stronger experimentation/building surface: it
  exposes agent versioning, branches, percentage traffic deployment, success
  evaluations, model/voice/tool choices and detailed latency/cost analytics.
- For the proposed “incumbent versus our work” comparison, keep **Lucy as the
  RingCentral control** and put the treatment on a separate number/queue or a
  deterministic IVR branch. If the treatment is ElevenLabs, connect it through
  a dedicated Twilio number or a verified RingCentral SIP path; do not move the
  main number until the test is accepted.

## Current RingCentral baseline

The user-authenticated Admin Portal shows:

- Lucy (Ext. 1003) connected to the company main number for business and
  after-hours calls, with Weekend AIR Voicemail (Ext. 11) as backup.
- Active Lucy skills: greeting, location/hours, FAQ, website knowledge base and
  lead capture. Transfer-by-name, transfer-by-context, SMS and appointment
  booking are not created.
- English (UK) / Lucy voice, Neutral personality, Balanced response detail and
  automatic AIR call recording enabled.
- AIR Call history: 18 Lucy rows in the last 30 days (11 caller-ended, 7
  transferred). AIR Analytics: 16 calls handled, 7 resolved, 9 unresolved, 2
  knowledge-base resolutions and 5 context transfers. These two UI surfaces
  use different denominators.
- Amelia AI, Mark, Kristen and Jackson are not connected. Their visible setup
  states are recorded in the main call-analysis document.

## Capability comparison

| Dimension | RingCentral AIR | ElevenLabs Agents |
| --- | --- | --- |
| **Telephony** | Native RingEX company numbers, call-handling rules, direct numbers, IVR and queues. | Twilio native integration or SIP trunking; SIP can connect existing phone systems, including RingCentral-compatible trunks. |
| **Deployment effort** | No-code Admin Portal flow; test calls and number/rule assignment are built into setup. | Requires an ElevenLabs agent plus Twilio or SIP plumbing, number ownership and usually a small integration layer. |
| **Agent control** | Guided skills: greeting, FAQ, knowledge, transfers, lead capture, calendar and language/voice settings. | Full prompt/workflow/tool/voice/LLM configuration, dynamic variables, webhooks, client/code/MCP tools and custom LLM options. |
| **Human escalation** | Native transfer-by-name/context skills and RingEX extension routing. | `transfer_to_number` over Twilio/SIP; transfer behavior depends on the integration mode. |
| **Knowledge** | Company description, FAQ, website/knowledge bases and skill-specific capture. | Files, URLs or text; full-context or RAG usage modes; documents can be shared across agents. |
| **Analytics** | AIR history and analytics: handled, resolved/unresolved, knowledge-base resolution, transfers, language, duration and usage minutes. | Granular filters/grouping by branch, model, voice, tool, error, language and call source; latency/cost and workflow-node metrics. |
| **Testing** | Built-in test calls and history review; current AIR UI does not expose a percentage traffic splitter. | Automated simulation/next-reply/tool tests plus branch experiments with traffic percentages and success evaluations. |
| **A/B testing** | Best implemented as separate number, queue or deterministic IVR cohort in the current account. | Native branches and percentage deployment; routing is deterministic by conversation ID, so cohorts remain stable. |
| **Data/retention** | In the AIR privacy datasheet, calls are recorded/transcribed for the service; account/region and DPA terms govern storage and subprocessors. | Retention controls are configurable for transcripts and audio; default retention and data-residency/compliance terms must be checked for the selected plan. |
| **Cost shape** | Uses the account’s AIR minute allocation and RingEX telephony; this account currently shows 100 minutes purchased and 18 used. | ElevenAgents plans include call minutes; extra minutes are listed at $0.08/min on the current pricing page, while telephony and LLM provider usage are additional. |

## What this means for our split test

### Fastest, lowest-risk test: RingCentral treatment

Create a second AIR assistant, clone Lucy’s baseline, keep it disconnected, and
assign only a dedicated number/queue/IVR branch. Change one thing at a time (for
example, the qualification prompt or product knowledge). This preserves the
same telephony and AIR reporting surface, but it is not a native percentage
experiment.

### Strongest experimentation test: ElevenLabs treatment

Keep Lucy on the RingCentral main number and run the new agent on a separate
Twilio number or a RingCentral SIP route. ElevenLabs can then manage branches,
traffic percentage, automated tests and branch analytics. This gives better
control over our agent, but adds telephony, SIP/Twilio, security and monitoring
work.

### Shared measurement contract

Normalize both arms into one ledger with the same definitions:

- calls offered and answered;
- resolved, unresolved and transferred;
- caller-ended/abandoned;
- lead captured and required fields complete;
- knowledge-source answer rate;
- transfer success and reason;
- conversation duration and p50/p90 response latency;
- recording/transcript availability;
- minutes and cost per resolved call.

Do not compare RingCentral’s AIR Analytics counters directly with ElevenLabs
branch counters until the denominator and event grain are aligned.

## Recommendation

Use RingCentral AIR first for a contained control/treatment pilot because the
number, routing and escalation already work. Build the higher-control
ElevenLabs version in parallel only after the test hypothesis and data contract
are fixed. The cleanest comparison is Lucy on the existing main route versus
our agent on a dedicated cohort, with no production route change until the
results are reviewed.

No ElevenLabs account or agent was created in this comparison, and no RingCentral
assistant, number, route or permission was changed.

## Sources

- [RingCentral AI Receptionist setup and updating guide](https://assets.ringcentral.com/us/guide/settingup-updating-your-ai-receptionist.pdf)
- [RingCentral AI Receptionist release notes](https://support.ringcentral.com/au/en/release-notes/ai-receptionist.html)
- [RingCentral AI Receptionist privacy datasheet](https://assets.ringcentral.com/us/datasheet/rc-ai-receptionist-privacy-datasheet.pdf)
- [ElevenLabs Agents experiments](https://elevenlabs.io/docs/eleven-agents/operate/experiments)
- [ElevenLabs Agent versioning](https://elevenlabs.io/docs/eleven-agents/operate/versioning)
- [ElevenLabs Analytics](https://elevenlabs.io/docs/eleven-agents/dashboard)
- [ElevenLabs SIP trunking](https://elevenlabs.io/docs/eleven-agents/phone-numbers/sip-trunking)
- [ElevenLabs Twilio native integration](https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/native-integration/)
- [ElevenAgents pricing](https://elevenlabs.io/pricing/agents)
