import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { parsePrice, formatPrice } from '../utils/price'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart()

  if (items.length === 0) {
    return (
      <section className="px-4 md:px-10 py-20 max-w-[900px] mx-auto text-center">
        <i className="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 text-sm mb-6">Browse the catalog and add something you like.</p>
        <Link to="/" className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition">
          Continue shopping
        </Link>
      </section>
    )
  }

  return (
    <section className="px-4 md:px-10 py-12 max-w-[900px] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="flex flex-col gap-3 mb-8">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="flex items-center gap-4 bg-[#F8FAFC] rounded-2xl p-4 border border-gray-100"
          >
            <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-white rounded-lg" />

            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-gray-800">{item.name}</div>
              {Object.entries(item.selectedVariants || {}).length > 0 && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {Object.entries(item.selectedVariants)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' · ')}
                </div>
              )}
              <div className="text-blue-600 font-bold text-sm mt-1">{item.price}</div>
            </div>

            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 transition"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 transition"
              >
                +
              </button>
            </div>

            <div className="w-20 text-right text-sm font-bold text-gray-800">
              {formatPrice(parsePrice(item.price) * item.quantity)}
            </div>

            <button
              type="button"
              onClick={() => removeFromCart(item.cartItemId)}
              className="text-gray-300 hover:text-red-500 transition px-2"
              aria-label={`Remove ${item.name}`}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
        <div>
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold text-gray-900">{formatPrice(cartTotal)}</div>
        </div>
        <button
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3 px-8 rounded-lg transition"
        >
          Checkout
        </button>
      </div>
    </section>
  )
}
