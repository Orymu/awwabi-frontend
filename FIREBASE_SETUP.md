# Firebase Waitlist Setup

## Current infrastructure

- Firebase project: `orymu-validation-engine`
- Firestore database: `(default)`
- Location: `nam5` (immutable)
- Plan: Spark/free tier
- Delete protection: enabled on 2026-06-24
- Production hosting: Vercel
- Product registered: `products/awwabi`
- Server identity: `waitlist-writer@orymu-validation-engine.iam.gserviceaccount.com`
- Server role: `roles/datastore.user`

The project is shared by all product waitlists. Product data is logically separated at:

```text
products/{productId}/waitlist_entries/{emailHmac}
```

Development and automated tests use the Firestore emulator. They must not use the production database.

## Security model

The browser posts to the same-origin Next.js route at `/api/waitlist`. Only the server uses the Firestore server client. Deployed Firestore rules deny all client reads and writes to products, entries, and rate-limit records.

Each deployment fixes its product with `WAITLIST_PRODUCT_ID`; the request cannot select another product. Document IDs are HMACs of product ID and normalized email, so raw email addresses do not appear in document paths.

The API additionally enforces:

- Strict JSON schema and payload-size limits.
- Allowed browser origins.
- A honeypot field.
- Firestore-backed, fixed-window limits by HMACed client IP.
- Idempotent create behavior with the same external response for new and repeated addresses.

## Local development

Prerequisites:

- Node.js 22
- Java 21 or newer for current Firebase emulators
- Firebase CLI authenticated to the project

Copy `.env.example` to `.env.local` and use emulator-only values. Do not add a service-account key for ordinary local development.

Start Firestore:

```bash
firebase emulators:start --only firestore --project demo-awwabi-waitlist
```

Start Next.js in another terminal:

```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
FIREBASE_PROJECT_ID=demo-awwabi-waitlist \
WAITLIST_PRODUCT_ID=awwabi \
WAITLIST_ALLOWED_ORIGINS=http://localhost:3000 \
npm run dev
```

Run the complete Firebase test suite:

```bash
npm run test:firebase
```

## Vercel production variables

Configure these as encrypted Production variables in Vercel:

```text
FIREBASE_PROJECT_ID=orymu-validation-engine
FIREBASE_CLIENT_EMAIL=waitlist-writer@orymu-validation-engine.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=<private key generated for the dedicated account>
WAITLIST_HASH_SECRET=<independent random value of at least 32 characters>
WAITLIST_PRODUCT_ID=awwabi
WAITLIST_ALLOWED_ORIGINS=https://awwabi.app,<approved Vercel production origin if needed>
WAITLIST_RETENTION_DAYS=365
WAITLIST_RATE_LIMIT_MAX=5
WAITLIST_RATE_LIMIT_WINDOW_SECONDS=60
```

Do not expose any of these as `NEXT_PUBLIC_*`. Preview deployments should keep the waitlist disabled unless their origins and data behavior have been explicitly approved.

The service-account private key and HMAC secret must be generated and transferred directly to Vercel. They must never be committed, pasted into documentation, or sent through issue/PR comments.

## Deployment order

The existing deployed Firestore rules still allow the legacy client write. Use this order to avoid an outage:

1. Add the production secrets to Vercel.
2. Deploy this application and verify `/api/waitlist` against production using a controlled test address.
3. Deploy the deny-by-default rules and indexes:

   ```bash
   firebase deploy --only firestore:rules,firestore:indexes --project orymu-validation-engine
   ```

4. Verify a second form submission succeeds through the server endpoint.
5. Verify a direct unauthenticated Firestore read and write are rejected.
6. Remove the obsolete `NEXT_PUBLIC_FIREBASE_*` variables from Vercel.

Never weaken Firestore rules as a rollback. If the endpoint fails, temporarily disable form submission while correcting the server deployment.

## Adding another product

1. Choose a stable lowercase slug such as `product-two`.
2. Create `products/{slug}` with `name`, `status: "active"`, and `schemaVersion: 1` using trusted admin tooling.
3. Configure that landing-page deployment with `WAITLIST_PRODUCT_ID={slug}`.
4. Add its exact production origin to that deployment's `WAITLIST_ALLOWED_ORIGINS`.
5. Run a controlled submission and confirm it appears only under the new product path.

Do not add a product ID to browser-submitted JSON and do not create a separate Firebase project or top-level schema for each product.

## Retention on the free plan

Firestore managed TTL requires billing, so it is not available on the current Spark plan. Records still contain `expiresAt`, but deletion must be run operationally.

Dry run:

```bash
FIREBASE_PROJECT_ID=orymu-validation-engine \
WAITLIST_PRODUCT_IDS=awwabi \
npm run cleanup:waitlist
```

Execute after reviewing the dry-run count:

```bash
FIREBASE_PROJECT_ID=orymu-validation-engine \
WAITLIST_PRODUCT_IDS=awwabi \
npm run cleanup:waitlist -- --execute
```

Run cleanup on the approved retention schedule with the same trusted credentials as the server endpoint. The script never logs document IDs, names, or email addresses.

If billing is enabled later, replace this manual process with Firestore TTL policies on `expiresAt` for the `waitlist_entries` and `rate_limits` collection groups.
