import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { friendlyAuthError } from '../utils/authErrors'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="px-4 py-16 max-w-[420px] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset your password</h1>
      <p className="text-gray-500 text-sm mb-6">
        Enter the email on your account and we'll send you a link to reset your password.
      </p>

      {sent ? (
        <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
          If an account exists for <strong>{email}</strong>, a reset link is on its way — check your inbox.
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded bg-gray-50 text-sm focus:outline-none focus:border-red-500 transition"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        </>
      )}

      <p className="text-sm text-gray-500 text-center mt-6">
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Back to sign in
        </Link>
      </p>
    </section>
  )
}
