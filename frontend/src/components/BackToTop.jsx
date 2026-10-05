import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowUp } from 'react-icons/fi'
import { useEffect, useState } from 'react'

/** Floating button that scrolls back to the top, shown after scrolling down. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
        >
          <FiArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  )
}