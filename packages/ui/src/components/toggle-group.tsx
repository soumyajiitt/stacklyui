"use client";

import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { toggleClasses } from "./toggle";

export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(function ToggleGroup({ className, ...props }, ref) {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn("inline-flex gap-1.5", className)}
      {...props}
    />
  );
});

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(function ToggleGroupItem({ className, ...props }, ref) {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(toggleClasses, className)}
      {...props}
    />
  );
});
