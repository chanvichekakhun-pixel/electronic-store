import { useCallback, useEffect, useRef, useState } from 'react'
import { heroSlides } from '../data/products'

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef(null)
  const totalSlides = heroSlides.length

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  const moveSlide = useCallback(
    (direction) => {
      setCurrentIndex((prev) => {
        let next = prev + direction
        if (next >= totalSlides) next = 0
        if (next < 0) next = totalSlides - 1
        return next
      })
    },
    [totalSlides]
  )

  const startAutoSlide = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      moveSlide(1)
    }, 2500)
  }, [moveSlide])

  useEffect(() => {
    startAutoSlide()
    return () => clearInterval(intervalRef.current)
  }, [startAutoSlide])

  const handleManualChange = (fn) => {
    fn()
    startAutoSlide()
  }

  return (
    <section className="hero-gradient w-full px-4 md:px-10 py-5">
      <div
        className="carousel-container w-full max-w-[1400px] mx-auto rounded-lg relative bg-gray-900"
        style={{ height: 400 }}
      >
        <div
          className="carousel-slide flex h-full w-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover block" />
            </div>
          ))}
        </div>

        <button
          onClick={() => handleManualChange(() => moveSlide(-1))}
          className="carousel-btn absolute left-4 top-1/2 -translate-y-1/2 text-white w-10 h-10 rounded-full flex items-center justify-center z-10"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button
          onClick={() => handleManualChange(() => moveSlide(1))}
          className="carousel-btn absolute right-4 top-1/2 -translate-y-1/2 text-white w-10 h-10 rounded-full flex items-center justify-center z-10"
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => handleManualChange(() => goToSlide(index))}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
