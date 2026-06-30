import 'server-only'

import { createHmac } from 'node:crypto'
import { Timestamp } from '@google-cloud/firestore'
import { getWaitlistFirestore } from '@/lib/firebase/admin'
import type { WaitlistConfig } from '@/lib/waitlist/config'

const RATE_LIMIT_RECORD_TTL_MS = 24 * 60 * 60 * 1000

export class WaitlistRateLimitError extends Error {
  constructor(public readonly retryAfterSeconds: number) {
    super('Waitlist rate limit exceeded')
    this.name = 'WaitlistRateLimitError'
  }
}

function digest(secret: string, value: string) {
  return createHmac('sha256', secret).update(value).digest('hex')
}

export interface SubmitWaitlistInput {
  name: string
  email: string
  clientIp: string
}

export async function submitWaitlist(
  input: SubmitWaitlistInput,
  config: WaitlistConfig,
  now = Date.now(),
): Promise<'created' | 'existing'> {
  const db = getWaitlistFirestore(config.projectId)
  const productRef = db.collection('products').doc(config.productId)
  const entryId = digest(
    config.hashSecret,
    `${config.productId}\0${input.email}`,
  )
  const windowMs = config.rateLimitWindowSeconds * 1000
  const rateLimitId = digest(
    config.hashSecret,
    `${config.productId}\0${input.clientIp}`,
  )
  const entryRef = productRef.collection('waitlist_entries').doc(entryId)
  const rateLimitRef = productRef.collection('rate_limits').doc(rateLimitId)

  return db.runTransaction(async (transaction) => {
    const [rateLimitSnapshot, entrySnapshot] = await transaction.getAll(
      rateLimitRef,
      entryRef,
    )
    const previousWindowStart = rateLimitSnapshot
      .get('windowStartedAt')
      ?.toMillis?.()
    const windowStart =
      typeof previousWindowStart === 'number' &&
      now < previousWindowStart + windowMs
        ? previousWindowStart
        : now
    const attemptCount =
      windowStart === previousWindowStart
        ? Number(rateLimitSnapshot.get('attemptCount'))
        : 0

    if (attemptCount >= config.rateLimitMax) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((windowStart + windowMs - now) / 1000),
      )
      throw new WaitlistRateLimitError(retryAfterSeconds)
    }

    transaction.set(rateLimitRef, {
      attemptCount: attemptCount + 1,
      expiresAt: Timestamp.fromMillis(now + RATE_LIMIT_RECORD_TTL_MS),
      windowStartedAt: Timestamp.fromMillis(windowStart),
    })

    if (entrySnapshot.exists) return 'existing'

    transaction.create(entryRef, {
      createdAt: Timestamp.fromMillis(now),
      email: input.email,
      expiresAt: Timestamp.fromMillis(
        now + config.retentionDays * 24 * 60 * 60 * 1000,
      ),
      name: input.name,
      productId: config.productId,
      schemaVersion: 1,
      source: 'landing-page',
    })

    return 'created'
  })
}
