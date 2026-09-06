# RingCentral probe — SBI Voice Assistant Bridge

Read-only operational probe performed on **2026-08-30** after the private
`SBI Voice Assistant Bridge` app and its app-restricted JWT credential were
created in the SBI Group International account.

## Connection

- API server: `https://platform.ringcentral.com`.
- JWT exchange succeeded with HTTP 200; the returned OAuth access token was
  accepted by the Platform API and expires in one hour. No credential values
  are stored in this document.
- Account status: **Confirmed**.
- Authenticated extension: **Trevon Shone**, extension **318**, **Enabled**,
  role **Super Admin**.
- The local bridge credentials live only in
  `integrations/ringcentral/.env`, mode `0600`, ignored by Git. No token or
  client secret is printed by the CLI.

## App and scope state

The newly created app is a private REST API app using JWT authentication. The
Developer Console shows these scopes on the app:

- Analytics (automatically present in the console)
- Read Accounts
- Read Call Log
- Read Messages
- Team Messaging

The restricted JWT is active and authorized only for this app. Call Control,
RingOut, VoIP Calling, Edit Extensions and call-recording read access were not
added in this pass.

## What the API exposed

### Team Messaging

`GET /team-messaging/v1/chats` returned two chats:

| Type | Name | Result |
| --- | --- | --- |
| Everyone | Team SBI Group International Limited | accessible; no posts returned |
| Personal | personal chat | accessible; no posts returned |

Reading `/posts` for both chats returned HTTP 200 with zero records. The
account therefore has Team Messaging access, but there is no chat history
visible through these two chat records.

### Extensions and AI surfaces

`GET /restapi/v1.0/account/~/extension` returned **33 extensions**:

- 6 enabled users and 9 disabled users;
- 6 enabled departments and 1 disabled department;
- 5 enabled application extensions;
- 1 enabled bot, 1 enabled IVR menu, 1 enabled company extension;
- 2 not-activated announcements and 1 not-activated voicemail extension.

The existing application extensions are:

- **Amelia AI** — 1002
- **Lucy** — 1003
- **Mark - technical support** — 1004
- **Kristen - Billing and accounts** — 1005
- **Jackson - Existing distributors** — 1006

Relevant routing resources include **SBi Group UK - general calls** (IVR
1001), **General enquires** (department 4), **Existing distributors** (5),
**Technical support** (6), **Billing and accounts** (7), and **Weekend AIR
Voicemail** (11). These are inventory facts only; no routing was changed.

### Calls

`GET /restapi/v1.0/account/~/call-log` returned a first page of **100 voice
records** covering 2026-07-23 through 2026-08-27:

- 80 inbound, 20 outbound;
- 15 missed, 54 accepted, 9 voicemail, 15 call-connected, 2 rejected,
  3 hang-up, 1 stopped and 1 no-answer result;
- 59 records on that page carried recording metadata.

Pagination was not continued after RingCentral returned HTTP 429. No audio was
downloaded.

The authenticated user extension’s own message store and call log returned no
records for the tested historical window. Numeric extension message-store and
detail routes returned `TokenInvalid`/`Token not found`, so this app currently
cannot inspect other extensions through those routes.

## Admin/UI boundary

The authenticated RingCentral app exposes **Settings → AI** and **Company
settings → AI → Visit Admin Portal**. The latter opens the separate
`service.ringcentral.co.uk` admin surface, which requested a fresh sign-in in
the available browser tab. No password or OTP was entered and no bypass was
attempted.

The existing AI application extensions are visible in account inventory, but
their detailed configuration was not changed. To create the separate SBI
assistant safely, the next decision is the target extension/queue and whether
the account is using standard RingEX AI features or RingCX. Only then should
we consider adding `Edit Extensions`, `Call Control`, or a RingCX-specific
permission.

## Actions and non-actions

- Read-only probes completed: token exchange, account, own extension, chats,
  extension inventory and account call-log first page.
- No RingCentral chat post, SMS, fax, call, routing change, AI assistant
  creation, recording download or credential export was performed.
- The old Demonstration App/JWT was not reused; its token exchange had failed
  with an unsupported signing algorithm. The new app-restricted JWT is the one
  used by the local bridge.
