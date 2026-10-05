import { useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/**
 * Counts up to `value` when it scrolls into view.
 *
 * Only transform-free text changes are animated (no layout thrash), and the
 * counter is skipped when the user prefers reduced motion.
 */
export default function StatsCounter({ value, suffix = '', label, duration = 1600 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(0)

  // The animated path only runs when motion is welcome and the stat is on
  // screen, so the plain value is simply rendered otherwise.
  const shouldAnimate = inView && !reduceMotion

  useEffect(() => {
    if (!shouldAnimate) return undefined

    let frame
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      // easeOutExpo, so it decelerates towards the target instead of stopping abruptly.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [shouldAnimate, value, duration])

  const display = shouldAnimate ? count : value

  return (
    <div ref={ref} className="stat">
      <p className="stat-value">
        {display.toLocaleString('en-IN')}
        {suffix}
      </p>
      <p className="stat-label">{label}</p>
    </div>
  )
}