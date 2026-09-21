# HWS production release — 21 September 2026

Owner explicitly requested production deployment after the task-list review.

- Released commit: `4456199d7bdffd9afb21b035a1d369fe97e135e5`.
- Release path: fast-forward Git push to `origin/main` from the existing local HWS checkout; no separate worktree.
- Vercel deployment: `dpl_9VoVXBiRiRsZPCugrd5BxzAZTDDK`, target production, status Ready.
- Public site: https://hwsystem.co.uk/
- Deployment URL: https://hwsystem-bgeqxta25-bojidars-projects-2603784f.vercel.app
- Previous production commit: `205a2b261812817560bc8a14409d9cb5f49d9e5b`.

`HWS_ADMIN_PASSWORD` was configured as a sensitive production environment variable before deployment. A recovery copy is stored only in the ignored `hwsystem/.env.production.admin` file with mode 0600. No credential value is recorded here or committed.

Browser read-back on the canonical production domain verified the updated homepage, new UK number, expanded product menu, old-category product redirect and unauthenticated admin redirect to sign-in. The www domain redirects to the apex. Authenticated production admin login and real form delivery were not exercised in this release check.

The previously reviewed catalogue/commercial/voice-routing gaps remain open. This is deployment of the reviewed implementation, not completion of the whole task list. The production-release and admin-secret blockers from the preceding review are now resolved.

## Follow-up release preparation

The continuation adds the contextual nine-second/24-hour contact popup, Special order catalogue tabs, an enquiry inbox, linked voice-ticket statuses, manufacturer and labelled representative photos, and category corrections. The installation page remains preview-only and noindex pending team review. Local checks: 29 passing tests, successful production build, lint with three existing warnings; email-only popup persistence, dismissal, inbox rendering and illustrative-image captions verified in the isolated local database/browser.

ElevenLabs Main version `agtvrsn_8601m30kjtpqftcs7fy3rtm5sbeb` was merged from tested version `agtvrsn_0801m30jj4zjf2kv2zjzazq737rg`. The four tests passed, and merged configuration/test attachments match the preview. The audit confirms Main 100%, no draft/divergence, correct UK number, tool, knowledge ID, and recording with seven-day retention. `agents branches get` reported 0% while the branch inventory reports 100%; the audited live inventory and default-Main phone assignment are retained as routing evidence.

All historical lead-capture and personality test fixtures use synthetic contacts. External notification delivery and human transfer remain pending Alex-Shon's destinations. RingCentral remains at owner SSO sign-in; no Lucy/shared-KB or main-route change was made.

## Verified website continuation

- `3794fe9dcd199cacb787805ae513847a95f5d80d`: production Ready (`dpl_71sBNvBYeGA6k81JkpfT6K9uxKkd`) and installation preview Ready (`dpl_A854c8U5xLWr1jB4nTwiZc4q7EPy`). Canonical catalogue tabs and illustrative captions read back in the browser.
- `d642d5928c3cb962560e57bed7361b3caad2b28f`: production Ready (`dpl_96LVRQhz2i2TTXhU41q61EuseU7E`), correcting remaining named motor families and kits that mention included remotes. Audit: 1,637 unique SKUs, 1,600 with images, 37 missing images, 1,273 quote-only.
- Installation review: https://hwsystem-gdbnt5t5u-bojidars-projects-2603784f.vercel.app/installation . Canonical `/installation` returns 404; unauthenticated `/admin/leads` redirects to sign-in.
- Telegram messages 2940–2941 delivered the preview, remaining decisions and image-source CSV; both read back. Alex-Shon approved the email destination in message 2938. Sending-domain DNS records were sent in 2939, also read back. Email activation remains pending DNS verification and a scoped provider credential.
- Email continuation checks: 32 tests pass; production build and TypeScript pass; lint retains three existing warnings.

- `c74e3fd468f34e55d63a78d8a6b38a2d01efdb95`: production Ready (`dpl_61t6THeSMKYJgkA8X8RBnT69wg73`), email activation code deployed. A synthetic live request and replay returned `saved:true`, the same lead ID and `notification:unconfigured`; the database contained one notification record with no provider ID. Synthetic lead/ticket closed. No external delivery claimed.

## Installation public review request

Alex-Shon message 2942 explicitly requests the draft at the production `/installation` URL because the preview did not load for him. Removed only the production access guard. Draft labels, noindex metadata and the visual-only form remain; service terms still require confirmation. Production build and TypeScript passed. Email DNS remains `not_started`; no duplicate reminder sent.
