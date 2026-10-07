import { useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function StatsCounter({ value, suffix = '', label, duration = 1600 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(0)

  const shouldAnimate = inView && !reduceMotion

  useEffect(() => {
    if (!shouldAnimate) return undefined

    let frame
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)

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