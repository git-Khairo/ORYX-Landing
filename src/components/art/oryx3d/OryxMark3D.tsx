"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";

/**
 * The ORYX mark, extruded into real geometry from the brand artwork.
 *
 * The supplied logo (public/brand/logo.png) is traced to a vector
 * outline (public/brand/logo.svg): two ridged horns meeting at an
 * angular base, with the ridge notches preserved as holes. Here that
 * exact silhouette is extruded with a soft bevel, so the flat mark
 * becomes a solid object that catches studio light and turns.
 *
 * The same object is the site's recurring character (brand book, "the
 * mark is the guide"): the hero centrepiece, a tinted presence behind
 * the standard, and the forward-facing close on contact. `motion` and
 * the colour props are what let one asset play all three parts.
 *
 * SVG space is Y-down and in artwork pixels, so the geometry is centred
 * on its own bounding box and the mesh is scaled with a negative Y to
 * flip it upright and down to world size. The negative scale inverts
 * winding, so the material draws both sides.
 */

/** World height the mark should occupy. */
const TARGET_HEIGHT = 2.35;

export type MarkMotion = "hero" | "spin" | "front";

/** Build the extruded geometry once from the traced logo. */
function useMarkGeometry() {
  const data = useLoader(SVGLoader, "/brand/logo.svg");
  return useMemo(() => {
    const shapes: THREE.Shape[] = [];
    for (const path of data.paths) {
      const c = path.color;
      // Skip the white background rect the tracer adds; keep the ink mark.
      const lum = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
      if (lum > 0.85) continue;
      shapes.push(...SVGLoader.createShapes(path));
    }

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 42,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 3,
      bevelSegments: 3,
      curveSegments: 16,
    });
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const cx = (bb.max.x + bb.min.x) / 2;
    const cy = (bb.max.y + bb.min.y) / 2;
    const cz = (bb.max.z + bb.min.z) / 2;
    geo.translate(-cx, -cy, -cz);

    const height = bb.max.y - bb.min.y;
    return { geometry: geo, scale: TARGET_HEIGHT / height };
  }, [data]);
}

export function OryxMark3D({
  markColor,
  emissive,
  emissiveIntensity = 0.05,
  metalness = 0.5,
  roughness = 0.32,
  motion = "hero",
  reduce,
}: {
  /** Body colour of the mark. */
  markColor: string;
  /** Emissive tint, usually the section accent. */
  emissive: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  motion?: MarkMotion;
  reduce: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { geometry, scale } = useMarkGeometry();

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(markColor),
        metalness,
        roughness,
        clearcoat: 0.85,
        clearcoatRoughness: 0.3,
        emissive: new THREE.Color(emissive),
        emissiveIntensity,
        side: THREE.DoubleSide,
      }),
    [markColor, emissive, emissiveIntensity, metalness, roughness],
  );

  const rest = motion === "front" ? 0 : -0.3;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (reduce) {
      g.rotation.set(0, rest, 0);
      return;
    }
    const t = state.clock.elapsedTime;
    if (motion === "spin") {
      // Ambient backdrop: a slow, endless turn, no pointer coupling.
      g.rotation.y += delta * 0.18;
      g.rotation.x = Math.sin(t * 0.3) * 0.08;
      g.position.y = Math.sin(t * 0.5) * 0.05;
      return;
    }
    // hero and front both lean gently toward the pointer.
    const reach = motion === "front" ? 0.28 : 0.5;
    const targetY = rest + Math.sin(t * 0.5) * 0.24 + state.pointer.x * reach;
    const targetX = Math.sin(t * 0.4) * 0.05 - state.pointer.y * 0.2;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
    g.position.y = Math.sin(t * 0.6) * 0.04;
  });

  return (
    <group ref={group} rotation={[0, rest, 0]}>
      {/* Negative Y flips the artwork upright; the material is DoubleSide
          so the inverted winding still shades correctly. */}
      <mesh
        geometry={geometry}
        material={material}
        scale={[scale, -scale, scale]}
        castShadow
        receiveShadow
      />
    </group>
  );
}
