# RingCentral bridge

This is a local, read-first bridge for the HWS/SBI RingCentral account. It is
separate from the Next.js app and has no dependency on the HWS customer-facing
bundle.

## Current boundary

- `doctor`, `account`, `extension`, `chats`, `chat`, `messages` and `calls` are
  read operations.
- `post` is the only write operation currently exposed. It requires all of:
  `write_enabled: true` in `config.json`, `RINGCENTRAL_WRITE_ENABLED=true`, a
  chat ID in `allowlist.chat_ids`, and the per-command `--confirm-write` flag.
- The separate SBI voice-assistant plan remains local metadata, but the
  RingCentral Admin Portal now contains **SBI HWS Treatment (Ext. 1007)**. It
  is **Not connected** and has no number, queue or company call-handling rule,
  so it cannot receive live calls yet.
- As of 6 September, its six AIR skills are active, backup is voicemail Ext. 11
  and recording is enabled. Internal chat and synthetic lead persistence were
  checked; real-call validation and a pilot number remain pending. See the
  [configuration receipt](../../evals/ringcentral-air-configuration-receipt-2026-09-06.md).
  `voice-plan` reports this dated local snapshot, not live provider state.
- The public Platform API/this CLI currently do not expose AIR Studio CRUD,
  AIR skills, AIR call-history analytics or AIR routing configuration. Use the
  authenticated Admin Portal for those operations; do not reverse-engineer
  private browser endpoints as a production integration.
- Credentials are read from the process environment. Never put them in Git,
  Telegram, a document, or a command pasted into a shared log.

## One-time local setup

1. Create a RingCentral Developer app in the
   [Developer Console](https://developer.ringcentral.com/).
2. Select the correct product boundary: standard RingEX/Platform APIs versus
   RingCX. RingCX has a separate API surface and account/token exchange.
3. For the initial inspection, request only the scopes the account needs:
   `ReadAccounts`, `ReadMessages`, `ReadCallLog`, and `TeamMessaging`.
   Add `ReadCallRecording` only when recorded audio is explicitly required.
   Do not enable `RingOut`, `VoipCalling`, `Call Control`, `SMS` sending, or
   `EditMessages` until the separate voice-agent design is reviewed.
4. Prefer OAuth authorization code + PKCE for a human-approved connection. For
   a single-account local/server integration, RingCentral also supports a JWT
   credential. The CLI accepts one of `RINGCENTRAL_ACCESS_TOKEN`,
   `RINGCENTRAL_USER_JWT`, or `RINGCENTRAL_REFRESH_TOKEN`.
5. Copy `.env.example` to `.env` and fill it locally. Keep the file ignored.

The app scope is not the same as the user’s role permission; the RingCentral
user/extension must also be allowed to view the relevant chats, messages, calls
or recordings.

## Local commands

Run from this directory with Node 20+:

```bash
node --env-file=.env cli.mjs doctor
node --env-file=.env cli.mjs auth-url
node --env-file=.env cli.mjs login
node --env-file=.env cli.mjs account
node --env-file=.env cli.mjs extensions --type ApplicationExtension --status Enabled
node --env-file=.env cli.mjs chats --limit 50
node --env-file=.env cli.mjs chat <CHAT_ID> --limit 100
node --env-file=.env cli.mjs messages --type SMS,MMS,VoiceMail
node --env-file=.env cli.mjs calls --date-from 2026-08-01T00:00:00Z
node --env-file=.env cli.mjs calls-account --date-from 2026-08-01T00:00:00Z
node --env-file=.env cli.mjs voice-plan
```

`auth-url` prints an authorization URL and a state value. `login` runs a
localhost-only PKCE callback, opens the browser, and stores the resulting OAuth
token file at `tokens/oauth.json` with mode `0600`. Do not paste the callback
code into chat. The bridge deliberately does not print access or refresh token
values.

Only after we have identified a safe test chat and explicitly reviewed the
payload should a write be enabled:

```bash
node --env-file=.env cli.mjs post <ALLOWLISTED_CHAT_ID> "test message" --confirm-write
```

Leave `RINGCENTRAL_WRITE_ENABLED=false` until that point.

## API map

The bridge calls the standard Platform API directly:

- Team Messaging: `/team-messaging/v1/chats` and
  `/team-messaging/v1/chats/{chatId}/posts`.
- Message Store: `/restapi/v1.0/account/~/extension/~/message-store`.
- Call log: `/restapi/v1.0/account/~/extension/~/call-log`.

For a live voice assistant, chat history is not enough. We still need to confirm
whether the account is RingEX or RingCX, choose the target extension/queue, and
then design call control/audio, escalation, recording and retention boundaries.
