import { PLACEHOLDER, resolveImageUrl } from '../services/images'

// Renders an event image that can never end up broken.
//
// If the file is missing or the path is wrong, `onError` swaps in the local
// placeholder so the page never shows a broken-image icon.
export default function EventImage({ src, alt, className = '' }) {
  const url = resolveImageUrl(src)

  return (
    <img
      src={url}
      // alt is required for accessibility; callers should describe the image.
      alt={alt || 'Event image'}
      className={className}
      loading="lazy"
      // Covers the "file missing" and "path wrong" cases in one line.
      onError={(e) => {
        // Guard against an infinite loop if the placeholder itself is missing.
        if (e.currentTarget.src.endsWith(PLACEHOLDER)) return
        e.currentTarget.src = PLACEHOLDER
      }}
    />
  )
}