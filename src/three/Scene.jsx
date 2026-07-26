import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Model from './Model'
import HeroMedia from './HeroMedia'

/**
 * The single persistent WebGL layer behind every DOM section. Opaque cream so it
 * reads as one surface with the page. The particle sculpture uses its own shader
 * (no scene lighting needed); the scroll store drives everything in Model.
 */
export default function Scene() {
  return (
    <div className="scene-layer" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        }}
        camera={{ fov: 42, position: [0, 0.15, 6.4], near: 0.1, far: 100 }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(new THREE.Color('#f4efe6'), 1)
          scene.background = new THREE.Color('#f4efe6')
        }}
      >
        <HeroMedia />
        <Model />
      </Canvas>
    </div>
  )
}
