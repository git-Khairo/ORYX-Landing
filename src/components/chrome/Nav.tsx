"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { List, X, Check } from "@phosphor-icons/react";
import { CHAPTERS } from "@/lib/chapters";
import { useExperience } from "@/lib/store";
import { OryxMark, Wordmark } from "@/components/brand/OryxMark";
import { Action } from "@/components/ui/Action";

const NAV_ITEMS = CHAPTERS.filter((c) => c.nav && c.id !== "contact");

const LANGUAGES = [
  { code: "en", label: "English", ready: true },
  { code: "nl", label: "Nederlands", ready: false },
  { code: "ar", label: "العربية", ready: false },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pauseTimer = useRef<number | null>(null);
  const last = useRef(0);

  
  const activeScene = useExperience((s) => s.activeScene);
  const openContact = useExperience((s) => s.openContact);
  const serviceOpen = useExperience((s) => s.activeService !== null);

  // Quieter while moving down, back on the way up or on a pause.
  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - last.current;
    last.current = y;
    setLifted(y > 40);
    if (y > 220 && delta > 6) setHidden(true);
    if (delta < -6) setHidden(false);
    if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(() => setHidden(false), 900);
  });

  useEffect(
    () => () => {
      if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!langOpen) return;
    const close = () => setLangOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [langOpen]);

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // The bar has no surface of its own, so it borrows the ink of the
  // scene it is floating over.
  // One tone now, so the chrome no longer has to guess.
  const ink = "var(--ink)";

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[80] transition-colors duration-500"
        style={{ color: ink }}
        animate={{ y: hidden && !menuOpen ? "-105%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: lifted && !menuOpen ? 1 : 0,
            /* One tone, so one gradient. It fades the stage out under
               the bar rather than covering it. */
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--base) 88%, transparent), transparent)",
            backdropFilter: "blur(6px)",
            maskImage: "linear-gradient(to bottom, #000 55%, transparent)",
          }}
          aria-hidden="true"
        />

        <nav
          aria-label="Primary"
          className="relative mx-auto flex h-[var(--nav-h)] w-full max-w-[104rem] items-center justify-between gap-6 px-6 sm:px-10 lg:px-16"
        >
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              goTo("hero");
            }}
            className="flex items-center gap-3 text-current"
            aria-label="ORYX, back to the start"
          >
            <OryxMark size={26} strokeWidth={2.4} />
            <Wordmark className="text-[0.9rem]" />
          </a>

          <div className="hidden items-center gap-9 lg:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                aria-current={activeScene === item.id ? "true" : undefined}
                className="relative text-[0.8125rem] tracking-tight opacity-70 transition-opacity duration-300 hover:opacity-100 aria-[current]:opacity-100"
              >
                {item.label}
                {activeScene === item.id && !serviceOpen ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-2 left-0 h-px w-full bg-[color:var(--accent)]"
                  />
                ) : null}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen((v) => !v);
                }}
                aria-expanded={langOpen}
                aria-haspopup="menu"
                style={{
                  borderColor: "color-mix(in oklab, currentColor 28%, transparent)",
                }}
                className="control border px-3.5 py-2 font-mono text-[0.6875rem] tracking-[0.18em] opacity-70 transition-opacity hover:opacity-100"
              >
                EN
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-[calc(100%+0.6rem)] w-52 border border-[color:var(--line-soft)] bg-[color:var(--surface-raised)] p-1.5 text-[color:var(--ink)] shadow-2xl"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        role="menuitem"
                        type="button"
                        disabled={!l.ready}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[0.8125rem] transition-colors hover:bg-[color:var(--surface-raised)] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <span>{l.label}</span>
                        {l.ready ? (
                          <Check
                            size={13}
                            weight="bold"
                            className="text-[color:var(--accent)]"
                          />
                        ) : (
                          <span className="font-mono text-[0.5625rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
                            SOON
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Action
              variant="ghost"
              arrow="none"
              className="hidden px-5 py-2.5 text-[0.8125rem] sm:inline-flex"
              onClick={() => openContact()}
            >
              Contact us
            </Action>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="control -mr-2 p-2 lg:hidden"
              aria-label="Open menu"
            >
              <List size={22} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu: the same journey, listed. A charcoal panel over the
          warm world, so it declares its tone and lets the tokens flip. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            
            className="fixed inset-0 z-[95] bg-[color:var(--base)] text-[color:var(--ink)] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-[var(--nav-h)] items-center justify-between px-6">
              <OryxMark size={26} strokeWidth={2.4} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="control -mr-2 p-2"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col px-6 pt-6" aria-label="Sections">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(item.id)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                  className="flex items-baseline gap-5 border-b border-[color:var(--line-soft)] py-6 text-left"
                >
                  <span className="t-index text-xs text-[color:var(--accent)]">
                    {item.index}
                  </span>
                  <span className="text-3xl tracking-tight">{item.label}</span>
                </motion.button>
              ))}
              <Action
                className="mt-10 justify-center"
                onClick={() => {
                  setMenuOpen(false);
                  openContact();
                }}
              >
                Contact us
              </Action>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
