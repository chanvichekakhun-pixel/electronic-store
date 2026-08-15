// Firebase app initialization.
//
// 1. Create a project at https://console.firebase.google.com
// 2. Add a Web App to the project to get your config values.
// 3. Enable Authentication -> Sign-in method -> Email/Password.
// 4. Enable Firestore (Native mode) — used to store each user's role.
// 5. Copy .env.example to .env and fill in the values below from your
//    Firebase project settings, then restart `npm run dev`.
//
// Until you do that, `isFirebaseConfigured` is false and auth/db are null —
// the rest of the app still renders normally, sign-in just shows a message
// telling you Firebase isn't set up yet instead of crashing.
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCUH2pCPItanSqB5aJ-MUKIzVQDX9uN5Yw",
  authDomain: "electronic-store-ec2e5.firebaseapp.com",
  projectId: "electronic-store-ec2e5",
  storageBucket: "electronic-store-ec2e5.firebasestorage.app",
  messagingSenderId: "604746436176",
  appId: "1:604746436176:web:83dd0150aff6729fc7cb55",
  measurementId: "G-5X9RHD1PN5"
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let app = null
let auth = null
let db = null

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (err) {
    // Shouldn't happen once apiKey/projectId are present, but never let a
    // bad Firebase config take down the whole app.
    console.error('Firebase failed to initialize:', err)
  }
} else if (import.meta.env.DEV) {
  console.warn(
    '[firebase] No VITE_FIREBASE_* env vars found — sign-in is disabled. ' +
      'Copy .env.example to .env and fill in your Firebase project config.'
  )
}

export { app, auth, db }
