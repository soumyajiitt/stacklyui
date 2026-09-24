"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  /** Paint the bar with the accent gradient instead of a flat fill. */
  gradient?: boolean;
}

/** A determinate progress bar with a smooth spring-eased fill (Radix). */
export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(function Progress({ className, value = 0, gradient = true, ...props }, ref) {
  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={value}
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-border",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 rounded-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
          gradient
            ? "bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-2),var(--color-accent-3))]"
            : "bg-accent",
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
