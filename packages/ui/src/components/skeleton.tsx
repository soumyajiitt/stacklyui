"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * A loading placeholder with a soft shimmer sweep. Freezes to a static block
 * under reduced motion (handled by the shipped stylesheet).
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("sui-skeleton rounded-md bg-fg/[0.08]", className)}
        {...props}
      />
    );
  },
);
