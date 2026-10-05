// Fallback images and path helpers.
//
// Convention used across the whole project: every image lives in
// frontend/public/images/ and is referenced as "/images/...". The database
// stores only that relative path, never a full URL, so the API host can change
// without touching any data.

export const PLACEHOLDER = '/images/placeholder.svg'

/**
 * Normalise whatever the API returned into a URL the browser can load.
 *
 *   '/images/events/x.svg'  -> served from frontend/public/
 *   'https://cdn/x.jpg'     -> absolute URL, used as-is
 *   'x.svg'                 -> bare filename, resolved under /images/
 *   null / undefined / ''   -> the local placeholder
 *
 * @param {string} [src] Image path or URL from the database
 * @returns {string} A URL the browser can load
 */
export function resolveImageUrl(src) {
  if (!src) return PLACEHOLDER

  if (/^https?:\/\//i.test(src)) return src

  if (src.startsWith('/')) return src

  return `/images/${src}`
}