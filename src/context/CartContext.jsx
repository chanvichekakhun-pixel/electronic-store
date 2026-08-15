import { createContext, useContext, useEffect, useState } from 'react'
import { parsePrice } from '../utils/price'

const CartContext = createContext(null)
const STORAGE_KEY = 'cart-items'

// Builds a stable id for a cart line: same product + same chosen variants
// should stack into one line (with an increased quantity) instead of
// creating a duplicate row.
function buildCartItemId(productId, selectedVariants) {
  const variantKey = Object.entries(selectedVariants || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|')
  return `${productId}__${variantKey}`
}

function loadInitialCart() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialCart)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.error('Failed to save cart:', err)
    }
  }, [items])

  // product: the product object (needs id, name, price, image, category).
  // selectedVariants: e.g. { Color: 'Black', Storage: '512GB' }.
  const addToCart = (product, selectedVariants = {}, quantity = 1) => {
    const cartItemId = buildCartItemId(product.id, selectedVariants)

    setItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId)
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          selectedVariants,
          quantity,
        },
      ]
    })
  }

  const removeFromCart = (cartItemId) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId))
  }

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) return
    setItems((prev) => prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => setItems([])

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0)

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
