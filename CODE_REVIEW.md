# Architecture and Code Quality Review

**Repository:** `awwabi-frontend`  
**Reviewed:** 2026-06-24  
**Scope:** Current working tree, including the uncommitted Firebase waitlist integration  
**Release verdict:** **Not ready to publish under the organization account**

## Executive summary

The page composition is appropriately simple for a small Next.js marketing site. Route components are thin, the visual code is split into understandable sections and primitives, TypeScript strict mode is enabled, the production build succeeds, and motion-reduction handling is present.

The repository is not publication-ready, however. The waitlist is a public client-side Firestore write whose security rules and deployment contract are absent from the repository. It has no visible abuse control, gives the wrong business meaning to generic authorization failures, collects personal data under an inadequate privacy notice, and adds roughly 500 KB of raw JavaScript to the landing route. The primary navbar CTA also does nothing. In addition, the declared lint command is broken, there are no automated tests or CI checks, and the repository lacks the basic documentation and licensing expected of a public organization repository.

This is not primarily a folder-structure problem. The main deficiencies are trust-boundary design, operational completeness, performance, enforceable quality gates, and public-repository stewardship.

## Architecture assessment

The presentational dependency flow is mostly reasonable:

```text
app routes
  -> marketing/site sections
    -> UI primitives and hooks
      -> utilities
```

This is proportionate to the application. Introducing a general state-management library, domain layer, or elaborate component taxonomy would make the code worse, not better.

The waitlist flow is the exception:

```text
browser form
  -> Firebase SDK bundled into the landing page
    -> public Firestore document write
      -> undeclared external security rules
```

That design puts validation, the database schema, document identity, error interpretation, and abuse surface in an untrusted client. The code comment treats external Firestore rules as part of the implementation, but those rules are not versioned here. Consequently, the repository cannot demonstrate that the feature is safe or even reproducibly deployable.

For this product, the preferred boundary is:

```text
browser form
  -> same-origin POST /api/waitlist
    -> schema validation + normalization
    -> rate limit / bot control
    -> idempotent server-side persistence
```

That can be a Next.js route handler, server action, or a small separately deployed function. If the site must remain fully static, use a managed form endpoint or a narrowly scoped serverless function rather than shipping the Firestore client and database contract to every visitor.

## Release blockers

### 1. The public Firestore write has no reviewable security or abuse boundary

[`ValidationEngine.ts`](src/lib/firebase/ValidationEngine.ts#L71) constructs a predictable document ID and writes directly to `waitlist_entries`. The implementation relies on Firestore rules blocking updates, yet there is no `firestore.rules`, `firebase.json`, App Check setup, rate limiting, CAPTCHA/bot control, or server-side validation in the repository.

Client validation is not a security control; callers can bypass this UI and invoke the Firebase API directly. Without the deployed rules, this review cannot establish field allowlisting, maximum sizes, create-only behavior, or whether arbitrary documents can be written. This exposes data quality and potentially Firebase cost.

**Required:** move persistence behind a server-controlled endpoint and add server-side schema limits and abuse controls. If direct Firestore access is retained, version the exact rules and emulator tests in this repository and document App Check and deployment. Do not publish on comments about rules that reviewers cannot inspect.

### 2. The error model is factually wrong and hides outages

[`ValidationEngine.ts`](src/lib/firebase/ValidationEngine.ts#L87) maps every Firebase `permission-denied` error to “email already registered.” The same code can mean malformed data rejected by rules, disabled access, an incorrect project, or a rules regression. Users would receive a false duplicate message while an outage remained hidden.

An explicit client-side existence check is not the fix: it introduces a race and can enable email enumeration. Make the server operation idempotent, return typed application outcomes, and log unexpected infrastructure failures. A repeated signup can safely return the same success response without revealing whether an address already exists.

### 3. The privacy notice does not match actual processing

The form collects both name and email ([`call-to-action.tsx`](src/components/marketing/call-to-action.tsx#L29)), persists them to Firebase, and loads fonts from Google. [`privacy/page.tsx`](src/app/privacy/page.tsx#L16) only says waiting-list data is used for launch notification and “not shared with third parties.” It does not identify the operator, processors, retention period, deletion/contact mechanism, lawful basis/consent model, or cross-border processing. The privacy page is not linked from the form or footer.

This is a legal and reputational risk, not merely missing copy. Have the notice reviewed for the jurisdictions in which the site operates, disclose processors accurately, link it adjacent to submission, and collect only fields that have a defined use and retention policy.

### 4. The primary navbar CTA is a dead control

[`navbar.tsx`](src/components/site/navbar.tsx#L24) renders `WaitlistButton` without an `onClick`, link target, or form association. It is presented as the primary action but performs no action.

**Required:** render this as a link to `#contact`, or implement explicit focus/scroll behavior. Prefer a semantic anchor for navigation.

### 5. The repository has no functioning quality gate

`npm run lint` runs `next lint`, which is not a valid Next.js 16 lint command in this project. It exits with code 1 and interprets `lint` as a project directory. There is no ESLint dependency/configuration, formatter, test runner, or CI workflow.

**Required before publication:** configure `eslint`/`eslint-config-next` with `eslint .`, add a formatting check, add focused tests for the waitlist contract and form behavior, and run typecheck, lint, tests, and build in GitHub Actions. A broken script is worse than an absent one because it falsely advertises enforcement.

### 6. Public-repository essentials are absent

The repository contains no README, LICENSE, contributing guidance, security-reporting policy, `.env.example`, runtime/package-manager declaration, or GitHub workflow. A new contributor cannot discover prerequisites, configure Firebase, run all checks, or understand whether reuse is legally permitted.

**Required:** at minimum add `README.md`, an intentional `LICENSE`, `.env.example` with non-secret placeholders, supported Node version (`engines` and/or `.nvmrc`), package-manager declaration, setup/deployment instructions, architecture notes for the waitlist, and CI. Add `SECURITY.md` and contribution guidance if external participation is expected.

## High-priority findings

### 7. Firebase dominates the JavaScript budget of a simple landing page

The production build reports **1,015,880 bytes of uncompressed first-load JavaScript** for `/`, versus about 520 KB for the static secondary routes. The chunk containing Firestore and `ValidationEngine` is **500,351 bytes raw / 151,112 bytes gzip**. In other words, a form used near the bottom of the page adds approximately half a megabyte raw to initial route loading.

Moving the write server-side removes the Firebase browser SDK from this route. As an interim measure only, dynamically import the submission client on submit, then verify the resulting route bundle.

### 8. Input and persisted-data constraints are incomplete

[`ValidationEngine.ts`](src/lib/firebase/ValidationEngine.ts#L56) normalizes email and project ID but does not limit email, name, source, or `extraData` sizes. `extraData` accepts `Record<string, any>`, allowing an arbitrary client-supplied document shape. The form's required name is neither trimmed nor length-limited. A permissive deployed rule could therefore accept oversized or unexpected data.

Define one explicit waitlist schema, reject unknown fields, impose byte/character limits on every field, normalize name/email deliberately, and enforce the same constraints at the trusted boundary and database rules. Use `unknown`, schema inference, and narrowed errors instead of `any` in both [`ValidationEngine.ts`](src/lib/firebase/ValidationEngine.ts#L8) and [`call-to-action.tsx`](src/components/marketing/call-to-action.tsx#L37).

### 9. `ValidationEngine` is the wrong abstraction

The class combines environment configuration, Firebase app initialization, input validation, persistence, transport-error translation, and user-facing Indonesian strings. Its name does not reveal that it writes waitlist records, and mutable static state is unnecessary module-level ceremony in TypeScript.

Use a small function-oriented module with explicit boundaries, for example `waitlist/schema.ts`, `app/api/waitlist/route.ts`, and a persistence adapter only if another implementation is genuinely expected. Do not create interfaces or layers solely for architectural appearance.

### 10. Dependency audit is not clean

`npm audit --omit=dev` reports two moderate findings through Next.js's nested PostCSS (`GHSA-qx2v-qp2m-jg93`). The tool does not propose a sensible non-breaking resolution; its suggested forced change is an incompatible downgrade to Next 9.

Do **not** run `npm audit fix --force` blindly. Confirm the upstream patched Next.js release, upgrade deliberately, rebuild, and record any temporary risk acceptance if no compatible release exists.

## Medium-priority findings

### 11. Image markup and sizing waste bandwidth and repository space

`hero-bg.png` is 5.5 MB and `cta-bg.png` is 2.3 MB in the repository. Next Image optimizes served variants, but source size still affects repository weight and optimization work. The hero renders separate desktop and mobile trees containing the same background, phone screenshot, and frame. The phone screenshot has no `sizes` hint and production HTML offers 1920/3840-pixel candidates for an image displayed at roughly phone width.

Compress source artwork, prefer AVIF/WebP where fidelity permits, provide accurate `sizes`, avoid upscaled candidates, and consider one responsive hero tree rather than duplicated markup. Verify the result with Lighthouse/WebPageTest on representative mobile hardware and network conditions.

### 12. Five externally hosted font families are excessive

[`layout.tsx`](src/app/layout.tsx#L15) loads five Google Font families and many weights through a render-blocking external stylesheet. This adds third-party requests, weakens privacy claims, complicates CSP, and risks layout shifts or fallback typography when Google is unavailable.

Reduce the typography palette, use `next/font` or intentionally self-host licensed assets, and verify actual used weights. Five families are difficult to justify for a three-section landing page.

### 13. Global mobile CSS is overly broad

[`globals.css`](src/app/globals.css#L55) applies `max-width: 100%` to every element on mobile; later it assigns minimum dimensions to every `button`, `a`, and `[role="button"]`, and `-webkit-overflow-scrolling` to every element. These rules can silently alter unrelated layout and future inline controls.

Keep touch-target and overflow behavior on intentional components/containers. Remove ineffective or obsolete global declarations. Persistent `will-change` on animated sections should also be measured and removed after animation if it causes excess compositing memory.

### 14. Public navigation and contact surfaces are incomplete

The footer shows “Instagram • Gmail • WhatsApp” as plain text rather than links. `/about` and `/privacy` exist but are not reachable from site navigation. The brand in the navbar is a non-clickable `span`. These are visible signs of an unfinished public site.

Add real, accessible destinations; link the legal and about pages; and verify all controls by keyboard and touch.

### 15. Metadata and HTTP hardening are minimal

The root metadata only defines title and description. `siteConfig.url` is unused, and there is no canonical metadata, Open Graph/Twitter image, favicon/app icons, sitemap, or explicit robots file. HTTP responses have no project-defined security headers and expose `X-Powered-By`.

Add only metadata that has real assets and correct production URLs. Define a practical CSP and baseline headers after the final font/Firebase architecture is known; otherwise the policy will either break production or be so permissive that it adds little value.

### 16. Conventions and copy need a cleanup pass

The Firebase module uses PascalCase filenames, semicolons, and double quotes while the rest of the repository uses kebab-case filenames, no semicolons, and single quotes. Design tokens are alternately used as Tailwind utilities and raw `var(...)` expressions. `siteConfig.description` duplicates `hero.subtitle`; exported `Feature` and `SiteConfig` types appear unused. Public copy mixes Indonesian and English and includes visible errors such as “memotifasi.”

Enforce conventions mechanically, remove unused/speculative exports, centralize truly shared copy, and perform an editorial review. Avoid a broad refactor of the pixel-positioned hero unless the design is changing.

## What is already good

- Route files are thin and statically rendered; the production build reports `/`, `/about`, and `/privacy` as static pages.
- The component grouping (`marketing`, `site`, `ui`) is understandable at this size.
- TypeScript `strict` mode is enabled, and `npx tsc --noEmit` succeeds.
- Decorative imagery generally has empty alternative text, while the application screenshot has meaningful text.
- Form labels are programmatically associated with inputs, loading disables repeat submission, and status/error messages use live-region roles.
- `useInView` disconnects its observer and handles unsupported observers and reduced-motion preference.
- CSS also disables the authored animations for `prefers-reduced-motion`.
- Environment files are ignored, and no `.env*` file is currently tracked or appears in the nine-commit history. This is not a substitute for a full history/secret scan before publication.

## Recommended release sequence

1. Decide the trusted waitlist architecture and implement the server-side/data-rule boundary.
2. Define the data schema, idempotency, abuse controls, observability, and operational failure behavior.
3. Correct and link the privacy notice after legal/product review.
4. Fix the dead navbar CTA and complete all public links/contact destinations.
5. Establish ESLint, formatting, tests, CI, Node/package-manager versions, and dependency policy.
6. Add README, license, environment template, security policy, and deployment documentation.
7. Remove Firebase from initial client loading; optimize images/fonts; establish a performance budget.
8. Finish metadata, security headers, copy editing, responsive QA, keyboard QA, and real-device testing.
9. Run a secret scan across the complete Git history before changing repository visibility.

## Verification performed

| Check                                                              | Result                                                       |
| ------------------------------------------------------------------ | ------------------------------------------------------------ |
| `npx tsc --noEmit`                                                 | Pass                                                         |
| `npm run build`                                                    | Pass; all three application routes statically generated      |
| `npm run lint`                                                     | **Fail**; invalid `next lint` command                        |
| `npm audit --omit=dev`                                             | **Fail**; 2 moderate findings                                |
| HTTP smoke checks for `/`, `/about`, `/privacy`, and missing route | 200, 200, 200, and 404 respectively                          |
| Production route bundle diagnostics                                | `/`: 1,015,880 bytes uncompressed first-load JS              |
| Automated browser/responsive/interactivity audit                   | Not run; browser tooling was unavailable in this environment |

The build passing is necessary but insufficient: it does not validate deployed Firestore rules, Firebase configuration, form persistence, spam resistance, privacy behavior, accessibility, visual regressions, or responsive interaction.
