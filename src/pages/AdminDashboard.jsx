import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AdminProductForm from '../components/AdminProductForm'
import AdminProductList from '../components/AdminProductList'

const CATEGORIES = [
  { value: 'laptop-desktop', label: 'Laptop/Desktop' },
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'accessory', label: 'Accessory' },
]

export default function AdminDashboard() {
  const { currentUser } = useAuth()
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].value)
  const [refreshKey, setRefreshKey] = useState(0)
  const [editingProduct, setEditingProduct] = useState(null)

  const active = CATEGORIES.find((c) => c.value === activeCategory)

  const switchCategory = (value) => {
    setActiveCategory(value)
    setEditingProduct(null) // don't carry an edit-in-progress across tabs
  }

  return (
    <section className="px-4 md:px-10 py-16 max-w-[900px] mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">
        Signed in as {currentUser?.email}. Pick a category below to add, edit, or delete
        products in it — everything here reads and writes the Firestore "products" collection
        directly.
      </p>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => switchCategory(c.value)}
            className={`px-4 py-2.5 text-sm font-bold transition border-b-2 -mb-px ${
              activeCategory === c.value
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* key resets the form when switching tabs, so each category gets a fresh blank form */}
      <AdminProductForm
        key={active.value}
        category={active.value}
        categoryLabel={active.label}
        editingProduct={editingProduct}
        onCancelEdit={() => setEditingProduct(null)}
        onProductAdded={() => {
          setRefreshKey((k) => k + 1)
          setEditingProduct(null)
        }}
      />

      <AdminProductList
        category={active.value}
        categoryLabel={active.label}
        refreshKey={refreshKey}
        editingId={editingProduct?.id}
        onEdit={(product) => setEditingProduct(product)}
      />
    </section>
  )
}
