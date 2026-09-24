"use client";

import * as React from "react";
import { Toggle as TogglePrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export const toggleClasses =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-strong bg-bg px-3 h-9 text-sm font-medium text-fg outline-none transition-colors hover:bg-surface-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-accent data-[state=on]:bg-accent/12 data-[state=on]:text-accent [&_svg]:size-4";

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {}

/** A two-state toggle button (Radix Toggle). */
export const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(function Toggle({ className, ...props }, ref) {
  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleClasses, className)}
      {...props}
    />
  );
});
