"use client";

import * as React from "react";
import { cn } from "../lib/cn";

type GradientTextOwnProps = {
  /** CSS gradient stops. Defaults to the StacklyUI accent gradient. */
  colors?: string[];
  /** Animate the gradient sweeping across the text. Default: true. */
  animate?: boolean;
  /** Duration of one sweep in seconds. Default: 6. */
  duration?: number;
  /** Render as a different element (e.g. "h1", "span"). Default: "span". */
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
};

export type GradientTextProps = GradientTextOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof GradientTextOwnProps>;

/**
 * Text painted with an animated gradient (clipped to the glyphs).
 *
 * The gradient is applied via `background-clip: text`, and the sweep is a CSS
 * `background-position` animation — no JS per frame. Respects reduced motion
 * (the stylesheet pins the gradient in place). The text stays fully selectable
 * and readable by assistive tech.
 */
export function GradientText({
  className,
  children,
  colors,
  animate = true,
  duration = 6,
  as,
  style,
  ...props
}: GradientTextProps) {
  const Component: React.ElementType = as ?? "span";
  const gradient = colors?.length
    ? `linear-gradient(110deg, ${colors.join(", ")})`
    : undefined;

  return React.createElement(
    Component,
    {
      className: cn(
        "sui-gradient-text",
        animate && "sui-gradient-text--animated",
        className,
      ),
      style: {
        "--sui-gradient-duration": `${duration}s`,
        ...(gradient ? { "--sui-text-gradient": gradient } : {}),
        ...style,
      } as React.CSSProperties,
      ...props,
    },
    children,
  );
}
