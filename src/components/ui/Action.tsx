"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight, ArrowLeft } from "@phosphor-icons/react";

type Variant = "primary" | "ghost" | "quiet";

/**
 * The only button in the system. Pill radius, one dark stage.
 *
 * The old note here described gold on cream and a rule that no single
 * text colour cleared AA against four accents. Inverting the world
 * dissolved that problem: every accent now sits on a near black base,
 * and the filled control pairs `--accent` with `--accent-ink`, which
 * is the token that exists precisely so a fill always knows what
 * colour its own label should be. Each palette declares that pairing
 * once, so a filled button is correct in all three by construction
 * rather than by audit.
 *
 * The accent still never carries body text. It carries fills, rules,
 * numerals and edges.
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
      "bg-[color:var(--accent)] text-[color:var(--accent-ink)] border border-transparent hover:brightness-110",
    ghost:
      "border border-[color:color-mix(in_oklab,var(--ink)_34%,transparent)] text-[color:var(--ink)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] bg-[color:color-mix(in_oklab,var(--base)_55%,transparent)] backdrop-blur-sm",
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
