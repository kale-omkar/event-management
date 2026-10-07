import { motion } from 'framer-motion'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import SmartImage from './SmartImage'
import formatPrice from '../utils/formatPrice'

export default function EventCard({ event, index = 0, showCategory = true }) {
  const eventDate = new Date(event.date)

  return (
    <motion.article
      className="card card-hover event-card"

      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.36), ease: [0.16, 1, 0.3, 1] }}
      layout
    >
      <Link to={`/events/${event.id}`} className="event-card-link">
        <div className="event-card-media">
          <SmartImage
            src={event.image_url}
            alt={event.title}
            ratio="16 / 10"
            className="event-card-image"
          />

          {showCategory && (
            <span className="event-card-badge">{event.category}</span>
          )}
        </div>

        <div className="event-card-body">
          <h3 className="event-card-title">{event.title}</h3>

          <p className="event-card-meta">
            <FiCalendar aria-hidden="true" />
            <span>
              {eventDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </p>

          <p className="event-card-meta">
            <FiMapPin aria-hidden="true" />
            <span>{event.location}</span>
          </p>

          <p className="event-card-price">{formatPrice(event.price)}</p>
        </div>
      </Link>
    </motion.article>
  )
}