# RingCentral AIR setup and validation

Date: 2026-09-06. Status: configuration applied; isolated telephone pilot pending.

## Decision

Use native AIR for the first treatment, with Lucy (1003) retained on the main
company route and SBI HWS Treatment (1007) configured separately. The owner
approved the prepared configuration, which was saved through the Admin Portal.
The local bridge remains read-first, with writes disabled. A local commit does
not publish AIR settings or activate telephone service.

The final provider state and bounded test evidence are in the
[configuration receipt](../../evals/ringcentral-air-configuration-receipt-2026-09-06.md).
The [review package](../../evals/ringcentral-air-setup-review-2026-09-06.md) is the
approved proposal, not a current-state API response.

## Implementation lessons

- Creating a profile does not connect it: the Platform API's `Enabled` status
  only proves the extension is enabled. Check AIR Channels and actual inbound
  calls for reachability. On this date the unassigned number inventory was empty.
- The public Platform bridge can read inventory and account logs; it cannot
  configure native AIR skills. Use the authenticated UI, never private browser
  endpoints or session-store extraction.
- A questionnaire permits five custom questions, plus mandatory name and phone.
  Combine callback timing and final confirmation when necessary. An “optional
  email” question does not make the mandatory phone question optional.
- Capture timing has three choices: Before transfer, At a natural break, After
  greeting. Natural break allowed direct requested transfers without prior lead
  collection, but initially offered a questionnaire once after contact refusal.
  Explicit opt-out/end requests passed the final bounded retest. Recheck this
  behavior before launch; it is not a documented intent-based capture engine.
- Internal test chats create actual RingCentral Leads records. Label all test
  fields clearly and prohibit callbacks. The test record `/leads/detail/756`
  persisted a corrected height, which is stronger evidence than a chat summary.
- Company-description instructions alone did not fix ambiguous product handling.
  A targeted FAQ produced the expected clarifying question. Test the answer,
  rather than assuming prompt text governs every AIR skill.
- Read UI state after every mutation; loading placeholders and temporary disabled
  buttons are common. Revisit saved settings before claiming persistence.
- The greeting's recording disclosure and automatic-call-recording setting are
  separate. Align the approved settings and verify actual audio/transcript storage
  with a call. A checkbox is not recording-quality evidence.
- Ext. 11 is a Department named Weekend AIR Voicemail, not a standalone Voicemail
  type. Its verified wait settings send callers directly to voicemail; its name
  alone would not establish that behavior. Confirm notification ownership too.

## Evidence levels and completion

1. Configuration read-back: six active skills, approved rules and answers,
   voicemail fallback and recording state. Completed for 1007.
2. Internal chat: twelve scenario categories exercised, targeted corrections
   retested, synthetic lead fields and correction persisted. Completed with the
   specific limits in the receipt; no performance win over Lucy claimed.
3. Telephone pilot: exact number/cohort, hours and inbox/voicemail owner approved;
   inbound reachability, actual handoff, audio and recording verified. Pending.
4. Promotion: comparable reviewer-scored call evidence and original guardrails
   satisfied, followed by an explicit activation decision. Pending.

Never merge account call logs, AIR history and AIR Analytics denominators without
a supported reconciliation key. Keep the original baseline and current checks
separate; twelve chat categories are not twelve real-call passes.

## Handoff

Alex-Shon received the status and the exact-number/routing question in Abundance,
topic SBI/Jidoro/HWS/Vectra (1891), messages 2862 and 2863. Read-back confirmed the
topic and message text. His reply, a paid-number purchase and live activation are
not implied by delivery. Refresh the conversation before choosing the next step.
