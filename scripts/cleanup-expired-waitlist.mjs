import { Firestore, Timestamp } from '@google-cloud/firestore'

const execute = process.argv.includes('--execute')
const projectId = process.env.FIREBASE_PROJECT_ID
const productIds = (
  process.env.WAITLIST_PRODUCT_IDS ??
  process.env.WAITLIST_PRODUCT_ID ??
  ''
)
  .split(',')
  .map((productId) => productId.trim())
  .filter(Boolean)

if (!projectId || productIds.length === 0) {
  throw new Error(
    'FIREBASE_PROJECT_ID and WAITLIST_PRODUCT_IDS (or WAITLIST_PRODUCT_ID) are required',
  )
}

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

if (Boolean(clientEmail) !== Boolean(privateKey)) {
  throw new Error(
    'FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY must be configured together',
  )
}

const database = new Firestore({
  projectId,
  ...(clientEmail && privateKey
    ? { credentials: { client_email: clientEmail, private_key: privateKey } }
    : {}),
})
const collections = ['waitlist_entries', 'rate_limits']
const batchSize = 400

async function cleanCollection(productId, collectionName) {
  let matched = 0

  while (true) {
    const snapshot = await database
      .collection('products')
      .doc(productId)
      .collection(collectionName)
      .where('expiresAt', '<=', Timestamp.now())
      .limit(batchSize)
      .get()

    matched += snapshot.size

    if (!execute || snapshot.empty) break

    const batch = database.batch()
    for (const document of snapshot.docs) batch.delete(document.ref)
    await batch.commit()

    if (snapshot.size < batchSize) break
  }

  const action = execute ? 'deleted' : 'would delete'
  console.log(
    `${productId}/${collectionName}: ${action} ${matched} document(s)`,
  )
}

for (const productId of productIds) {
  for (const collectionName of collections) {
    await cleanCollection(productId, collectionName)
  }
}

if (!execute) {
  console.log(
    'Dry run only. Re-run with -- --execute to delete expired records.',
  )
}
