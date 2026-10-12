import { AnimatePresence, motion } from 'framer-motion'
import { FiLogIn, FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  const [lastPath, setLastPath] = useState(location.pathname)
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname)
    if (menuOpen) setMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Link to="/" className="navbar-brand">
            <img src="/images/logo.svg" alt="" className="navbar-logo" width="38" height="38" />
            <span>
              Event<span className="navbar-brand-accent">Nest</span>
            </span>
          </Link>

          <nav className="navbar-links" aria-label="Main">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <div className="navbar-user-menu">
                <div className="navbar-user-pill" title={user?.email || 'Logged in'}>
                  <span className="navbar-avatar">
                    {user?.full_name ? user.full_name.trim().charAt(0).toUpperCase() : 'U'}
                  </span>
                  <span className="navbar-user-name">
                    {user?.full_name ? user.full_name.split(' ')[0] : 'Account'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="btn btn-ghost btn-sm navbar-logout-btn"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <FiLogOut />
                  <span className="navbar-logout-text">Logout</span>
                </button>
              </div>
            ) : (
              <div className="navbar-auth-links">
                <Link to="/login" className="btn btn-ghost btn-sm navbar-login-btn">
                  <FiLogIn className="navbar-btn-icon" />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="btn btn-outline btn-sm navbar-signup-btn">
                  Sign Up
                </Link>
              </div>
            )}

            <Link to="/booking" className="btn btn-primary btn-sm navbar-cta">
              Book Now
            </Link>

            <button
              type="button"
              className="navbar-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <motion.span
                animate={{ rotate: menuOpen ? 90 : 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="navbar-toggle-icon"
              >
                {menuOpen ? <FiX /> : <FiMenu />}
              </motion.span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.nav
              id="mobile-drawer"
              className="drawer"
              aria-label="Mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="drawer-header">
                <p className="drawer-title">Menu</p>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="drawer-close"
                  aria-label="Close menu"
                >
                  <FiX />
                </button>
              </div>

              {isAuthenticated ? (
                <div className="drawer-user-card">
                  <div className="drawer-avatar">
                    {user?.full_name ? user.full_name.trim().charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="drawer-user-meta">
                    <p className="drawer-user-fullname">{user?.full_name}</p>
                    <p className="drawer-user-email">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="drawer-auth-buttons">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-outline btn-block"
                  >
                    <FiLogIn style={{ marginRight: 8 }} /> Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-primary btn-block"
                  >
                    Create Account
                  </Link>
                </div>
              )}

              <div className="drawer-links-list">
                {LINKS.map(({ to, label }, index) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + index * 0.05, duration: 0.25 }}
                  >
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
                    >
                      {label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <div className="drawer-footer-actions">
                <Link to="/booking" className="btn btn-primary btn-block drawer-cta">
                  Book Now
                </Link>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                    className="btn btn-ghost btn-block drawer-logout-btn"
                  >
                    <FiLogOut style={{ marginRight: 8 }} /> Sign Out
                  </button>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}