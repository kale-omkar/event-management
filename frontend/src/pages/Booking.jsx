import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertCircle, FiCalendar, FiCheckCircle, FiInfo } from 'react-icons/fi'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import api from '../services/api'
import useToast from '../components/useToast'
import { resolveImageUrl } from '../services/images'
import SmartImage from '../components/SmartImage'
import useFetch from '../hooks/useFetch'
import formatPrice from '../utils/formatPrice'

const EVENT_TYPES = ['Wedding', 'Corporate', 'Birthday', 'Concert', 'Other']

// Matches the server-side rule: 10 digits starting 6-9, optional +91.
const PHONE_RE = /^(?:\+?91[- ]?)?[6-9]\d{9}$/
// Deliberately simple; the server validates the real thing with EmailStr.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NAME_RE = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  event_type: 'Wedding',
  event_date: '',
  guests: '',
  message: '',
}

/** Today's date as YYYY-MM-DD, for the `min` attribute on a date input. */
function today() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

/**
 * Validate a single field.
 * @returns {string} error message, or '' when valid
 */
function validate(field, values) {
  const value = (values[field] ?? '').toString().trim()

  switch (field) {
    case 'name':
      if (!value) return 'Please enter your name'
      if (value.length < 2) return 'Name must be at least 2 characters'
      if (!NAME_RE.test(value)) return 'Please enter a valid name'
      return ''

    case 'email':
      if (!value) return 'Please enter your email'
      if (!EMAIL_RE.test(value)) return 'Enter a valid email address'
      return ''

    case 'phone':
      if (!value) return 'Please enter your phone number'
      if (!PHONE_RE.test(value.replace(/[\s-]/g, ''))) {
        return 'Enter a valid 10-digit Indian mobile number'
      }
      return ''

    case 'event_type':
      return value ? '' : 'Please choose an event type'

    case 'event_date': {
      if (!value) return 'Please choose an event date'
      if (value < today()) return 'Event date must be today or in the future'
      return ''
    }

    case 'guests': {
      const n = Number(value)
      if (!value) return 'Please enter the number of guests'
      if (!Number.isInteger(n) || n < 1) return 'Guests must be at least 1'
      if (n > 1000) return 'For more than 1000 guests please contact us directly'
      return ''
    }

    case 'message':
      // Message is optional.
      return ''

    default:
      return ''
  }
}

export default function Booking() {
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('event')

  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  // Track which fields have been blurred so errors appear at the right time.
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [receipt, setReceipt] = useState(null)

  // Fetch the chosen event so the form can show what it is booking.
  const { data: selectedEvent } = useFetch(
    eventId ? `/api/events/${eventId}` : null,
  )

  // The event type follows the selected event's category, unless the user has
  // explicitly picked one. Derived during render rather than synced by an
  // effect, so the select is correct on the very first paint.
  const typeFromEvent = useMemo(() => {
    const category = selectedEvent?.category
    if (!category) return null
    return (
      EVENT_TYPES.find((t) => t.toLowerCase() === category.toLowerCase()) ?? null
    )
  }, [selectedEvent?.category])

  const [userType, setUserType] = useState(null)
  const eventType = userType ?? typeFromEvent ?? values.event_type

  const minDate = useMemo(() => today(), [])

  const handleChange = (field) => (e) => {
    const { value } = e.target
    setValues((current) => ({ ...current, [field]: value }))

    // Re-validate live once a field has already shown an error.
    if (touched[field]) {
      setErrors((current) => ({ ...current, [field]: validate(field, { ...values, [field]: value }) }))
    }
  }

  const handleBlur = (field) => () => {
    setTouched((current) => ({ ...current, [field]: true }))
    setErrors((current) => ({ ...current, [field]: validate(field, values) }))
  }

  const validateAll = () => {
    const next = {}
    Object.keys(EMPTY).forEach((field) => {
      const message = validate(field, field === 'event_type' ? { ...values, event_type: eventType } : values)
      if (message) next[field] = message
    })
    setErrors(next)
    setTouched(Object.keys(EMPTY).reduce((acc, k) => ({ ...acc, [k]: true }), {}))
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const found = validateAll()
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem so keyboard users are not stranded.
      const first = Object.keys(found)[0]
      document.getElementById(`booking-${first}`)?.focus()
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        event_type: eventType,
        event_date: values.event_date,
        guests: Number(values.guests),
        message: values.message.trim() || null,
        ...(eventId ? { event_id: Number(eventId) } : {}),
      }

      const { data } = await api.post('/api/bookings', payload)
      setReceipt(data)
      toast.success('Booking request received!')
      setValues(EMPTY)
      setTouched({})
      setErrors({})
    } catch (err) {
      // Surface the server's own validation messages where we can.
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        const fieldErrors = {}
        for (const item of detail) {
          const field = item.loc?.at(-1)
          if (field && field in EMPTY) fieldErrors[field] = item.msg
        }
        if (Object.keys(fieldErrors).length > 0) {
          setErrors((current) => ({ ...current, ...fieldErrors }))
          toast.error('Please fix the highlighted fields.')
          setSubmitting(false)
          return
        }
      }

      const message =
        typeof detail === 'string'
          ? detail
          : 'Could not submit the booking. Please try again.'
      setSubmitError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Success screen replaces the form once a booking is stored.
  if (receipt) {
    return (
      <section className="section container">
        <motion.div
          className="success-panel"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="status"
        >
          <FiCheckCircle className="success-icon" aria-hidden="true" />

          <h1>Booking request received</h1>
          <p className="text-muted">
            Thank you, {receipt.name}. A planner will call {receipt.phone} within
            one working day with a detailed quote.
          </p>

          <dl className="summary">
            <div>
              <dt>Reference</dt>
              <dd>#{receipt.id}</dd>
            </div>
            <div>
              <dt>Event type</dt>
              <dd>{receipt.event_type}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{new Date(receipt.event_date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}</dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd>{receipt.guests}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd className="summary-badge">{receipt.status}</dd>
            </div>
          </dl>

          <div className="row success-actions">
            <Link to="/events" className="btn btn-ghost">
              Browse events
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setReceipt(null)}
            >
              Book another event
            </button>
          </div>
        </motion.div>
      </section>
    )
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Reserve a date</p>
          <h1>Book an event</h1>
          <p className="page-hero-lede">
            Tell us about your occasion. No payment is taken now &mdash; we reply
            with a detailed quote within 24 hours.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container booking-layout">
          {/* Form ---------------------------------------------------------- */}
          <div className="booking-form-wrap">
            <AnimatePresence>
              {submitError && (
                <motion.div
                  className="alert alert-error"
                  role="alert"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <FiAlertCircle aria-hidden="true" />
                  <span>{submitError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="stack stack-6" onSubmit={handleSubmit} noValidate>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Your details</legend>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="booking-name" className="label">
                      Full name<span className="required">*</span>
                    </label>
                    <input
                      id="booking-name"
                      name="name"
                      className="input"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={values.name}
                      onChange={handleChange('name')}
                      onBlur={handleBlur('name')}
                      aria-invalid={Boolean(touched.name && errors.name)}
                      aria-describedby={errors.name ? 'booking-name-error' : undefined}
                    />
                    {touched.name && errors.name && (
                      <p id="booking-name-error" className="field-error">
                        <FiAlertCircle aria-hidden="true" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="booking-email" className="label">
                      Email<span className="required">*</span>
                    </label>
                    <input
                      id="booking-email"
                      name="email"
                      className="input"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={handleChange('email')}
                      onBlur={handleBlur('email')}
                      aria-invalid={Boolean(touched.email && errors.email)}
                      aria-describedby={errors.email ? 'booking-email-error' : undefined}
                    />
                    {touched.email && errors.email && (
                      <p id="booking-email-error" className="field-error">
                        <FiAlertCircle aria-hidden="true" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="booking-phone" className="label">
                      Phone<span className="required">*</span>
                    </label>
                    <input
                      id="booking-phone"
                      name="phone"
                      className="input"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="98765 43210"
                      value={values.phone}
                      onChange={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                      aria-invalid={Boolean(touched.phone && errors.phone)}
                      aria-describedby={
                        errors.phone ? 'booking-phone-error' : 'booking-phone-hint'
                      }
                    />
                    {touched.phone && errors.phone ? (
                      <p id="booking-phone-error" className="field-error">
                        <FiAlertCircle aria-hidden="true" />
                        {errors.phone}
                      </p>
                    ) : (
                      <p id="booking-phone-hint" className="field-hint">
                        10-digit Indian mobile number.
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Event details</legend>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="booking-event_type" className="label">
                      Event type<span className="required">*</span>
                    </label>
                    <select
                      id="booking-event_type"
                      name="event_type"
                      className="select"
                      value={eventType}
                      onChange={(e) => {
                        setUserType(e.target.value)
                        setErrors((c) => ({ ...c, event_type: '' }))
                      }}
                      onBlur={handleBlur('event_type')}
                      aria-invalid={Boolean(touched.event_type && errors.event_type)}
                    >
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {touched.event_type && errors.event_type && (
                      <p className="field-error">
                        <FiAlertCircle aria-hidden="true" />
                        {errors.event_type}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="booking-event_date" className="label">
                      Event date<span className="required">*</span>
                    </label>
                    <input
                      id="booking-event_date"
                      name="event_date"
                      className="input"
                      type="date"
                      min={minDate}
                      value={values.event_date}
                      onChange={handleChange('event_date')}
                      onBlur={handleBlur('event_date')}
                      aria-invalid={Boolean(touched.event_date && errors.event_date)}
                    />
                    {touched.event_date && errors.event_date && (
                      <p className="field-error">
                        <FiAlertCircle aria-hidden="true" />
                        {errors.event_date}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="booking-guests" className="label">
                      Expected guests<span className="required">*</span>
                    </label>
                    <input
                      id="booking-guests"
                      name="guests"
                      className="input"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max="1000"
                      placeholder="e.g. 250"
                      value={values.guests}
                      onChange={handleChange('guests')}
                      onBlur={handleBlur('guests')}
                      aria-invalid={Boolean(touched.guests && errors.guests)}
                    />
                    {touched.guests && errors.guests && (
                      <p className="field-error">
                        <FiAlertCircle aria-hidden="true" />
                        {errors.guests}
                      </p>
                    )}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="booking-message" className="label">
                    Anything else we should know?
                  </label>
                  <textarea
                    id="booking-message"
                    name="message"
                    className="textarea"
                    placeholder="Venue preferences, themes, special requirements..."
                    value={values.message}
                    onChange={handleChange('message')}
                    onBlur={handleBlur('message')}
                    maxLength={2000}
                  />
                  <p className="field-hint">Optional. {values.message.length}/2000</p>
                </div>
              </fieldset>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                disabled={submitting}
              >
                {submitting && <span className="spinner" aria-hidden="true" />}
                {submitting ? 'Sending your request...' : 'Submit Booking Request'}
              </button>

              <p className="text-subtle text-center">
                We will never share your details. By submitting you agree to be
                contacted about this enquiry.
              </p>
            </form>
          </div>

          {/* Summary rail --------------------------------------------------- */}
          <aside className="booking-aside">
            <div className="booking-card">
              {selectedEvent ? (
                <>
                  <p className="booking-card-label">You are booking</p>

                  <SmartImage
                    src={resolveImageUrl(selectedEvent.image_url)}
                    alt={selectedEvent.title}
                    ratio="16 / 9"
                    className="booking-card-image"
                    eager
                  />

                  <h3 className="booking-card-title">{selectedEvent.title}</h3>

                  <ul className="booking-card-meta">
                    <li>
                      <FiCalendar aria-hidden="true" />
                      <span>
                        {new Date(selectedEvent.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </li>
                  </ul>

                  <p className="booking-card-price">
                    {formatPrice(selectedEvent.price)}
                  </p>

                  <Link to={`/events/${selectedEvent.id}`} className="detail-back">
                    View full details
                  </Link>
                </>
              ) : (
                <>
                  <span className="booking-card-icon" aria-hidden="true">
                    <FiInfo />
                  </span>
                  <h3 className="booking-card-title">No event selected</h3>
                  <p className="text-muted text-sm">
                    You are making a general enquiry. Browse the events page if you
                    want to book a specific package.
                  </p>
                  <Link to="/events" className="btn btn-outline btn-block btn-sm">
                    Browse events
                  </Link>
                </>
              )}

              <div className="booking-card-divider" />

              <p className="text-subtle">
                Prefer to talk? Call <a href="tel:+919876543210">+91 98765 43210</a>{' '}
                or <Link to="/contact">send us a message</Link>.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}