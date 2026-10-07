

import { useCallback, useEffect, useRef, useState } from 'react'

import api from '../services/api'

export default function useFetch(url, options = {}) {

  const enabled = Boolean(url)
  const [state, setState] = useState({ data: null, error: null, loading: enabled })

  const optionsRef = useRef(options)

  const request = useCallback(
    (signal) => api.get(url, { ...optionsRef.current, signal }),
    [url],
  )

  useEffect(() => {

    if (!enabled) return

    const controller = new AbortController()

    request(controller.signal)
      .then((response) => {
        setState({ data: response.data, error: null, loading: false })
      })
      .catch((err) => {

        if (controller.signal.aborted) return
        setState({ data: null, error: err, loading: false })
      })

    return () => controller.abort()
  }, [request, enabled])

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

  if (!enabled) {
    return { data: null, error: null, loading: false, refetch }
  }

  return { ...state, refetch }
}
