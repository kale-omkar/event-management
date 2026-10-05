import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { Suspense, useEffect } from 'react'

import BackToTop from './BackToTop'
import Footer from './Footer'
import Navbar from './Navbar'
import { ToastProvider } from './ToastProvider'

/** Jumps to the top of the page whenever the route changes. */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])

  return null
}

/** Thin progress bar shown while a lazy route chunk is loading. */
function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="route-fallback-bar">
        <div className="route-fallback-fill" />
      </div>
    </div>
  )
}

/**
 * Shell shared by every page: sticky navbar, animated page area, footer.
 * Rendered once as the parent route so the chrome never re-mounts.
 */
export default function Layout() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    <ToastProvider>
      <ScrollToTop />

      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div className="app-shell">
        <Navbar />

        <main id="main" className="app-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              // Re-mount on path change so the enter animation replays.
              key={location.pathname}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Suspense fallback={<RouteFallback />}>
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
        <BackToTop />
      </div>
    </ToastProvider>
  )
}