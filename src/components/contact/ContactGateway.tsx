"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react";
import { useEscape, useFocusTrap, useScrollLock } from "@/lib/hooks";
import { useExperience } from "@/lib/store";
import { serviceById } from "@/lib/content";
import { OryxMark } from "@/components/brand/OryxMark";
import { Doors } from "./Doors";
import { Journey } from "./Journey";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The contact experience.
 *
 * Clicking contact never lands on a form. It opens a gateway with one
 * question, then a journey shaped to the service that was chosen.
 * Closing keeps every answer, so leaving to check something is not a
 * punishment.
 *
 * The overlay is a cream surface with charcoal ink, so arriving here
 * feels like staying in the same world rather than falling into a
 * separate application. It arrives the way a scene does: the surface
 * fades, then the contents settle a beat later. Under reduced motion
 * both are a plain fade.
 */
export function ContactGateway() {
  const open = useExperience((s) => s.contactOpen);
  const close = useExperience((s) => s.closeContact);
  const serviceId = useExperience((s) => s.contactService);
  const status = useExperience((s) => s.status);
  const trap = useFocusTrap(open);
  const reduce = useReducedMotion();

  useScrollLock(open);
  useEscape(open, close);

  const service = serviceId ? serviceById(serviceId) : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] bg-[color:var(--surface)] text-[color:var(--ink)]"
          style={
            {
              ["--accent" as string]: service?.accent ?? "#b48a50",
            } as React.CSSProperties
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.25 : 0.5, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Contact ORYX"
        >
          <motion.div
            ref={trap}
            className="flex h-full flex-col"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0.25 : 0.8,
              delay: reduce ? 0 : 0.08,
              ease: EASE,
            }}
          >
            <header className="relative z-20 flex h-[var(--nav-h)] shrink-0 items-center justify-between border-b border-[color:var(--line-soft)] px-6 sm:px-10 lg:px-14">
              <div className="flex items-center gap-3 text-[color:var(--accent)]">
                <OryxMark size={24} strokeWidth={2.4} />
                <span
                  className="block h-4 w-px"
                  style={{ background: "var(--line)" }}
                  aria-hidden="true"
                />
                <span className="font-mono text-[0.625rem] tracking-[0.2em] text-[color:var(--ink-muted)]">
                  {status === "success" ? "REQUEST SENT" : "NEW REQUEST"}
                </span>
              </div>
              <button
                type="button"
                onClick={close}
                className="control -mr-2 flex items-center gap-2.5 px-3 py-2 text-sm text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--ink)]"
                aria-label="Close. Your answers are kept."
              >
                <span className="hidden sm:inline">Close</span>
                <X size={20} />
              </button>
            </header>

            <div className="relative min-h-0 flex-1">
              <AnimatePresence mode="wait">
                {service === null ? (
                  <motion.div
                    key="doors"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0.2 : 0.45, ease: EASE }}
                  >
                    <Doors />
                  </motion.div>
                ) : (
                  <motion.div
                    key={service.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0.2 : 0.45, ease: EASE }}
                  >
                    <Journey service={service} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
