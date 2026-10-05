import { FiFacebook, FiInstagram, FiLinkedin, FiMail, FiMapPin, FiPhone, FiTwitter } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/services', label: 'Services' },
      { to: '/events', label: 'Events' },
    ],
  },
  {
    title: 'Get Started',
    links: [
      { to: '/booking', label: 'Book an Event' },
      { to: '/contact', label: 'Contact Us' },
    ],
  },
]

const SOCIALS = [
  { href: 'https://instagram.com', label: 'Instagram', Icon: FiInstagram },
  { href: 'https://facebook.com', label: 'Facebook', Icon: FiFacebook },
  { href: 'https://twitter.com', label: 'Twitter', Icon: FiTwitter },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: FiLinkedin },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/images/logo.svg" alt="" width="36" height="36" />
              <span>EventNest</span>
            </Link>
            <p className="footer-blurb">
              Planning weddings, corporate events, birthdays and concerts across India.
              Tell us the occasion, we handle the rest.
            </p>

            <ul className="footer-contact">
              <li>
                <FiMapPin aria-hidden="true" />
                <span>42 Residency Road, Bengaluru 560025</span>
              </li>
              <li>
                <FiPhone aria-hidden="true" />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li>
                <FiMail aria-hidden="true" />
                <a href="mailto:hello@eventnest.example">hello@eventnest.example</a>
              </li>
            </ul>
          </div>

          {COLUMNS.map(({ title, links }) => (
            <nav key={title} className="footer-col" aria-label={title}>
              <h4 className="footer-col-title">{title}</h4>
              <ul>
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer-col">
            <h4 className="footer-col-title">Follow</h4>
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
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} EventNest. Built by the Event Management team.
          </p>
          <p>All prices in Indian Rupees (INR).</p>
        </div>
      </div>
    </footer>
  )
}