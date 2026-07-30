# Discovery log

## 2026-07-30 — PR #2 assistant review and hardening

- Reviewed GitHub PR #2, `Add bilingual AI customer assistant`, originally at
  `8bb96ba`.
- The chat was visible only on the PR preview because the PR was still open,
  explaining why it was absent from the main deployment.
- Reproduced a blocking false positive: the Bulgarian SBI compatibility
  question returned an SBI remote, a BFT remote and the unrelated
  `BFT-MOOVI-30` barrier.
- Found that the original route accepted browser-supplied history, had no rate
  limit or upstream timeout, and created a resolved zero-minute ticket for the
  first message without a transcript or contact.
- Reworked the assistant around the standalone typed catalogue, server-owned
  history, deterministic compatibility answers, optional grounded Responses
  API output and consented human handoff.
- Added admin conversation listing and transcript routes, plus one
  conversation-linked ticket per follow-up.
- Updated Next.js to `16.2.12` and cleared production dependency audit
  findings.
- Added request body limits, database-backed throttling, honeypots, strict Zod
  schemas and an eight-second OpenAI timeout.
- Validated locally with eight tests, typecheck, build, production audit,
  API/database smoke tests, desktop browser QA and 390 × 844 mobile QA.
- Pushed commit `904a850` to
  `codex/add-ai-chat-for-client-support`.
- Verified Vercel deployment
  `hwsystem-4nowigu4k-bojidars-projects-2603784f.vercel.app` was READY for the
  exact commit and reproduced the correct Bulgarian SBI answer there with zero
  browser console warnings.
