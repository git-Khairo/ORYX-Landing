"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { CanvasVariant } from "@/lib/content";
import { clipFor, type SlotName } from "@/lib/media";
import type { Tone } from "@/components/layout/Scene";
import { OperationalCanvas } from "./OperationalCanvas";

export type ScrimKind = "edge" | "left" | "bottom" | "center" | "wash" | "none";

/**
 * One media slot.
 *
 * Film first, drawing as the floor. Three things this has to get
 * right, and all three are about not making the page pay for footage
 * it is not showing:
 *
 *  - Nothing is fetched until the scene is roughly a screen away.
 *  - Only the visible film decodes. Off screen videos are paused, not
 *    merely hidden, because a hidden video still burns decode budget.
 *  - Reduced motion gets the still poster frame and never a moving one.
 *
 * The film fades up from the scene's own drawing, so a slow network
 * shows a composed surface rather than a black rectangle, and a failed
 * request is simply never noticed.
 */
export function SceneMedia({
  slot,
  variant,
  accent,
  tone = "cream",
  scrim = "edge",
  className = "",
}: {
  /** Assigned footage. Omit for scenes that stay purely drawn. */
  slot?: SlotName;
  /** The operational drawing under the film, and the fallback. */
  variant: CanvasVariant;
  accent: string;
  tone?: Tone;
  scrim?: ScrimKind;
  className?: string;
}) {
  const clip = slot ? clipFor(slot) : null;
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  const [near, setNear] = useState(false);
  const [failed, setFailed] = useState(false);

  // Mount the source only once the scene is roughly a screen away.
  //
  // Measured first, observed second. An observer callback is not
  // guaranteed to arrive promptly, or at all, when the page is not
  // being composited, which would leave the hero showing its drawing
  // and never its film. Measuring on mount means anything already in
  // range plays immediately and the observer only has to catch what
  // scrolls into range later.
  useEffect(() => {
    const el = wrap.current;
    if (!el || !clip) return;

    const inRange = () => {
      const r = el.getBoundingClientRect();
      const margin = window.innerHeight * 1.2;
      return r.bottom > -margin && r.top < window.innerHeight + margin;
    };

    if (inRange()) {
      setNear(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "120% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [clip]);

  // Decode only while on screen.
  useEffect(() => {
    const el = wrap.current;
    const v = video.current;
    if (!el || !v || !near || reduce) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {
            /* autoplay refused: the drawing underneath carries the scene */
          });
        } else {
          v.pause();
        }
      },
      { threshold: 0.01 },
    );
    io.observe(el);

    const onHidden = () => {
      if (document.hidden) v.pause();
    };
    document.addEventListener("visibilitychange", onHidden);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [near, reduce]);

  const showVideo = clip && near && !failed;

  return (
    <div ref={wrap} className={`scene-media ${className}`}>
      <OperationalCanvas
        variant={variant}
        accent={accent}
        tone={tone === "cream" ? "light" : "dark"}
        className="absolute inset-0 h-full w-full"
      />

      {showVideo ? (
        <video
          ref={video}
          src={clip.src}
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
          onCanPlay={(e) => e.currentTarget.setAttribute("data-ready", "true")}
          onError={() => setFailed(true)}
        />
      ) : null}

      <Scrim kind={scrim} />
    </div>
  );
}

function Scrim({ kind }: { kind: ScrimKind }) {
  if (kind === "none") return null;

  /* Inherited from the scene, never passed in.
     Tone used to be declared twice, once on the Scene and again on the
     SceneMedia inside it, and forgetting the second one painted a
     cream veil across a charcoal scene. The scene now publishes
     --scrim-rgb and the scrim simply reads it, so the two can no
     longer disagree. */
  const base = "var(--scrim-rgb)";

  /**
   * Scrims protect copy. They are not a mood filter.
   *
   * Every one of these is now shaped so the region carrying type is
   * covered hard and the rest of the frame is left open. The previous
   * set covered the whole frame at 0.88 to 0.96 everywhere, which is
   * why the film read as a white haze rather than as footage.
   */
  const styles: Record<Exclude<ScrimKind, "none">, React.CSSProperties> = {
    // Vignette. Centre stays open, edges carry the weight.
    edge: {
      background: `radial-gradient(125% 100% at 50% 42%, rgba(${base},0) 0%, rgba(${base},0.24) 46%, rgba(${base},0.82) 82%, rgba(${base},0.97) 100%)`,
    },
    // A left hand column of copy. The right half of the frame is clear.
    left: {
      background: `linear-gradient(96deg, rgba(${base},0.97) 0%, rgba(${base},0.93) 30%, rgba(${base},0.5) 52%, rgba(${base},0.06) 78%, rgba(${base},0) 100%)`,
    },
    // The hero: film wide open at the top, solid under the headline.
    bottom: {
      background: `linear-gradient(to top, rgba(${base},0.96) 0%, rgba(${base},0.82) 26%, rgba(${base},0.28) 58%, rgba(${base},0.04) 82%, rgba(${base},0.22) 100%)`,
    },
    // Type sits centre. Open ring around it.
    center: {
      background: `radial-gradient(75% 60% at 50% 50%, rgba(${base},0.9) 0%, rgba(${base},0.72) 38%, rgba(${base},0.12) 72%, rgba(${base},0.4) 100%)`,
    },
    // Film as texture under a full column of copy. Still the heaviest
    // of the set, but no longer opaque.
    wash: {
      background: `linear-gradient(180deg, rgba(${base},0.9) 0%, rgba(${base},0.7) 40%, rgba(${base},0.66) 60%, rgba(${base},0.92) 100%)`,
    },
  };

  return <div className="scene-scrim" style={styles[kind]} />;
}
