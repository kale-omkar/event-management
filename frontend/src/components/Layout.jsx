import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import BackToTop from './BackToTop'
import Footer from './Footer'
import Navbar from './Navbar'
import { ToastProvider } from './ToastProvider'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])

  return null
}

export default function Layout() {
  const location = useLocation()

  return (
    <ToastProvider>
      <ScrollToTop />

      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div className="app-shell">
        <Navbar />

        <main id="main" className="app-main">
          <div key={location.pathname} className="page-transition">
            <Outlet />
          </div>
        </main>

        <Footer />
        <BackToTop />
      </div>
    </ToastProvider>
  )
}