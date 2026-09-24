"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

type Direction = "up" | "down" | "left" | "right" | "none";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction the content travels from. Default: "up". */
  direction?: Direction;
  /** Travel distance in px. Default: 24. */
  distance?: number;
  /** Seconds before the animation starts once in view. Default: 0. */
  delay?: number;
  /** Animation duration in seconds. Default: 0.7. */
  duration?: number;
  /** Also scale up slightly on reveal. Default: false. */
  scale?: boolean;
  /** Render as a different element via Motion (e.g. "section", "li"). */
  as?: keyof typeof motion;
  /** Replay every time it enters the viewport instead of once. Default: false. */
  repeat?: boolean;
  children: React.ReactNode;
}

const OFFSETS: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 1 },
  down: { y: -1 },
  left: { x: 1 },
  right: { x: -1 },
  none: {},
};

/**
 * Reveals its children with a spring-eased fade + slide when scrolled into
 * view. Wrap sections, headings, cards — anything you want to animate in.
 *
 * Under reduced motion it renders instantly with no transform, so content is
 * never hidden from users who opt out.
 */
export function Reveal({
  className,
  children,
  direction = "up",
  distance = 24,
  delay = 0,
  duration = 0.7,
  scale = false,
  as = "div",
  repeat = false,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as] as typeof motion.div;

  if (reduced) {
    // Strip motion-only props before forwarding to a plain element.
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  const offset = OFFSETS[direction];
  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: (offset.x ?? 0) * distance,
      y: (offset.y ?? 0) * distance,
      scale: scale ? 0.96 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount: 0.25, margin: "0px 0px -10% 0px" }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </Component>
  );
}
