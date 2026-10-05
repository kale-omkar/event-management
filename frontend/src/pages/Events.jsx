import { AnimatePresence, motion } from 'framer-motion'
import { FiFilter, FiSearch } from 'react-icons/fi'
import { useMemo, useState } from 'react'

import EventCard from '../components/EventCard'
import SmartImage from '../components/SmartImage'
import Lightbox from '../components/Lightbox'
import ScrollReveal from '../components/ScrollReveal'
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States'
import useToast from '../components/useToast'
import useFetch from '../hooks/useFetch'

const ALL = 'All'

export default function Events() {
  const toast = useToast()
  const [category, setCategory] = useState(ALL)
  const [search, setSearch] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const { data, error, loading, refetch } = useFetch('/api/events')

  const allEvents = useMemo(() => data?.events ?? [], [data?.events])
  const categories = useMemo(
    () => [ALL, ...(data?.categories ?? [])],
    [data?.categories],
  )

  // Filter on the client so typing is instant. The API supports the same
  // filters server-side, which is what you'd use once the list gets large.
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()

    return allEvents.filter((event) => {
      const matchesCategory = category === ALL || event.category === category
      const matchesSearch =
        !term ||
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        (event.description ?? '').toLowerCase().includes(term)

      return matchesCategory && matchesSearch
    })
  }, [allEvents, category, search])

  const lightboxImages = useMemo(
    () =>
      visible.map((event) => ({
        src: event.image_url,
        alt: event.title,
        caption: event.title,
      })),
    [visible],
  )

  const resetFilters = () => {
    setCategory(ALL)
    setSearch('')
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Browse</p>
          <h1>Events</h1>
          <p className="page-hero-lede">
            Every occasion we are planning right now. Filter by type or search by
            name and venue.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          {/* ---------------------------------------------------------- */}
          {/* Filters: search box + category chips                       */}
          {/* ---------------------------------------------------------- */}
          <div className="filters">
            <div className="filters-search">
              <FiSearch aria-hidden="true" className="filters-search-icon" />
              <label htmlFor="event-search" className="sr-only">
                Search events
              </label>
              <input
                id="event-search"
                type="search"
                className="input filters-input"
                placeholder="Search by name, venue or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="chips" role="group" aria-label="Filter by category">
              <span className="chips-label">
                <FiFilter aria-hidden="true" />
                Category
              </span>

              {categories.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`chip ${category === name ? 'chip-active' : ''}`}
                  onClick={() => setCategory(name)}
                  aria-pressed={category === name}
                >
                  {name}
                </button>
              ))}

              {(category !== ALL || search) && (
                <button
                  type="button"
                  className="chip chip-clear"
                  onClick={resetFilters}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <p className="results-count text-subtle" aria-live="polite">
            {loading
              ? 'Loading events…'
              : `Showing ${visible.length} of ${allEvents.length} event${
                  allEvents.length === 1 ? '' : 's'
                }`}
          </p>

          {/* ---------------------------------------------------------- */}
          {/* Results                                                    */}
          {/* ---------------------------------------------------------- */}
          {loading && <SkeletonGrid count={6} />}

          {!loading && error && (
            <ErrorState
              title="Could not load events"
              message={
                error.response?.status === 503
                  ? 'The API is running but the database is not reachable yet. Check the DB_* values in backend/.env.'
                  : 'Something went wrong talking to the API.'
              }
              onRetry={() => {
                refetch()
                toast.info('Retrying…')
              }}
            />
          )}

          {!loading && !error && visible.length === 0 && (
            <EmptyState
              title="No events match those filters"
              message="Try a different category, or clear the search."
            />
          )}

          {!loading && !error && visible.length > 0 && (
            <motion.div className="event-grid" layout>
              <AnimatePresence mode="popLayout">
                {visible.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && !error && visible.length > 0 && (
            <p className="gallery-hint text-subtle text-center">
              Tip: select an event to see full details, inclusions and photos.
            </p>
          )}
        </div>
      </section>

      {/* Gallery: thumbnails open the lightbox */}
      {!loading && !error && lightboxImages.length > 0 && (
        <section className="section-sm">
          <ScrollReveal>
            <div className="section-head section-head-center">
              <p className="eyebrow">Gallery</p>
              <h2>A look at recent work</h2>
              <p>Select any photo to open the viewer. Use the arrow keys to move between them.</p>
            </div>
          </ScrollReveal>

          <div className="gallery-grid">
            {lightboxImages.map((image, index) => (
              <motion.button
                key={`${image.src}-${index}`}
                type="button"
                className="gallery-thumb"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Open image: ${image.alt}`}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                transition={{ duration: 0.35, delay: (index % 6) * 0.05 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                <SmartImage src={image.src} alt={image.alt} ratio="4 / 3" />
              </motion.button>
            ))}
          </div>
        </section>
      )}

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() =>
          setLightboxIndex((i) => (i === null ? null : (i - 1 + lightboxImages.length) % lightboxImages.length))
        }
        onNext={() =>
          setLightboxIndex((i) => (i === null ? null : (i + 1) % lightboxImages.length))
        }
      />
    </>
  )
}