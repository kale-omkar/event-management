/**
 * Toast notifications (provider side).
 *
 * Render <ToastProvider> once, in the Layout, and show messages from anywhere
 * via the useToast hook in ./useToast.js.
 */

import { AnimatePresence, motion } from 'framer-motion'
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'
import { useCallback, useMemo, useRef, useState } from 'react'

import { ToastContext } from './ToastContext'

const ICONS = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (type, message) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((current) => [...current, { id, type, message }])
      // Auto-dismiss. Errors linger a little longer.
      timers.current.set(id, setTimeout(() => dismiss(id), type === 'error' ? 6000 : 4000))
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({
      success: (m) => push('success', m),
      error: (m) => push('error', m),
      info: (m) => push('info', m),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-region" role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map(({ id, type, message }) => {
            const Icon = ICONS[type] ?? FiInfo
            return (
              <motion.div
                key={id}
                className={`toast toast-${type}`}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                layout
              >
                <Icon className="toast-icon" aria-hidden="true" />
                <p className="toast-message">{message}</p>
                <button
                  type="button"
                  className="toast-close"
                  onClick={() => dismiss(id)}
                  aria-label="Dismiss notification"
                >
                  <FiX aria-hidden="true" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
