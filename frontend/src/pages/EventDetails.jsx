import { motion } from 'framer-motion'
import { FiCalendar, FiCheck, FiMapPin, FiUsers } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'

import EventCard from '../components/EventCard'
import ScrollReveal from '../components/ScrollReveal'
import SmartImage from '../components/SmartImage'
import { ErrorState, SkeletonGrid } from '../components/States'
import useToast from '../components/useToast'
import useFetch from '../hooks/useFetch'
import formatPrice from '../utils/formatPrice'

// Photos shown in the gallery. All are local files, so nothing can 404.
const GALLERY = [
  { src: '/images/gallery/mandap.svg', alt: 'Decorated stage' },
  { src: '/images/gallery/reception-hall.svg', alt: 'Reception hall' },
  { src: '/images/gallery/keynote.svg', alt: 'Keynote stage' },
  { src: '/images/gallery/conference-seating.svg', alt: 'Conference seating' },
  { src: '/images/gallery/cake.svg', alt: 'Celebration cake' },
  { src: '/images/gallery/stage-lights.svg', alt: 'Stage lighting' },
]

export default function EventDetails() {
  const { id } = useParams()
  const toast = useToast()

  const { data: event, error, loading, refetch } = useFetch(`/api/events/${id}`)
  const { data: relatedData } = useFetch(`/api/events/${id}/related`)

  const related = (relatedData ?? []).filter((e) => e.id !== Number(id)).slice(0, 3)

  if (loading) {
    return (
      <section className="section container">
        <SkeletonGrid count={3} />
      </section>
    )
  }

  if (error) {
    return (
      <section className="section container">
        <ErrorState
          title={error.response?.status === 404 ? 'Event not found' : 'Could not load this event'}
          message={
            error.response?.status === 404
              ? `There is no event with id ${id}. It may have been removed.`
              : 'Something went wrong talking to the API.'
          }
          onRetry={() => {
            refetch()
            toast.info('Retrying…')
          }}
        />

        <p className="text-center">
          <Link to="/events" className="btn btn-ghost">
            Back to events
          </Link>
        </p>
      </section>
    )
  }

  if (!event) return null

  const eventDate = new Date(event.date)

  // The API stores inclusions one per line.
  const inclusions = (event.inclusions ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <>
      <section className="detail-hero">
        <div className="container">
          <Link to="/events" className="detail-back">
            &larr; All events
          </Link>

          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {event.category}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
          >
            {event.title}
          </motion.h1>

          <div className="detail-meta">
            <span>
              <FiCalendar aria-hidden="true" />
              {eventDate.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span>
              <FiMapPin aria-hidden="true" />
              {event.location}
            </span>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container detail-layout">
          {/* Main column ------------------------------------------------ */}
          <div className="detail-main">
            <SmartImage
              src={event.image_url}
              alt={event.title}
              ratio="16 / 9"
              className="detail-cover"
              eager
            />

            <ScrollReveal>
              <div className="detail-section">
                <h2>About this event</h2>
                <p className="text-muted detail-description">{event.description}</p>
              </div>
            </ScrollReveal>

            {inclusions.length > 0 && (
              <ScrollReveal>
                <div className="detail-section">
                  <h2>What&rsquo;s included</h2>
                  <ul className="inclusions">
                    {inclusions.map((item) => (
                      <li key={item}>
                        <FiCheck aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <div className="detail-section">
                <h2>Photos</h2>
                <div className="detail-gallery">
                  {GALLERY.map((image) => (
                    <div key={image.src} className="detail-gallery-item">
                      <SmartImage src={image.src} alt={image.alt} ratio="4 / 3" />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Sticky booking card --------------------------------------- */}
          <aside className="detail-aside">
            <div className="booking-card">
              <p className="booking-card-label">Package price</p>
              <p className="booking-card-price">{formatPrice(event.price)}</p>

              <ul className="booking-card-meta">
                <li>
                  <FiUsers aria-hidden="true" />
                  <span>From 50 guests</span>
                </li>
                <li>
                  <FiCalendar aria-hidden="true" />
                  <span>
                    {eventDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </li>
                <li>
                  <FiMapPin aria-hidden="true" />
                  <span>{event.location}</span>
                </li>
              </ul>

              {/* Carries the event id so the booking form can prefill it. */}
              <Link to={`/booking?event=${event.id}`} className="btn btn-primary btn-block">
                Book This Event
              </Link>

              <p className="text-subtle booking-card-note">
                No payment now. We reply within 24 hours with a detailed quote.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-sm">
          <div className="container">
            <ScrollReveal>
              <div className="section-head">
                <p className="eyebrow">More like this</p>
                <h2>Related events</h2>
              </div>
            </ScrollReveal>

            <div className="event-grid">
              {related.map((item, i) => (
                <EventCard key={item.id} event={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}