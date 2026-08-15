import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

function Stars({ rating }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<i key={i} className="fas fa-star"></i>)
    } else if (rating >= i - 0.5) {
      stars.push(<i key={i} className="fas fa-star-half-alt"></i>)
    } else {
      stars.push(<i key={i} className="far fa-star"></i>)
    }
  }
  return <>{stars}</>
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const navigate = useNavigate()
  const detailUrl = `/product/${product.category}/${product.id}`
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0
  const saved = isWishlisted(product.id)

  const handleBuyNow = (e) => {
    e.preventDefault()
    if (hasVariants) {
      // Needs a variant choice first — send them to the product page instead.
      navigate(detailUrl)
      return
    }
    addToCart(product, {}, 1)
    navigate('/cart')
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist(product)
  }

  return (
    <Link
      to={detailUrl}
      className="min-w-[280px] sm:min-w-[320px] snap-center product-card bg-white rounded-2xl p-4 border border-gray-100 relative group h-[400px] flex flex-col"
    >
      <div>
        <div className="flex justify-between items-start mb-1 relative z-10">
          <span
            className="text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm"
            style={{ backgroundColor: product.badgeColor }}
          >
            {product.badge}
          </span>
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`transition ${saved ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}
          >
            <i className={`${saved ? 'fas' : 'far'} fa-heart`}></i>
          </button>
        </div>
        <div className="flex justify-center h-52 mb-0">
          <img src={product.image} alt={product.alt} className="h-full w-full object-contain" />
        </div>
        <div className="flex items-center gap-1 text-yellow-400 text-xs mb-2">
          <Stars rating={product.rating} />
          <span className="text-gray-400 ml-1 font-normal text-[10px]">({product.reviews})</span>
        </div>
        <div className="flex justify-between items-center mt-0.5 mb-0">
          <div className="text-xl font-bold text-blue-600">{product.price}</div>
          <button
            type="button"
            onClick={handleBuyNow}
            className="bg-[#5b45f2] hover:bg-[#4a36d6] text-white text-[13px] font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition shadow-sm"
          >
            {hasVariants ? 'Choose Options' : 'Buy Now'} <i className="fas fa-shopping-cart text-xs"></i>
          </button>
        </div>
      </div>
      <div className="pt-1">
        <h3 className="font-bold text-gray-800 text-sm leading-tight">{product.name}</h3>
        {(product.specs || []).map((spec) => (
          <p key={spec} className="text-gray-800 text-[10px] mt-1 leading-relaxed">
            {spec}
          </p>
        ))}
      </div>
    </Link>
  )
}
