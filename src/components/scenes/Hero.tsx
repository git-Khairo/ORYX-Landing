"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Scene } from "@/components/layout/Scene";
import { HeroStage } from "@/components/art/HeroStage";
import { Action } from "@/components/ui/Action";
import { SERVICES, type ServiceId } from "@/lib/content";
import { useExperience } from "@/lib/store";

/**
 * Scene 01.
 *
 * No film and no card. The mark itself is the image: the ORYX logo
 * stands beside the copy and turns slowly on its vertical axis, lit and
 * alive without ever performing. The words get out of the way: three of
 * them, one supporting line, two actions.
 *
 * The one typographic event on the page happens here. As the mark
 * settles the wordmark expands along Archivo's width axis, from
 * condensed to full. It runs once, on a transition, and never on
 * scroll: animating `wdth` changes text metrics, and pager.ts derives
 * its scroll stops from element heights, so a continuously reflowing
 * headline would quietly invalidate the stop table.
 */
export function Hero({
  onOpenService,
}: {
  onOpenService: (id: ServiceId) => void;
}) {
  const openContact = useExperience((s) => s.openContact);
  const reduce = useReducedMotion();
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (reduce) {
      setResolved(true);
      return;
    }
    const id = window.setTimeout(() => setResolved(true), 620);
    return () => window.clearTimeout(id);
  }, [reduce]);

  return (
    <Scene id="hero" label="ORYX. Always ready.">
      {/* The mark as the hero image: turning on its vertical axis,
          orbited by a slow gyroscope of rings. */}
      <HeroStage />

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
            Transportation, cleaning and facility management, plus the people
            to run them, as one partnership.
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

        {/* A direct path into each service from the first screen, so a
            visitor who already knows what they need is one click away. */}
        <motion.div
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[color:var(--line-soft)] pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="t-label text-[color:var(--ink-faint)]">
            Go straight to
          </span>
          {SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onOpenService(s.id)}
              className="group inline-flex items-center gap-2 text-sm tracking-tight text-[color:var(--ink-muted)] transition-colors duration-300 hover:text-[color:var(--ink)]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-150"
                style={{ background: s.accent }}
                aria-hidden="true"
              />
              <span className="border-b border-transparent pb-0.5 transition-colors duration-300 group-hover:border-[color:var(--ink)]">
                {s.name}
              </span>
            </button>
          ))}
        </motion.div>
      </div>
    </Scene>
  );
}
