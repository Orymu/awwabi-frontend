import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { getWaitlistFirestore } from '@/lib/firebase/admin'
import type { WaitlistConfig } from '@/lib/waitlist/config'
import { submitWaitlist, WaitlistRateLimitError } from '@/lib/waitlist/submit'

const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST
const projectId = 'demo-awwabi-waitlist'
const baseConfig: WaitlistConfig = {
  projectId,
  productId: 'awwabi',
  hashSecret: 'integration-test-secret-with-32-characters',
  allowedOrigins: ['http://localhost:3000'],
  retentionDays: 365,
  rateLimitMax: 5,
  rateLimitWindowSeconds: 60,
}

describe.skipIf(!emulatorHost)('submitWaitlist', () => {
  let testEnvironment: RulesTestEnvironment

  beforeAll(async () => {
    const [host, port] = emulatorHost!.split(':')
    testEnvironment = await initializeTestEnvironment({
      projectId,
      firestore: { host, port: Number(port) },
    })
  })

  beforeEach(async () => {
    await testEnvironment.clearFirestore()
  })

  afterAll(async () => {
    await testEnvironment.cleanup()
  })

  it('creates one idempotent entry per email and product', async () => {
    const input = {
      name: 'Aisyah',
      email: 'aisyah@example.com',
      clientIp: '203.0.113.10',
    }

    await expect(submitWaitlist(input, baseConfig, 1_000_000)).resolves.toBe(
      'created',
    )
    await expect(submitWaitlist(input, baseConfig, 1_000_001)).resolves.toBe(
      'existing',
    )

    const entries = await getWaitlistFirestore(projectId)
      .collection('products/awwabi/waitlist_entries')
      .get()

    expect(entries.size).toBe(1)
    expect(entries.docs[0]?.data()).toMatchObject({
      email: 'aisyah@example.com',
      name: 'Aisyah',
      productId: 'awwabi',
      schemaVersion: 1,
    })
  })

  it('separates the same email across products', async () => {
    const input = {
      name: 'Aisyah',
      email: 'aisyah@example.com',
      clientIp: '203.0.113.10',
    }

    await submitWaitlist(input, baseConfig, 1_000_000)
    await submitWaitlist(
      input,
      { ...baseConfig, productId: 'product-two' },
      1_000_000,
    )

    const database = getWaitlistFirestore(projectId)
    const [awwabiEntries, productTwoEntries] = await Promise.all([
      database.collection('products/awwabi/waitlist_entries').get(),
      database.collection('products/product-two/waitlist_entries').get(),
    ])

    expect(awwabiEntries.size).toBe(1)
    expect(productTwoEntries.size).toBe(1)
  })

  it('enforces the distributed fixed-window limit', async () => {
    const config = { ...baseConfig, rateLimitMax: 1 }

    await submitWaitlist(
      {
        name: 'Aisyah',
        email: 'aisyah@example.com',
        clientIp: '203.0.113.10',
      },
      config,
      1_000_000,
    )

    await expect(
      submitWaitlist(
        {
          name: 'Fatimah',
          email: 'fatimah@example.com',
          clientIp: '203.0.113.10',
        },
        config,
        1_000_001,
      ),
    ).rejects.toBeInstanceOf(WaitlistRateLimitError)
  })
})
