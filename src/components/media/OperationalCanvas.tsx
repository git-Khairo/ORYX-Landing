"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import type { CanvasVariant } from "@/lib/content";

/**
 * The operational media layer.
 *
 * Every variant draws an idea from the brief rather than decoration:
 * routes are coordination, sweep is progressive clarity, plan is the
 * building, telemetry is visibility, pulse is one signal reaching many
 * disciplines, converge is complexity becoming order.
 *
 * Runs only while on screen. Under reduced motion it paints a single
 * composed frame, so the picture is still there and nothing moves.
 */

type Tone = "dark" | "light";

interface Palette {
  line: (a: number) => string;
  accent: (a: number) => string;
}

type Painter = (
  c: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  p: Palette,
  /** Density multiplier. 1 is the full drawing, below 1 thins it out. */
  d: number,
) => void;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const cubic = (
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number,
) => {
  const u = 1 - t;
  return (
    u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  );
};

/* ------------------------------------------------------------------ */

const drift: Painter = (c, w, h, t, p, d) => {
  // Three parallax planes of hairlines: depth without parallax jank.
  for (let plane = 0; plane < 3; plane++) {
    const rnd = mulberry32(11 + plane * 97);
    const speed = 5 + plane * 9;
    const alpha = 0.05 + plane * 0.028;
    const count = Math.max(4, Math.round(12 * d));
    c.lineWidth = plane === 2 ? 1.25 : 1;
    for (let i = 0; i < count; i++) {
      const span = w * 1.6;
      const base = rnd() * span;
      const x = ((base + t * speed) % span) - w * 0.3;
      const top = h * (0.1 + rnd() * 0.3);
      const len = h * (0.28 + rnd() * 0.5);
      const g = c.createLinearGradient(0, top, 0, top + len);
      g.addColorStop(0, p.line(0));
      g.addColorStop(0.45, p.line(alpha));
      g.addColorStop(1, p.line(0));
      c.strokeStyle = g;
      c.beginPath();
      c.moveTo(x, top);
      c.lineTo(x, top + len);
      c.stroke();
    }
  }

  // Horizon: the single warm event in the frame.
  const hy = h * 0.66;
  const g = c.createLinearGradient(0, hy - h * 0.22, 0, hy + h * 0.06);
  g.addColorStop(0, p.accent(0));
  g.addColorStop(1, p.accent(0.13));
  c.fillStyle = g;
  c.fillRect(0, hy - h * 0.22, w, h * 0.28);
  c.strokeStyle = p.accent(0.3);
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(0, hy);
  c.lineTo(w, hy);
  c.stroke();

  // Sparse drifting motes: presence of activity, not confetti.
  const rnd = mulberry32(4242);
  const motes = Math.max(8, Math.round(26 * d));
  for (let i = 0; i < motes; i++) {
    const sx = rnd();
    const sy = rnd();
    const sp = 4 + rnd() * 12;
    const x = ((sx * w + t * sp) % (w + 60)) - 30;
    const y = sy * h + Math.sin(t * 0.35 + i) * 8;
    c.fillStyle = p.line(0.1 + rnd() * 0.12);
    c.fillRect(x, y, 1.5, 1.5);
  }
};

const routes: Painter = (c, w, h, t, p, d) => {
  const lanes = Math.max(2, Math.round(5 * d));
  for (let i = 0; i < lanes; i++) {
    const rnd = mulberry32(700 + i * 31);
    const y0 = h * (0.16 + i * 0.17);
    const y1 = y0 + (rnd() - 0.5) * h * 0.22;
    const cy1 = y0 + (rnd() - 0.5) * h * 0.5;
    const cy2 = y1 + (rnd() - 0.5) * h * 0.5;

    c.strokeStyle = p.line(0.14);
    c.lineWidth = 1;
    c.beginPath();
    for (let s = 0; s <= 60; s++) {
      const u = s / 60;
      const x = u * w;
      const y = cubic(u, y0, cy1, cy2, y1);
      s === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
    }
    c.stroke();

    // Travelling units. Position is the schedule made visible.
    const units = 2;
    for (let k = 0; k < units; k++) {
      const phase = (t * (0.055 + i * 0.012) + k / units + i * 0.13) % 1;
      const x = phase * w;
      const y = cubic(phase, y0, cy1, cy2, y1);

      const trail = c.createLinearGradient(x - 130, 0, x, 0);
      trail.addColorStop(0, p.accent(0));
      trail.addColorStop(1, p.accent(0.5));
      c.strokeStyle = trail;
      c.lineWidth = 1.5;
      c.beginPath();
      for (let s = 0; s <= 18; s++) {
        const u = Math.max(0, phase - (1 - s / 18) * 0.09);
        c.lineTo(u * w, cubic(u, y0, cy1, cy2, y1));
      }
      c.stroke();

      c.fillStyle = p.accent(0.95);
      c.beginPath();
      c.arc(x, y, 2.4, 0, Math.PI * 2);
      c.fill();
    }

    // Handover points: where responsibility changes hands.
    for (let k = 1; k < 4; k++) {
      const u = k / 4;
      const x = u * w;
      const y = cubic(u, y0, cy1, cy2, y1);
      c.strokeStyle = p.line(0.22);
      c.lineWidth = 1;
      c.strokeRect(x - 3, y - 3, 6, 6);
    }
  }
};

const sweep: Painter = (c, w, h, t, p, d) => {
  const cell = 46;
  const x = (((t * 0.055) % 1.5) - 0.25) * w;

  // Ahead of the sweep: unresolved. Behind it: resolved.
  const rnd = mulberry32(31337);
  const specks = Math.max(90, Math.round(420 * d));
  for (let i = 0; i < specks; i++) {
    const px = rnd() * w;
    const py = rnd() * h;
    if (px < x) continue;
    const fade = Math.min(1, (px - x) / (w * 0.35));
    c.fillStyle = p.line(0.03 + fade * 0.1);
    c.fillRect(px, py, 1.4, 1.4);
  }

  c.lineWidth = 1;
  for (let gx = 0; gx < w + cell; gx += cell) {
    const on = gx < x;
    c.strokeStyle = p.line(on ? 0.1 : 0.028);
    c.beginPath();
    c.moveTo(gx, 0);
    c.lineTo(gx, h);
    c.stroke();
  }
  for (let gy = 0; gy < h + cell; gy += cell) {
    c.strokeStyle = p.line(0.055);
    c.beginPath();
    c.moveTo(0, gy);
    c.lineTo(Math.max(0, x), gy);
    c.stroke();
  }

  const band = c.createLinearGradient(x - 90, 0, x + 30, 0);
  band.addColorStop(0, p.accent(0));
  band.addColorStop(0.75, p.accent(0.14));
  band.addColorStop(1, p.accent(0));
  c.fillStyle = band;
  c.fillRect(x - 90, 0, 120, h);

  c.strokeStyle = p.accent(0.42);
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(x, 0);
  c.lineTo(x, h);
  c.stroke();
};

const plan: Painter = (c, w, h, t, p, d) => {
  const rnd = mulberry32(9091);
  const rooms: [number, number, number, number][] = [];
  const cols = d < 0.8 ? 3 : 4;
  const rows = d < 0.8 ? 2 : 3;
  const pad = Math.min(w, h) * 0.08;
  const cw = (w - pad * 2) / cols;
  const ch = (h - pad * 2) / rows;
  for (let r = 0; r < rows; r++) {
    for (let cx = 0; cx < cols; cx++) {
      const inset = 6 + rnd() * 16;
      rooms.push([
        pad + cx * cw + inset,
        pad + r * ch + inset,
        cw - inset * 2,
        ch - inset * 2,
      ]);
    }
  }

  // Systems running between rooms: the coordination layer.
  c.strokeStyle = p.line(0.07);
  c.lineWidth = 1;
  for (let i = 0; i < rooms.length - 1; i++) {
    const a = rooms[i];
    const b = rooms[i + 1];
    const ax = a[0] + a[2] / 2;
    const ay = a[1] + a[3] / 2;
    const bx = b[0] + b[2] / 2;
    const by = b[1] + b[3] / 2;
    c.beginPath();
    c.moveTo(ax, ay);
    c.lineTo(bx, ay);
    c.lineTo(bx, by);
    c.stroke();
  }

  const active = Math.floor(t / 1.15) % rooms.length;
  const phase = (t / 1.15) % 1;
  rooms.forEach((r, i) => {
    const isActive = i === active;
    c.strokeStyle = isActive ? p.accent(0.55) : p.line(0.13);
    c.lineWidth = isActive ? 1.4 : 1;
    c.strokeRect(r[0], r[1], r[2], r[3]);
    if (isActive) {
      c.fillStyle = p.accent(0.07 * (1 - phase));
      c.fillRect(r[0], r[1], r[2], r[3]);
      c.fillStyle = p.accent(0.8);
      c.fillRect(r[0] + 6, r[1] + 6, 4, 4);
    }
  });
};

const telemetry: Painter = (c, w, h, t, p, d) => {
  const rowsN = Math.max(3, Math.round(7 * d));
  const top = h * 0.16;
  const gap = (h * 0.68) / (rowsN - 1);
  const scan = ((t * 0.08) % 1.25) * w;

  for (let i = 0; i < rowsN; i++) {
    const rnd = mulberry32(5000 + i * 17);
    const y = top + i * gap;

    c.strokeStyle = p.line(0.09);
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(w * 0.06, y);
    c.lineTo(w * 0.94, y);
    c.stroke();

    // Scheduled blocks along an operational timeline.
    let x = w * 0.06;
    while (x < w * 0.94) {
      const len = 24 + rnd() * 90;
      const on = rnd() > 0.42;
      if (on) {
        const passed = scan > x;
        c.fillStyle = passed ? p.accent(0.32) : p.line(0.1);
        c.fillRect(x, y - 3, Math.min(len, w * 0.94 - x), 6);
      }
      x += len + 14 + rnd() * 40;
    }

    c.fillStyle = p.line(0.2);
    c.fillRect(w * 0.06 - 10, y - 1, 4, 2);
  }

  const g = c.createLinearGradient(scan - 60, 0, scan, 0);
  g.addColorStop(0, p.accent(0));
  g.addColorStop(1, p.accent(0.18));
  c.fillStyle = g;
  c.fillRect(scan - 60, top - 30, 60, gap * (rowsN - 1) + 60);
  c.strokeStyle = p.accent(0.5);
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(scan, top - 30);
  c.lineTo(scan, top + gap * (rowsN - 1) + 30);
  c.stroke();
};

const pulse: Painter = (c, w, h, t, p) => {
  const cx = w / 2;
  const cy = h / 2;
  const rx = Math.min(w * 0.34, 380);
  const ry = Math.min(h * 0.34, 260);
  const n = 6;

  for (let k = 0; k < 3; k++) {
    const prog = ((t * 0.24 + k / 3) % 1);
    c.strokeStyle = p.accent(0.24 * (1 - prog));
    c.lineWidth = 1;
    c.beginPath();
    c.ellipse(cx, cy, rx * prog, ry * prog, 0, 0, Math.PI * 2);
    c.stroke();
  }

  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;

    c.strokeStyle = p.line(0.1);
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(cx, cy);
    c.lineTo(x, y);
    c.stroke();

    const reach = ((t * 0.24) % 1) * 1;
    const hit = Math.abs(reach - 1) < 0.12 || Math.abs(reach - 0.99) < 0.12;
    c.strokeStyle = hit ? p.accent(0.75) : p.line(0.28);
    c.lineWidth = 1;
    c.beginPath();
    c.arc(x, y, 5, 0, Math.PI * 2);
    c.stroke();
  }

  c.fillStyle = p.accent(0.9);
  c.beginPath();
  c.arc(cx, cy, 3.2, 0, Math.PI * 2);
  c.fill();
};

const organic: Painter = (c, w, h, t, p) => {
  // Slow, low frequency. The one place the system breathes.
  for (let i = 0; i < 7; i++) {
    const y0 = h * (0.2 + i * 0.1);
    c.strokeStyle = i === 3 ? p.accent(0.3) : p.line(0.08 + i * 0.006);
    c.lineWidth = i === 3 ? 1.3 : 1;
    c.beginPath();
    for (let x = 0; x <= w; x += 8) {
      const y =
        y0 +
        Math.sin(x * 0.0035 + t * 0.14 + i * 0.8) * (12 + i * 3) +
        Math.sin(x * 0.0011 - t * 0.08) * 9;
      x === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
    }
    c.stroke();
  }
};

const converge: Painter = (c, w, h, t, p, d) => {
  const n = Math.max(24, Math.round(84 * d));
  const cols = 7;
  const period = 9;
  const raw = (t % period) / period;
  // Hold scattered, organise, hold ordered, release.
  const k =
    raw < 0.18
      ? 0
      : raw < 0.46
        ? (raw - 0.18) / 0.28
        : raw < 0.78
          ? 1
          : 1 - (raw - 0.78) / 0.22;
  const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

  const rnd = mulberry32(2024);
  const padX = w * 0.16;
  const padY = h * 0.2;
  const colW = (w - padX * 2) / (cols - 1);
  const rowsN = Math.ceil(n / cols);
  const rowH = (h - padY * 2) / (rowsN - 1);

  for (let i = 0; i < n; i++) {
    const sx = rnd() * w;
    const sy = rnd() * h;
    const tx = padX + (i % cols) * colW;
    const ty = padY + Math.floor(i / cols) * rowH;
    const x = sx + (tx - sx) * e;
    const y = sy + (ty - sy) * e;
    c.fillStyle = p.line(0.14 + 0.2 * e);
    c.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
  }

  if (e > 0.55) {
    const a = (e - 0.55) / 0.45;
    c.strokeStyle = p.accent(0.18 * a);
    c.lineWidth = 1;
    for (let cxi = 0; cxi < cols; cxi++) {
      const x = padX + cxi * colW;
      c.beginPath();
      c.moveTo(x, padY - 14);
      c.lineTo(x, padY + rowH * (rowsN - 1) + 14);
      c.stroke();
    }
  }
};

const PAINTERS: Record<CanvasVariant, Painter> = {
  drift,
  routes,
  sweep,
  plan,
  telemetry,
  pulse,
  organic,
  converge,
};

/* ------------------------------------------------------------------ */

export function OperationalCanvas({
  variant,
  accent,
  tone = "dark",
  className = "",
  /**
   * Thins the drawing out. The service territories run at well under 1
   * because three drawings side by side, each behind a panel of type,
   * was simply too much texture at once.
   */
  density = 1,
  /** Frozen frame used for reduced motion and first paint. */
  seedTime = 3.4,
}: {
  variant: CanvasVariant;
  accent: string;
  tone?: Tone;
  className?: string;
  density?: number;
  seedTime?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const base = tone === "light" ? "11,15,18" : "243,240,232";
    const rgb = hexToRgb(accent);
    const palette: Palette = {
      line: (a) => `rgba(${base},${a})`,
      accent: (a) => `rgba(${rgb},${a})`,
    };
    const paint = PAINTERS[variant];

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let start = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      paint(ctx, w, h, time, palette, density);
    };

    const loop = (now: number) => {
      if (!start) start = now;
      frame(seedTime + (now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      start = 0;
    };

    resize();
    frame(seedTime);

    const ro = new ResizeObserver(() => {
      resize();
      if (!raf) frame(seedTime);
    });
    ro.observe(canvas);

    // Only the scenes you can actually see cost anything.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (reduce) return;
        if (visible && !raf) raf = requestAnimationFrame(loop);
        if (!visible) stop();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible && !reduce && !raf) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [variant, accent, tone, reduce, seedTime, density]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

function hexToRgb(hex: string) {
  const v = hex.replace("#", "");
  const n = parseInt(
    v.length === 3
      ? v
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : v,
    16,
  );
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
