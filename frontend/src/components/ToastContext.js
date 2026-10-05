import { createContext } from 'react'

/**
 * Shared context for toast notifications.
 *
 * Lives in its own module so ToastProvider.jsx only exports components, which
 * is what React Fast Refresh needs. Use the useToast hook in ./useToast.js
 * rather than reading this directly.
 */
export const ToastContext = createContext(null)

export default ToastContext