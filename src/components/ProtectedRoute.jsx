import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-500 text-sm">
        Checking your account…
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admins only</h1>
        <p className="text-gray-500 text-sm">You don't have permission to view this page.</p>
      </div>
    )
  }

  return children
}
