import * as THREE from 'three'

/**
 * Builds the particle geometry for the abstract ORYX sculpture — the oryx's two
 * long, ringed horns rendered as a field of gold grains, plus a faint body
 * cloud and an ambient dust field. Each particle also stores a dispersed
 * "scatter" position so the shader can morph dispersed → formed.
 *
 * Attributes: position (formed target), aScatter (dispersed), aSeed (randoms).
 */
export function buildOryxGeometry({ hornCount = 4800, bodyCount = 1500, dustCount = 1200 } = {}) {
  const total = hornCount + bodyCount + dustCount
  const position = new Float32Array(total * 3)
  const scatter = new Float32Array(total * 3)
  const seed = new Float32Array(total * 4)

  let i = 0
  const set = (px, py, pz, sx, sy, sz, mix) => {
    position[i * 3] = px; position[i * 3 + 1] = py; position[i * 3 + 2] = pz
    scatter[i * 3] = sx; scatter[i * 3 + 1] = sy; scatter[i * 3 + 2] = sz
    seed[i * 4] = Math.random()
    seed[i * 4 + 1] = 0.4 + Math.random() * 0.8
    seed[i * 4 + 2] = Math.random()
    seed[i * 4 + 3] = mix
    i++
  }
  const rand = (s = 6) => [
    (Math.random() - 0.5) * s,
    (Math.random() - 0.5) * s,
    (Math.random() - 0.5) * s * 0.7,
  ]

  // Horn path: t in [0,1], side ∈ {-1,+1}. Long, tall, slight outward flare.
  const horn = (sgn, t) => {
    const x = sgn * (0.18 + 0.42 * Math.pow(t, 1.05))
    const y = 2.9 * t - 0.85
    const z = -0.55 * t * t
    return [x, y, z]
  }

  for (let n = 0; n < hornCount; n++) {
    const sgn = n % 2 === 0 ? -1 : 1
    const t = Math.pow(Math.random(), 0.85)
    const [cx, cy, cz] = horn(sgn, t)
    const radius = (0.07 * (1 - t) + 0.012) * (0.6 + Math.random() * 0.9)
    const a = Math.random() * Math.PI * 2
    const [sx, sy, sz] = rand(7)
    set(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius * 0.9, cz + Math.sin(a) * radius, sx, sy, sz, t)
  }

  for (let n = 0; n < bodyCount; n++) {
    const u = Math.random() * Math.PI * 2
    const v = Math.acos(2 * Math.random() - 1)
    const r = Math.pow(Math.random(), 0.6)
    const [sx, sy, sz] = rand(7)
    set(
      Math.sin(v) * Math.cos(u) * 0.6 * r,
      -0.95 + Math.cos(v) * 0.5 * r,
      Math.sin(v) * Math.sin(u) * 0.45 * r,
      sx, sy, sz, 0.15 + Math.random() * 0.2,
    )
  }

  for (let n = 0; n < dustCount; n++) {
    const rad = 2.6 + Math.random() * 2.6
    const a = Math.random() * Math.PI * 2
    const px = Math.cos(a) * rad
    const py = (Math.random() - 0.5) * 4.2
    const pz = Math.sin(a) * rad - 0.5
    set(px, py, pz, px * 1.1, py * 1.1, pz * 1.1, 0.5 + Math.random() * 0.5)
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(position, 3))
  g.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3))
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
  g.computeBoundingSphere()
  return g
}
