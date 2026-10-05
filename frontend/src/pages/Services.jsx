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

const SERVICES = [
  {
    title: 'Wedding Planning',
    image: '/images/services/wedding-planning.svg',
    price: 150000,
    Icon: FiHeart,
    text: 'Mehndi, sangeet, ceremony and reception planned end to end, with vendor coordination on the day.',
    points: ['Venue sourcing', 'Decor & florals', 'Guest management'],
  },
  {
    title: 'Corporate Events',
    image: '/images/services/corporate-events.svg',
    price: 75000,
    Icon: FiUsers,
    text: 'Conferences, kickoffs and award nights with AV, staging and a run-sheet your team can rely on.',
    points: ['AV & staging', 'Registration desk', 'Catering for large groups'],
  },
  {
    title: 'Birthday Parties',
    image: '/images/services/birthday-parties.svg',
    price: 25000,
    Icon: FiCalendar,
    text: 'Milestone birthdays and children’s parties, with themed decor, games and a cake of your choice.',
    points: ['Theme decor', 'Games & entertainment', 'Custom cakes'],
  },
  {
    title: 'Live Music & Concerts',
    image: '/images/services/live-music.svg',
    price: 9999,
    Icon: FiMusic,
    text: 'Artist booking, sound and lighting for concerts, festivals and private performances.',
    points: ['Artist booking', 'Sound & lighting', 'Crowd management'],
  },
  {
    title: 'Catering & Decor',
    image: '/images/services/catering-decor.svg',
    price: 40000,
    Icon: FiStar,
    text: 'Menus for every budget, from buffet to plated, paired with themed decor and floral design.',
    points: ['Custom menus', 'Themed decor', 'Live counters'],
  },
  {
    title: 'Photo & Video',
    image: '/images/services/photo-video.svg',
    price: 35000,
    Icon: FiCamera,
    text: 'Candid photography, highlight films and same-day edits delivered after your event.',
    points: ['Candid photography', 'Highlight films', 'Same-day edits'],
  },
]

const PROMISES = [
  { Icon: FiShield, title: 'Transparent pricing', text: 'Quotes in Rupees with no hidden charges.' },
  { Icon: FiCalendar, title: 'On-time delivery', text: 'Run-sheets we actually stick to.' },
  { Icon: FiStar, title: 'Quality first', text: 'Vetted vendors and quality checks on the day.' },
]

export default function Services() {
  return (
    <>
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

      <section className="section-sm">
        <div className="container">
          <div className="service-grid service-grid-lg">
            {SERVICES.map((service, index) => {
              const { Icon } = service

              return (
                <ScrollReveal key={service.title} delay={index * 0.07}>
                  <motion.article
                    className="card card-hover service-card"
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  >
                    <div className="service-card-media">
                      <SmartImage
                        src={service.image}
                        alt={service.title}
                        ratio="16 / 9"
                        eager={index < 3}
                      />

                      <span className="service-card-icon" aria-hidden="true">
                        <Icon />
                      </span>
                    </div>

                    <div className="service-card-body">
                      <h3>{service.title}</h3>
                      <p className="text-muted">{service.text}</p>

                      <ul className="service-points">
                        {service.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>

                      <div className="service-card-foot">
                        <p className="service-card-price">
                          From <strong>{formatPrice(service.price)}</strong>
                        </p>

                        <Link
                          to={`/booking?service=${encodeURIComponent(service.title)}`}
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
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <ScrollReveal>
            <div className="promise-grid">
              {PROMISES.map(({ Icon, title, text }) => (
                <div key={title} className="promise">
                  <span className="promise-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{title}</h3>
                  <p className="text-muted">{text}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}