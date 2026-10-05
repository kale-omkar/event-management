// Renders an image that can never end up broken.
//
// Behaviour:
//   - shows a shimmering skeleton while loading
//   - fades in once loaded, with no layout shift (the box is fixed by `ratio`)
//   - falls back to a local placeholder on error, so a missing file can never
//     leave a broken-image icon on the page
//   - lazy-loads by default, and optionally for eager above-the-fold images

import { useEffect, useRef, useState } from 'react'

import { PLACEHOLDER, resolveImageUrl } from '../services/images'

/**
 * @param {object} props
 * @param {string} [props.src]        Relative path or absolute URL
 * @param {string} [props.alt]        Required for accessibility
 * @param {string} [props.ratio]      CSS aspect-ratio, e.g. '16 / 9'
 * @param {string} [props.className]
 * @param {boolean} [props.eager]     Skip lazy loading (use for hero images)
 * @param {string} [props.fit]        object-fit value, default 'cover'
 */
export default function SmartImage({
  src,
  alt = '',
  ratio = '16 / 9',
  className = '',
  eager = false,
  fit = 'cover',
}) {
  const [status, setStatus] = useState('loading') // loading | loaded | error
  const imgRef = useRef(null)

  const url = resolveImageUrl(src)

  // Reset to the loading state when the source changes, so a new image shows
  // its skeleton instead of popping in at full opacity. Done during render
  // rather than in an effect, which React recommends for this adjustment.
  const [lastUrl, setLastUrl] = useState(url)
  if (url !== lastUrl) {
    setLastUrl(url)
    setStatus('loading')
  }

  // A cached image can finish before React attaches onLoad, so check
  // `complete` on mount as well.
  useEffect(() => {
    if (imgRef.current?.complete) setStatus('loaded')
  }, [])

  const handleError = () => {
    // Guard against looping if even the placeholder fails to load.
    if (url === PLACEHOLDER) {
      setStatus('error')
      return
    }
    if (imgRef.current) imgRef.current.src = PLACEHOLDER
  }

  return (
    <div
      className={`smart-image ${className}`}
      style={{ aspectRatio: ratio }}
      data-status={status}
    >
      {status === 'loading' && <div className="smart-image-skeleton" aria-hidden="true" />}

      <img
        ref={imgRef}
        src={url}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        onLoad={() => setStatus('loaded')}
        onError={handleError}
        className="smart-image-img"
        style={{ objectFit: fit }}
      />
    </div>
  )
}