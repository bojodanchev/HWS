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
