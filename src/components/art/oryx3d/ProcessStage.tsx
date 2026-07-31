"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Lazy, in-view gate for the process 3D stage. Same discipline as
 * MarkStage: the three/R3F bundle stays out of the initial route, and
 * the WebGL context only exists while the section is near the viewport.
 */
const ProcessStage3D = dynamic(
  () => import("./ProcessStage3D").then((m) => m.ProcessStage3D),
  { ssr: false, loading: () => null },
);

export function ProcessStage({ active }: { active: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "40% 0px 40% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {visible ? <ProcessStage3D active={active} /> : null}
    </div>
  );
}
