"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { usePalette } from "@/lib/palette";
import { OryxMark3D, type MarkMotion } from "./OryxMark3D";

export type StageVariant = "hero" | "ambient" | "front";

/**
 * A reusable light 3D stage for the ORYX mark.
 *
 * One transparent WebGL stage, three roles selected by `variant`:
 *   hero    the pointer-led centrepiece on the opening scene
 *   ambient a tinted, slowly turning presence behind a section
 *   front   a calm, forward-facing close
 *
 * No dark backdrop anywhere: soft key, cool fill and a warm accent rim
 * give the mark form against the page's own light base, and colours are
 * read live from the palette so the object never disagrees with the DOM.
 * Under reduced motion the mark holds one composed pose and the shadow
 * renders a single frame.
 */

interface Config {
  camera: [number, number, number];
  fov: number;
  motion: MarkMotion;
  markTinted: boolean;
  emissiveIntensity: number;
  metalness: number;
  roughness: number;
  contactShadow: boolean;
  floatIntensity: number;
  accentLight: number;
}

const CONFIG: Record<StageVariant, Config> = {
  hero: {
    camera: [0, 0.1, 4.4],
    fov: 34,
    motion: "hero",
    markTinted: false,
    emissiveIntensity: 0.05,
    metalness: 0.5,
    roughness: 0.32,
    contactShadow: true,
    floatIntensity: 0.35,
    accentLight: 2.2,
  },
  ambient: {
    camera: [0, 0, 5.2],
    fov: 32,
    motion: "spin",
    markTinted: true,
    emissiveIntensity: 0.14,
    metalness: 0.35,
    roughness: 0.42,
    contactShadow: false,
    floatIntensity: 0.5,
    accentLight: 2.8,
  },
  front: {
    camera: [0, 0.05, 4.6],
    fov: 32,
    motion: "front",
    markTinted: false,
    emissiveIntensity: 0.08,
    metalness: 0.5,
    roughness: 0.3,
    contactShadow: true,
    floatIntensity: 0.3,
    accentLight: 2.4,
  },
};

export function Stage3D({ variant = "hero" }: { variant?: StageVariant }) {
  const reduce = useReducedMotion() ?? false;
  const { accent, ink } = usePalette();
  const c = CONFIG[variant];
  const markColor = c.markTinted ? accent : ink;

  return (
    <Canvas
      dpr={[1, 1.5]}
      shadows={c.contactShadow}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: c.camera, fov: c.fov }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#ffffff", "#d9d4cc", 0.6]} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.5}
        castShadow={c.contactShadow}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-4, 1, 2]} intensity={0.4} color="#cfe0ff" />
      <pointLight
        position={[-1.5, -0.5, -2]}
        intensity={c.accentLight}
        color={accent}
        distance={9}
      />

      <Suspense fallback={null}>
        <Float
          speed={reduce ? 0 : 1.1}
          rotationIntensity={reduce ? 0 : 0.15}
          floatIntensity={reduce ? 0 : c.floatIntensity}
        >
          <OryxMark3D
            markColor={markColor}
            emissive={accent}
            emissiveIntensity={c.emissiveIntensity}
            metalness={c.metalness}
            roughness={c.roughness}
            motion={c.motion}
            reduce={reduce}
          />
        </Float>
      </Suspense>

      {c.contactShadow ? (
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={reduce ? 0.22 : 0.3}
          scale={7}
          blur={2.6}
          far={3}
          resolution={512}
          color="#2a2622"
          frames={reduce ? 1 : undefined}
        />
      ) : null}
    </Canvas>
  );
}
