// src/utils/resolveImage.js
//
// Normalizes a product image path so it works no matter where it came from:
//   - A full URL (e.g. a Firebase Storage download URL from the Admin
//     Dashboard's image upload) is returned as-is.
//   - A local seed path — '/image/x.jpg', 'image/x.jpg', or even the buggy
//     '/public/image/x.jpg' — is normalized to the correct base-aware path,
//     so it works both in local dev (base '/') and on GitHub Pages
//     (base '/electronic-store/').
//
// Use this anywhere a product image renders, instead of using the raw
// `image` field directly:
//   <img src={resolveImage(product.image)} alt={product.name} />

export function resolveImage(path) {
  if (!path) return ''

  // Already a full URL (Firebase Storage, external link, etc.) — leave it alone.
  if (/^https?:\/\//i.test(path)) return path

  // Strip any leading slash, and strip a leading "public/" if present
  // (files in Vite's public/ folder are served from the site root, never
  // from a path containing the word "public").
  const clean = path
    .replace(/^\/+/, '')       // leading slash(es)
    .replace(/^public\//i, '') // stray "public/" prefix
    .replace(/^image\//i, '')  // we'll re-add this ourselves, so strip if present

  return `${import.meta.env.BASE_URL}image/${clean}`
}