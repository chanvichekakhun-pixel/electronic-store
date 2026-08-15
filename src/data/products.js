// Prefix every image path with Vite's base URL so paths resolve correctly
// both locally (base = '/') and on GitHub Pages (base = '/electronic-store/').
// Never hardcode a leading '/image/...' string directly — it bypasses this
// and breaks the moment the site isn't hosted at the domain root.
const IMG = `${import.meta.env.BASE_URL}image/`

export const heroSlides = [
  { id: 1, image: `${IMG}hero-gaming-monitors.jpg`, alt: 'Gaming Monitor Banner' },
  { id: 2, image: `${IMG}hero-laptop-banner.webp`, alt: 'Laptop Banner' },
  { id: 3, image: `${IMG}hero-desktop-banner.webp`, alt: 'Desktop Banner' },
  { id: 4, image: `${IMG}hero-phone-banner.png`, alt: 'Phone Banner' },
]

export const promoBanners = [
  { id: 1, image: `${IMG}promo-samsung.jpg`, alt: 'Samsung' },
  { id: 2, image: `${IMG}promo-asus-rog-bar.jpg`, alt: 'ASUS ROG' },
  { id: 3, image: `${IMG}promo-iphone17.jpg`, alt: 'iPhone 17' },
  { id: 4, image: `${IMG}promo-keyboard.jpg`, alt: 'Keyboard Combo' },
  { id: 5, image: `${IMG}promo-rog.png`, alt: 'Keyboard Combo' },
  { id: 6, image: `${IMG}promo-r.png`, alt: 'Keyboard Combo' },
  { id: 7, image: `${IMG}promo-air.jpg`, alt: 'Keyboard Combo' },
  { id: 8, image: `${IMG}promo-l2.avif`, alt: 'Keyboard Combo' },
  { id: 9, image: `${IMG}promo-2.jpg`, alt: 'Keyboard Combo' },
]

export const newArrivals = [
  {
    id: 1,
    category: 'laptop-desktop',
    badge: 'New',
    badgeColor: '#22c55e',
    image: `${IMG}product-cpu.jpg`,
    alt: 'PC',
    rating: 5,
    reviews: 73,
    price: '$700',
    name: 'ASUS Prime GeForce RTX 5060 Ti',
    specs: ['16GB GDDR7 | PCIe 5.0 | OC Edition', 'DLSS 4 | Ray Tracing | HDMI 2.1'],
  },
  {
    id: 2,
    category: 'laptop-desktop',
    badge: 'New',
    badgeColor: '#22c55e',
    image: `${IMG}product-desktop1.jpg`,
    alt: 'GPU',
    rating: 5,
    reviews: 59,
    price: '$1,958',
    name: 'iBUYPOWER SlateMesh Gaming PC',
    specs: ['Intel Core i7 | 32GB DDR5 | 1TB SSD', 'RTX 5070 | Wi-Fi 7 | Windows 11'],
  },
  {
    id: 3,
    category: 'smartphone',
    badge: 'New',
    badgeColor: '#22c55e',
    image: `${IMG}product-iphone17.webp`,
    alt: 'MacBook Pro',
    rating: 5,
    reviews: 64,
    price: '$1,400',
    name: 'IPHONE 17 Pro Max',
    specs: ['Chip A19 Pro | 256GB Storage | 12GB RAM', '48MP Camera | USB-C | iOS 27'],
  },
  {
    id: 4,
    category: 'laptop-desktop',
    badge: 'New',
    badgeColor: '#22c55e',
    image: `${IMG}product-macbook-neo.webp`,
    alt: 'Phone',
    rating: 5,
    reviews: 91,
    price: '$699',
    name: 'MacBook Neo',
    specs: ['Apple M4 Chip | 16GB RAM | 512GB SSD', '13.6" Liquid Retina | macOS'],
  },
]

export const bestSelling = [
  {
    id: 1,
    category: 'laptop-desktop',
    badge: 'Best Seller',
    badgeColor: '#8b5cf6',
    image: `${IMG}product-rog-zephyrus.webp`,
    alt: 'Laptop',
    rating: 4.5,
    reviews: 88,
    price: '$1,500',
    name: 'ROG Zephyrus G14',
    specs: ['AMD Ryzen 9 7940HS | 16GB RAM | 1TB SSD', 'RTX 4060 | 14" QHD+ | Win 11'],
  },
  {
    id: 2,
    category: 'laptop-desktop',
    badge: 'Trending',
    badgeColor: '#8b5cf6',
    image: `${IMG}product-lenovo-yoga.avif`,
    alt: 'Tablet',
    rating: 4,
    reviews: 96,
    price: '$1,200',
    name: 'Lenovo Yoga Duet 7i',
    specs: ['Intel Core i7-13700H | 16GB RAM | 1TB SSD', '13.3" OLED | Windows 11 | Stylus Included'],
  },
  {
    id: 3,
    category: 'laptop-desktop',
    badge: 'Best Seller',
    badgeColor: '#8b5cf6',
    image: `${IMG}product-rog-strix.jpg`,
    alt: 'Gaming Laptop',
    rating: 5,
    reviews: 142,
    price: '$2,200',
    name: 'ROG Strix G16 Gaming',
    specs: ['Intel Core i9-13980HX | 16GB RAM | 1TB SSD', 'RTX 4060 | 16" QHD+240Hz | Windows 11'],
  },
  {
    id: 4,
    category: 'laptop-desktop',
    badge: 'Top Rated',
    badgeColor: '#8b5cf6',
    image: `${IMG}product-macbook-pro-m5.jpg`,
    alt: 'MacBook',
    rating: 5,
    reviews: 190,
    price: '$2,500',
    name: 'MacBook Pro M5',
    specs: ['Apple M5 Chip | 16GB RAM | 1TB SSD', '16" Liquid Retina | macOS'],
  },
]

export const accessories = [
  {
    id: 101,
    category: 'accessory',
    badge: 'Popular',
    badgeColor: '#f59e0b',
    image: `${IMG}promo-keyboard.jpg`,
    alt: 'Keyboard combo',
    rating: 4.5,
    reviews: 54,
    price: '$79',
    name: 'Mechanical Keyboard & Mouse Combo',
    specs: ['Hot-swappable switches | RGB backlight', 'Wireless 2.4GHz + Bluetooth'],
  },
]

export const allProducts = [...bestSelling, ...newArrivals, ...accessories]
