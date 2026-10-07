import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import EventCard from '../components/EventCard'
import StatsCounter from '../components/StatsCounter'
import SmartImage from '../components/SmartImage'
import TestimonialsSlider from '../components/TestimonialsSlider'
import ScrollReveal from '../components/ScrollReveal'
import useToast from '../components/useToast'
import useFetch from '../hooks/useFetch'
import formatPrice from '../utils/formatPrice'

const SERVICES = [
  {
    title: 'Wedding Planning',
    image: '/images/services/wedding-planning.svg',
    price: 150000,
    text: 'End-to-end planning across venues, decor and catering.',
  },
  {
    title: 'Corporate Events',
    image: '/images/services/corporate-events.svg',
    price: 75000,
    text: 'Conferences, kickoffs and award nights, run to the minute.',
  },
  {
    title: 'Birthday Parties',
    image: '/images/services/birthday-parties.svg',
    price: 25000,
    text: 'Milestone birthdays and kids parties, indoors or out.',
  },
]

const STATS = [
  { value: 480, suffix: '+', label: 'Events hosted' },
  { value: 320, suffix: '+', label: 'Happy clients' },
  { value: 12, suffix: '', label: 'Cities covered' },
  { value: 9, suffix: ' yrs', label: 'Experience' },
]

export default function Home() {
  const toast = useToast()

  const { data: health, error: healthError } = useFetch('/api/health')

  const {
    data: eventsData,
    error: eventsError,
    loading: eventsLoading,
    refetch: refetchEvents,
  } = useFetch('/api/events')

  const featured = eventsData?.events?.slice(0, 6) ?? []

  return (
    <>

      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          <SmartImage
            src="/images/hero/hero-main.svg"
            alt=""
            ratio="16 / 9"
            className="hero-image"
            eager
          />
          <div className="hero-overlay" />
        </div>

        <div className="container hero-content">
          <motion.p
            className="eyebrow hero-eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Weddings · Corporate · Birthdays · Concerts
          </motion.p>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Plan Unforgettable Events
          </motion.h1>

          <motion.p
            className="hero-lede"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            Tell us the occasion and we handle the venue, decor, catering and
            everything in between. Transparent pricing, in Rupees, no surprises.
          </motion.p>

          <motion.div
            className="row hero-actions"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/booking" className="btn btn-gold btn-lg">
              Book Now
            </Link>
            <Link to="/events" className="btn btn-outline btn-lg hero-btn-ghost">
              View Events
            </Link>
          </motion.div>

          <motion.p
            className="hero-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {healthError
              ? 'API offline — showing cached content'
              : `API ${health?.status ?? 'checking'}${health?.database ? ` · database ${health.database}` : ''}`}
          </motion.p>
        </div>
      </section>

      <section className="section-sm stats-band">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.08}>
                <StatsCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div className="section-head section-head-center">
              <p className="eyebrow">What we do</p>
              <h2>Services built around your occasion</h2>
              <p>
                Pick a starting package or tell us what you need and we will put a
                custom plan together.
              </p>
            </div>
          </ScrollReveal>

          <div className="service-grid">
            {SERVICES.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.1}>
                <article className="card card-hover service-card">
                  <SmartImage
                    src={service.image}
                    alt={service.title}
                    ratio="16 / 9"
                    className="service-card-image"
                  />
                  <div className="service-card-body">
                    <h3>{service.title}</h3>
                    <p className="text-muted">{service.text}</p>
                    <p className="service-card-price">
                      From <strong>{formatPrice(service.price)}</strong>
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center" delay={0.1}>
            <Link to="/services" className="btn btn-ghost">
              See all services
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div className="row-between section-head-row">
              <div className="section-head">
                <p className="eyebrow">Coming up</p>
                <h2>Featured events</h2>
                <p>A few of the occasions we are currently planning.</p>
              </div>

              <Link to="/events" className="btn btn-ghost">
                View all
              </Link>
            </div>
          </ScrollReveal>

          {eventsLoading && (
            <p className="text-muted" role="status">
              Loading events&hellip;
            </p>
          )}

          {!eventsLoading && eventsError && (
            <div className="alert alert-info">
              <span>
                Events are unavailable right now — the API or database is not
                reachable. You can still browse our services or send an enquiry.
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  refetchEvents()
                  toast.info('Retrying events…')
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!eventsLoading && !eventsError && featured.length === 0 && (
            <p className="text-muted">No events scheduled yet. Check back soon.</p>
          )}

          <div className="event-grid">
            {featured.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div className="section-head section-head-center">
              <p className="eyebrow">Kind words</p>
              <h2>What our clients say</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <TestimonialsSlider />
          </ScrollReveal>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <ScrollReveal>
            <div className="cta-banner">
              <div className="cta-banner-media" aria-hidden="true">
                <SmartImage
                  src="/images/hero/hero-secondary.svg"
                  alt=""
                  ratio="16 / 9"
                  className="cta-banner-image"
                  eager
                />
              </div>

              <div className="cta-banner-body">
                <h2>Let&rsquo;s plan something memorable</h2>
                <p>
                  Share your date, guest count and occasion, and we will send a
                  detailed quote within 24 hours.
                </p>

                <div className="row cta-banner-actions">
                  <Link to="/booking" className="btn btn-gold btn-lg">
                    Book Now
                  </Link>
                  <Link to="/contact" className="btn btn-ghost btn-lg">
                    Talk to us
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}