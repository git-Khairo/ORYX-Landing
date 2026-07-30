"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

/**
 * The ORYX logo, from the supplied JPG.
 *
 * The artwork is black on a white background. `mix-blend-mode: multiply`
 * blends that white into the base colour behind it, so the white square
 * resolves to the page and only the horns remain. Because a transform
 * (the spin, the nav's show/hide, a tilt) creates an isolation group
 * that would otherwise leave the blend nothing to work against, the
 * wrapper always paints the base colour itself, so the trick holds in
 * every context.
 *
 * Height comes from `className` (e.g. `h-7`, `h-[60svh]`); the image
 * keeps its aspect ratio. `spin` rotates it slowly on its vertical
 * axis, and is dropped under reduced motion.
 */
export function BrandLogo({
  className = "",
  alt = "ORYX",
  spin = false,
}: {
  className?: string;
  alt?: string;
  spin?: boolean;
}) {
  const reduce = useReducedMotion();

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo.jpg"
      alt={alt}
      className="block h-full w-auto select-none object-contain"
      style={{ mixBlendMode: "multiply" }}
      draggable={false}
    />
  );

  const base: CSSProperties = { backgroundColor: "var(--base)" };

  if (spin && !reduce) {
    return (
      <span className={`inline-block ${className}`} style={{ perspective: 1000 }}>
        <motion.span
          className="block h-full w-fit"
          style={{ ...base, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1, rotateY: 360 }}
          transition={{
            opacity: { duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
            rotateY: { duration: 16, repeat: Infinity, ease: "linear" },
          }}
        >
          {img}
        </motion.span>
      </span>
    );
  }

  return (
    <span className={`inline-block ${className}`} style={base}>
      {img}
    </span>
  );
}
