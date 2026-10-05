import { useContext } from 'react'

import { ToastContext } from './ToastContext'

/**
 * Access the toast helpers.
 *
 * Must be called from a component inside <ToastProvider>, which the Layout
 * renders once:
 *
 *   const toast = useToast()
 *   toast.success('Booking confirmed!')
 *
 * Kept in its own file so ToastProvider only exports components, which is what
 * React Fast Refresh requires.
 */
export default function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>')
  }

  return context
}