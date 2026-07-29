"use client";

import { useEffect, useRef } from "react";

/**
 * The ambient dust field.
 *
 * A fixed canvas behind the whole document: a few dozen slow, softly
 * glowing motes in the live accent. It is what makes the dark stage
 * read as air rather than as a flat colour, and it costs almost
 * nothing because of four deliberate limits:
 *
 *  - no per-particle shadowBlur, ever. The glow is one radial gradient
 *    per mote, which is an order of magnitude cheaper.
 *  - frame rate capped at 45fps. Dust does not need 120.
 *  - DPR capped at 1.5. Nobody can see the difference on motes.
 *  - the loop stops on a hidden tab and never starts under reduced
 *    motion, where the field simply is not there. Atmosphere is not
 *    content, so nothing is lost.
 *
 * Colour is read from the palette tokens, not passed in, so a palette
 * swap retints the dust in the same frame as everything else.
 */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Small screens get their battery back; the field is a desktop mood.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let accent = "46, 107, 255";
    const readAccent = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-rgb")
        .trim();
      if (v) accent = v;
    };
    readAccent();
    const observer = new MutationObserver(readAccent);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-palette"],
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const setSize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const count = Math.min(42, Math.round((w * h) / 38000));
    type Mote = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      a: number;
      tw: number;
    };
    const motes: Mote[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.4,
      vx: (Math.random() - 0.5) * 0.1,
      vy: -(Math.random() * 0.08 + 0.02), // drifting gently upward
      a: Math.random() * 0.4 + 0.15,
      tw: Math.random() * Math.PI * 2,
    }));

    const onResize = () => setSize();
    window.addEventListener("resize", onResize);

    let raf = 0;
    let last = performance.now();
    const targetMs = 1000 / 45;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < targetMs) return;
      last = now;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of motes) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.016;
        if (p.x < -6) p.x = w + 6;
        if (p.x > w + 6) p.x = -6;
        if (p.y < -6) p.y = h + 6;

        const tw = (Math.sin(p.tw) + 1) * 0.5;
        const a = p.a * (0.5 + tw * 0.6);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grad.addColorStop(0, `rgba(${accent}, ${a * 0.5})`);
        grad.addColorStop(1, `rgba(${accent}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${accent}, ${Math.min(1, a * 1.3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 opacity-70"
      aria-hidden="true"
    />
  );
}
