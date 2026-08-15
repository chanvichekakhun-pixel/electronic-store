// Firestore product data access.
//
// Products live in a single top-level collection called "products".
// Each document looks like:
//
// {
//   name: "ROG Zephyrus G14",
//   category: "laptop-desktop",   // 'laptop-desktop' | 'smartphone' | 'accessory'
//   badge: "Trending",
//   badgeColor: "#8b5cf6",
//   image: "/image/product-rog-zephyrus.webp",
//   alt: "Laptop",
//   rating: 4.5,
//   reviews: 88,
//   price: "$1,500",
//   specs: ["AMD Ryzen 9 7940HS | 16GB RAM | 1TB SSD", "RTX 4060 | 14\" QHD+ | Win 11"],
//   description: "A long-form paragraph describing the product in detail.",
//   variants: [
//     { name: "Color", options: [{ label: "Moonlight White", priceDelta: 0 }, { label: "Eclipse Gray", priceDelta: 0 }] },
//     { name: "Storage", options: [{ label: "512GB", priceDelta: 0 }, { label: "1TB", priceDelta: 200 }] }
//   ],
//   section: "bestSelling",  // 'bestSelling' | 'newArrival' | null — which Home page carousel this shows in
//   createdAt: <server timestamp>
// }
//
// "variants" models things like color/size/storage choices. Each entry is a
// group (e.g. "Color") with a list of selectable options. Each option has a
// "label" (what the shopper sees/picks) and a "priceDelta" (added to the
// base price when that option is chosen — 0 or omitted means no change).
// Add as many groups as the product needs, or leave the array empty for
// products with no variants.

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './config'

const PRODUCTS_COLLECTION = 'products'

// Fetch a single product by its Firestore document id.
export async function getProduct(id) {
  if (!isFirebaseConfigured) return null

  const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// Fetch all products, or only the ones in a given category.
export async function getProducts(category) {
  if (!isFirebaseConfigured) return []

  const productsRef = collection(db, PRODUCTS_COLLECTION)
  const q = category ? query(productsRef, where('category', '==', category)) : productsRef
  const snap = await getDocs(q)

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// Fetch products tagged for a Home page section ('bestSelling' or 'newArrival').
export async function getProductsBySection(section) {
  if (!isFirebaseConfigured) return []

  const productsRef = collection(db, PRODUCTS_COLLECTION)
  const q = query(productsRef, where('section', '==', section))
  const snap = await getDocs(q)

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// Add a new product. `data` should match the shape documented above.
export async function addProduct(data) {
  const productsRef = collection(db, PRODUCTS_COLLECTION)
  const docRef = await addDoc(productsRef, {
    ...data,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

// Update an existing product by its Firestore document id.
export async function updateProduct(id, data) {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), data)
}

// Delete a product by its Firestore document id.
export async function deleteProduct(id) {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id))
}
