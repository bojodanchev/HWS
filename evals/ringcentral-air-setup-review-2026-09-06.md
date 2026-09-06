# SBI HWS Treatment: configuration ready for review

Status: approved and applied on 6 September 2026, with provider-limit and
test-driven adjustments recorded in
[the configuration receipt](ringcentral-air-configuration-receipt-2026-09-06.md).
The proposal below is retained as the reviewed scope, not the final-state record.
Inspected in the authenticated Admin Portal on 6 September 2026.
Assistant: SBI HWS Treatment, extension 1007,
`4c0df219-1f5b-42f4-bc24-2bdd8c80eba9`.

## Verified live state

- Not connected. Lucy remains selected for both company business-hours and
  out-of-hours routing on the main number.
- Active greeting, company location/hours, and 31 FAQs. No knowledge-base,
  lead-capture or transfer skills created.
- Company hours inherited by treatment: Monday–Friday 07:30–17:30,
  Europe/Lisbon. Test chat correctly states weekends are closed.
- Backup is currently Radoslav Kadiyski, extension 301. Automatic call
  recording checkbox is off. Both greeting periods use the same text,
  including AI identification and “This call is being recorded.”
- Knowledge hub contains “Accepting a lead for an estimate”, ID
  `1b7f1a71-7e6e-491d-b72f-c91c0629d665`, used by Lucy. Its sole source is
  https://sbigaragedoors.co.uk/, marked Completed and updated 3 September.
- Department extensions 4, 5, 6 and 7 are enabled and selectable as AIR
  context-transfer targets. Queue inventory currently shows zero available
  agents for these queues; this is a Sunday snapshot, not a staffing audit.
- Extension 11, Weekend AIR Voicemail, is enabled. Its wait settings say
  “Don't wait”, then Voicemail; queue full and agents unavailable also go to
  voicemail. Working settings apply 24/7. Its listed agent is extension 307,
  which the Platform API marks Disabled. Treat this as a voicemail destination,
  never promise it reaches a live person. Notification delivery is untested.
- Unassigned number inventory is empty. The additional main number is already
  a company number; the listed direct number belongs to extension 301.

## Exact proposed skill changes

Scope: extension 1007 only. No edits to Lucy, company hours, shared knowledge
content, department queues, public numbers, permissions, or integrations.

### Knowledge

Attach the existing completed “Accepting a lead for an estimate” knowledge
base to 1007 and enable its Knowledge bases skill. This reuses the existing
public SBI website source without modifying Lucy's source. More detailed
product claims still require review against a specific current product page.

### Lead capture

Create “SBI quote and callback request”, for new and existing callers. Store
responses in RingCentral Leads; do not connect an external CRM or send SMS.
RingCentral requires name and phone number and repeats those mandatory
questions when unanswered. Do not represent email-only capture as supported.

Custom questions in order:

1. What product or issue would you like help with?
2. What is the postcode for the property or project?
3. If you need a door or shutter quote, what are the approximate opening width
   and height, including units? It is fine if you do not know yet.
4. Is there an email address you would also like us to use? This is optional.
5. What is a convenient time for the team to call you back?
6. Are the contact details and project information we have discussed correct,
   or would you like to correct anything?

The UI has no observed intent-condition field for questionnaires. Test whether
it over-collects on simple FAQ calls before enabling live traffic. A confirmation
question alone does not prove that AIR reads details back; that must pass testing.

### Context transfer rules

Each description fits the observed 500-character field.

| Destination | Rule description |
| --- | --- |
| Ext. 4 General enquires | Transfer callers requesting a person for a new quote, product enquiry or general sales question to General enquiries. Ask only the minimum question needed to identify the request. Do not promise that an agent is available. |
| Ext. 5 Existing distributors | Transfer existing distributors asking about their trade orders or distributor relationship to Existing distributors. Do not put an existing distributor through a new-customer sales questionnaire before the requested handoff. |
| Ext. 6 Technical support | Transfer faults, troubleshooting, repairs and technical compatibility questions requiring a specialist to Technical support. Do not instruct callers to work on electrical wiring, springs or other hazardous door mechanisms. |
| Ext. 7 Billing and accounts | Transfer invoice, payment-status and account-balance questions to Billing and accounts. Never ask for card details, banking passwords or verification codes. |

Do not claim these descriptions guarantee workflow order, warm transfer or
context delivery; validate provider behavior in tests. Actual destination
answering and after-hours behavior require end-to-end calls.

### Fallback and recording — explicit choices for approval

- Proposed backup: change 301 to 11, with spoken destination name “voicemail”.
  This avoids promising a live handoff when nobody is available. Confirm a
  human owner receives and processes the voicemail before launching.
- Proposed automatic recording: enable for 1007 and retain the existing AI
  and recording disclosure. Verify actual recording/transcript availability
  with an isolated test. AIR conversation storage and the account call-log
  recording checkbox may be distinct; checkbox state alone does not prove
  whether all underlying provider recording is off.

### FAQ corrections

The current FAQ contains broad generated-looking service promises. Replace the
following answers with bounded wording rather than assuming those promises
have been approved:

| Existing question | Replacement answer |
| --- | --- |
| Do you handle servicing and repairs of garage doors? | Please tell us the door type, fault and postcode. Our technical team can confirm whether we can service or repair that particular door. |
| Can you remove my old garage door? | Please mention removal and disposal when requesting your quote. The team will confirm whether they are included for your installation. |
| Is there a warranty on your products? | Warranty terms depend on the specific product and installation. Please provide the product or order details so the team can confirm the applicable terms. |
| Can you automate existing garage doors? | Retrofitting depends on the existing door and equipment. Please provide the door or motor details so our technical team can assess suitability. |
| Are your automation systems compatible with smart home technology? | Compatibility depends on the exact motor, controller and smart-home system. Please provide their model details so our technical team can confirm compatibility. |
| Do you provide free site surveys? | Please ask for a site survey with your quote request. The team will confirm whether one is needed, available and chargeable for your project. |
| Can you schedule installations outside standard business hours? | Please include your preferred installation time in your enquiry. The team must confirm availability before any appointment is agreed. |
| Do you install garage doors as well as supply them? | Please provide your postcode and product requirements. The team will confirm the supply and installation options for your project. |
| Which areas of the UK do you cover? | We advertise nationwide UK coverage. Please provide your postcode so the team can confirm the service available for your project. |

Add these operational answers:

- Exact price or delivery date: “The team must confirm your project-specific
  quote and delivery date. I cannot guarantee a price, stock or lead time.”
- Urgent fault: “Please keep people clear of the door and avoid attempting
  electrical or mechanical repairs. I can help route your enquiry to technical
  support, but I cannot promise emergency attendance.”
- Outside office hours: “Our office hours are Monday to Friday, 07:30 to 17:30.
  I can help with general information or take your details for follow-up. I
  cannot promise that a person is available now or guarantee a callback time.”

## Tests performed on unchanged configuration

Internal AIR test chat only; synthetic prompts, no caller identifiers, no
phone calls, no claim of completed lead capture or successful transfer.

| Check | Observed result | Limit |
| --- | --- | --- |
| Greeting | Identifies SBi Group and AI; includes recording disclosure | Audio and storage unverified |
| Quote requirements | Lists name, postcode, phone/email, product and dimensions | Lists fields; did not prove persistence |
| Weekend hours | Says closed Saturday and Sunday | Internal chat only |
| Exact price and delivery guarantee | Refuses guarantee; says project-dependent | One combined follow-up prompt |

## Completion gates for this session

1. Approve and save the exact 1007 configuration above, then read it back.
2. Run the existing 12 scenarios in internal chat, using synthetic lead details
   only; inspect all captured fields and verify correction handling. Test that
   informational callers are not forced through a sales questionnaire.
3. Check a supervised audio call, recording disclosure, actual recording and
   transcription, and queue/voicemail handoff. Do not count chat simulation as
   a telephone handoff test.
4. Select and approve an isolated phone route. There is no spare number, so a
   new number requires a displayed recurring price and spending approval;
   reassigning a current number requires a specific reviewed routing choice.
5. Confirm who processes leads and voicemail and verify receipt with one
   synthetic enquiry. No new notifications or external messages are enabled
   by this review package.
6. Activate the selected pilot only after critical tests pass, make an inbound
   call to its actual number, and verify provider read-back. Preserve Lucy's
   main-number assignment for the control comparison.

## Source provenance

- Authenticated RingCentral AIR Studio skills, settings, knowledge hub, chat
  test and Channels, inspected 6 September 2026.
- Authenticated Number inventory and Weekend AIR Voicemail wait settings,
  inspected 6 September 2026; public Platform API extension inventory refreshed.
- https://sbigaragedoors.co.uk/ — public product families, nationwide coverage
  and quote fields, fetched 6 September 2026.
- https://sbigaragedoors.co.uk/contact-us/ — public contact surface checked;
  page body and footer list different email aliases. Do not invent a lead
  notification recipient from this discrepancy.

Repository AGENTS.md requires action-time approval before changing skills,
routes and recording settings. This package records the exact pending actions;
it is not an approval or a deployment receipt.
