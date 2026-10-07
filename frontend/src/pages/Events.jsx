import { AnimatePresence, motion } from 'framer-motion'
import { FiFilter, FiSearch } from 'react-icons/fi'
import { useEffect, useMemo, useState } from 'react'

import EventCard from '../components/EventCard'
import SmartImage from '../components/SmartImage'
import Lightbox from '../components/Lightbox'
import ScrollReveal from '../components/ScrollReveal'
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States'
import useToast from '../components/useToast'
import useFetch from '../hooks/useFetch'

const ALL = 'All'

function Countdown({ eventDate }) {
  const calculateTime = () => {
    const target = new Date(eventDate).getTime()
    const now = new Date().getTime()
    const difference = target - now

    if (difference <= 0) {
      return {
        expired: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }

    return {
      expired: false,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference / (1000 * 60 * 60)) % 24,
      ),
      minutes: Math.floor(
        (difference / (1000 * 60)) % 60,
      ),
      seconds: Math.floor(
        (difference / 1000) % 60,
      ),
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTime)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime())
    }, 1000)

    return () => clearInterval(timer)
  }, [eventDate])

  if (timeLeft.expired) {
    return (
      <div className="countdown countdown-ended">
        Event completed
      </div>
    )
  }

  return (
    <div className="countdown">
      <p className="countdown-label">Starts in</p>

      <div className="countdown-grid">
        <div className="countdown-item">
          <strong>{String(timeLeft.days).padStart(2, '0')}</strong>
          <span>Days</span>
        </div>

        <div className="countdown-item">
          <strong>{String(timeLeft.hours).padStart(2, '0')}</strong>
          <span>Hours</span>
        </div>

        <div className="countdown-item">
          <strong>{String(timeLeft.minutes).padStart(2, '0')}</strong>
          <span>Min</span>
        </div>

        <div className="countdown-item">
          <strong>{String(timeLeft.seconds).padStart(2, '0')}</strong>
          <span>Sec</span>
        </div>
      </div>
    </div>
  )
}

function EventWithCountdown({ event, index }) {
  const eventDate = new Date(event.date)
  const now = new Date()

  const isUpcoming = eventDate >= now

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <EventCard event={event} index={index} />

      {isUpcoming && event.date && (
        <Countdown eventDate={event.date} />
      )}
    </motion.div>
  )
}

export default function Events() {
  const toast = useToast()

  const [category, setCategory] = useState(ALL)
  const [search, setSearch] = useState('')

  const [galleryCategory, setGalleryCategory] = useState(ALL)
  const [gallerySearch, setGallerySearch] = useState('')

  const [lightboxIndex, setLightboxIndex] = useState(null)

  const {
    data: eventData,
    error: eventError,
    loading: eventLoading,
    refetch: refetchEvents,
  } = useFetch('/api/events')

  const {
    data: galleryData,
    error: galleryError,
    loading: galleryLoading,
    refetch: refetchGallery,
  } = useFetch('/api/gallery')

  const allEvents = useMemo(
    () => eventData?.events ?? [],
    [eventData?.events],
  )

  const eventCategories = useMemo(
    () => [ALL, ...(eventData?.categories ?? [])],
    [eventData?.categories],
  )

  const visibleEvents = useMemo(() => {
    const term = search.trim().toLowerCase()

    return allEvents.filter((event) => {
      const matchesCategory =
        category === ALL ||
        event.category === category

      const matchesSearch =
        !term ||
        (event.title ?? '').toLowerCase().includes(term) ||
        (event.location ?? '').toLowerCase().includes(term) ||
        (event.description ?? '').toLowerCase().includes(term)

      return matchesCategory && matchesSearch
    })
  }, [allEvents, category, search])

  const { upcomingEvents, previousEvents } = useMemo(() => {
    const now = new Date()

    const upcoming = []
    const previous = []

    visibleEvents.forEach((event) => {
      if (!event.date) {
        return
      }

      const eventDate = new Date(event.date)

      if (eventDate >= now) {
        upcoming.push(event)
      } else {
        previous.push(event)
      }
    })

    upcoming.sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date),
    )

    previous.sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date),
    )

    return {
      upcomingEvents: upcoming,
      previousEvents: previous,
    }
  }, [visibleEvents])

  const allGalleryImages = useMemo(() => {
    
    return (
      galleryData?.gallery ??
      galleryData?.images ??
      []
    )
  }, [galleryData])

  const galleryCategories = useMemo(() => {
    const categories = allGalleryImages
      .map((image) => image.category)
      .filter(Boolean)

    return [ALL, ...new Set(categories)]
  }, [allGalleryImages])

  const visibleGalleryImages = useMemo(() => {
    const term = gallerySearch.trim().toLowerCase()

    return allGalleryImages.filter((image) => {
      const matchesCategory =
        galleryCategory === ALL ||
        image.category === galleryCategory

      const matchesSearch =
        !term ||
        (image.title ?? '').toLowerCase().includes(term) ||
        (image.event_name ?? '')
          .toLowerCase()
          .includes(term) ||
        (image.description ?? '')
          .toLowerCase()
          .includes(term)

      return matchesCategory && matchesSearch
    })
  }, [
    allGalleryImages,
    galleryCategory,
    gallerySearch,
  ])

  const lightboxImages = useMemo(
    () =>
      visibleGalleryImages.map((image) => ({
        src:
          image.image_url ??
          image.url ??
          image.src,
        alt:
          image.title ??
          image.event_name ??
          'Event image',
        caption:
          image.title ??
          image.event_name ??
          '',
      })),
    [visibleGalleryImages],
  )

  const resetEventFilters = () => {
    setCategory(ALL)
    setSearch('')
  }

  const resetGalleryFilters = () => {
    setGalleryCategory(ALL)
    setGallerySearch('')
  }

  const retryEvents = () => {
    refetchEvents()
    toast.info('Retrying events...')
  }

  const retryGallery = () => {
    refetchGallery()
    toast.info('Retrying gallery...')
  }

  return (
    <>
      
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Browse</p>

          <h1>Events</h1>

          <p className="page-hero-lede">
            Discover upcoming events, explore previous
            events and browse our event gallery.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">

          <div className="filters">

            <div className="filters-search">
              <FiSearch
                aria-hidden="true"
                className="filters-search-icon"
              />

              <label
                htmlFor="event-search"
                className="sr-only"
              >
                Search events
              </label>

              <input
                id="event-search"
                type="search"
                className="input filters-input"
                placeholder="Search by name, venue or keyword"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div
              className="chips"
              role="group"
              aria-label="Filter by category"
            >
              <span className="chips-label">
                <FiFilter aria-hidden="true" />
                Category
              </span>

              {eventCategories.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`chip ${
                    category === name
                      ? 'chip-active'
                      : ''
                  }`}
                  onClick={() =>
                    setCategory(name)
                  }
                  aria-pressed={
                    category === name
                  }
                >
                  {name}
                </button>
              ))}

              {(category !== ALL || search) && (
                <button
                  type="button"
                  className="chip chip-clear"
                  onClick={resetEventFilters}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <p
            className="results-count text-subtle"
            aria-live="polite"
          >
            {eventLoading
              ? 'Loading events...'
              : `Showing ${visibleEvents.length} of ${
                  allEvents.length
                } events`}
          </p>

          {eventLoading && (
            <SkeletonGrid count={6} />
          )}

          {!eventLoading && eventError && (
            <ErrorState
              title="Could not load events"
              message={
                eventError.response?.status === 503
                  ? 'The API is running but the database is not reachable yet. Check the DB_* values in backend/.env.'
                  : 'Something went wrong talking to the API.'
              }
              onRetry={retryEvents}
            />
          )}

          {!eventLoading &&
            !eventError &&
            visibleEvents.length === 0 && (
              <EmptyState
                title="No events match those filters"
                message="Try another category or clear the search."
              />
            )}

          {!eventLoading &&
            !eventError &&
            upcomingEvents.length > 0 && (
              <section className="section-sm">

                <ScrollReveal>
                  <div className="section-head">
                    <p className="eyebrow">
                      Coming Soon
                    </p>

                    <h2>
                      Upcoming Events
                    </h2>

                    <p>
                      Don't miss our upcoming
                      events.
                    </p>
                  </div>
                </ScrollReveal>

                <motion.div
                  className="event-grid"
                  layout
                >
                  <AnimatePresence mode="popLayout">
                    {upcomingEvents.map(
                      (event, index) => (
                        <EventWithCountdown
                          key={event.id}
                          event={event}
                          index={index}
                        />
                      ),
                    )}
                  </AnimatePresence>
                </motion.div>

              </section>
            )}

          {!eventLoading &&
            !eventError &&
            previousEvents.length > 0 && (
              <section className="section-sm">

                <ScrollReveal>
                  <div className="section-head">
                    <p className="eyebrow">
                      Our History
                    </p>

                    <h2>
                      Previous Events
                    </h2>

                    <p>
                      Explore events we have
                      successfully hosted.
                    </p>
                  </div>
                </ScrollReveal>

                <motion.div
                  className="event-grid"
                  layout
                >
                  <AnimatePresence mode="popLayout">
                    {previousEvents.map(
                      (event, index) => (
                        <EventWithCountdown
                          key={event.id}
                          event={event}
                          index={index}
                        />
                      ),
                    )}
                  </AnimatePresence>
                </motion.div>

              </section>
            )}

        </div>
      </section>

      <section className="section-sm">
        <div className="container">

          <ScrollReveal>
            <div className="section-head section-head-center">
              <p className="eyebrow">
                Gallery
              </p>

              <h2>
                A Look at Our Events
              </h2>

              <p>
                Browse photos from our events
                and celebrations.
              </p>
            </div>
          </ScrollReveal>

          <div className="filters">

            <div className="filters-search">
              <FiSearch
                aria-hidden="true"
                className="filters-search-icon"
              />

              <label
                htmlFor="gallery-search"
                className="sr-only"
              >
                Search gallery
              </label>

              <input
                id="gallery-search"
                type="search"
                className="input filters-input"
                placeholder="Search gallery..."
                value={gallerySearch}
                onChange={(e) =>
                  setGallerySearch(e.target.value)
                }
              />
            </div>

            <div
              className="chips"
              role="group"
              aria-label="Filter gallery"
            >
              <span className="chips-label">
                <FiFilter aria-hidden="true" />
                Category
              </span>

              {galleryCategories.map(
                (name) => (
                  <button
                    key={name}
                    type="button"
                    className={`chip ${
                      galleryCategory === name
                        ? 'chip-active'
                        : ''
                    }`}
                    onClick={() =>
                      setGalleryCategory(name)
                    }
                    aria-pressed={
                      galleryCategory === name
                    }
                  >
                    {name}
                  </button>
                ),
              )}

              {(galleryCategory !== ALL ||
                gallerySearch) && (
                <button
                  type="button"
                  className="chip chip-clear"
                  onClick={
                    resetGalleryFilters
                  }
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {galleryLoading && (
            <SkeletonGrid count={6} />
          )}

          {!galleryLoading &&
            galleryError && (
              <ErrorState
                title="Could not load gallery"
                message="The gallery API could not be reached."
                onRetry={retryGallery}
              />
            )}

          {!galleryLoading &&
            !galleryError &&
            visibleGalleryImages.length ===
              0 && (
              <EmptyState
                title="No gallery images found"
                message="Try another category or search."
              />
            )}

          {!galleryLoading &&
            !galleryError &&
            visibleGalleryImages.length >
              0 && (
              <div className="gallery-grid">

                {visibleGalleryImages.map(
                  (image, index) => (
                    <motion.button
                      key={
                        image.id ??
                        `${image.image_url ?? image.url}-${index}`
                      }
                      type="button"
                      className="gallery-thumb"
                      onClick={() =>
                        setLightboxIndex(index)
                      }
                      aria-label={`Open image: ${
                        image.title ??
                        image.event_name ??
                        'Event image'
                      }`}
                      initial={{
                        opacity: 0,
                        scale: 0.94,
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                      }}
                      viewport={{
                        once: true,
                        margin:
                          '0px 0px -40px 0px',
                      }}
                      transition={{
                        duration: 0.35,
                        delay:
                          (index % 6) * 0.05,
                      }}
                      whileHover={{
                        y: -4,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                    >
                      <SmartImage
                        src={
                          image.image_url ??
                          image.url ??
                          image.src
                        }
                        alt={
                          image.title ??
                          image.event_name ??
                          'Event image'
                        }
                        ratio="4 / 3"
                      />
                    </motion.button>
                  ),
                )}

              </div>
            )}

        </div>
      </section>

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() =>
          setLightboxIndex(null)
        }
        onPrev={() =>
          setLightboxIndex((i) =>
            i === null
              ? null
              : (i -
                  1 +
                  lightboxImages.length) %
                lightboxImages.length,
          )
        }
        onNext={() =>
          setLightboxIndex((i) =>
            i === null
              ? null
              : (i + 1) %
                lightboxImages.length,
          )
        }
      />
    </>
  )
}