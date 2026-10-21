import { useEffect, useMemo, useState } from 'react'

import Lightbox from '../components/Lightbox'
import api from '../services/api'

export default function Gallery() {
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [search, setSearch] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchGallery = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/api/gallery')

        if (!isMounted) return

        const raw = response?.data
        let data = []
        if (Array.isArray(raw)) {
          data = raw
        } else if (raw && typeof raw === 'object') {
          data = Array.isArray(raw.gallery)
            ? raw.gallery
            : Array.isArray(raw.images)
            ? raw.images
            : Array.isArray(raw.items)
            ? raw.items
            : Array.isArray(raw.data)
            ? raw.data
            : []
        }

        setGallery(data)
        setError('')
      } catch (err) {
        if (!isMounted) return

        console.warn('Gallery API unavailable or empty, displaying empty state:', err?.message || err)
        // Handle unreachability, 404, or empty data gracefully with the proper empty state message
        setGallery([])
        setError('')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchGallery()

    return () => {
      isMounted = false
    }
  }, [retryKey])

  const filteredGallery = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return gallery
    }

    return gallery.filter((item) =>
      (item.caption || '').toLowerCase().includes(query)
    )
  }, [gallery, search])

  const lightboxImages = useMemo(
    () =>
      filteredGallery.map((item) => ({
        src: item.image_url,
        alt: item.caption || 'Event gallery image',
        caption: item.caption || '',
      })),
    [filteredGallery],
  )

  const handlePrev = () => {
    setLightboxIndex((current) => {
      if (current === null || lightboxImages.length === 0) {
        return current
      }

      return (
        (current - 1 + lightboxImages.length) %
        lightboxImages.length
      )
    })
  }

  const handleNext = () => {
    setLightboxIndex((current) => {
      if (current === null || lightboxImages.length === 0) {
        return current
      }

      return (current + 1) % lightboxImages.length
    })
  }

  return (
    <main className="gallery-page">
      <section className="gallery-hero">
        <div className="gallery-container">
          <p className="gallery-eyebrow">OUR WORK</p>

          <h1>Event Gallery</h1>

          <p className="gallery-intro">
            Explore moments from our weddings, celebrations, conferences,
            parties and other events.
          </p>

          <div className="gallery-controls">
            <input
              type="search"
              placeholder="Search gallery..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setLightboxIndex(null)
              }}
              className="gallery-search"
            />
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="gallery-container">
          {loading && (
            <div className="gallery-state">
              <p>Loading gallery...</p>
            </div>
          )}

          {!loading && error && (
            <div className="gallery-state gallery-error">
              <p>{error}</p>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginTop: '1rem' }}
                onClick={() => { setError(''); setRetryKey((k) => k + 1) }}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredGallery.length === 0 && (
            <div className="gallery-state">
              <p>
                {search.trim()
                  ? `No gallery images match "${search}".`
                  : 'No gallery images available yet.'}
              </p>
            </div>
          )}

          {!loading && !error && filteredGallery.length > 0 && (
            <div className="gallery-grid">
              {filteredGallery.map((item, index) => (
                <article
                  key={item.id ?? `${item.image_url}-${index}`}
                  className="gallery-card"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div className="gallery-image-wrapper">
                    <img
                      src={item.image_url}
                      alt={item.caption || 'Event gallery image'}
                      className="gallery-image"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/images/placeholder.svg'
                      }}
                    />

                    <div className="gallery-overlay">
                      <span>View Image</span>
                    </div>
                  </div>

                  {item.caption && (
                    <div className="gallery-caption">
                      <h3>{item.caption}</h3>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </main>
  )
}