"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { usePalette } from "@/lib/palette";

/**
 * The process as four steps in space.
 *
 * Four rounded blocks stand in a row along a single track. The active
 * step, driven by the section below, lifts and lights in the accent
 * while the others rest low and neutral: the method, read at a glance,
 * instead of four columns of prose. Light stage, soft key and a warm
 * accent rim, transparent background. Under reduced motion the blocks
 * hold their pose and only the active one stays raised.
 */

const COUNT = 4;
const GAP = 1.35;

function Step({
  index,
  active,
  accent,
  ink,
  reduce,
}: {
  index: number;
  active: boolean;
  accent: string;
  ink: string;
  reduce: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const x = (index - (COUNT - 1) / 2) * GAP;

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    const targetY = active ? 0.42 : 0;
    if (reduce) {
      g.position.y = targetY;
      return;
    }
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 5, delta);
  });

  return (
    <group ref={ref} position={[x, 0, 0]}>
      <RoundedBox args={[0.86, 1.5, 0.86]} radius={0.12} smoothness={4} castShadow>
        <meshPhysicalMaterial
          color={active ? accent : ink}
          metalness={0.4}
          roughness={active ? 0.3 : 0.55}
          clearcoat={0.7}
          clearcoatRoughness={0.35}
          emissive={new THREE.Color(accent)}
          emissiveIntensity={active ? 0.28 : 0}
        />
      </RoundedBox>
    </group>
  );
}

function Track({ color }: { color: string }) {
  const w = (COUNT - 1) * GAP + 0.9;
  return (
    <mesh position={[0, -0.86, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, 0.045]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

export function ProcessStage3D({ active }: { active: number }) {
  const reduce = useReducedMotion() ?? false;
  const { accent, ink } = usePalette();

  return (
    <Canvas
      dpr={[1, 1.5]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.5, 6], fov: 32 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#ffffff", "#d9d4cc", 0.55]} />
      <directionalLight
        position={[3, 6, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-4, 2, 2]} intensity={0.35} color="#cfe0ff" />
      <pointLight position={[0, 1, 3]} intensity={1.6} color={accent} distance={12} />

      <group rotation={[0, -0.32, 0]}>
        {Array.from({ length: COUNT }, (_, i) => (
          <Step
            key={i}
            index={i}
            active={i === active}
            accent={accent}
            ink={ink}
            reduce={reduce}
          />
        ))}
        <Track color={accent} />
      </group>

      <ContactShadows
        position={[0, -0.9, 0]}
        opacity={0.28}
        scale={9}
        blur={2.8}
        far={3}
        resolution={512}
        color="#2a2622"
        frames={reduce ? 1 : undefined}
      />
    </Canvas>
  );
}
