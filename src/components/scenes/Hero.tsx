"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Scene } from "@/components/layout/Scene";
import { HeroFigure } from "@/components/art/figures";
import { Action } from "@/components/ui/Action";
import { useExperience } from "@/lib/store";

/**
 * Scene 01.
 *
 * No film, no card, no lede stack. The horns draw themselves in
 * beside the copy and the words get out of the way: three of them, one
 * supporting line, two actions.
 *
 * The one typographic event on the page happens here. As the mark
 * locks into place the wordmark expands along Archivo's width axis,
 * from condensed to full. The type resolves as the object resolves.
 * It runs once, on a transition, and never on scroll: animating
 * `wdth` changes text metrics, and pager.ts derives its scroll stops
 * from element heights, so a continuously reflowing headline would
 * quietly invalidate the stop table.
 */
export function Hero() {
  const openContact = useExperience((s) => s.openContact);
  const reduce = useReducedMotion();
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (reduce) {
      setResolved(true);
      return;
    }
    // Lands with the mark, not before it.
    const id = window.setTimeout(() => setResolved(true), 620);
    return () => window.clearTimeout(id);
  }, [reduce]);

  return (
    <Scene id="hero" label="ORYX. Always ready.">
      {/* The city, already running, behind the words. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[58%] items-center lg:flex"
        aria-hidden="true"
      >
        <HeroFigure className="h-full max-h-[86svh] w-full" />
      </div>
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[100rem] flex-col justify-end px-6 pb-[12svh] pt-[calc(var(--nav-h)+2rem)] sm:px-10 lg:px-16">
        <motion.p
          className="t-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Operational services. Netherlands.
        </motion.p>

        <h1
          className="t-display t-kinetic mt-6 max-w-[14ch]"
          data-resolved={resolved ? "true" : "false"}
        >
          Always ready.
        </h1>

        <motion.div
          className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="t-lede">
            Transportation, cleaning and facility management, run as one
            partnership.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Action
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              See the services
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
