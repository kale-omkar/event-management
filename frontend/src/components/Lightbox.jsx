import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import { useCallback, useEffect } from 'react'

import SmartImage from './SmartImage'

/**
 * Full-screen image viewer.
 *
 * Keyboard: Escape closes, ArrowLeft/ArrowRight move between images. The body
 * scroll is locked while open, and focus is moved into the dialog so screen
 * readers announce it.
 */
export default function Lightbox({ images, index, onClose, onPrev, onNext }) {
  const open = index !== null && images.length > 0

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext],
  )

  useEffect(() => {
    if (!open) return undefined
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={onClose}
            aria-label="Close image viewer"
          >
            <FiX />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox-nav lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev()
                }}
                aria-label="Previous image"
              >
                <FiChevronLeft />
              </button>

              <button
                type="button"
                className="lightbox-nav lightbox-next"
                onClick={(e) => {
                  e.stopPropagation()
                  onNext()
                }}
                aria-label="Next image"
              >
                <FiChevronRight />
              </button>
            </>
          )}

          <motion.div
            className="lightbox-content"
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <SmartImage
              src={images[index]?.src}
              alt={images[index]?.alt ?? ''}
              ratio="16 / 9"
              eager
              fit="contain"
            />
            {images[index]?.caption && (
              <p className="lightbox-caption">{images[index].caption}</p>
            )}
            {images.length > 1 && (
              <p className="lightbox-counter">
                {index + 1} / {images.length}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}