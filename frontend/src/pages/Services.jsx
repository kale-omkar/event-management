import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiCalendar,
  FiCamera,
  FiHeart,
  FiMusic,
  FiShield,
  FiStar,
  FiUsers,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'

import ScrollReveal from '../components/ScrollReveal'
import SmartImage from '../components/SmartImage'
import formatPrice from '../utils/formatPrice'
import api from '../services/api'

const SERVICE_META = {
  'Wedding Planning': {
    price: 150000,
    Icon: FiHeart,
    points: ['Venue sourcing', 'Decor & florals', 'Guest management'],
  },

  'Corporate Events': {
    price: 75000,
    Icon: FiUsers,
    points: ['AV & staging', 'Registration desk', 'Catering for large groups'],
  },

  'Birthday Parties': {
    price: 25000,
    Icon: FiCalendar,
    points: ['Theme decor', 'Games & entertainment', 'Custom cakes'],
  },

  'Live Music & Concerts': {
    price: 9999,
    Icon: FiMusic,
    points: ['Artist booking', 'Sound & lighting', 'Crowd management'],
  },

  'Catering & Decor': {
    price: 40000,
    Icon: FiStar,
    points: ['Custom menus', 'Themed decor', 'Live counters'],
  },

  'Photo & Video': {
    price: 35000,
    Icon: FiCamera,
    points: ['Candid photography', 'Highlight films', 'Same-day edits'],
  },
}

const PROMISES = [
  {
    Icon: FiShield,
    title: 'Transparent pricing',
    text: 'Quotes in Rupees with no hidden charges.',
  },
  {
    Icon: FiCalendar,
    title: 'On-time delivery',
    text: 'Run-sheets we actually stick to.',
  },
  {
    Icon: FiStar,
    title: 'Quality first',
    text: 'Vetted vendors and quality checks on the day.',
  },
]

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/api/services')

        setServices(response.data)
      } catch (err) {
        console.error('Failed to load services:', err)
        setError(
          'Unable to load services right now. Please try again later.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">What we offer</p>

          <h1>Services</h1>

          <p className="page-hero-lede">
            Pick a package as a starting point. Every quote is tailored after a
            short call about your date, venue and guest count.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-sm">
        <div className="container">

          {/* Loading */}
          {loading && (
            <div className="text-center">
              <p>Loading services...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center">
              <p className="text-muted">{error}</p>
            </div>
          )}

          {/* No Services */}
          {!loading && !error && services.length === 0 && (
            <div className="text-center">
              <p className="text-muted">
                No services are available at the moment.
              </p>
            </div>
          )}

          {/* Service Cards */}
          {!loading && !error && services.length > 0 && (
            <div className="service-grid service-grid-lg">
              {services.map((service, index) => {
                const meta = SERVICE_META[service.name]

                const Icon = meta?.Icon || FiStar
                const price = meta?.price
                const points = meta?.points || []

                return (
                  <ScrollReveal
                    key={service.id}
                    delay={index * 0.07}
                  >
                    <motion.article
                      className="card card-hover service-card"
                      whileHover={{ y: -6 }}
                      transition={{
                        type: 'spring',
                        stiffness: 320,
                        damping: 24,
                      }}
                    >

                      {/* Image */}
                      <div className="service-card-media">
                        <SmartImage
                          src={service.image_url}
                          alt={service.name}
                          ratio="16 / 9"
                          eager={index < 3}
                        />

                        <span
                          className="service-card-icon"
                          aria-hidden="true"
                        >
                          <Icon />
                        </span>
                      </div>

                      {/* Content */}
                      <div className="service-card-body">

                        <h3>{service.name}</h3>

                        <p className="text-muted">
                          {service.description}
                        </p>

                        {/* Points */}
                        {points.length > 0 && (
                          <ul className="service-points">
                            {points.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        )}

                        {/* Price + Enquire */}
                        <div className="service-card-foot">

                          {price !== undefined && (
                            <p className="service-card-price">
                              From{' '}
                              <strong>
                                {formatPrice(price)}
                              </strong>
                            </p>
                          )}

                          <Link
                            to={`/booking?service=${encodeURIComponent(
                              service.name
                            )}`}
                            className="btn btn-outline btn-sm"
                          >
                            Enquire
                          </Link>

                        </div>
                      </div>
                    </motion.article>
                  </ScrollReveal>
                )
              })}
            </div>
          )}

        </div>
      </section>

      {/* Promises Section */}
      <section className="section-sm">
        <div className="container">
          <ScrollReveal>
            <div className="promise-grid">

              {PROMISES.map(({ Icon, title, text }) => (
                <div
                  key={title}
                  className="promise"
                >
                  <span
                    className="promise-icon"
                    aria-hidden="true"
                  >
                    <Icon />
                  </span>

                  <h3>{title}</h3>

                  <p className="text-muted">
                    {text}
                  </p>
                </div>
              ))}

            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}