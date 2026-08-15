import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../firebase/config'

const AuthContext = createContext(null)

// Comma-separated list of emails that should automatically become admins
// the first time they sign in. Set VITE_ADMIN_EMAILS in your .env file.
// e.g. VITE_ADMIN_EMAILS=owner@example.com,manager@example.com
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

// Reads (or, the first time, creates) a user's Firestore role doc.
// Shared by the auth-state listener and the sign-up flow so a brand new
// account always has a role attached to it right away.
async function ensureUserDoc(user) {
  const userRef = doc(db, 'users', user.uid)
  const snap = await getDoc(userRef)

  if (snap.exists()) {
    return snap.data().role || 'user'
  }

  const assignedRole = ADMIN_EMAILS.includes((user.email || '').toLowerCase()) ? 'admin' : 'user'

  await setDoc(userRef, {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: assignedRole,
    createdAt: serverTimestamp(),
  })

  return assignedRole
}

const CONFIG_ERROR_MESSAGE =
  'Firebase is not configured yet. Copy .env.example to .env, fill in your Firebase project ' +
  'config, and restart the dev server.'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [role, setRole] = useState(null)
  // If Firebase isn't configured yet, there's nothing to wait on.
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isFirebaseConfigured) return

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setError(null)
      if (!user) {
        setCurrentUser(null)
        setRole(null)
        setLoading(false)
        return
      }

      setCurrentUser(user)

      try {
        setRole(await ensureUserDoc(user))
      } catch (err) {
        console.error('Failed to load/create user role:', err)
        setError(err)
        // Fall back so the UI doesn't hang if Firestore rules/config aren't set up yet.
        setRole('user')
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const requireConfigured = () => {
    if (!isFirebaseConfigured) {
      const err = new Error(CONFIG_ERROR_MESSAGE)
      setError(err)
      throw err
    }
  }

  const signInWithEmail = async (email, password) => {
    requireConfigured()
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err)
      throw err
    }
  }

  const signUpWithEmail = async (email, password, displayName) => {
    requireConfigured()
    setError(null)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(user, { displayName })
      }
      // Create the Firestore role doc right away (with the display name
      // already set) instead of waiting on the auth-state listener.
      await ensureUserDoc({ ...user, displayName: displayName || user.displayName })
    } catch (err) {
      setError(err)
      throw err
    }
  }

  const resetPassword = async (email) => {
    requireConfigured()
    setError(null)
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err) {
      setError(err)
      throw err
    }
  }

  const logout = () => (isFirebaseConfigured ? firebaseSignOut(auth) : Promise.resolve())

  const value = {
    currentUser,
    role,
    isAdmin: role === 'admin',
    loading,
    error,
    isFirebaseConfigured,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
