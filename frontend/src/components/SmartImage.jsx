

import { useEffect, useRef, useState } from 'react'

import { PLACEHOLDER, resolveImageUrl } from '../services/images'

export default function SmartImage({
  src,
  alt = '',
  ratio = '16 / 9',
  className = '',
  eager = false,
  fit = 'cover',
}) {
  const [status, setStatus] = useState('loading')
  const imgRef = useRef(null)

  const url = resolveImageUrl(src)

  const [lastUrl, setLastUrl] = useState(url)
  if (url !== lastUrl) {
    setLastUrl(url)
    setStatus('loading')
  }

  useEffect(() => {
    if (imgRef.current?.complete) setStatus('loaded')
  }, [])

  const handleError = () => {

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