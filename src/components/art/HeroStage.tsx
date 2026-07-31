"use client";

import { motion, useReducedMotion } from "motion/react";
import { ContourField } from "@/components/art/ContourField";
import { MarkStage } from "@/components/art/oryx3d/MarkStage";

/**
 * The hero centrepiece, full bleed across the section.
 *
 * A field of flowing contour lines fills the whole hero and bows clear
 * of the mark, keeping the section alive on light. Within it, the ORYX
 * mark now stands as a real extruded object on a WebGL stage
 * (art/oryx3d), turning under the pointer and grounded by a soft contact
 * shadow. A gentle accent glow sits behind it so the light material has
 * something warm to sit against.
 *
 * The glow carries a CSS `filter` and so must never wrap the 3D canvas;
 * it stays a separate sibling layer behind the stage.
 *
 * Under reduced motion the contour field holds a single frame, the glow
 * pulse is dropped, and the 3D object composes one static pose.
 */
export function HeroStage() {
  const reduce = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <ContourField />

      {/* The mark, right of centre, with real depth. Desktop only; the
          contour field carries the section on smaller screens. */}
      <div className="absolute right-[3%] top-1/2 hidden h-[68svh] max-h-[640px] w-[46vw] max-w-[680px] -translate-y-1/2 lg:block">
        {/* Glow, kept behind the canvas so its filter cannot touch it. */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent) 18%, transparent) 0%, transparent 62%)",
            filter: "blur(26px)",
          }}
          animate={
            reduce ? undefined : { opacity: [0.3, 0.55, 0.3], scale: [1, 1.06, 1] }
          }
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative h-full w-full">
          <MarkStage variant="hero" eager />
        </div>
      </div>
    </div>
  );
}
