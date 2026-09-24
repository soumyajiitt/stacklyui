"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scroll vertically instead of horizontally. Default: false. */
  vertical?: boolean;
  /** Reverse the scroll direction. Default: false. */
  reverse?: boolean;
  /** Pause the animation while hovered. Default: true. */
  pauseOnHover?: boolean;
  /** Seconds for one full loop. Default: 40. */
  duration?: number;
  /** Gap between items (any CSS length). Default: "1rem". */
  gap?: string;
  /** Fade the leading/trailing edges with a mask. Default: true. */
  fade?: boolean;
  /** Number of times the children are repeated to fill the track. Default: 2. */
  repeat?: number;
  children: React.ReactNode;
}

/**
 * An infinite marquee. The track is duplicated `repeat` times and translated
 * with a single CSS keyframe animation, so scrolling runs entirely on the
 * compositor. Freezes under reduced motion (handled in the stylesheet).
 */
export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  function Marquee(
    {
      className,
      children,
      vertical = false,
      reverse = false,
      pauseOnHover = true,
      duration = 40,
      gap = "1rem",
      fade = true,
      repeat = 2,
      style,
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "sui-marquee",
          vertical ? "sui-marquee--vertical" : "sui-marquee--horizontal",
          pauseOnHover && "sui-marquee--pause-hover",
          fade && "sui-marquee--fade",
          className,
        )}
        style={
          {
            "--sui-marquee-duration": `${duration}s`,
            "--sui-marquee-gap": gap,
            "--sui-marquee-direction": reverse ? "reverse" : "normal",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} aria-hidden={i > 0} className="sui-marquee__track">
            {children}
          </div>
        ))}
      </div>
    );
  },
);
