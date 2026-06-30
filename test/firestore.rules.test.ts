import { readFileSync } from 'node:fs'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { afterAll, beforeAll, describe, it } from 'vitest'

const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST

describe.skipIf(!emulatorHost)('Firestore security rules', () => {
  let testEnvironment: RulesTestEnvironment

  beforeAll(async () => {
    const [host, port] = emulatorHost!.split(':')
    testEnvironment = await initializeTestEnvironment({
      projectId: 'demo-awwabi-waitlist',
      firestore: {
        host,
        port: Number(port),
        rules: readFileSync(
          new URL('../firestore.rules', import.meta.url),
          'utf8',
        ),
      },
    })
  })

  afterAll(async () => {
    await testEnvironment.cleanup()
  })

  it('denies unauthenticated waitlist writes', async () => {
    const database = testEnvironment.unauthenticatedContext().firestore()
    const entry = doc(
      database,
      'products/awwabi/waitlist_entries/example-entry',
    )

    await assertFails(
      setDoc(entry, { email: 'aisyah@example.com', name: 'Aisyah' }),
    )
  })

  it('denies unauthenticated waitlist reads', async () => {
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(
          context.firestore(),
          'products/awwabi/waitlist_entries/example-entry',
        ),
        { email: 'aisyah@example.com', name: 'Aisyah' },
      )
    })

    const database = testEnvironment.unauthenticatedContext().firestore()
    await assertFails(
      getDoc(doc(database, 'products/awwabi/waitlist_entries/example-entry')),
    )
  })

  it('allows trusted test administration for setup and verification', async () => {
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await assertSucceeds(
        setDoc(doc(context.firestore(), 'products/awwabi'), {
          name: 'Awwabi',
        }),
      )
    })
  })
})
