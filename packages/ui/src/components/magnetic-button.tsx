"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { cn } from "../lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface MagneticButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onDragEnter"
    | "onDragLeave"
    | "onDragOver"
    | "onDrop"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
    | "style"
  > {
  /** Inline styles (merged with the magnetic transform). */
  style?: React.CSSProperties;
  variant?: Variant;
  size?: Size;
  /** How strongly the button is pulled toward the cursor (px of max travel). Default: 12. */
  strength?: number;
  /** Show an expanding ripple on click/press. Default: true. */
  ripple?: boolean;
  children: React.ReactNode;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/**
 * A button that leans toward the cursor while hovered and springs back on
 * leave, with an optional press ripple.
 *
 * The magnetic pull uses Motion springs on `x`/`y` transforms (compositor
 * friendly). It's a real `<button>`, so it's keyboard focusable and activates
 * on Enter/Space out of the box; the magnetic offset is disabled under reduced
 * motion. Focus is shown with a visible ring.
 */
export const MagneticButton = React.forwardRef<
  HTMLButtonElement,
  MagneticButtonProps
>(function MagneticButton(
  {
    className,
    children,
    variant = "primary",
    size = "md",
    strength = 12,
    ripple = true,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    ...props
  },
  ref,
) {
  const reduced = useReducedMotion();
  const localRef = React.useRef<HTMLButtonElement | null>(null);
  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(event);
    if (reduced || !localRef.current) return;
    const rect = localRef.current.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;
    x.set((relX / (rect.width / 2)) * strength);
    y.set((relY / (rect.height / 2)) * strength);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(event);
    x.set(0);
    y.set(0);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    onPointerDown?.(event);
    if (!ripple || !localRef.current) return;
    const rect = localRef.current.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [
      ...prev,
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
    ]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 650);
  };

  return (
    <motion.button
      ref={setRefs}
      className={cn(
        "sui-btn",
        `sui-btn--${variant}`,
        `sui-btn--${size}`,
        className,
      )}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      {...props}
    >
      <span className="sui-btn__label">{children}</span>
      {ripple
        ? ripples.map((r) => (
            <span
              key={r.id}
              aria-hidden
              className="sui-btn__ripple"
              style={{ left: r.x, top: r.y }}
            />
          ))
        : null}
    </motion.button>
  );
});
