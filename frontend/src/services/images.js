

export const PLACEHOLDER = '/images/placeholder.svg'

export function resolveImageUrl(src) {
  if (!src) return PLACEHOLDER

  if (/^https?:\/\//i.test(src)) return src

  if (src.startsWith('/')) return src

  return `/images/${src}`
}