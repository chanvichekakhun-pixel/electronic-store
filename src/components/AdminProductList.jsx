import { useEffect, useState } from 'react'
import { getProducts, deleteProduct } from '../firebase/products'

// Lists the existing Firestore products for a category, with a delete
// button on each. `refreshKey` lets the parent force a re-fetch (e.g. right
// after a new product is added) by changing to a new value.
export default function AdminProductList({ category, categoryLabel, refreshKey, onEdit, editingId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    getProducts(category)
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err) => {
        console.error('Failed to load products:', err)
        if (!cancelled) setError('Could not load products.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [category, refreshKey])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return

    setDeletingId(id)
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error('Failed to delete product:', err)
      setError('Could not delete that product. Check your Firestore rules and try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-400 py-6">Loading {categoryLabel} products…</div>
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Existing {categoryLabel} products</h2>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-sm text-gray-400 bg-[#F8FAFC] rounded-2xl py-10 text-center">
          No {categoryLabel.toLowerCase()} products in Firestore yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 border transition ${
                editingId === p.id ? 'bg-red-50 border-red-200' : 'bg-[#F8FAFC] border-gray-100'
              }`}
            >
              {p.image && (
                <img src={p.image} alt={p.alt || p.name} className="w-12 h-12 object-contain rounded bg-white" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-gray-800 truncate">{p.name}</div>
                <div className="text-xs text-gray-500">{p.price}</div>
              </div>
              <button
                type="button"
                onClick={() => onEdit?.(p)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(p.id, p.name)}
                disabled={deletingId === p.id}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
              >
                {deletingId === p.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
