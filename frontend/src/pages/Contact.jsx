import { motion } from 'framer-motion'
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter,
} from 'react-icons/fi'
import { useState } from 'react'

import useToast from '../components/useToast'
import api from '../services/api'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NAME_RE = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/

const EMPTY = { name: '', email: '', subject: '', message: '' }

function validate(field, value) {
  const v = value.trim()

  if (field === 'name') {
  if (!v) return 'Please enter your name'
  if (v.length < 2) return 'Name must be at least 2 characters'
  if (!NAME_RE.test(v)) return 'Please enter a valid name'
  return ''
}

  if (field === 'email') {
    if (!v) return 'Please enter your email'
    if (!EMAIL_RE.test(v)) return 'Enter a valid email address'
    return ''
  }

  if (field === 'subject') return '' // optional

  if (field === 'message') {
    if (!v) return 'Please enter your message'
    if (v.length < 10) return 'Message must be at least 10 characters'
    if (v.length > 5000) return 'Message is too long'
    return ''
  }

  return ''
}

const CHANNELS = [
  {
    Icon: FiPhone,
    title: 'Call us',
    lines: ['+91 98765 43210', '+91 80 4123 5566'],
    href: 'tel:+919876543210',
  },
  {
    Icon: FiMail,
    title: 'Email us',
    lines: ['hello@eventnest.example', 'bookings@eventnest.example'],
    href: 'mailto:hello@eventnest.example',
  },
  {
    Icon: FiMapPin,
    title: 'Visit us',
    lines: ['42 Residency Road', 'Bengaluru 560025'],
  },
  {
    Icon: FiClock,
    title: 'Office hours',
    lines: ['Mon - Sat, 9:30 AM - 7:00 PM', 'Sunday by appointment'],
  },
]

const SOCIALS = [
  { href: 'https://instagram.com', label: 'Instagram', Icon: FiInstagram },
  { href: 'https://facebook.com', label: 'Facebook', Icon: FiFacebook },
  { href: 'https://twitter.com', label: 'Twitter', Icon: FiTwitter },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: FiLinkedin },
]

export default function Contact() {
  const toast = useToast()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [sent, setSent] = useState(false)

  const handleChange = (field) => (e) => {
    const { value } = e.target
    setValues((current) => ({ ...current, [field]: value }))
    if (touched[field]) {
      setErrors((current) => ({ ...current, [field]: validate(field, value) }))
    }
  }

  const handleBlur = (field) => () => {
    setTouched((current) => ({ ...current, [field]: true }))
    setErrors((current) => ({ ...current, [field]: validate(field, values[field]) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const found = {}
    Object.keys(EMPTY).forEach((field) => {
      const message = validate(field, values[field])
      if (message) found[field] = message
    })
    setErrors(found)
    setTouched(Object.keys(EMPTY).reduce((acc, k) => ({ ...acc, [k]: true }), {}))

    if (Object.keys(found).length > 0) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus()
      return
    }

    setSubmitting(true)

    try {
      await api.post('/api/contact', {
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim() || null,
        message: values.message.trim(),
      })

      setSent(true)
      toast.success('Message sent. We will get back to you shortly.')
      setValues(EMPTY)
      setTouched({})
      setErrors({})
    } catch (err) {
      const detail = err.response?.data?.detail
      const message =
        typeof detail === 'string'
          ? detail
          : 'Could not send your message. Please try again.'
      setSubmitError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Say hello</p>
          <h1>Contact us</h1>
          <p className="page-hero-lede">
            Questions about a package, a date, or a custom plan? Send a message and
            a planner will reply within one working day.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container contact-layout">
          {/* Form ---------------------------------------------------------- */}
          <div>
            {sent && (
              <motion.div
                className="alert alert-info contact-sent"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FiCheckCircle aria-hidden="true" />
                <span>
                  Thanks for getting in touch. We have your message and will reply
                  shortly.
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSent(false)}
                >
                  Send another
                </button>
              </motion.div>
            )}

            {submitError && (
              <div className="alert alert-error" role="alert">
                <FiAlertCircle aria-hidden="true" />
                <span>{submitError}</span>
              </div>
            )}

            <form className="stack stack-6" onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="contact-name" className="label">
                    Full name<span className="required">*</span>
                  </label>
                  <input
                    id="contact-name"
                    className="input"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={handleChange('name')}
                    onBlur={handleBlur('name')}
                    aria-invalid={Boolean(touched.name && errors.name)}
                  />
                  {touched.name && errors.name && (
                    <p className="field-error">
                      <FiAlertCircle aria-hidden="true" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="contact-email" className="label">
                    Email<span className="required">*</span>
                  </label>
                  <input
                    id="contact-email"
                    className="input"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                    aria-invalid={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <p className="field-error">
                      <FiAlertCircle aria-hidden="true" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="field">
                <label htmlFor="contact-subject" className="label">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  className="input"
                  type="text"
                  placeholder="Wedding enquiry for December"
                  value={values.subject}
                  onChange={handleChange('subject')}
                  onBlur={handleBlur('subject')}
                  maxLength={255}
                />
                <p className="field-hint">Optional.</p>
              </div>

              <div className="field">
                <label htmlFor="contact-message" className="label">
                  Message<span className="required">*</span>
                </label>
                <textarea
                  id="contact-message"
                  className="textarea"
                  placeholder="Tell us about your occasion, date and guest count."
                  value={values.message}
                  onChange={handleChange('message')}
                  onBlur={handleBlur('message')}
                  aria-invalid={Boolean(touched.message && errors.message)}
                />
                {touched.message && errors.message && (
                  <p className="field-error">
                    <FiAlertCircle aria-hidden="true" />
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                disabled={submitting}
              >
                {submitting && <span className="spinner" aria-hidden="true" />}
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact info + map -------------------------------------------- */}
          <aside className="contact-aside">
            <div className="contact-cards">
              {CHANNELS.map(({ Icon, title, lines, href }) => (
                <div key={title} className="card contact-card">
                  <span className="contact-card-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    {lines.map((line) => (
                      <p key={line} className="text-muted text-sm">
                        {href && !line.includes('@') ? (
                          <a href={href}>{line}</a>
                        ) : line.includes('@') ? (
                          <a href={`mailto:${line}`}>{line}</a>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder: an embedded map would need an API key, so this
                is a styled, accessible stand-in that links to the location. */}
            <div className="map-placeholder">
              <FiMapPin aria-hidden="true" className="map-pin" />
              <p className="map-title">Our studio</p>
              <p className="text-muted text-sm">42 Residency Road, Bengaluru 560025</p>
              <a
                className="btn btn-ghost btn-sm"
                href="https://maps.google.com/?q=Residency+Road+Bengaluru"
                target="_blank"
                rel="noreferrer noopener"
              >
                Open in Maps
              </a>
            </div>

            <div className="card contact-card">
              <h3>Follow us</h3>
              <div className="footer-socials">
                {SOCIALS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    className="footer-social"
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <Icon aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}