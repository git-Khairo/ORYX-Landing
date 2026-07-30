"use client";

import { motion, useReducedMotion } from "motion/react";
import { ContourField } from "@/components/art/ContourField";
import { LogoCanvas } from "@/components/art/LogoCanvas";

/**
 * The hero centrepiece, full bleed across the section.
 *
 * A field of flowing contour lines fills the whole hero and bows clear
 * of the mark. The ORYX logo stands within it, keyed to transparency so
 * the lines pass behind the horns, given real thickness by a short
 * stack of Z offset layers, and swaying on its vertical axis so that
 * depth catches the light. A soft accent glow sits behind it.
 *
 * The depth stack must not carry a CSS `filter`: a filter flattens 3D
 * children, which would collapse the extrusion. So the glow is a
 * separate layer behind, never a parent of the stack.
 *
 * Under reduced motion the field holds a single frame, the sway and
 * glow pulse are dropped, and the mark simply stands.
 */
const DEPTH_LAYERS = [0, 1, 2, 3, 4, 5];

export function HeroStage() {
  const reduce = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <ContourField />

      {/* The mark, right of centre, with depth. Desktop only; the
          contour field carries the section on smaller screens. */}
      <div
        className="absolute right-[7%] top-1/2 hidden h-[56svh] max-h-[520px] -translate-y-1/2 lg:block"
        style={{ perspective: 1200 }}
      >
        {/* Glow, kept off the 3D stack so it cannot flatten it. */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent) 20%, transparent) 0%, transparent 60%)",
            filter: "blur(22px)",
          }}
          animate={
            reduce ? undefined : { opacity: [0.35, 0.6, 0.35], scale: [1, 1.06, 1] }
          }
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Extruded, swaying mark. */}
        <motion.div
          className="relative h-full"
          style={{ transformStyle: "preserve-3d" }}
          initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
          animate={
            reduce ? undefined : { opacity: 1, scale: 1, rotateY: [0, 26, 0, -26, 0] }
          }
          transition={{
            opacity: { duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
            // A pendulum through centre, so the flat mark stays
            // dimensional and never collapses edge on.
            rotateY: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {DEPTH_LAYERS.map((i) => (
            <div
              key={i}
              className={i === 0 ? "relative h-full" : "absolute inset-0"}
              style={{ transform: `translateZ(${-i * 1.6}px)` }}
            >
              <LogoCanvas className="h-full w-auto" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
