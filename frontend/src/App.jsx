import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { lazy } from 'react'

import Layout from './components/Layout'
import NotFound from './components/NotFound'

// Lazy-load each page so the initial bundle stays small. Layout is imported
// eagerly because it is needed on the very first paint.
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Events = lazy(() => import('./pages/Events'))
const EventDetails = lazy(() => import('./pages/EventDetails'))
const Booking = lazy(() => import('./pages/Booking'))
const Contact = lazy(() => import('./pages/Contact'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout is the parent route, so the navbar and footer stay mounted. */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="booking" element={<Booking />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}