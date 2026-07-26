import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getScrollState } from '../lib/useScrollStore'
import { prefersReduced } from '../lib/useLenis'

/* ────────────────────────────────────────────────────────────────────────
   HERO MEDIA — an image / video / gif behind the 3D particle oryx.

   The oryx floats in front of this plane and they interact through depth
   parallax (they shift in opposite directions with the pointer); the plane
   fades out as you scroll past the hero.

   To use YOUR media: drop a file in `public/hero/` and set MEDIA_SRC below.
     • Image:  '/hero/hero.jpg' | '.png' | '.webp'  (a .gif shows its 1st frame)
     • Video:  '/hero/hero.mp4' | '.webm'            (animated, autoplay+loop)
   Leave it null to use the built-in desert placeholder.
   ──────────────────────────────────────────────────────────────────────── */
const MEDIA_SRC = null

function makePlaceholderTexture() {
  const c = document.createElement('canvas')
  c.width = 1200
  c.height = 700
  const x = c.getContext('2d')
  const sky = x.createLinearGradient(0, 0, 0, 700)
  sky.addColorStop(0, '#fbf9f5')
  sky.addColorStop(0.6, '#efe6d6')
  sky.addColorStop(1, '#e4d5b8')
  x.fillStyle = sky
  x.fillRect(0, 0, 1200, 700)
  const sun = x.createRadialGradient(560, 300, 20, 560, 300, 320)
  sun.addColorStop(0, 'rgba(232,200,138,0.9)')
  sun.addColorStop(1, 'rgba(217,184,119,0)')
  x.fillStyle = sun
  x.fillRect(0, 0, 1200, 700)
  const dune = (y1, y2, color) => {
    x.fillStyle = color
    x.beginPath()
    x.moveTo(0, y1)
    x.bezierCurveTo(400, y1 - 46, 820, y1 + 34, 1200, y2)
    x.lineTo(1200, 700)
    x.lineTo(0, 700)
    x.closePath()
    x.fill()
  }
  dune(520, 500, '#e0cfa9')
  dune(600, 580, '#d0b988')
  dune(660, 648, '#b48a50')
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function loadMedia() {
  if (MEDIA_SRC && /\.(mp4|webm|ogg)$/i.test(MEDIA_SRC)) {
    const v = document.createElement('video')
    v.src = MEDIA_SRC
    v.loop = true
    v.muted = true
    v.playsInline = true
    v.autoplay = true
    v.play?.().catch(() => {})
    const t = new THREE.VideoTexture(v)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }
  if (MEDIA_SRC) {
    const t = new THREE.TextureLoader().load(MEDIA_SRC)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }
  return makePlaceholderTexture()
}

export default function HeroMedia() {
  const mesh = useRef()
  const mat = useRef()
  const texture = useMemo(loadMedia, [])
  const op = useRef(0)

  useFrame((rt) => {
    const { progress } = getScrollState()
    // Hero-only: visible at the top, fades as you scroll away.
    const target = 1 - THREE.MathUtils.smoothstep(progress, 0.02, 0.14)
    op.current = THREE.MathUtils.lerp(op.current, target, 0.1)
    if (mat.current) mat.current.opacity = op.current

    if (mesh.current && !prefersReduced) {
      // Parallax opposite the oryx for a depth/interaction feel.
      mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, -rt.pointer.x * 0.5, 0.06)
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, 0.35 - rt.pointer.y * 0.4, 0.06)
    }
  })

  return (
    <mesh ref={mesh} position={[0, 0.35, -3]}>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial ref={mat} map={texture} transparent opacity={0} toneMapped={false} />
    </mesh>
  )
}
