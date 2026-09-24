"use client";

import * as React from "react";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export interface AnimatedBeamProps {
  /** Ref of the element that contains both endpoints (defines the SVG coordinate space). */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Ref of the start element. */
  fromRef: React.RefObject<HTMLElement | null>;
  /** Ref of the end element. */
  toRef: React.RefObject<HTMLElement | null>;
  /** Curvature of the beam. Positive bows up, negative bows down. Default: 0. */
  curvature?: number;
  /** Reverse the travel direction of the light. Default: false. */
  reverse?: boolean;
  /** Duration of one travel pass in seconds. Default: 3. */
  duration?: number;
  /** Delay before the animation starts, in seconds. Default: 0. */
  delay?: number;
  /** Width of the beam stroke. Default: 2. */
  width?: number;
  /** Gradient start color. */
  gradientStart?: string;
  /** Gradient end color. */
  gradientStop?: string;
  /** Color of the static resting line. */
  pathColor?: string;
  /** Opacity of the static resting line. Default: 0.15. */
  pathOpacity?: number;
  /** Offset the start point (px). */
  startXOffset?: number;
  startYOffset?: number;
  /** Offset the end point (px). */
  endXOffset?: number;
  endYOffset?: number;
}

/**
 * Draws an SVG line between two DOM elements and animates a traveling light
 * along it — ideal for "how it works" / integration diagrams.
 *
 * The path is recomputed from the elements' bounding rects on mount and on any
 * container/window resize (via ResizeObserver), so it stays accurate through
 * responsive reflow. Under reduced motion the gradient is drawn statically.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  width = 2,
  gradientStart = "#7c3aed",
  gradientStop = "#22d3ee",
  pathColor = "currentColor",
  pathOpacity = 0.15,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const id = React.useId().replace(/[:]/g, "");
  const reduced = useReducedMotion();
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [path, setPath] = React.useState("");

  const updatePath = React.useCallback(() => {
    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    if (!container || !from || !to) return;

    const containerRect = container.getBoundingClientRect();
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    setDimensions({ width: containerRect.width, height: containerRect.height });

    const startX =
      fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
    const startY =
      fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
    const endX =
      toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
    const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

    const controlX = (startX + endX) / 2;
    const controlY = (startY + endY) / 2 - curvature;

    setPath(`M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`);
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  React.useEffect(() => {
    updatePath();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updatePath);
      return () => window.removeEventListener("resize", updatePath);
    }
    const observer = new ResizeObserver(updatePath);
    observer.observe(container);
    if (fromRef.current) observer.observe(fromRef.current);
    if (toRef.current) observer.observe(toRef.current);
    return () => observer.disconnect();
  }, [updatePath, containerRef, fromRef, toRef]);

  // Traveling light: reversing swaps the offset animation direction.
  const values = reverse
    ? { a: "1;-0.2", b: "1.2;0", c: "1.3;0.1", d: "1.5;0.2" }
    : { a: "-0.2;1", b: "0;1.2", c: "0.1;1.3", d: "0.2;1.5" };

  return (
    <svg
      aria-hidden
      fill="none"
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      className="pointer-events-none absolute left-0 top-0"
      style={{ color: pathColor }}
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth={width}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={path}
        stroke={`url(#beam-${id})`}
        strokeWidth={width}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id={`beam-${id}`}
          gradientUnits="userSpaceOnUse"
          x1={reduced ? "0%" : undefined}
          x2={reduced ? "100%" : undefined}
        >
          {reduced ? (
            <>
              <stop stopColor={gradientStart} />
              <stop offset="1" stopColor={gradientStop} />
            </>
          ) : (
            <>
              <stop stopColor={gradientStart} stopOpacity="0">
                <animate
                  attributeName="offset"
                  values={values.a}
                  dur={`${duration}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </stop>
              <stop stopColor={gradientStart}>
                <animate
                  attributeName="offset"
                  values={values.b}
                  dur={`${duration}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="0.2" stopColor={gradientStop}>
                <animate
                  attributeName="offset"
                  values={values.c}
                  dur={`${duration}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="0.3" stopColor={gradientStop} stopOpacity="0">
                <animate
                  attributeName="offset"
                  values={values.d}
                  dur={`${duration}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </stop>
            </>
          )}
        </linearGradient>
      </defs>
    </svg>
  );
}
