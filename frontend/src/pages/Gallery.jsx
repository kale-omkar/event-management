import { useEffect, useMemo, useState } from 'react'

import Lightbox from '../components/Lightbox'

const API_URL = 'http://localhost:8000/api/gallery'

export default function Gallery() {
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        setGallery(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Gallery fetch error:', err)
        setError('Unable to load gallery images.')
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

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
            </div>
          )}

          {!loading && !error && filteredGallery.length === 0 && (
            <div className="gallery-state">
              <p>No gallery images found.</p>
            </div>
          )}

          {!loading && !error && filteredGallery.length > 0 && (
            <div className="gallery-grid">
              {filteredGallery.map((item, index) => (
                <article
                  key={item.id}
                  className="gallery-card"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div className="gallery-image-wrapper">
                    <img
                      src={item.image_url}
                      alt={item.caption || 'Event gallery image'}
                      className="gallery-image"
                      loading="lazy"
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