import { useEffect, useState } from 'react'
import { addProduct, updateProduct } from '../firebase/products'

const emptyVariant = { name: '', options: '' }

const emptyForm = {
  name: '',
  price: '',
  image: '',
  alt: '',
  badge: '',
  badgeColor: '#8b5cf6',
  rating: 5,
  reviews: 0,
  specs: '',
  description: '',
  section: 'none',
}

// Turns Firestore's { label, priceDelta } option objects back into the
// editable "Label:+delta" comma-separated string the form inputs use.
function optionsToText(options) {
  return (options || [])
    .map((o) => {
      if (typeof o === 'string') return o
      return o.priceDelta ? `${o.label}:${o.priceDelta > 0 ? '+' : ''}${o.priceDelta}` : o.label
    })
    .join(', ')
}

function productToFormState(product) {
  return {
    name: product.name || '',
    price: product.price || '',
    image: product.image || '',
    alt: product.alt || '',
    badge: product.badge || '',
    badgeColor: product.badgeColor || '#8b5cf6',
    rating: product.rating ?? 5,
    reviews: product.reviews ?? 0,
    specs: (product.specs || []).join('\n'),
    description: product.description || '',
    section: product.section || 'none',
  }
}

function productToVariantsState(product) {
  const variants = (product.variants || []).map((v) => ({
    name: v.name,
    options: optionsToText(v.options),
  }))
  return variants.length > 0 ? variants : [emptyVariant]
}

// Add/edit form scoped to a single category. Rendered once per tab in
// AdminDashboard. In "add" mode it's always blank; pass editingProduct to
// switch it into edit mode, pre-filled with that product's data.
export default function AdminProductForm({ category, categoryLabel, onProductAdded, editingProduct, onCancelEdit }) {
  const isEditing = Boolean(editingProduct)

  const [form, setForm] = useState(() => (editingProduct ? productToFormState(editingProduct) : emptyForm))
  const [variants, setVariants] = useState(() =>
    editingProduct ? productToVariantsState(editingProduct) : [emptyVariant]
  )
  const [status, setStatus] = useState(null) // 'saving' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  // Re-fill the form whenever a different product is selected for editing.
  useEffect(() => {
    if (editingProduct) {
      setForm(productToFormState(editingProduct))
      setVariants(productToVariantsState(editingProduct))
      setStatus(null)
      setErrorMsg('')
    }
  }, [editingProduct])

  const updateField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const updateVariant = (index, field) => (e) => {
    const next = [...variants]
    next[index] = { ...next[index], [field]: e.target.value }
    setVariants(next)
  }

  const addVariantRow = () => setVariants((v) => [...v, emptyVariant])
  const removeVariantRow = (index) =>
    setVariants((v) => v.filter((_, i) => i !== index))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('saving')
    setErrorMsg('')

    const payload = {
      name: form.name,
      category,
      price: form.price,
      image: form.image,
      alt: form.alt || form.name,
      badge: form.badge,
      badgeColor: form.badgeColor,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      // One spec per line in the textarea -> array of strings.
      specs: form.specs
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      description: form.description,
      // Which Home page carousel this shows in: 'bestSelling', 'newArrival', or none.
      section: form.section === 'none' ? null : form.section,
      // Turn each variant row's comma-separated "Label:+delta" entries
      // into an array of { label, priceDelta } objects.
      variants: variants
        .filter((v) => v.name.trim())
        .map((v) => ({
          name: v.name.trim(),
          options: v.options
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean)
            .map((entry) => {
              const [label, deltaRaw] = entry.split(':').map((s) => s.trim())
              const priceDelta = Number(String(deltaRaw || '0').replace(/[^0-9.-]/g, '')) || 0
              return { label, priceDelta }
            }),
        })),
    }

    try {
      if (isEditing) {
        await updateProduct(editingProduct.id, payload)
        setStatus('success')
        onProductAdded?.() // reuse the same "refresh the list" callback
      } else {
        await addProduct(payload)
        setStatus('success')
        setForm(emptyForm)
        setVariants([emptyVariant])
        onProductAdded?.()
      }
    } catch (err) {
      console.error('Failed to save product:', err)
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong saving this product.')
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-sm focus:outline-none focus:border-red-500 transition'

  return (
    <form onSubmit={handleSubmit} className="bg-[#F8FAFC] rounded-2xl p-6 md:p-8 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          {isEditing ? `Editing "${editingProduct.name}"` : `Add a ${categoryLabel} product`}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-medium text-gray-500 hover:text-gray-800"
          >
            Cancel edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Name</label>
          <input className={inputClass} value={form.name} onChange={updateField('name')} required />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Price (e.g. $699)</label>
          <input className={inputClass} value={form.price} onChange={updateField('price')} required />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Image path (e.g. /image/my-product.jpg)
          </label>
          <input className={inputClass} value={form.image} onChange={updateField('image')} required />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Alt text</label>
          <input className={inputClass} value={form.alt} onChange={updateField('alt')} placeholder={form.name || 'Product image'} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Badge text</label>
          <input className={inputClass} value={form.badge} onChange={updateField('badge')} placeholder="New" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Badge color</label>
          <input
            type="color"
            className="w-full h-10 border border-gray-200 rounded"
            value={form.badgeColor}
            onChange={updateField('badgeColor')}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Rating (0–5)</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            className={inputClass}
            value={form.rating}
            onChange={updateField('rating')}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Review count</label>
          <input type="number" min="0" className={inputClass} value={form.reviews} onChange={updateField('reviews')} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Home page section
          </label>
          <select className={inputClass} value={form.section} onChange={updateField('section')}>
            <option value="none">Not featured on Home</option>
            <option value="bestSelling">Best Selling</option>
            <option value="newArrival">New Arrival</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Specs — one short line per bullet, shown on the product card
        </label>
        <textarea
          className={inputClass}
          rows={2}
          value={form.specs}
          onChange={updateField('specs')}
          placeholder={'Apple M4 Chip | 16GB RAM | 512GB SSD\n13.6" Liquid Retina | macOS'}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Description — full product description
        </label>
        <textarea
          className={inputClass}
          rows={4}
          value={form.description}
          onChange={updateField('description')}
          placeholder="A longer paragraph describing the product, materials, what's in the box, etc."
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">
          Variants — e.g. Color, Storage. Each option is comma-separated; add
          <code className="mx-1 px-1 bg-white border border-gray-200 rounded text-[11px]">:+price</code>
          to charge more for that option (omit it for no change).
        </label>
        <div className="flex flex-col gap-2">
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                className={inputClass}
                placeholder="Variant name (e.g. Storage)"
                value={v.name}
                onChange={updateVariant(i, 'name')}
              />
              <input
                className={inputClass}
                placeholder="512GB, 1TB:+200, 2TB:+400"
                value={v.options}
                onChange={updateVariant(i, 'options')}
              />
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariantRow(i)}
                  className="text-gray-400 hover:text-red-500 px-2 py-2 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addVariantRow} className="mt-2 text-blue-600 hover:underline text-xs font-medium">
          + Add another variant
        </button>
      </div>

      {status === 'error' && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{errorMsg}</div>
      )}
      {status === 'success' && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
          {isEditing ? 'Changes saved to Firestore.' : `Product saved to Firestore under "${categoryLabel}".`}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'saving'}
        className="self-start bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition disabled:opacity-50"
      >
        {status === 'saving' ? 'Saving…' : isEditing ? 'Save changes' : `Save ${categoryLabel} product`}
      </button>
    </form>
  )
}
