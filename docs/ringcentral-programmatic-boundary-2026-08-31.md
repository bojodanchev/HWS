# RingCentral AIR programmatic boundary — 2026-08-31

## Verified current state

- **SBI HWS Treatment (Ext. 1007)** was created in RingCentral AIR through the
  authenticated Admin Portal.
- It is **Not connected** and has no phone number, queue or company
  call-handling rule. Lucy’s production route was not changed.
- The local bridge sees the new record in the standard extension inventory as
  an enabled, hidden `ApplicationExtension`.

## What is supported programmatically today

The local bridge and public RingCentral Platform API support the bounded
operations documented in [integrations/ringcentral/README.md](../integrations/ringcentral/README.md):

- account and authenticated-extension reads;
- standard extension inventory;
- Team Messaging chat/post reads;
- message-store and account call-log reads;
- guarded chat posting (disabled by default).

The bridge does not expose AIR Studio CRUD, AIR skill editing, AIR knowledge
base assignment, AIR Call History, AIR Analytics, AIR lead-capture configuration
or AIR Channels/routing assignment.

## What is not a documented public AIR API/CLI

The current RingCentral developer materials document the AIR setup path in the
Admin Portal: create the receptionist, configure skills, test it, then assign
it to company call handling or an IVR. The public developer catalog exposes
RingEX, RingCX and RingSense APIs, but I did not find a documented AIR Studio
CRUD endpoint or an official CLI for AIR configuration.

Do not infer that RingCX’s separate agent-management API is an AIR API. RingCX
agent records, groups and queue permissions are a different product surface.

The AIR web UI clearly uses private service routes behind the authenticated
portal. Those routes may change without notice and should not be scraped or
used as a production integration.

## Practical automation options

1. **Admin Portal automation** — suitable for bounded, human-supervised setup
   and readback. It still depends on SSO and should stop before final save or
   live route activation for review.
2. **Public Platform API + bridge** — suitable for account/extension/call-log
   evidence and standard RingEX operations, not AIR configuration.
3. **Vendor-supported access** — ask RingCentral whether the account can use a
   supported AIR Pro/API/BYOI surface if full automation is required. Confirm
   the exact product and entitlement first.
4. **Separate custom voice stack** — possible with RingCentral Call Control or
   SIP, but this would be our own voice agent rather than native AIR and would
   require additional scopes, telephony design and monitoring.

## Benchmark implication

For the incumbent-versus-our-work test, keep Lucy as control and treat Ext. 1007
as the isolated treatment. Use AIR Studio Call History/Analytics for agent
outcomes and the local bridge for account-level reconciliation. Do not claim a
programmatic AIR experiment until a supported API or a reviewed Admin Portal
workflow can produce stable agent/version/cohort identifiers.

## Safety boundary

No public number, company route, queue, recording policy, permission or live
call behavior was changed while confirming this boundary. Credentials remain
local and are not included in project documentation.

## References

- [RingCentral AIR setup and updating](https://assets.ringcentral.com/us/guide/settingup-updating-your-ai-receptionist.pdf)
- [RingCentral developer API catalog](https://developers.ringcentral.com/)
- [RingCX agent-management API](https://developers.ringcentral.com/engage/voice/guide/users/agents/agents)
