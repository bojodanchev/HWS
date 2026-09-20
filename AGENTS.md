# HWS Codex navigation

This root file is the concise Codex guide for the HWS repository. The
Next.js-specific rules remain in [hwsystem/AGENTS.md](hwsystem/AGENTS.md).
`CLAUDE.md` is a separate Claude-specific companion and is not synchronized by
this file.

## RingCentral status — 2026-09-06

- The local read-first bridge lives in
  [integrations/ringcentral/](integrations/ringcentral/); its credentials stay
  in the ignored mode-0600 `.env` and must never be printed or committed.
- The private SBI Voice Assistant Bridge JWT app is validated for account,
  extension inventory, Team Messaging and account call-log reads. The bridge
  keeps writes disabled by default and exposes only guarded chat posting.
- The user-authenticated Admin Portal shows Lucy (Ext. 1003) connected to the
  company main-number route. Amelia AI, Mark, Kristen and Jackson are not
  connected.
- **SBI HWS Treatment (Ext. 1007)** was created as the isolated treatment
  profile. It is Not connected and has no number, queue or company
  call-handling assignment. Six skills are active: greeting, hours, FAQ,
  knowledge, context transfers and lead capture. Backup is voicemail Ext. 11;
  automatic recording is enabled. Internal chat tests and synthetic lead
  persistence passed the bounded checks in the configuration receipt; real
  calls, transfers, audio and recording storage still require verification.
- Alex-Shon was updated in Abundance's HWS topic and asked for the pilot
  number/routing, hours and lead/voicemail owner (messages 2862–2863). Read the
  current reply before acting; the request is not routing approval.
- Preserve Lucy as the incumbent/control. Any new assistant is a treatment and
  must stay on a separate extension/number/queue/IVR cohort until explicitly
  reviewed and activated.
- Do not use TDD unless the user explicitly asks for it.

## HWS continuation — 2026-09-21

- Current decisions, Telegram cursor and pending blockers: [follow-up receipt](docs/hws-followup-state.json). Alex-Shon's verified sender ID is `7932023856`; exact Abundance topic is `SBI/Jidoro/HWS/Vectra`, ID 1891. Use the personal-telegram operator's `read-topic`; read back sends and avoid duplicate questions.
- The separate ElevenLabs UK pilot uses `+442045774094`. Versioned config, tools, tests and resource IDs live in `integrations/elevenlabs/`. Preserve unrelated agents. Use a review branch for behavioral changes, poll simulations, merge, and verify live Main and the phone assignment.
- Voice enquiries persist through `/api/voice/leads` with the workspace-secret-backed webhook; website forms fail closed on database failure. Do not claim an external notification or transfer until its destination and delivery are verified.
- See [task review](docs/task-list-review-2026-09-21.md) for remaining commercial/identity gaps. The installation page is preview-only pending team review. Illustrative product photos require visible captions and entries in `representative-image-manifest.json`; never replace exact photography with a fallback.

## Earlier RingCentral knowledge pointers

- [Current configuration receipt](evals/ringcentral-air-configuration-receipt-2026-09-06.md)
- [AIR setup lessons and activation gates](docs/decisions/2026-09-06-ringcentral-air-setup-and-validation.md)
- [Call and agent analysis](docs/ringcentral-call-analysis-2026-08-31.md)
- [AIR baseline evaluation](docs/ringcentral-air-baseline-evaluation-2026-08-31.md)
- [AIR benchmark plan](docs/ringcentral-air-benchmark-plan-2026-08-31.md)
- [Saved evaluation artifacts](evals/README.md)
- [RingCentral versus ElevenLabs comparison](docs/ringcentral-vs-elevenlabs-voice-agent-comparison-2026-08-31.md)
- [Discovery log](docs/discovery-log.md)

## Operational invariants

- Treat account call-log rows, AIR Call history and AIR Analytics as separate
  datasets until a provider reconciliation key is available. Never merge their
  denominators silently.
- Current AIR baseline is directional: the 90-day range has 32 Call History
  rows (30 Lucy, 2 Amelia) and AIR Analytics reports 28 Lucy-handled calls, 12
  resolved and 16 unresolved; the 60-day sensitivity range has 25 history rows
  and 21 handled (9 resolved, 12 unresolved). Transcript-level correctness
  still requires review.
- The Admin Portal can be read in an authenticated browser session, but the
  Create new AIR flow can force a fresh SSO login. The standard Platform API and
  local CLI inventory Ext. 1007 but do not expose documented AIR Studio CRUD or
  AIR analytics/configuration operations. Do not inspect or extract saved
  passwords, OTPs, cookies or browser session stores.
- Do not alter numbers, call handling, skills, permissions, routes, recordings
  or messages without explicit action-time approval. Keep caller PII and audio
  out of project logs unless a narrowly scoped reviewed artifact requires it.
- Internal AIR chat tests can create real Leads records. Use clearly synthetic
  details and verify stored corrections; do not treat test leads as callbacks.
