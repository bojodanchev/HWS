# HWS enquiry email setup

Recipient confirmed by Alex-Shon in Telegram message 2938: codeabundance2026@gmail.com.
Sending-only domain: notify.hwsystem.co.uk. Existing website and incoming mail records must remain unchanged.

Add these records in the hwsystem.co.uk Lightsail DNS zone (TTL 300 or provider default):

- TXT `resend._domainkey.notify` → `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/bWjD3By3mj6xr6W9+e2tKowt1ElXTSr7FrgMhWLV2+ldlj5MnAB+QsIVFbd5+6zWZ2lrFbG9Qo0wKvfZViY5jV+RAryudelxCNP/6GIz0Mry+/MxS2Rez96kkbN9X5K5gSNcDgDv77c6YlDWJo3NCiNVnclsnuPNjvu+Bwz4PQIDAQAB`
- MX `send.notify` → `10 feedback-smtp.eu-west-1.amazonses.com`
- TXT `send.notify` → `v=spf1 include:amazonses.com ~all`
- CNAME `rsend.notify` → `send.forge.rmta.net`

After DNS is published, run `resend domains verify --id 018f3193-e835-4602-aaec-78aa3aad36ac --json` and read back verified status before enabling email. No domain verification or email delivery is claimed yet.

## Delivery activation and verification

Production recipient and `HWS_LEAD_EMAIL_FROM=HWSystem Leads <leads@notify.hwsystem.co.uk>` are configured. `RESEND_API_KEY` remains absent until the sender is verified. Create only a domain-restricted sending key after verification; store directly in sensitive Vercel production configuration, never in a transcript or Git. Existing Resend CLI authentication is in Keychain and supports provider status reads.

The voice route stores the enquiry first, then attempts email. Acceptance is separate from actual delivery and never changes `saved:true` into a failed save. `voice_email_notifications` records each contact snapshot's status and provider message ID. Replayed accepted snapshots do not resend; corrected contact data produces a new message clearly labelled as updated details. Provider idempotency handles concurrent requests within its 24-hour window. Failed/unconfigured notifications remain in the admin database; no scheduled email retry or historical backfill is claimed. Verify a synthetic enquiry, retry, correction and provider delivered event after activation. Do not use real callers as test fixtures.

Tests use an explicit in-memory database and mocked network; they cannot contact the real recipient.
