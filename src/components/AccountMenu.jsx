import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AccountMenu() {
  const { currentUser, isAdmin, loading, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
  }

  if (!currentUser) {
    return (
      <Link to="/login" className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition">
        <i className="far fa-user-circle text-2xl"></i>
        <span className="text-sm hidden sm:inline">Sign in</span>
      </Link>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition"
      >
        {currentUser.photoURL ? (
          <img src={currentUser.photoURL} alt="" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <i className="far fa-user-circle text-2xl"></i>
        )}
        <span className="text-sm hidden sm:inline">
          {currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0] || 'Account'}
        </span>
        {isAdmin && (
          <span className="text-[9px] font-bold uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded hidden sm:inline">
            Admin
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800 truncate">
              {currentUser.displayName || 'Account'}
            </p>
            <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
          </div>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={() => {
              setOpen(false)
              logout()
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
