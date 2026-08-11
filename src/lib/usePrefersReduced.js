import { useEffect, useState } from 'react'

/**
 * Live `prefers-reduced-motion`, not a value read once at module load.
 *
 * Reading it at import time is the common shortcut and it is wrong twice: the
 * setting can change while the page is open, and on this page it decides
 * whether a nineteen-second film runs at all.
 */
const QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReduced() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
