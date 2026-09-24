"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "../lib/cn";

export type BadgeVariant =
  | "solid"
  | "soft"
  | "outline"
  | "success"
  | "warning"
  | "destructive";

const VARIANTS: Record<BadgeVariant, string> = {
  solid: "bg-accent text-accent-fg border-transparent",
  soft: "bg-accent/12 text-accent border-transparent",
  outline: "border-border text-fg",
  success: "bg-[oklch(0.72_0.15_150)]/15 text-[oklch(0.5_0.13_150)] border-transparent",
  warning: "bg-accent-3/20 text-[oklch(0.5_0.12_70)] border-transparent",
  destructive: "bg-destructive/12 text-destructive border-transparent",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  asChild?: boolean;
}

/** A small status/label pill with soft, solid, and semantic variants. */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge({ className, variant = "soft", asChild = false, ...props }, ref) {
    const Comp = asChild ? Slot.Root : "span";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold [&_svg]:size-3",
          VARIANTS[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
