"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Scene } from "@/components/layout/Scene";
import { SceneMedia } from "@/components/media/SceneMedia";
import { Action } from "@/components/ui/Action";
import { useExperience } from "@/lib/store";
import { useMounted } from "@/lib/hooks";

/**
 * Scene 01.
 *
 * A hero, not a title card. Film runs edge to edge and stays open at
 * the top of the frame; everything that has to be read is anchored to
 * the foot, where the scrim is strongest. Nothing floats in the middle
 * of the picture.
 *
 * On the first movement the two headline lines separate at different
 * rates and the film pushes back into depth. One idea, shown once: the
 * world has depth, and leaving the hero moves you into it.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const openContact = useExperience((s) => s.openContact);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const line1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-46%"]);
  const line2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const supportY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const fade = useTransform(scrollYProgress, [0.1, 0.7], [1, 0]);

  const live = useMounted() && !reduce;
  const EASE = [0.22, 1, 0.36, 1] as const;

  return (
    <Scene
      id="hero"
      label="ORYX. Always ready."
      accent="#b48a50"
      tone="charcoal"
    >
      <div ref={ref} className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={live ? { scale: mediaScale, y: mediaY } : undefined}
        >
          <SceneMedia
            slot="hero"
            variant="drift"
            accent="#b48a50"
            tone="charcoal"
            scrim="bottom"
          />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[100rem] flex-col justify-end px-6 pb-14 pt-[calc(var(--nav-h)+2rem)] sm:px-10 lg:px-16 lg:pb-20">
        <motion.div
          className="mb-7 h-px w-16 origin-left"
          style={{ background: "var(--accent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          aria-hidden="true"
        />

        {/* Two layers per line on purpose: the outer span carries the
            scroll parallax, the inner one carries the entrance. Both on
            one element would let the scroll value win and the headline
            would never rise in. */}
        <motion.h1
          className="t-display max-w-[15ch]"
          style={live ? { opacity: fade } : undefined}
        >
          <motion.span
            className="block"
            style={live ? { y: line1Y } : undefined}
          >
            <span className="mask-line">
              <motion.span
                className="block"
                initial={{ y: "112%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.25, delay: 0.25, ease: EASE }}
              >
                Your operations.
              </motion.span>
            </span>
          </motion.span>

          <motion.span
            className="block"
            style={live ? { y: line2Y } : undefined}
          >
            <span className="mask-line">
              <motion.span
                className="t-em block"
                initial={{ y: "112%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.25, delay: 0.4, ease: EASE }}
              >
                Always ready.
              </motion.span>
            </span>
          </motion.span>
        </motion.h1>

        <motion.div
          className="mt-9 flex flex-col gap-8 lg:mt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-20"
          style={live ? { y: supportY, opacity: fade } : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85, ease: EASE }}
        >
          <p className="t-lede">
            Transportation, cleaning and facility management, managed as one
            reliable operational partnership.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Action
              onClick={() =>
                document
                  .getElementById("partner")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              Explore ORYX
            </Action>
            <Action variant="ghost" arrow="none" onClick={() => openContact()}>
              Start a request
            </Action>
          </div>
        </motion.div>
      </div>
    </Scene>
  );
}
