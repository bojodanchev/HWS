# SBI HWS Treatment configuration receipt — 6 September 2026

Status: configuration applied and read back; internal chat checks completed;
telephone activation and real-call checks pending a selected pilot number.
Owner approved the setup review package in this session and requested an update
to Alex-Shon in Abundance's HWS topic after completion, including a phone-number
and routing question.

## Saved configuration

- Assistant: SBI HWS Treatment, extension 1007.
- Nine approved FAQ answers replaced and three operational answers added.
  Each replacement/addition was read back in the UI; expected total 34 FAQs.
- Existing knowledge base “Accepting a lead for an estimate” attached and
  Knowledge bases skill active; skill ID `cfffeafa-fbbd-4af9-9496-8e50cdfcda2a`.
  The shared source itself was not edited.
- Four active context-transfer rules to General enquires (4), Existing
  distributors (5), Technical support (6), Billing and accounts (7), each
  read back with the approved description. Skill ID
  `a56157ff-7601-4b13-aa6a-42edc5f94af8`.
- Backup changed from 301 to Weekend AIR Voicemail (11), spoken destination
  “voicemail”; automatic recording enabled and Saved confirmation observed.
- Lead questionnaire “SBI quote and callback request” created for new and
  existing callers, active with no external CRM selected. Skill ID
  `a442b878-bb8b-4fa9-a741-e825816cadce`.
- Provider permits only five custom lead questions. The approved callback-time
  and confirmation questions were combined into question 5; the other four
  retain the approved wording. Name and phone are separately mandatory.
- Capture timing initially set to “At a natural break” to avoid placing the
  questionnaire before a requested transfer. This remains the saved setting.
- Added one further FAQ after the ambiguity test failed: a vague building-front
  enquiry now asks what the caller wants to achieve rather than listing products.
  Final expected FAQ count is 35 (31 original + 3 approved + 1 corrective).
- Compressed company information to 475 characters, retaining product/quote
  boundaries and adding clarification, contact opt-out and no-availability-promise
  guidance. Saved and read back. Its instruction alone did not fix ambiguity;
  the targeted FAQ did.
- Revisited settings after navigation: extension 11, “voicemail” and recording
  enabled persisted. Skills page shows six active skills. Channels still shows
  Lucy for company business and out-of-hours routing, and no direct number for
  the treatment.

## Internal chat evidence

Tests use synthetic prompts, not production caller data. A chat announcement
of a transfer does not establish a successful telephone handoff.

- Information-only hours/location: nationwide UK and Monday–Friday 07:30–17:30,
  weekends closed. No initial questionnaire. After an explicit refusal to leave
  details, AIR nevertheless offered a short questionnaire once; a further “No,
  end the conversation” was respected. Capture timing needs refinement or a
  documented limitation before live activation.
- Human request about a new quote: offered General enquiries, then announced
  transfer after confirmation, without collecting contact details first.
- Existing distributor order: offered Existing distributors and announced that
  destination after confirmation; did not require a new-customer questionnaire.
- Technical fault involving electrical wiring: explicitly instructed the caller
  not to open wiring and offered Technical Support; announced that destination
  after confirmation.
- Billing/invoice: offered and then announced Billing and accounts after
  confirmation, with no request for payment details or a sales questionnaire.
- Residential quote: asked permission, then collected name, fictional phone,
  product, postcode, dimensions with units, optional example.com email and
  callback/confirmation. Corrected height from 2100 to 2200 mm in the read-back.
- Persistence: actual RingCentral Leads detail `/leads/detail/756` identifies
  the synthetic HWS Test Caller and SBI HWS Treatment, contains all five custom
  answers, and stores the corrected 2200 mm height in the dimensions answer.
  The callback answer explicitly says test/no actual callback. No real caller
  identifiers were copied into repository artifacts.
- Commercial shutter quote without dimensions: offered General enquiries
  rather than inventing measurements or a price. Full capture was exercised by
  the residential scenario, not repeated here.
- Somfy automation: confirmed the website-supported offering and refused to
  guarantee smart-home compatibility without exact equipment models.
- Exact price/delivery, disposal, survey and warranty: required a project quote,
  confirmation of disposal inclusion and survey charges, and product-specific
  warranty terms. No invented fixed price or delivery date.
- Ambiguous building-front request initially failed by listing products. After
  the corrective FAQ it asked which purpose/product the caller needed.
- Weekend urgency: said closed weekends, refused immediate-person and emergency
  attendance guarantees, provided safe keep-clear guidance, and offered technical
  support without promising availability.
- Final opt-out retest: answered hours only; a subsequent explicit request to
  end the conversation was honored without offering another questionnaire.
  This is a bounded retest, not proof that every paraphrase avoids the provider's
  natural-break capture offer.

The twelve categories from the saved scenario suite were exercised in chat.
These are qualitative acceptance checks, not a scored performance comparison
with Lucy, and not twelve end-to-end telephone passes. Some platform filler
phrases imply checking details; no order-system lookup integration was added.

## Boundaries

No phone number assigned; no company route, Lucy setting, queue setting,
notification recipient, external CRM, SMS, or appointment integration changed.
Audio quality, actual call transfers, recording/transcript storage and staff
receipt still require separate evidence. Lead persistence is verified as above.
The synthetic lead is intentionally retained as a test artifact; it must not
be treated as a genuine callback request.

## Alex-Shon handoff

Sent the authorized completion update and phone/routing question in Abundance,
topic SBI/Jidoro/HWS/Vectra (1891), messages 2862 and 2863. Read-back verified
both are outgoing in that topic and preserve actual paragraph breaks. Asked
for the exact pilot number or existing IVR route, operating hours, and the
person responsible for Leads and voicemail. Explained that the agent is not
receiving telephone calls yet and that real-call checks remain. No reply or
routing approval is implied by message delivery.
