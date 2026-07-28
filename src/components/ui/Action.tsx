"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight, ArrowLeft } from "@phosphor-icons/react";

type Variant = "primary" | "ghost" | "quiet";

/**
 * The only button in the system. Pill radius, contrast checked against
 * both tones of the world, the cream scenes and the three charcoal
 * moments.
 *
 * The primary fill is pinned to brand gold with charcoal text, and it
 * does not follow the scene accent. That is a contrast decision, not a
 * stylistic one: no single text colour clears AA against all four
 * accents. Gold on charcoal is 5.44:1 and leaf is 4.61:1, but rust
 * with charcoal is 2.85:1, while flipping to light text breaks gold
 * (2.98:1) and leaf (3.52:1). So the accent lives in rules, numerals
 * and underlines, and the one filled control in the system stays gold
 * with charcoal type everywhere. Ghost and quiet follow the scene.
 */
export function Action({
  variant = "primary",
  arrow = "right",
  children,
  className = "",
  ...rest
}: {
  variant?: Variant;
  arrow?: "right" | "left" | "none";
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles: Record<Variant, string> = {
    primary:
      "bg-gold text-charcoal hover:bg-tan border border-transparent",
    ghost:
      "border border-[color:color-mix(in_oklab,var(--ink)_34%,transparent)] text-[color:var(--ink)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] bg-[color:color-mix(in_oklab,var(--surface)_55%,transparent)] backdrop-blur-sm",
    quiet:
      "border border-transparent text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]",
  };

  return (
    <button
      type="button"
      className={`control group inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap px-6 py-3.5 text-sm font-medium tracking-tight disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
      {...rest}
    >
      {arrow === "left" ? (
        <ArrowLeft
          size={15}
          weight="bold"
          className="transition-transform duration-300 group-hover:-translate-x-1"
        />
      ) : null}
      {children}
      {arrow === "right" ? (
        <ArrowRight
          size={15}
          weight="bold"
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      ) : null}
    </button>
  );
}

/**
 * The directional line in the hero. It is the one place the brief asks
 * for a downward guide, so it is a drawn line rather than a label.
 */
export function DirectionalGuide({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex h-20 w-px items-start justify-center overflow-hidden bg-[color:color-mix(in_oklab,var(--ink)_16%,transparent)] ${className}`}
    >
      <span
        className="block h-8 w-px bg-[color:var(--accent)]"
        style={{ animation: "oryx-guide 2.6s cubic-bezier(0.65,0,0.35,1) infinite" }}
      />
      <style>{`@keyframes oryx-guide{0%{transform:translateY(-100%)}60%,100%{transform:translateY(320%)}}`}</style>
    </div>
  );
}
