// Small reusable data-fetching hook built on the shared axios instance.
//
// It handles the three states every screen needs: loading, error and success.
// Copy this pattern for the rest of the site.
import { useCallback, useEffect, useRef, useState } from 'react'

import api from '../services/api'

/**
 * Fetch JSON from the backend and expose loading / error / data.
 *
 * @param {string|null} url   Path to request, e.g. '/api/events'. Pass null to
 *                            skip fetching entirely; the hook then settles with
 *                            data null, no error and loading false.
 * @param {object} [options]  Optional axios options, e.g. { params: { limit: 10 } }
 *
 * The request re-runs when `url` changes. Pass options as a stable value
 * (a memoised object) if they change between renders.
 */
export default function useFetch(url, options = {}) {
  // A falsy url means "nothing to load", e.g. Booking passing null when the
  // user has not chosen an event. Report a settled empty state instead of
  // requesting the API root, which used to return the welcome payload.
  const enabled = Boolean(url)
  const [state, setState] = useState({ data: null, error: null, loading: enabled })

  // Kept in a ref so a new object literal on every render does not re-trigger
  // the request in an endless loop.
  const optionsRef = useRef(options)

  // Resolves on success, rejects on failure. Never sets state itself, so it is
  // safe to call from an effect.
  const request = useCallback(
    (signal) => api.get(url, { ...optionsRef.current, signal }),
    [url],
  )

  useEffect(() => {
    // Disabled hooks keep the state derived from `enabled` at render time, so
    // there is nothing to fetch and nothing to set.
    if (!enabled) return

    const controller = new AbortController()

    request(controller.signal)
      .then((response) => {
        setState({ data: response.data, error: null, loading: false })
      })
      .catch((err) => {
        // Ignore cancellations from unmounting or a newer request.
        if (controller.signal.aborted) return
        setState({ data: null, error: err, loading: false })
      })

    // Abort the in-flight request if the component unmounts or url changes.
    return () => controller.abort()
  }, [request, enabled])

  // Call this from an event handler to load again, e.g. after a form submit.
  const refetch = useCallback(() => {
    if (!enabled) return Promise.resolve(null)

    setState((prev) => ({ ...prev, loading: true, error: null }))

    return request()
      .then((response) => {
        setState({ data: response.data, error: null, loading: false })
      })
      .catch((err) => {
        setState({ data: null, error: err, loading: false })
      })
  }, [request, enabled])

  // When disabled, report a settled empty state without waiting for an effect,
  // so the very first render is already correct and no request is made.
  if (!enabled) {
    return { data: null, error: null, loading: false, refetch }
  }

  return { ...state, refetch }
}
