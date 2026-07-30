"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The ORYX logo with its white background keyed out to transparency.
 *
 * The supplied artwork is black on a solid white JPG. For the hero we
 * need genuine transparency, not the multiply trick, so the orbital
 * illustration can pass behind the horns and a real accent glow can
 * follow their silhouette. The image is same origin, so reading pixels
 * back off a canvas is untainted: near white becomes fully clear, the
 * black art stays, and the narrow band between is turned into a soft
 * alpha edge so nothing looks cut out.
 */
export function LogoCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const frame = ctx.getImageData(0, 0, w, h);
      const a = frame.data;
      for (let i = 0; i < a.length; i += 4) {
        const lum = (a[i] + a[i + 1] + a[i + 2]) / 3;
        // Opaque under 200, clear over 240, feathered between.
        let alpha: number;
        if (lum <= 200) alpha = 255;
        else if (lum >= 240) alpha = 0;
        else alpha = Math.round((255 * (240 - lum)) / 40);
        a[i + 3] = alpha;
      }
      ctx.putImageData(frame, 0, 0);
      setReady(true);
    };
    img.src = "/brand/logo.jpg";
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ opacity: ready ? 1 : 0, transition: "opacity 0.5s ease" }}
      aria-hidden="true"
    />
  );
}
