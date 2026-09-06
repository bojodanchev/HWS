# HWS voice-agent evaluations

This directory stores the benchmark inputs and decision rules for comparing
the connected RingCentral AIR incumbent with the isolated HWS treatment.

## Files

- [ringcentral-air-configuration-receipt-2026-09-06.md](ringcentral-air-configuration-receipt-2026-09-06.md)
  — latest saved configuration, internal chat/lead read-back, limits and Alex-Shon handoff.
- [ringcentral-air-setup-review-2026-09-06.md](ringcentral-air-setup-review-2026-09-06.md)
  — approved setup proposal; use the receipt for final state and adjustments.

- [ringcentral-air-lucy-incumbent-2026-08-31.json](ringcentral-air-lucy-incumbent-2026-08-31.json)
  — PII-free 60-day and 90-day control snapshot from AIR Call history,
  Analytics and Leads.
- [ringcentral-air-scenarios-2026-08-31.json](ringcentral-air-scenarios-2026-08-31.json)
  — anonymized offline scenarios and expected behaviors.
- [ringcentral-air-treatment-design-2026-08-31.md](ringcentral-air-treatment-design-2026-08-31.md)
  — proposed configuration differences, KPI targets, rollout sequence and
  guardrails.

## Control and treatment

- Control: Lucy, Ext. 1003, Connected to the company main-number route.
- Treatment: SBI HWS Treatment, Ext. 1007, Not connected and with no number,
  queue or company call-handling rule.

The treatment now has six active skills, voicemail-11 backup and recording
enabled. Internal chat and synthetic lead persistence are verified; actual
telephone reachability, handoffs, recording storage and staff receipt remain
pending. The treatment must stay isolated until its knowledge, greeting/disclosure,
hours, transfer destinations, recording behavior and lead read-back have been
reviewed. Do not join RingCentral account call-log rows to AIR rows by caller
number or time alone.

## Evaluation rule

Use the 90-day Lucy window as the primary control and 60 days as a recency
sensitivity check. The provisional practical bar is at least 52.9% reviewer-
verified resolution, versus Lucy's observed 42.9%, with at least 50 eligible
calls per arm and no critical guardrail regression. Provider `Resolved`,
`Transferred` and `Ended by caller` labels remain diagnostic until transcript
review confirms what happened.
