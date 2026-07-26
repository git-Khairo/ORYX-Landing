import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildOryxGeometry } from './particles'
import { createOryxMaterial } from './oryxMaterial'
import { getScrollState } from '../lib/useScrollStore'
import { getReady } from '../lib/useAppReady'
import { prefersReduced } from '../lib/useLenis'

/* The abstract ORYX particle sculpture (the oryx horns as a gold dust field).
   Calm and slow. When the real logo GLB is ready it can replace this. */

// Per-section colour mood for the particles.
const MOODS = [
  '#b48a50', '#c9a66b', '#8a8478', '#c9a66b', '#6e6a62',
  '#b48a50', '#7d8a5f', '#6e6a62', '#b48a50', '#9a723c',
]
const MOOD_COLORS = MOODS.map((c) => new THREE.Color(c))
const SECTION_COUNT = MOODS.length
const lerp = (a, b, t) => a + (b - a) * t

/* Where the oryx sits in each section so it lands on that section's illustration
   focal point — telling one continuous story as you scroll:
   hero (awakens) → discover (revealed) → technology (the hub of the network) →
   services (overseeing) → beyond (its desert) → why (where all lines converge) →
   sustainability (on the land) → process (guiding the path) →
   contact (the signal's source) → statement (settles among the stars). */
const ANCHORS = {
  hero: { x: 0, y: 1.35, s: 1.0 },
  discover: { x: -1.5, y: 0.15, s: 0.9 },
  technology: { x: -1.9, y: 0.1, s: 0.85 }, // network hub (left; text is right)
  services: { x: 0, y: 1.7, s: 0.6 }, // high & subtle; panels lead
  beyond: { x: 0, y: 0.25, s: 1.0 }, // its desert
  why: { x: 0, y: 1.35, s: 0.85 }, // the convergence point
  sustainability: { x: 1.9, y: 0.0, s: 0.9 }, // the contour island (right)
  process: { x: 0, y: 1.55, s: 0.7 }, // above the blueprint path
  contact: { x: 1.9, y: 0.1, s: 0.9 }, // centre of the signal rings (right)
  statement: { x: 0, y: 0.2, s: 0.95 }, // among the constellation
}
const ORDER = ['hero', 'discover', 'technology', 'services', 'beyond', 'why', 'sustainability', 'process', 'contact', 'statement']

function blendedAnchor() {
  const fallback = ANCHORS.hero
  if (typeof document === 'undefined') return fallback
  const midY = window.innerHeight * 0.5
  for (let i = 0; i < ORDER.length; i++) {
    const el = document.getElementById(ORDER[i])
    if (!el) continue
    const r = el.getBoundingClientRect()
    if (midY >= r.top && midY < r.bottom) {
      const t = THREE.MathUtils.clamp((midY - r.top) / r.height, 0, 1)
      const A = ANCHORS[ORDER[i]]
      const B = ANCHORS[ORDER[Math.min(i + 1, ORDER.length - 1)]]
      const k = THREE.MathUtils.smoothstep(t, 0.55, 1)
      return { x: lerp(A.x, B.x, k), y: lerp(A.y, B.y, k), s: lerp(A.s, B.s, k) }
    }
  }
  return fallback
}

export default function Model() {
  const group = useRef()
  const { camera } = useThree()

  const geometry = useMemo(() => buildOryxGeometry(), [])
  const material = useMemo(() => createOryxMaterial(), [])
  const tmpColor = useMemo(() => new THREE.Color(), [])
  const s = useRef({ form: 0.25, x: 0, y: 0, sz: 1, camZ: 6.4, spin: 0, tintAmt: 0 })

  useFrame((rt, delta) => {
    const { progress, velocity } = getScrollState()
    const u = material.uniforms
    const st = s.current
    const ready = getReady()

    u.uTime.value += delta
    u.uVelocity.value = THREE.MathUtils.lerp(u.uVelocity.value, Math.min(Math.abs(velocity) * 0.4, 0.8), 0.08)

    // Materialize: assemble from dispersed once the preloader lifts.
    const targetForm = ready ? 0.6 + THREE.MathUtils.smoothstep(progress, 0, 0.1) * 0.4 : 0.1
    st.form = lerp(st.form, targetForm, ready ? 0.04 : 0.08)
    u.uForm.value = st.form

    // Per-section colour mood.
    const fSec = Math.min(progress * SECTION_COUNT, SECTION_COUNT - 1)
    const i0 = Math.floor(fSec)
    const i1 = Math.min(i0 + 1, SECTION_COUNT - 1)
    tmpColor.copy(MOOD_COLORS[i0]).lerp(MOOD_COLORS[i1], fSec - i0)
    u.uTint.value.lerp(tmpColor, 0.05)
    st.tintAmt = lerp(st.tintAmt, i0 === 2 || i0 === 6 ? 0.4 : 0.12, 0.05)
    u.uTintAmount.value = st.tintAmt

    // Section-anchored position: the oryx travels to sit at each section's
    // illustration focal point (network hub, convergence, signal centre, …).
    const a = blendedAnchor()
    st.x = lerp(st.x, prefersReduced ? 0 : a.x, 0.045)
    st.y = lerp(st.y, a.y, 0.045)
    st.sz = lerp(st.sz, a.s, 0.045)
    st.spin += delta * 0.04

    if (group.current) {
      group.current.position.x = st.x
      group.current.position.y = st.y
      group.current.rotation.y = st.spin
      group.current.scale.setScalar(st.sz)
    }

    // Camera dolly + gentle mouse parallax.
    const targetZ = 6.4 - Math.sin(progress * Math.PI) * 1.2
    st.camZ = lerp(st.camZ, targetZ, 0.05)
    camera.position.z = st.camZ
    const px = prefersReduced ? 0 : rt.pointer.x
    const py = prefersReduced ? 0 : rt.pointer.y
    camera.position.x = lerp(camera.position.x, px * 0.35, 0.05)
    camera.position.y = lerp(camera.position.y, 0.15 + py * 0.2 - progress * 0.3, 0.05)
    camera.lookAt(0, 0.1, 0)
  })

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  )
}
