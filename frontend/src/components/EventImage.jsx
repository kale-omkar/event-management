import { PLACEHOLDER, resolveImageUrl } from '../services/images'

export default function EventImage({ src, alt, className = '' }) {
  const url = resolveImageUrl(src)

  return (
    <img
      src={url}

      alt={alt || 'Event image'}
      className={className}
      loading="lazy"

      onError={(e) => {

        if (e.currentTarget.src.endsWith(PLACEHOLDER)) return
        e.currentTarget.src = PLACEHOLDER
      }}
    />
  )
}