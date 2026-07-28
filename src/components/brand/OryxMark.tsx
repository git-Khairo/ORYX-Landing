"use client";

/**
 * The ORYX brand mark.
 *
 * An abstract line silhouette: two long horns and a head profile,
 * reduced to the fewest strokes that still read as alert. It is a
 * mark, not a mascot. It never speaks and never performs.
 *
 * `draw` animates the strokes as if the route line is forming it,
 * which is the device the opening moment uses.
 */
export function OryxMark({
  size = 40,
  className = "",
  draw = false,
  duration = 1.1,
  strokeWidth = 2.2,
}: {
  size?: number;
  className?: string;
  draw?: boolean;
  duration?: number;
  strokeWidth?: number;
}) {
  const style = draw
    ? ({
        strokeDasharray: 140,
        strokeDashoffset: 140,
        animation: `oryx-draw ${duration}s cubic-bezier(0.16,1,0.3,1) forwards`,
      } as React.CSSProperties)
    : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M23 41 Q35 24 52 7" style={style} />
      <path
        d="M15 38 Q28 20 41 5"
        style={style ? { ...style, animationDelay: "0.08s" } : undefined}
      />
      <path
        d="M23 41 Q16 47 17 55 Q18 61 27 61"
        style={style ? { ...style, animationDelay: "0.16s" } : undefined}
      />
      <path
        d="M15 38 L23 41"
        style={style ? { ...style, animationDelay: "0.22s" } : undefined}
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-medium leading-none tracking-[0.34em] ${className}`}
      style={{ letterSpacing: "0.34em" }}
    >
      ORYX
    </span>
  );
}
