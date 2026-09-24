"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface AuroraBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Render the aurora as a static gradient with no motion. */
  static?: boolean;
  /** Show a subtle radial vignette that darkens the edges. Default: true. */
  vignette?: boolean;
  /** Animation speed multiplier. 1 = default, 2 = twice as fast. Default: 1. */
  speed?: number;
  children?: React.ReactNode;
}

/**
 * A full-bleed animated aurora — layered, slowly drifting gradient blobs that
 * sit behind your content.
 *
 * The motion is pure CSS (transform + opacity keyframes), so it runs on the
 * compositor and never touches React. It automatically freezes to a static
 * gradient when the user prefers reduced motion (handled in the stylesheet).
 */
export const AuroraBackground = React.forwardRef<
  HTMLDivElement,
  AuroraBackgroundProps
>(function AuroraBackground(
  {
    className,
    children,
    static: isStatic = false,
    vignette = true,
    speed = 1,
    style,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "sui-aurora relative isolate overflow-hidden bg-[--sui-bg]",
        className,
      )}
      style={
        {
          "--sui-aurora-speed": `${20 / Math.max(speed, 0.1)}s`,
          ...style,
        } as React.CSSProperties
      }
      data-static={isStatic ? "" : undefined}
      {...props}
    >
      <div aria-hidden className="sui-aurora__layers absolute inset-0 -z-10">
        <span className="sui-aurora__blob sui-aurora__blob--1" />
        <span className="sui-aurora__blob sui-aurora__blob--2" />
        <span className="sui-aurora__blob sui-aurora__blob--3" />
      </div>
      {vignette ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(0_0_0/0.55)_100%)]"
        />
      ) : null}
      {children}
    </div>
  );
});
