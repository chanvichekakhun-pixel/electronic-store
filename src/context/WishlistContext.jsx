import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'wishlist-items'

function loadInitialWishlist() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadInitialWishlist)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.error('Failed to save wishlist:', err)
    }
  }, [items])

  const isWishlisted = (productId) => items.some((item) => item.id === productId)

  // Stores just enough of the product to render a wishlist card later,
  // without needing to re-fetch it from Firestore.
  const addToWishlist = (product) => {
    setItems((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev
        : [
            ...prev,
            {
              id: product.id,
              category: product.category,
              name: product.name,
              price: product.price,
              image: product.image,
              alt: product.alt,
              rating: product.rating,
              reviews: product.reviews,
            },
          ]
    )
  }

  const removeFromWishlist = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const toggleWishlist = (product) => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const value = {
    items,
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    wishlistCount: items.length,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
