"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { StageVariant } from "./Stage3D";

/**
 * Lazy, in-view gate for a 3D mark stage.
 *
 * next/dynamic (ssr:false) keeps three, R3F and drei out of the initial
 * route bundle and off the server. The IntersectionObserver then keeps
 * only the stages near the viewport mounted, so the page never holds
 * more than a couple of live WebGL contexts at once even though several
 * sections each want one. A stage scrolled well away is unmounted, which
 * frees its context; scrolling back re-creates it.
 *
 * The hero stage passes `eager` so it is present from first paint.
 */
const Stage3D = dynamic(() => import("./Stage3D").then((m) => m.Stage3D), {
  ssr: false,
  loading: () => null,
});

export function MarkStage({
  variant,
  eager = false,
}: {
  variant: StageVariant;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "40% 0px 40% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  return (
    <div ref={ref} className="h-full w-full">
      {visible ? <Stage3D variant={variant} /> : null}
    </div>
  );
}
