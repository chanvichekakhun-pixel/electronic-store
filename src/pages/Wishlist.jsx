import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

function Stars({ rating }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<i key={i} className="fas fa-star"></i>)
    else if (rating >= i - 0.5) stars.push(<i key={i} className="fas fa-star-half-alt"></i>)
    else stars.push(<i key={i} className="far fa-star"></i>)
  }
  return <>{stars}</>
}

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (items.length === 0) {
    return (
      <section className="px-4 md:px-10 py-20 max-w-[900px] mx-auto text-center">
        <i className="far fa-heart text-4xl text-gray-300 mb-4"></i>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
        <p className="text-gray-500 text-sm mb-6">
          Tap the heart on any product to save it here for later.
        </p>
        <Link to="/" className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition">
          Continue shopping
        </Link>
      </section>
    )
  }

  return (
    <section className="px-4 md:px-10 py-12 max-w-[1100px] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Wishlist</h1>

      <div className="flex flex-wrap gap-4">
        {items.map((product) => (
          <div
            key={product.id}
            className="min-w-[280px] sm:min-w-[300px] flex-1 max-w-[340px] bg-white rounded-2xl p-4 border border-gray-100 relative flex flex-col"
          >
            <button
              type="button"
              onClick={() => removeFromWishlist(product.id)}
              aria-label="Remove from wishlist"
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition z-10"
            >
              <i className="fas fa-heart"></i>
            </button>

            <Link to={`/product/${product.category}/${product.id}`} className="flex justify-center h-40 mb-2">
              <img src={product.image} alt={product.alt || product.name} className="h-full w-full object-contain" />
            </Link>

            <div className="flex items-center gap-1 text-yellow-400 text-xs mb-2">
              <Stars rating={product.rating} />
              <span className="text-gray-400 ml-1 font-normal text-[10px]">({product.reviews})</span>
            </div>

            <Link to={`/product/${product.category}/${product.id}`} className="font-bold text-gray-800 text-sm leading-tight mb-2 hover:text-red-600 transition">
              {product.name}
            </Link>

            <div className="flex items-center justify-between mt-auto">
              <div className="text-lg font-bold text-blue-600">{product.price}</div>
              <button
                type="button"
                onClick={() => addToCart(product, {}, 1)}
                className="bg-[#5b45f2] hover:bg-[#4a36d6] text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition"
              >
                Add to Cart <i className="fas fa-shopping-cart text-xs"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
