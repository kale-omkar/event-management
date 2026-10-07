import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'
import { useCallback, useEffect, useState } from 'react'

const TESTIMONIALS = [
  {
    quote:
      'They planned our three-day wedding end to end. Every detail was handled and the family could actually enjoy it.',
    name: 'Priya Sharma',
    role: 'Grand Wedding, Mumbai',
  },
  {
    quote:
      'Our 300-person summit ran to the minute. The AV and stage setup were flawless and the team was on call throughout.',
    name: 'Rahul Menon',
    role: 'Head of Events, Bengaluru',
  },
  {
    quote:
      'The 50th birthday dinner for my father was beautifully done. Warm, thoughtful and completely stress-free.',
    name: 'Anita Desai',
    role: 'Birthday Gala',
  },
  {
    quote:
      'Booking was simple, the quote was transparent, and the festival pass arrangement could not have been easier.',
    name: 'Karthik Iyer',
    role: 'Music Festival, Chennai',
  },
]

const INTERVAL = 6000

export default function TestimonialsSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()

  const go = useCallback((step) => {
    setIndex((current) => (current + step + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  useEffect(() => {
    if (paused || reduceMotion) return undefined
    const timer = setInterval(() => go(1), INTERVAL)
    return () => clearInterval(timer)
  }, [paused, reduceMotion, go])

  const current = TESTIMONIALS[index]

  return (
    <div
      className="testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="sr-only" aria-live="polite">
        Testimonial {index + 1} of {TESTIMONIALS.length}
      </span>

      <button
        type="button"
        className="slider-arrow slider-prev"
        onClick={() => go(-1)}
        aria-label="Previous testimonial"
      >
        <FiChevronLeft />
      </button>

      <div className="testimonial-viewport">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            className="testimonial"
            initial={reduceMotion ? false : { opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -32 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="testimonial-stars" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, i) => (
                <FiStar key={i} aria-hidden="true" />
              ))}
            </div>

            <p className="testimonial-quote">&ldquo;{current.quote}&rdquo;</p>

            <footer className="testimonial-author">
              <p className="testimonial-name">{current.name}</p>
              <p className="testimonial-role">{current.role}</p>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <button
        type="button"
        className="slider-arrow slider-next"
        onClick={() => go(1)}
        aria-label="Next testimonial"
      >
        <FiChevronRight />
      </button>

      <div className="slider-dots">
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.name}
            type="button"
            className={`slider-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </div>
  )
}