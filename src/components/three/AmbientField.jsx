import { Suspense, lazy, useEffect, useState } from 'react'
import { prefersReduced } from '../../lib/useLenis'

/**
 * Lazy, defensive wrapper for the gold-mote field. Mounts the WebGL canvas only
 * after paint and only when motion is welcome; otherwise it renders nothing, so
 * the section beneath simply shows its own background. Layered decoration — it
 * never carries content, so there is no static fallback to draw.
 */
const Canvas = lazy(() => import('./AmbientFieldCanvas'))

export default function AmbientField() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (prefersReduced) return
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setMounted(true), { timeout: 1500 })
      : window.setTimeout(() => setMounted(true), 500)
    return () => {
      if (window.cancelIdleCallback && typeof id === 'number') window.cancelIdleCallback(id)
      else clearTimeout(id)
    }
  }, [])

  if (prefersReduced || !mounted) return null
  return (
    <div className="ambient-field" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas />
      </Suspense>
    </div>
  )
}
