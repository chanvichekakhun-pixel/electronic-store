import { promoBanners } from '../data/products'

export default function PromoBanners() {
  return (
    <section className="px-4 md:px-10 py-8 pb-8 max-w-[1400px] mx-auto">
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4">
        {promoBanners.map((banner) => (
          <div key={banner.id} className="min-w-[280px] md:min-w-[320px] snap-center">
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
