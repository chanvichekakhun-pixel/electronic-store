// One-time script: uploads the products already in src/data/products.js
// into your Firestore "products" collection, so your existing catalog
// becomes editable/queryable from Firestore instead of hard-coded.
//
// Usage:
//   1. In the Firebase Console: Project settings -> Service accounts ->
//      "Generate new private key". Save the downloaded file as
//      serviceAccountKey.json in the project root (same folder as package.json).
//      Do NOT commit this file — add it to .gitignore.
//   2. npm install firebase-admin --save-dev
//   3. node scripts/seedProducts.mjs
//
// It's safe to re-run: it just adds documents, so if you run it twice
// you'll get duplicates — check your Firestore console afterwards, or
// delete the collection first if you need a clean re-seed.

import { readFileSync } from 'fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { bestSelling, newArrivals, accessories } from '../src/data/products.js'
import { productDetails } from '../src/data/productDetails.js'

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf-8'))

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// Every existing static product is merged with its hand-written description
// and variants from productDetails.js (matched by name), plus a "section"
// tag so it shows up in the right Home page carousel. Accessories get no
// section since they aren't featured on Home. Anything without matching
// details falls back to an empty description/variants pair.
const withSection = (arr, section) => arr.map((p) => ({ ...p, section }))

const allExisting = [
  ...withSection(bestSelling, 'bestSelling'),
  ...withSection(newArrivals, 'newArrival'),
  ...withSection(accessories, null),
].map(({ id, ...rest }) => {
  const details = productDetails[rest.name] || {}
  return {
    ...rest,
    description: details.description || '',
    variants: details.variants || [],
  }
})

async function seed() {
  const productsRef = db.collection('products')
  for (const product of allExisting) {
    const ref = await productsRef.add(product)
    console.log(`Added "${product.name}" -> ${ref.id}`)
  }
  console.log(`Done. Seeded ${allExisting.length} products.`)
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
