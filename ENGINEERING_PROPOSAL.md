# Engineering Proposal: Public-Ready Awwabi Landing Page and Waitlist

**Status:** Proposed  
**Date:** 2026-06-24  
**Related review:** [`CODE_REVIEW.md`](CODE_REVIEW.md)  
**Target outcome:** A small, maintainable public repository with a secure, reliable, privacy-aligned waitlist

## 1. Summary

The current presentation architecture is adequate and should not be replaced. The corrective work should focus on the waitlist trust boundary, repository quality gates, public-facing completeness, and page weight.

The central change is to remove direct Firestore access from the browser. The form will submit to a same-origin server endpoint that validates a fixed schema, applies abuse controls, performs an idempotent server-side write, and returns typed application responses. Firestore will deny all direct client access to waitlist records. This also removes the Firebase web SDK from the landing-page bundle.

The work is organized into independently reviewable phases. Security and data-handling changes land first; visual refactoring is intentionally deferred until the functional boundary is correct.

## 2. Goals

- Make the waitlist safe to expose to unauthenticated internet traffic.
- Keep personal data processing explicit, minimal, documented, and deletable.
- Make repeated submissions idempotent without disclosing whether an email exists.
- Remove Firebase from the initial browser bundle.
- Establish enforceable type, lint, format, test, build, and dependency checks.
- Complete broken or missing public navigation, metadata, documentation, and legal links.
- Reduce obvious image/font cost without redesigning the page.
- Make a clean clone reproducibly developable and deployable.

## 3. Non-goals

- Redesigning the landing page or changing its visual identity.
- Introducing global state management, a generic domain framework, or a broad component rewrite.
- Building a general multi-project waitlist platform.
- Building an administration dashboard or email campaign system.
- Replacing Firebase solely for architectural fashion.
- Making legal-policy decisions without the appropriate product/legal owner.

## 4. Preconditions and decisions required

These decisions must be recorded before implementation begins:

1. **Hosting model:** confirm that production supports a Next.js route handler or equivalent serverless function. If the site must be statically exported, host the same API contract in a Firebase/Cloud function or managed form backend.
2. **Production data:** determine whether `waitlist_entries` already contains real records. This controls whether migration is required.
3. **Retention:** define how long names and emails are retained, including what happens after launch.
4. **Legal copy owner:** assign an owner to approve the privacy notice and submission disclosure.
5. **Abuse-control provider:** select a rate-limit store available in the deployment environment. It must work across instances; in-memory limits are insufficient in serverless production.
6. **Repository license:** the organization must explicitly choose the license. Public visibility does not itself grant a usable open-source license.
7. **Public destinations:** provide the real Instagram, email, WhatsApp, canonical site URL, and social-preview assets.

Recommended defaults are used below. If a decision changes, preserve the API and security properties rather than the exact implementation.

## 5. Target architecture

```text
Browser
  POST /api/waitlist (same origin, JSON)
    -> request origin and size checks
    -> schema validation and normalization
    -> honeypot and distributed rate limit
    -> idempotent waitlist operation
      -> Firestore server client / trusted credentials
      -> Firestore create-only record
    -> structured, PII-safe metrics/logging

Firestore rules
  -> deny all browser reads and writes to waitlist records
```

### Why this boundary

- Validation and document shape are enforced outside the untrusted browser.
- Database collection names, write behavior, and infrastructure errors are not client concerns.
- The Firebase web SDK is not downloaded by every visitor.
- Rate limiting and monitoring have a trusted enforcement point.
- Duplicate handling can be atomic and privacy-preserving.
- Firestore rules and IAM become defense-in-depth rather than the only backend.

### Proposed module layout

```text
src/
├── app/api/waitlist/route.ts       # HTTP boundary only
├── components/marketing/
│   ├── call-to-action.tsx          # mostly static section
│   └── waitlist-form.tsx           # minimal client component
└── lib/
    ├── firebase/admin.ts            # server-only initialization
    └── waitlist/
        ├── schema.ts                # request type, normalization, limits
        ├── submit.ts                # idempotent operation
        └── errors.ts                # typed internal outcomes
```

Keep these modules function-oriented. Do not introduce a repository interface unless a second persistence implementation or meaningful test boundary requires it.

## 6. API contract

### Request

`POST /api/waitlist`

```json
{
  "name": "Aisyah",
  "email": "aisyah@example.com",
  "website": ""
}
```

`website` is an invisible honeypot field. It is not persisted.

Rules:

- Require `Content-Type: application/json`.
- Reject requests larger than a small fixed limit, recommended 8 KB.
- Require an allowed same-origin `Origin` in production.
- Reject unknown fields.
- Normalize `name` by trimming and collapsing excessive whitespace.
- Normalize `email` by trimming and lowercasing for this product's identity policy.
- Apply explicit limits, initially 1–100 characters for name and at most 254 characters for email.
- Use a maintained schema validator rather than maintaining a bespoke email regex.
- Do not accept `projectId`, `source`, or arbitrary `extraData` from the browser.

### Responses

| Status | Meaning                                          | Response behavior                                        |
| ------ | ------------------------------------------------ | -------------------------------------------------------- |
| `202`  | Accepted, including an existing normalized email | Return the same generic success body in both cases       |
| `400`  | Invalid request                                  | Return stable field codes suitable for localized UI copy |
| `415`  | Unsupported content type                         | Generic error                                            |
| `429`  | Rate limited                                     | Generic retry message and `Retry-After`                  |
| `503`  | Persistence unavailable                          | Generic retry-later message; record an internal error    |

Example success:

```json
{ "ok": true }
```

Do not return a duplicate-email outcome. That distinction enables email enumeration and is unnecessary for the user experience.

## 7. Data model and idempotency

Proposed stored record:

```ts
type WaitlistRecord = {
  email: string
  name: string
  source: 'landing-page'
  createdAt: Timestamp
  expiresAt: Timestamp
  schemaVersion: 1
  privacyNoticeVersion: string
}
```

Requirements:

- Use an HMAC-SHA-256 of the normalized email as the document ID. The HMAC secret remains server-side. Raw email addresses must not appear in document paths or routine logs.
- Use atomic create-only semantics. If the record already exists, do not overwrite the original name, timestamps, or consent metadata.
- Return the same accepted response for a newly created and existing record.
- Set `expiresAt` from the approved retention policy. On the current Spark plan, enforce deletion with the reviewed cleanup command; managed Firestore TTL requires billing.
- Restrict the record to the exact schema above. No arbitrary metadata bag is permitted.
- Never log the raw name or email. If correlation is needed, log a truncated server-generated digest or request ID.

### Existing-data migration

If real records already use `email_project` document IDs:

1. Export and back up the collection with restricted access.
2. Deploy the new endpoint writing to a versioned collection such as `waitlist_entries_v2`.
3. Run a one-time authenticated migration that validates each record and writes the HMAC-keyed schema.
4. Reconcile counts and rejected records without placing PII in logs.
5. Disable direct client writes before switching the form.
6. Retain the old collection only for an approved rollback window, then delete it securely.

If there is no production data, start with the final collection/schema and omit migration machinery.

## 8. Security and abuse controls

### Required controls

- Deny all direct browser access to waitlist records in committed Firestore rules.
- Use workload identity/application-default credentials where the host supports them. Avoid long-lived service-account keys; if unavoidable, store them only in the deployment secret manager.
- Apply distributed rate limits by IP-derived key and normalized-email digest. Keep rate-limit data short-lived and out of application records.
- Add a honeypot and minimum-submit-time signal as low-friction bot filters.
- Enforce same-origin requests and do not enable broad CORS.
- Validate payload size, shape, field types, and field limits at the server boundary.
- Return generic external errors and retain typed internal causes.
- Configure alerts for sustained write failures, rate-limit spikes, and unusual accepted volume.

CAPTCHA should not be the first control. Add a privacy-conscious challenge only if measured abuse remains material after server validation, honeypot filtering, and rate limiting.

### Firestore policy

The waitlist collection should be inaccessible through Firebase client credentials:

```text
match /waitlist_entries/{document=**} {
  allow read, write: if false;
}
```

Commit the complete deployable rules and emulator tests, not only this fragment. Server access must be constrained through IAM and deployment identity.

### HTTP hardening

After removing client Firebase and external font dependencies, add and test:

- `Content-Security-Policy`, including `frame-ancestors 'none'`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- A minimal `Permissions-Policy`.
- HSTS at the production edge once HTTPS behavior is confirmed.
- `poweredByHeader: false` in Next.js configuration.

Build CSP from observed production requirements. Do not ship an untested or broadly permissive policy.

## 9. Privacy and data lifecycle

Engineering must provide the mechanics; product/legal must approve the policy.

Required outcomes:

- Explain what name and email are used for and whether name is actually necessary.
- Identify the operating entity and relevant processors, including hosting and Firebase.
- State retention/deletion behavior and a working contact route.
- Document how a user requests access or deletion.
- Link the privacy notice immediately adjacent to the submit button.
- Version the approved notice and persist that version with new records.
- Ensure contact links and deletion requests are operational, not placeholder text.
- Remove or disclose third-party browser requests. Self-hosting fonts materially simplifies this.
- Maintain a small operational runbook for export, deletion, retention, and incident response.

Do not add a consent checkbox automatically. Whether explicit consent is required is a product/legal decision; the UI must reflect the approved basis accurately.

## 10. Frontend changes

### Waitlist form

- Extract a minimal `WaitlistForm` client component and keep static CTA/footer markup server-rendered where practical.
- Submit only to `/api/waitlist`; remove `ValidationEngine` and the Firebase web dependency.
- Add `autoComplete="name"` and `autoComplete="email"`, input limits, `aria-busy`, and stable error association.
- Preserve user input after retriable errors.
- Show the same success state for first and repeated submissions.
- Add the privacy disclosure/link near submission.
- Prevent repeated submission while pending, but restore controls after failures.

### Navigation and public content

- Replace the dead navbar button with a semantic link to `#contact`.
- Make the brand link to the home route.
- Link `/about` and `/privacy` from the footer/navigation.
- Replace Instagram, Gmail, and WhatsApp labels with real accessible links.
- Complete an Indonesian copy-editing pass and standardize “waitlist” terminology.

### Styling scope

- Replace broad mobile selectors such as `* { max-width: 100% }` and global anchor/button sizing with component-level rules.
- Keep the current design tokens but use generated Tailwind utilities consistently.
- Do not combine this work with a wholesale hero rewrite.

## 11. Performance work

Set initial budgets for the home route and enforce them in review:

- Remove the approximately 500 KB raw Firestore client chunk from first load.
- No new client dependency without a measured bundle impact.
- Convert/compress large PNG backgrounds and retain originals outside the shipped asset tree if design needs them.
- Add accurate `sizes` to responsive images; do not generate 1920/3840-pixel phone candidates for a phone-width display.
- Reduce duplicated desktop/mobile hero markup where it can be done without visual regression.
- Reduce the five-family typography set with design approval.
- Use `next/font` or intentionally self-host licensed font files.
- Establish mobile Lighthouse/WebPageTest baselines before and after the change. Record LCP, CLS, INP, transferred bytes, and first-load JS.

Performance acceptance is based on measured improvement, not merely converting file extensions.

## 12. Repository and quality system

### Required scripts

```json
{
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test": "vitest run",
  "test:e2e": "playwright test",
  "build": "next build"
}
```

Use ESLint flat configuration compatible with the installed Next.js major version. Pin or deliberately range tool versions and declare the supported Node/package-manager versions.

### Test strategy

Unit tests:

- Name/email normalization and boundary lengths.
- Unknown-field and oversized-payload rejection.
- Typed error mapping.
- Idempotent duplicate behavior.
- HMAC document identity without snapshotting secrets.

Integration tests:

- Route response contract for valid, invalid, duplicate, rate-limited, and persistence-failure cases.
- Firestore emulator rules proving that client read/write is denied.
- Persistence tests proving create-only behavior and exact schema.

Component tests:

- Loading/disabled state.
- Success and retryable error rendering.
- Privacy link and accessible labels/error association.

End-to-end smoke tests:

- Primary navbar CTA reaches and focuses the waitlist section appropriately.
- A successful mocked or isolated-environment signup reaches the success state.
- `/`, `/about`, `/privacy`, and 404 behavior.
- Keyboard navigation at desktop and mobile viewports.

Do not make production Firestore writes from pull-request tests.

### CI gates

Every pull request must run on a clean install:

1. Lockfile-enforced dependency install.
2. Format check.
3. Lint.
4. Typecheck.
5. Unit/integration tests.
6. Production build.
7. Emulator rule tests.
8. Dependency and secret scanning.
9. E2E smoke tests where the CI environment supports a browser.

Branch protection should require these checks and at least one review for changes to the waitlist, rules, CI, or deployment configuration.

### Public-repository files

Add:

- `README.md`: purpose, screenshots, architecture, prerequisites, setup, scripts, environment variables, test/deploy flow.
- `LICENSE`: selected by the organization.
- `.env.example`: names and descriptions only; no functional credentials.
- `CONTRIBUTING.md`: workflow, conventions, and review expectations.
- `SECURITY.md`: private vulnerability-reporting route and supported versions.
- `CODE_OF_CONDUCT.md` if external contributions are invited.
- Node/package-manager version declarations.
- GitHub Actions workflows and dependency-update policy.

Run a full-history secret scan before changing repository visibility. The current absence of tracked environment files does not prove the complete history is clean.

## 13. Metadata and release polish

- Set `metadataBase` and canonical URLs from the confirmed production domain.
- Add favicon/app icons and real Open Graph/Twitter assets.
- Add `robots.ts` and `sitemap.ts` with intentional production behavior.
- Ensure preview/staging deployments are not indexed.
- Replace the default 404 with a small branded recovery page if design capacity permits.
- Verify all external/contact links and remove placeholders.
- Run copy review, responsive QA, keyboard QA, reduced-motion QA, and real-device mobile testing.

## 14. Observability and operations

Record metrics without personal data:

- Request count by outcome: accepted, invalid, rate-limited, rejected-bot, unavailable.
- Persistence latency and failure count.
- Duplicate count internally, if needed, keyed only by non-reversible digest.
- Alerting on sustained `503`, write failure, or unexpected volume.

Logs must use request IDs and typed error codes, not form payloads. Document:

- How to disable submissions during an incident.
- How to rotate credentials/HMAC secrets without losing duplicate detection. Prefer versioned keys or a planned re-key migration.
- How to export/delete a user's record.
- How to restore from backup and reconcile counts.
- Who owns production alerts and Firebase cost monitoring.

## 15. Delivery plan

### Phase 0 — Decisions and inventory

- Resolve the seven preconditions in Section 4.
- Confirm current production deployment, Firebase rules, data, and credentials.
- Capture performance and functional baselines.
- Write a short ADR for the trusted waitlist boundary.

**Exit criteria:** hosting, retention, migration, legal owner, rate-limit provider, license, and public destinations are known.

### Phase 1 — Trusted waitlist path

- Add server-only Firebase initialization.
- Implement schema, endpoint, idempotent create, generic duplicate response, and PII-safe logging.
- Add distributed rate limiting and honeypot handling.
- Commit restrictive Firestore rules and emulator tests.
- Add migration tooling only if production data exists.

**Exit criteria:** direct client access is denied; endpoint contract and failure paths are tested.

### Phase 2 — Frontend and privacy integration

- Replace Firebase client submission with the endpoint.
- Remove `ValidationEngine` and the Firebase web SDK.
- Fix navbar CTA and public links.
- Add approved privacy disclosure and data-lifecycle behavior.
- Add component and end-to-end form coverage.

**Exit criteria:** no Firebase/Firestore code ships in the browser; repeated signups are indistinguishable; all primary controls work.

### Phase 3 — Quality and public-repository readiness

- Add ESLint, Prettier, tests, CI, runtime declarations, and branch gates.
- Add README, license, environment template, contributing and security documents.
- Triage and resolve dependency-audit findings without forced incompatible downgrades.
- Run full-history secret scanning.

**Exit criteria:** clean-clone CI passes and repository usage/security expectations are documented.

### Phase 4 — Performance and hardening

- Optimize images, image sizing, fonts, and unnecessary client boundaries.
- Scope broad CSS rules.
- Add tested security headers, metadata, sitemap, and robots behavior.
- Measure against the recorded baseline and agreed budgets.

**Exit criteria:** performance improves measurably, CSP works in production-like testing, and metadata is complete.

### Phase 5 — Release validation

- Test staging with production-equivalent configuration and isolated test data.
- Perform responsive, keyboard, screen-reader smoke, reduced-motion, privacy, and incident-path checks.
- Verify alerts, rate limits, scheduled retention cleanup, deletion procedure, and rollback.
- Obtain engineering, product/legal, and repository-owner sign-off.

**Exit criteria:** the release checklist in Section 17 is complete before repository visibility changes.

## 16. Estimated effort

Assuming one experienced engineer, an existing server-capable deployment, no complex data migration, and prompt product/legal decisions:

| Workstream                                         |        Estimate |
| -------------------------------------------------- | --------------: |
| Decisions, inventory, ADR                          |       0.5–1 day |
| Server endpoint, schema, persistence, rules        |        1–2 days |
| Abuse controls, observability, operational tests   |      1–1.5 days |
| Frontend integration and navigation/privacy wiring |       0.5–1 day |
| Tooling, tests, CI, public-repository docs         |    1.5–2.5 days |
| Performance, metadata, headers, release QA         |        1–2 days |
| **Total engineering effort**                       | **5.5–10 days** |

Legal review, design decisions, obtaining production destinations/assets, and a nontrivial existing-data migration are excluded. They can extend calendar time even when engineering effort is unchanged.

## 17. Release acceptance checklist

- [ ] Browser cannot read or write waitlist records directly.
- [ ] Server rejects unknown, malformed, and oversized input.
- [ ] Rate limiting works across deployment instances.
- [ ] New and duplicate submissions return the same external success result.
- [ ] No raw PII appears in document paths, application logs, analytics, or alerts.
- [ ] Retention cleanup and deletion procedure are tested.
- [ ] Privacy notice is approved and linked at submission.
- [ ] Navbar CTA and all public/contact links work.
- [ ] Firebase web SDK is absent from the home-route client bundle.
- [ ] Lint, format, typecheck, tests, build, rules tests, and scans pass in CI.
- [ ] Dependency audit findings are resolved or formally time-bounded and accepted.
- [ ] README, license, environment template, contributing, and security documents exist.
- [ ] Node and package-manager versions are declared.
- [ ] Images/fonts meet the agreed measured budget.
- [ ] Security headers and CSP pass production-like testing.
- [ ] Metadata, canonical URL, social preview, robots, and sitemap are correct.
- [ ] Responsive, keyboard, reduced-motion, and screen-reader smoke tests pass.
- [ ] Full Git history passes secret scanning.
- [ ] Rollback, alert ownership, and Firebase cost monitoring are documented.

## 18. Rollback strategy

- Deploy the server endpoint before switching the browser form.
- Keep the previous UI deployment artifact available, but do not re-enable unsafe client writes as a rollback.
- If the new endpoint fails, disable submission with an explicit temporary-unavailable state while preserving page availability.
- Use a versioned collection during migration so the old dataset remains read-only during the rollback window.
- Roll back application and rules changes independently only when their compatibility has been verified.
- Never weaken Firestore rules to recover from an application incident.

## 19. Definition of done

The proposal is complete when the waitlist has a trusted and tested server boundary, direct client database access is denied, personal-data handling matches approved public policy, the landing page no longer ships Firebase, all public controls work, clean-clone CI is green, public-repository documentation is complete, and release QA has been performed against a production-like deployment.
