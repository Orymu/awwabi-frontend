import 'server-only'

import { Firestore } from '@google-cloud/firestore'

const clients = new Map<string, Firestore>()

export function getWaitlistFirestore(projectId: string) {
  const existingClient = clients.get(projectId)
  if (existingClient) return existingClient

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (Boolean(clientEmail) !== Boolean(privateKey)) {
    throw new Error(
      'FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY must be configured together',
    )
  }

  const client = new Firestore({
    projectId,
    ...(clientEmail && privateKey
      ? { credentials: { client_email: clientEmail, private_key: privateKey } }
      : {}),
  })

  clients.set(projectId, client)
  return client
}
