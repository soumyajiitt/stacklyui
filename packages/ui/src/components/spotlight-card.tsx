"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { usePointerVars } from "../hooks/use-pointer-vars";

export interface SpotlightCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Radius of the spotlight glow in px. Default: 350. */
  radius?: number;
  /** CSS color of the glow. Defaults to the accent token. */
  glow?: string;
  /** Render an animated conic border that also tracks the pointer. Default: true. */
  border?: boolean;
  children?: React.ReactNode;
}

/**
 * A glass card with a spotlight glow that follows the cursor.
 *
 * The glow position is written to CSS custom properties on pointer move (via
 * `usePointerVars`), so tracking the mouse never re-renders React — it only
 * updates two style variables that a radial-gradient reads. The card also
 * exposes an optional pointer-aware border sheen.
 */
export const SpotlightCard = React.forwardRef<
  HTMLDivElement,
  SpotlightCardProps
>(function SpotlightCard(
  {
    className,
    children,
    radius = 350,
    glow,
    border = true,
    style,
    onPointerMove,
    onPointerEnter,
    onPointerLeave,
    ...props
  },
  ref,
) {
  const pointer = usePointerVars<HTMLDivElement>();

  // Merge the forwarded ref with the internal pointer ref.
  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      pointer.ref.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [pointer.ref, ref],
  );

  return (
    <div
      ref={setRefs}
      className={cn("sui-spotlight-card", border && "sui-spotlight-card--bordered", className)}
      style={
        {
          "--sui-spot-radius": `${radius}px`,
          "--sui-spot-color": glow ?? "var(--sui-accent-glow)",
          "--pointer-active": "0",
          ...style,
        } as React.CSSProperties
      }
      onPointerMove={(e) => {
        pointer.onPointerMove(e);
        onPointerMove?.(e);
      }}
      onPointerEnter={(e) => {
        pointer.onPointerEnter();
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        pointer.onPointerLeave();
        onPointerLeave?.(e);
      }}
      {...props}
    >
      <div aria-hidden className="sui-spotlight-card__glow" />
      <div className="sui-spotlight-card__content">{children}</div>
    </div>
  );
});
