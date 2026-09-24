"use client";

import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(function HoverCardContent({ className, align = "center", sideOffset = 8, ...props }, ref) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "sui-pop sui-paper-sm z-50 w-72 rounded-xl border-2 border-border-strong bg-popover p-4 outline-none",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
});
