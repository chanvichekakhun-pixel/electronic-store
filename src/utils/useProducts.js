import { useEffect, useState } from 'react'
import { getProducts, getProductsBySection, getProduct } from '../firebase/products'
import { isFirebaseConfigured } from '../firebase/config'
import { allProducts as staticAllProducts, bestSelling as staticBestSelling, newArrivals as staticNewArrivals } from '../data/products'

// Loads products for a category (or all products if none given) from
// Firestore. If Firebase isn't configured yet, or the "products" collection
// is still empty, it falls back to the static data in src/data/products.js
// so the site keeps working while you're setting Firestore up.
export function useProducts(category) {
  const [products, setProducts] = useState(null) // null = still loading
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const fallback = category
        ? staticAllProducts.filter((p) => p.category === category)
        : staticAllProducts

      if (!isFirebaseConfigured) {
        if (!cancelled) setProducts(fallback)
        return
      }

      try {
        const fromFirestore = await getProducts(category)
        if (cancelled) return
        setProducts(fromFirestore.length > 0 ? fromFirestore : fallback)
      } catch (err) {
        console.error('Failed to load products from Firestore:', err)
        if (!cancelled) {
          setError(err)
          setProducts(fallback)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [category])

  return { products: products || [], loading: products === null, error }
}

const STATIC_SECTIONS = {
  bestSelling: staticBestSelling,
  newArrival: staticNewArrivals,
}

// Loads products tagged with a given Home page section ('bestSelling' or
// 'newArrival') from Firestore. Falls back to the matching static array if
// Firebase isn't configured yet or no products have that section set.
export function useProductsBySection(section) {
  const [products, setProducts] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const fallback = STATIC_SECTIONS[section] || []

      if (!isFirebaseConfigured) {
        if (!cancelled) setProducts(fallback)
        return
      }

      try {
        const fromFirestore = await getProductsBySection(section)
        if (cancelled) return
        setProducts(fromFirestore.length > 0 ? fromFirestore : fallback)
      } catch (err) {
        console.error('Failed to load products from Firestore:', err)
        if (!cancelled) {
          setError(err)
          setProducts(fallback)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [section])

  return { products: products || [], loading: products === null, error }
}

// Loads a single product by id for the product detail page. Tries Firestore
// first (real Firestore doc ids are strings); if that comes back empty —
// because Firebase isn't configured, or this is one of the original static
// products that was never migrated — it falls back to matching by id+category
// inside the static catalog.
export function useProduct(category, id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const fallback =
        staticAllProducts.find((p) => p.category === category && String(p.id) === String(id)) || null

      if (!isFirebaseConfigured) {
        if (!cancelled) {
          setProduct(fallback)
          setLoading(false)
        }
        return
      }

      try {
        const fromFirestore = await getProduct(id)
        if (cancelled) return
        setProduct(fromFirestore || fallback)
      } catch (err) {
        console.error('Failed to load product from Firestore:', err)
        if (!cancelled) {
          setError(err)
          setProduct(fallback)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [category, id])

  return { product, loading, error }
}

