import { useProducts } from '../utils/useProducts'
import ProductCard from '../components/ProductCard'

export default function CategoryPage({ title, subtitle, category }) {
  const { products, loading } = useProducts(category)

  return (
    <section className="px-4 md:px-10 py-12 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>

      {loading ? (
        <div className="bg-[#F8FAFC] rounded-3xl py-20 text-center text-gray-400 text-sm">
          Loading products…
        </div>
      ) : products.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#F8FAFC] rounded-3xl py-20 text-center text-gray-400 text-sm">
          No products in this category yet — check back soon.
        </div>
      )}
    </section>
  )
}
