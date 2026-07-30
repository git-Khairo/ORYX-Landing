"use client";

import { useEffect, useRef } from "react";

/**
 * A field of flowing contour lines, full bleed behind the hero.
 *
 * Thin hairlines run edge to edge, each a slow sum of sines so the
 * whole field ripples like a topographic or wind map. A soft focal
 * repulsion bows the lines clear of the mark, so the logo reads as
 * standing within the field rather than on top of a flat picture. One
 * line carries the accent; the rest are quiet ink.
 *
 * Cheap on purpose: capped frame rate, capped DPR, paused on a hidden
 * tab. Under reduced motion it paints a single still frame and stops.
 * Colour is read from the palette tokens, so a palette swap retints it.
 */
export function ContourField({
  focusX = 0.72,
  focusY = 0.46,
}: {
  focusX?: number;
  focusY?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;

    let ink: [number, number, number] = [23, 20, 26];
    let accent: [number, number, number] = [232, 100, 30];
    const hexToRgb = (hex: string): [number, number, number] | null => {
      const m = hex.trim().replace("#", "");
      if (m.length < 6) return null;
      const n = parseInt(m.slice(0, 6), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      const i = hexToRgb(cs.getPropertyValue("--ink"));
      if (i) ink = i;
      const a = cs.getPropertyValue("--accent-rgb").trim();
      if (a) {
        const parts = a.split(",").map((v) => parseInt(v, 10));
        if (parts.length === 3 && parts.every((v) => !Number.isNaN(v)))
          accent = parts as [number, number, number];
      }
    };
    readColors();
    const observer = new MutationObserver(readColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-palette"],
    });

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

    const onResize = () => setSize();
    window.addEventListener("resize", onResize);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const fx = w * focusX;
      const fy = h * focusY;
      const gap = 40;
      const count = Math.ceil(h / gap) + 2;
      const step = 12;
      const sigma = Math.min(w, h) * 0.26;
      const accentLine = Math.floor(count * 0.5);

      for (let li = 0; li < count; li++) {
        const baseY = li * gap - gap;
        const isAccent = li === accentLine;
        ctx.beginPath();
        for (let x = -step; x <= w + step; x += step) {
          // Layered sines, drifting with time, phase offset per line.
          const p = li * 0.6;
          let y =
            baseY +
            18 * Math.sin(x * 0.006 + p + t * 0.18) +
            10 * Math.sin(x * 0.013 - p * 0.7 - t * 0.12) +
            5 * Math.sin(x * 0.026 + t * 0.22);
          // Bow the field clear of the focal point.
          const dx = x - fx;
          const infl = Math.exp(-(dx * dx) / (2 * sigma * sigma));
          const dir = baseY < fy ? -1 : 1;
          y += dir * infl * 46 * Math.exp(-Math.abs(baseY - fy) / (h * 0.5));
          if (x === -step) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const [r, g, b] = isAccent ? accent : ink;
        const alpha = isAccent ? 0.5 : 0.14;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = isAccent ? 1.3 : 0.8;
        ctx.stroke();
      }
    };

    if (reduce) {
      draw(0);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", onResize);
      };
    }

    let raf = 0;
    let last = performance.now();
    let time = 0;
    const targetMs = 1000 / 30;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = now - last;
      if (dt < targetMs) return;
      last = now;
      time += dt / 1000;
      draw(time);
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
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [focusX, focusY]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
