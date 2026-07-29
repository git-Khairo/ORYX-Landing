"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { OryxMark } from "@/components/brand/OryxMark";

const SEEN_KEY = "oryx-opened";
const FULL_MS = 1500;
const RETURNING_MS = 320;

/**
 * Section 00. A route line crosses the frame and resolves into the
 * mark. It lasts 1.5s once, then never again in the session, and it
 * never blocks the page: the hero is already rendered underneath and
 * fully readable the moment this layer clears.
 *
 * Charcoal, like the hero it clears into, so the handover is a fade
 * rather than a flash. Gold carries the line and the mark; the
 * tagline uses the ink token.
 */
export function Opening() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"pending" | "playing" | "done">("pending");
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode: play the short version, never break */
    }
    const short = seen || Boolean(reduce);
    setReturning(short);
    setPhase("playing");
    const id = window.setTimeout(
      () => setPhase("done"),
      short ? RETURNING_MS : FULL_MS,
    );
    return () => window.clearTimeout(id);
  }, [reduce]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="opening"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[color:var(--base)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          {phase === "playing" && !returning && (
            <div className="relative flex w-full max-w-lg flex-col items-center gap-8 px-8">
              {/* The route line: it arrives, then becomes the mark. */}
              <motion.span
                className="absolute top-1/2 block h-px bg-[color:var(--accent)]"
                initial={{ width: 0, left: "0%", opacity: 0.9 }}
                animate={{ width: ["0%", "100%", "0%"], left: ["0%", "0%", "100%"] }}
                transition={{ duration: 0.78, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.35 }}
                className="text-[color:var(--accent)]"
              >
                <OryxMark size={54} draw duration={0.75} strokeWidth={2} />
              </motion.div>
              <motion.p
                className="text-sm tracking-[0.34em] text-[color:var(--ink-muted)]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.86, duration: 0.4 }}
              >
                ALWAYS READY.
              </motion.p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
