import 'server-only'

import { z } from 'zod'

const productIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const waitlistConfigSchema = z.object({
  projectId: z.string().min(1),
  productId: z.string().regex(productIdPattern).max(50),
  hashSecret: z.string().min(32),
  allowedOrigins: z.array(z.url()).min(1),
  retentionDays: z.number().int().min(1).max(3650),
  rateLimitMax: z.number().int().min(1).max(100),
  rateLimitWindowSeconds: z.number().int().min(10).max(3600),
})

export type WaitlistConfig = z.infer<typeof waitlistConfigSchema>

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) return fallback
  return Number(value)
}

export function getWaitlistConfig(): WaitlistConfig {
  const developmentOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']
  const configuredOrigins = process.env.WAITLIST_ALLOWED_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  const allowedOrigins = configuredOrigins?.length
    ? configuredOrigins
    : process.env.NODE_ENV === 'production'
      ? []
      : developmentOrigins

  return waitlistConfigSchema.parse({
    projectId: process.env.FIREBASE_PROJECT_ID,
    productId: process.env.WAITLIST_PRODUCT_ID,
    hashSecret:
      process.env.WAITLIST_HASH_SECRET ||
      (process.env.FIRESTORE_EMULATOR_HOST
        ? 'local-emulator-secret-not-for-production'
        : undefined),
    allowedOrigins,
    retentionDays: parsePositiveInteger(
      process.env.WAITLIST_RETENTION_DAYS,
      365,
    ),
    rateLimitMax: parsePositiveInteger(process.env.WAITLIST_RATE_LIMIT_MAX, 5),
    rateLimitWindowSeconds: parsePositiveInteger(
      process.env.WAITLIST_RATE_LIMIT_WINDOW_SECONDS,
      60,
    ),
  })
}
