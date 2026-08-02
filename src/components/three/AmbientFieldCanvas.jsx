import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A slow field of gold motes — ORYX's answer to AI Studio's starfield. Points
 * drift up and gently sideways through a shallow volume and wrap when they
 * leave it, so the field never empties and never repeats on a visible beat.
 * Colour and size stay inside the brand (tan → gold), and the whole thing is
 * additively blended so it reads as light, not confetti.
 */
const COUNT = 320

function Motes() {
  const points = useRef()

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14 // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9 // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 // z
      speeds[i] = 0.15 + Math.random() * 0.35
    }
    return { positions, speeds }
  }, [])

  useFrame((state, delta) => {
    const geo = points.current?.geometry
    if (!geo) return
    const d = Math.min(delta, 0.05)
    const arr = geo.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < COUNT; i++) {
      const yi = i * 3 + 1
      arr[yi] += speeds[i] * d // rise
      arr[i * 3] += Math.sin(t * 0.2 + i) * 0.0015 // faint sideways sway
      if (arr[yi] > 4.5) {
        arr[yi] = -4.5
        arr[i * 3] = (Math.random() - 0.5) * 14
      }
    }
    geo.attributes.position.needsUpdate = true
    if (points.current) points.current.rotation.y = Math.sin(t * 0.05) * 0.08
  })

  const texture = useMemo(() => {
    // A soft round sprite so each mote is a glow, not a square.
    const size = 64
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,240,214,1)')
    g.addColorStop(0.35, 'rgba(201,166,107,0.75)')
    g.addColorStop(1, 'rgba(201,166,107,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(c)
    tex.needsUpdate = true
    return tex
  }, [])

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.13}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </points>
  )
}

export default function AmbientFieldCanvas() {
  return (
    <Canvas
      className="ambient-canvas"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 7], fov: 55 }}
    >
      <Motes />
    </Canvas>
  )
}
