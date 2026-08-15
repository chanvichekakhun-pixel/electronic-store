# Electronic Accessory Shop — React

A React + Vite + Tailwind conversion of the original static `test.html` electronics-shop landing page,
now with client-side routing and Firebase Google sign-in.

## Structure

```
src/
  components/
    Header.jsx            nav bar w/ NavLink routing + responsive hamburger menu
    AccountMenu.jsx        sign-in button / avatar dropdown, shows Admin badge
    ProtectedRoute.jsx     route guard (signed-in / admin-only)
    HeroCarousel.jsx       auto-playing hero carousel
    PromoBanners.jsx       horizontal-scroll promo image strip
    ProductCard.jsx        single product card incl. star-rating renderer
    ProductSection.jsx     reusable product row with scroll button
  pages/
    Home.jsx               hero + promo + best selling + new arrival (the old homepage)
    LaptopDesktop.jsx, Smartphone.jsx, Accessory.jsx   category pages (filter data/products.js)
    About.jsx, ContactUs.jsx                            static content pages
    AdminDashboard.jsx                                  example admin-only page at /admin
  context/
    AuthContext.jsx        Firebase auth state + Firestore-backed role ("user" | "admin")
  firebase/
    config.js               Firebase app/auth/firestore initialization
  data/
    products.js             hero slides, promo banners, and product data (now with `category`)
  App.jsx                   route definitions
  main.jsx                  entry point — wraps App in BrowserRouter + AuthProvider
public/
  image/                    all images referenced by the page (renamed to remove spaces/parentheses)
```

## Routing

Each nav item is now a real route via `react-router-dom`:

| Label          | Path              |
|----------------|-------------------|
| Home           | `/`               |
| Laptop/Desktop | `/laptop-desktop` |
| Smartphone     | `/smartphone`     |
| Accessory      | `/accessory`      |
| About          | `/about`          |
| Contact Us     | `/contact-us`     |
| Sign in        | `/login`          |
| Sign up        | `/signup`         |
| Forgot password| `/forgot-password`|
| Admin (hidden) | `/admin`          |

Below the `md` breakpoint the nav list collapses behind a hamburger icon in `Header.jsx`; tapping it
opens a stacked mobile menu, and it auto-closes on navigation.

## Firebase auth (email/password + Google, user + admin roles)

Sign-in supports both **email/password** and **Google**, on dedicated pages — `/login`, `/signup`,
and `/forgot-password` — instead of a popup-only flow. Roles (`user` or `admin`) aren't part of Firebase
Auth itself; they're stored per-user in **Firestore** (`users/{uid}.role`) and read after sign-in, so you
can promote or demote anyone by editing that field straight in the Firebase console.

### Setup

1. Create a project at https://console.firebase.google.com.
2. **Build → Authentication → Sign-in method** → enable **Google** *and* **Email/Password**.
3. **Build → Firestore Database** → create a database (Native mode, any region).
4. **Project settings → General → Your apps** → add a Web app → copy the config values.
5. Copy `.env.example` to `.env` and paste those values in:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
6. (Optional) Set `VITE_ADMIN_EMAILS` in `.env` to a comma-separated list of emails that should be
   auto-promoted to `admin` the first time they sign up/sign in. Everyone else defaults to `user`.
7. **Firestore rules** — start with something like this so users can read/write only their own doc:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read: if request.auth != null && request.auth.uid == uid;
         allow create: if request.auth != null && request.auth.uid == uid;
         allow update: if request.auth != null &&
           (request.auth.uid == uid && request.resource.data.role == resource.data.role);
       }
     }
   }
   ```

### Changing someone's role

Firebase console → **Firestore Database** → `users` collection → open their document → edit the
`role` field to `admin` or `user`. They'll see the change next time they sign in (or refresh, since
the role is only re-read on auth-state change).

### How it works

- `src/firebase/config.js` initializes the Firebase app from your `.env` values (and no-ops
  gracefully if they're missing, so the rest of the site still renders).
- `src/context/AuthContext.jsx` exposes `signInWithEmail()`, `signUpWithEmail()`,
  `signInWithGoogle()`, `resetPassword()`, and `logout()`, plus `currentUser`, `role`, and `isAdmin`,
  via the `useAuth()` hook. New accounts (email or Google) get a Firestore role doc created
  immediately — `admin` if their email is in `VITE_ADMIN_EMAILS`, otherwise `user`.
- `src/pages/Login.jsx`, `Signup.jsx`, and `ForgotPassword.jsx` are full pages (routes `/login`,
  `/signup`, `/forgot-password`) with email/password forms, a "Continue with Google" button, and
  friendly error messages (`src/utils/authErrors.js` maps Firebase error codes to plain English).
- `AccountMenu.jsx` in the header shows a "Sign in" link when signed out (→ `/login`), and an
  avatar + name + role badge dropdown (with "Sign out" and, for admins, an "Admin Dashboard" link)
  when signed in.
- `ProtectedRoute.jsx` wraps `/admin` — redirects signed-out users to `/`, and shows an
  "Admins only" message to signed-in non-admins.

## Run it

```bash
npm install
cp .env.example .env   # then fill in your Firebase config
npm run dev             # start dev server
npm run build            # production build to dist/
```
