"use client";

import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {}

/** A thin visual divider (wraps Radix Separator). */
export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(function Separator(
  { className, orientation = "horizontal", decorative = true, ...props },
  ref,
) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
});
