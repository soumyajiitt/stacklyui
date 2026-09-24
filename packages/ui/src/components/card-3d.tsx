"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max tilt in degrees at the edges. Default: 12. */
  tilt?: number;
  /** Show a moving light glare across the surface. Default: true. */
  glare?: boolean;
  /** How far the card lifts toward the viewer on hover (px). Default: 40. */
  lift?: number;
  children?: React.ReactNode;
}

/**
 * A card that tilts in 3D toward the cursor with a perspective transform and an
 * optional light glare.
 *
 * The rotation is written to CSS custom properties on pointer move via
 * `requestAnimationFrame`, so tracking the cursor never re-renders React — the
 * transform reads `var(--rx)` / `var(--ry)`. Tilt is disabled under reduced
 * motion. Add `preserve-3d` children (with `translateZ`) for layered depth.
 */
export const Card3D = React.forwardRef<HTMLDivElement, Card3DProps>(
  function Card3D(
    {
      className,
      children,
      tilt = 12,
      glare = true,
      lift = 40,
      style,
      onPointerMove,
      onPointerEnter,
      onPointerLeave,
      ...props
    },
    ref,
  ) {
    const reduced = useReducedMotion();
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    const frame = React.useRef<number | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);
      const node = innerRef.current;
      if (reduced || !node) return;
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        node.style.setProperty("--ry", `${(px - 0.5) * tilt * 2}deg`);
        node.style.setProperty("--rx", `${(0.5 - py) * tilt * 2}deg`);
        node.style.setProperty("--gx", `${px * 100}%`);
        node.style.setProperty("--gy", `${py * 100}%`);
      });
    };

    const handleEnter = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(event);
      innerRef.current?.style.setProperty("--active", "1");
    };

    const handleLeave = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(event);
      const node = innerRef.current;
      if (!node) return;
      node.style.setProperty("--active", "0");
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
    };

    return (
      <div
        ref={setRefs}
        className={cn("sui-card3d", glare && "sui-card3d--glare", className)}
        style={
          {
            "--sui-card3d-lift": `${lift}px`,
            "--active": "0",
            "--rx": "0deg",
            "--ry": "0deg",
            ...style,
          } as React.CSSProperties
        }
        onPointerMove={handleMove}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        {...props}
      >
        <div className="sui-card3d__inner">
          {children}
          {glare ? <div aria-hidden className="sui-card3d__glare" /> : null}
        </div>
      </div>
    );
  },
);
