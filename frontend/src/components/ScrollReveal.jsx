import { motion, useReducedMotion } from 'framer-motion'

export default function ScrollReveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.6,
  once = true,
  as = 'div',
  className = '',
}) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as] ?? motion.div

  if (reduceMotion) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -80px 0px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}