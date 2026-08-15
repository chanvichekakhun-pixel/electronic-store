import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import AccountMenu from './AccountMenu'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Laptop/Desktop', to: '/laptop-desktop' },
  { label: 'Smartphone', to: '/smartphone' },
  { label: 'Accessory', to: '/accessory' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', to: '/contact-us' },
]

function navLinkClass({ isActive }) {
  return `nav-link transition ${isActive ? 'active text-red-600' : 'hover:text-red-600'}`
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()

  return (
    <header className="bg-white px-4 md:px-10 py-3 border-b border-gray-200 relative z-40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex-shrink-0 flex items-center gap-3">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-gray-700 hover:text-red-600 transition w-8 h-8 flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <i className={`fas ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
          </button>
          <NavLink to="/">
            <img src="/image/logo.png" alt="Logo" className="h-10 w-auto" />
          </NavLink>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium text-gray-700">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={navLinkClass} end={item.to === '/'}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5 flex-shrink-0 text-gray-700">
          <NavLink to="/wishlist" className="relative cursor-pointer hover:text-red-600 transition">
            <i className="far fa-heart text-xl"></i>
            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </NavLink>
          <NavLink to="/cart" className="relative cursor-pointer hover:text-red-600 transition">
            <i className="fas fa-shopping-cart text-xl"></i>
            <span className="cart-badge">{cartCount}</span>
          </NavLink>
          <AccountMenu />
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col gap-1 pt-3 mt-3 border-t border-gray-100 text-sm font-medium text-gray-700">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2.5 px-1 transition ${isActive ? 'text-red-600 font-semibold' : 'hover:text-red-600'}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
