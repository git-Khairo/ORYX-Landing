"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Scene, Marker } from "@/components/layout/Scene";
import { SceneMedia } from "@/components/media/SceneMedia";
import { OPERATIONAL_WORDS } from "@/lib/content";

const ACCENT = "#b48a50";
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scene 02. Supplier to partner.
 *
 * Third version. The first scattered the seven operational words and
 * dragged them into a column, which was a trick. The second was a
 * cream plate over film, and it inherited the problem the whole page
 * had: a cream scrim over footage bleaches the picture and leaves
 * charcoal type sitting on a mid tone, so neither the film nor the
 * words read.
 *
 * This one is charcoal. That single decision fixes both halves at
 * once. A dark scrim darkens film instead of washing it, so the empty
 * office stays legible as a picture, and cream type on charcoal is the
 * strongest pairing in the palette. It is also the only tone where
 * gold can carry text: #b48a50 on #1c1c1a is 5.6:1, against 2.7:1 on
 * cream. So the turn in the sentence is finally allowed to be gold
 * rather than merely italic.
 *
 * Structurally it is a split. Copy holds the left, the film stays open
 * on the right, and the seven things ORYX absorbs run along the foot
 * as one quiet index that fills in from the left.
 *
 * Exactly one viewport, and no scroll scrubbing. The previous version
 * was two viewports on a sticky stage, and every reading of it caught
 * the scene mid transition. A single frame that resolves on arrival
 * cannot be caught halfway.
 */
export function Partner() {
  const reduce = useReducedMotion();
  const [lit, setLit] = useState(0);
  const [entered, setEntered] = useState(false);

  /* The handover plays once, on arrival, left to right. A timer rather
     than scroll position: this scene is one viewport, so there is no
     travel to map it onto, and tying it to scroll would mean it only
     completed if the visitor happened to keep moving. */
  useEffect(() => {
    if (!entered) return;
    if (reduce) {
      setLit(OPERATIONAL_WORDS.length);
      return;
    }
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setLit(n);
      if (n >= OPERATIONAL_WORDS.length) window.clearInterval(id);
    }, 260);
    return () => window.clearInterval(id);
  }, [entered, reduce]);

  const allLit = lit >= OPERATIONAL_WORDS.length;

  return (
    <Scene
      id="partner"
      label="ORYX as an operating partner"
      accent={ACCENT}
      tone="charcoal"
    >
      <SceneMedia
        slot="statement"
        variant="converge"
        accent={ACCENT}
        tone="charcoal"
        scrim="left"
      />

      <motion.div
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[100rem] flex-col justify-center px-6 py-20 sm:px-10 lg:px-16"
        onViewportEnter={() => setEntered(true)}
        viewport={{ amount: 0.4 }}
      >
        <div className="max-w-[52rem]">
          <Marker index="02">The shift</Marker>

          {/* Two states of one sentence. The first is what they have
              had, set muted. The second is what ORYX is, set in the
              accent, which only works because the ground is dark. */}
          <h2 className="t-display mt-7">
            <span className="mask-line">
              <motion.span
                className="block text-[color:var(--ink-muted)]"
                initial={reduce ? { opacity: 0 } : { y: "112%" }}
                whileInView={reduce ? { opacity: 1 } : { y: "0%" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduce ? 0.35 : 1.1, ease: EASE }}
              >
                Not another supplier.
              </motion.span>
            </span>
            <span className="mask-line">
              <motion.span
                className="block"
                style={{ color: ACCENT }}
                initial={reduce ? { opacity: 0 } : { y: "112%" }}
                whileInView={reduce ? { opacity: 1 } : { y: "0%" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: reduce ? 0.35 : 1.1,
                  delay: 0.12,
                  ease: EASE,
                }}
              >
                An operating partner.
              </motion.span>
            </span>
          </h2>

          <motion.p
            className="mt-8 max-w-[34ch] text-lg leading-snug tracking-tight text-[color:var(--ink)] sm:text-xl lg:text-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          >
            We take care of the details that keep your business running.
          </motion.p>
        </div>

        {/* The index, along the foot. One rule filling left to right is
            the whole idea in a single graphic gesture: these are not
            being animated at, they are being taken over. */}
        <div className="mt-14 lg:mt-20">
          <div
            className="relative h-px w-full"
            style={{ background: "var(--line)" }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-y-0 left-0 w-full origin-left"
              style={{
                background: ACCENT,
                transform: `scaleX(${lit / OPERATIONAL_WORDS.length})`,
                transition: "transform 700ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </div>

          <ul className="mt-6 flex flex-wrap items-baseline gap-x-[clamp(1.25rem,3.4vw,4rem)] gap-y-3">
            {OPERATIONAL_WORDS.map((word, i) => {
              const on = i < lit;
              return (
                <li
                  key={word}
                  /* Set large on purpose. The lit state is the accent,
                     and on charcoal gold clears AA at 5.6:1 at any
                     size, but these still read as an index rather than
                     a caption, which is the point. Unlit is a real
                     colour, never a dimmed version of the lit one. */
                  className="text-[clamp(1.05rem,1.7vw,1.5rem)] tracking-tight"
                  style={{
                    color: on ? ACCENT : "var(--ink-muted)",
                    transition: "color 600ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  {word}
                </li>
              );
            })}
          </ul>

          <p
            className="mt-7 text-sm text-[color:var(--ink-muted)]"
            style={{
              opacity: allLit ? 1 : 0,
              transition: "opacity 700ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            One partner. Every operational detail.
          </p>
        </div>
      </motion.div>
    </Scene>
  );
}
