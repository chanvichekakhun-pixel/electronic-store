import HeroCarousel from '../components/HeroCarousel'
import PromoBanners from '../components/PromoBanners'
import ProductSection from '../components/ProductSection'
import { useProductsBySection } from '../utils/useProducts'

export default function Home() {
  const { products: bestSelling } = useProductsBySection('bestSelling')
  const { products: newArrivals } = useProductsBySection('newArrival')

  return (
    <>
      <HeroCarousel />
      <PromoBanners />
      <ProductSection
        title="Best Selling"
        subtitle="Top-rated picks loved by our customers"
        icon="fa-star"
        iconBg="bg-blue-600"
        products={bestSelling}
        scrollId="bestSellingScroll"
      />
      <ProductSection
        title="New Arrival"
        subtitle="Check out the latest tech now in store"
        icon="fa-rocket"
        iconBg="bg-blue-600"
        products={newArrivals}
        scrollId="newArrivalScroll"
        className="mt-6"
      />
    </>
  )
}
