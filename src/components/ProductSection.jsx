import { useRef } from 'react'
import ProductCard from './ProductCard'

export default function ProductSection({ title, subtitle, icon, iconBg, products, scrollId, className = '' }) {
  const scrollRef = useRef(null)

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })
  }

  return (
    <section className={`px-4 md:px-10 py-12 max-w-[1400px] mx-auto bg-[#F8FAFC] rounded-3xl relative ${className}`}>
      <div className="flex justify-between items-center mb-8 pr-12 md:pr-14">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center text-white`}>
            <i className={`fas ${icon} text-sm`}></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-500 text-xs">{subtitle}</p>
          </div>
        </div>
        <a href="#" className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline">
          View all <i className="fas fa-arrow-right text-xs"></i>
        </a>
      </div>

      <div className="relative flex items-center group">
        <div
          id={scrollId}
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 scroll-smooth w-full"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="scroll-btn absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-20 hidden md:flex transition hover:scale-110 bg-white shadow-lg text-blue-600 hover:bg-blue-600 hover:text-white border border-gray-100"
        >
          <i className="fas fa-chevron-right text-sm"></i>
        </button>
      </div>
    </section>
  )
}
