"use client";

import { motion, useReducedMotion } from "motion/react";
import { Scene } from "@/components/layout/Scene";
import { SignalFigure } from "@/components/art/figures";
import { Action } from "@/components/ui/Action";
import { Wordmark } from "@/components/brand/OryxMark";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SERVICES } from "@/lib/content";
import { useExperience } from "@/lib/store";

/**
 * Scene 05. The close.
 *
 * The mark reassembles and faces the viewer on the stage behind this,
 * so the page has almost nothing to do: one statement, one action,
 * and the three services as direct entries for anyone who already
 * knows which one they came for.
 *
 * The footer keeps clear of the journey rail on the right, which is
 * fixed and vertically centred and used to land on top of it.
 */
export function Contact() {
  const openContact = useExperience((s) => s.openContact);
  const reduce = useReducedMotion();

  return (
    <Scene id="contact" label="Contact ORYX">
      {/* The light left on. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[52%] items-center opacity-90 lg:flex"
        aria-hidden="true"
      >
        <SignalFigure className="h-full max-h-[80svh] w-full" />
      </div>
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[100rem] flex-col justify-between px-6 pb-10 pt-[calc(var(--nav-h)+3rem)] sm:px-10 lg:px-16">
        <div className="flex flex-1 flex-col justify-center">
          <motion.h2
            className="t-display max-w-[13ch]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            One partner. Every detail.
          </motion.h2>

          <div className="mt-10 flex flex-col gap-8 lg:mt-14 lg:flex-row lg:items-end lg:justify-between">
            <p className="t-lede">
              Tell us what needs to be ready. You get an operational answer, not
              a brochure.
            </p>
            <Action onClick={() => openContact()}>Start a request</Action>
          </div>

          <ul className="mt-14 grid gap-px border-t border-[color:var(--line-soft)] sm:grid-cols-3">
            {SERVICES.map((s) => (
              <li key={s.id} className="border-b border-[color:var(--line-soft)]">
                <button
                  type="button"
                  onClick={() => openContact(s.id)}
                  className="group flex w-full items-baseline gap-4 py-5 text-left"
                >
                  <span className="t-index text-[0.6875rem]" style={{ color: s.accent }}>
                    {s.index}
                  </span>
                  <span className="text-base tracking-tight transition-colors duration-300 group-hover:text-[color:var(--accent)]">
                    {s.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-16 border-t border-[color:var(--line-soft)] pt-8 lg:pr-16 xl:pr-20">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="leading-tight">
              <BrandLogo alt="ORYX" className="mb-4 h-10" />
              <Wordmark className="text-sm" />
              <p className="t-label mt-2">Always ready.</p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-[color:var(--ink-muted)] sm:items-end">
              <a
                href="mailto:hello@oryx.nl"
                className="text-[color:var(--ink)] transition-colors hover:text-[color:var(--accent)]"
              >
                hello@oryx.nl
              </a>
              <p>Operating across the Netherlands.</p>
            </div>
          </div>
          <p className="mt-8 max-w-[60ch] text-xs leading-relaxed text-[color:var(--ink-muted)]">
            We use the details you share only to answer your request. Nothing is
            sold, and nothing is used for unrelated marketing.
          </p>
        </footer>
      </div>
    </Scene>
  );
}
