import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProduct } from '../utils/useProducts'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { computeVariantPrice, formatPrice } from '../utils/price'

function Stars({ rating }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<i key={i} className="fas fa-star"></i>)
    else if (rating >= i - 0.5) stars.push(<i key={i} className="fas fa-star-half-alt"></i>)
    else stars.push(<i key={i} className="far fa-star"></i>)
  }
  return <>{stars}</>
}

// Options can be plain strings (older data) or { label, priceDelta } objects.
function optionLabel(option) {
  return typeof option === 'string' ? option : option.label
}
function optionDelta(option) {
  return typeof option === 'string' ? 0 : option.priceDelta || 0
}

export default function ProductDetail() {
  const { category, id } = useParams()
  const navigate = useNavigate()
  const { product, loading } = useProduct(category, id)
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const [selectedVariants, setSelectedVariants] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  // Default every variant group to its first option once the product loads.
  useEffect(() => {
    if (!product?.variants) return
    const defaults = {}
    product.variants.forEach((group) => {
      if (group.options?.length) defaults[group.name] = optionLabel(group.options[0])
    })
    setSelectedVariants(defaults)
  }, [product])

  if (loading) {
    return (
      <section className="px-4 md:px-10 py-20 max-w-[1100px] mx-auto text-center text-gray-400 text-sm">
        Loading product…
      </section>
    )
  }

  if (!product) {
    return (
      <section className="px-4 md:px-10 py-20 max-w-[1100px] mx-auto text-center">
        <p className="text-gray-500 text-sm mb-4">We couldn't find that product.</p>
        <Link to="/" className="text-blue-600 hover:underline font-medium text-sm">
          Back to home
        </Link>
      </section>
    )
  }

  // Live unit price = base price + every selected option's price delta.
  const unitPrice = computeVariantPrice(product, selectedVariants)
  const productForCart = { ...product, price: formatPrice(unitPrice) }

  const handleAddToCart = () => {
    addToCart(productForCart, selectedVariants, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(productForCart, selectedVariants, quantity)
    navigate('/cart')
  }

  return (
    <section className="px-4 md:px-10 py-12 max-w-[1100px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-[#F8FAFC] rounded-3xl flex items-center justify-center p-10 h-[380px] md:h-[460px]">
          <img src={product.image} alt={product.alt || product.name} className="max-h-full max-w-full object-contain" />
        </div>

        <div className="flex flex-col">
          {product.badge && (
            <span
              className="self-start text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm mb-3"
              style={{ backgroundColor: product.badgeColor }}
            >
              {product.badge}
            </span>
          )}

          <div className="flex items-start justify-between gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition ${
                isWishlisted(product.id)
                  ? 'border-red-200 bg-red-50 text-red-500'
                  : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
              }`}
            >
              <i className={`${isWishlisted(product.id) ? 'fas' : 'far'} fa-heart`}></i>
            </button>
          </div>

          <div className="flex items-center gap-1 text-yellow-400 text-sm mb-3">
            <Stars rating={product.rating} />
            <span className="text-gray-400 ml-1 font-normal text-xs">({product.reviews} reviews)</span>
          </div>

          <div className="text-3xl font-bold text-blue-600 mb-5">{formatPrice(unitPrice)}</div>

          {(product.specs || []).length > 0 && (
            <ul className="text-sm text-gray-600 mb-5 flex flex-col gap-1">
              {product.specs.map((spec) => (
                <li key={spec} className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 text-xs mt-1"></i>
                  {spec}
                </li>
              ))}
            </ul>
          )}

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>
          )}

          {(product.variants || []).map((group) => (
            <div key={group.name} className="mb-5">
              <div className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                {group.name}: <span className="font-normal normal-case text-gray-500">{selectedVariants[group.name]}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const label = optionLabel(option)
                  const delta = optionDelta(option)
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedVariants((prev) => ({ ...prev, [group.name]: label }))}
                      className={`px-4 py-2 rounded-lg text-sm border transition ${
                        selectedVariants[group.name] === label
                          ? 'border-red-600 bg-red-50 text-red-600 font-bold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {label}
                      {delta !== 0 && (
                        <span className="ml-1 text-xs opacity-70">
                          ({delta > 0 ? '+' : ''}{formatPrice(delta)})
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Qty</span>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-600 transition"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-600 transition"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 border-2 border-[#5b45f2] text-[#5b45f2] hover:bg-[#5b45f2] hover:text-white font-bold py-3 px-4 rounded-lg transition text-sm"
            >
              {added ? 'Added ✓' : 'Add to Cart'}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition text-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
