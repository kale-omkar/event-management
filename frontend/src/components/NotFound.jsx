import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section container">
      <motion.div
        className="notfound"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src="/images/placeholder.svg"
          alt=""
          className="notfound-image"
          width="160"
          height="107"
        />

        <p className="notfound-code">404</p>
        <h1>Page not found</h1>
        <p className="text-muted">
          The page you are looking for has moved or never existed.
        </p>

        <div className="row notfound-actions">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link to="/events" className="btn btn-ghost">
            Browse Events
          </Link>
        </div>
      </motion.div>
    </section>
  )
}