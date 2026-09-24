"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(function PopoverContent({ className, align = "center", sideOffset = 8, ...props }, ref) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "sui-pop sui-paper-sm z-50 w-72 rounded-xl border-2 border-border-strong bg-popover p-4 outline-none",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
