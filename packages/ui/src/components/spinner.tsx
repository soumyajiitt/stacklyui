"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  label?: string;
}

/** An accessible loading spinner. Announces a label to screen readers. */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner({ className, size = 20, label = "Loading", style, ...props }, ref) {
    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn("sui-spinner inline-block", className)}
        style={{ width: size, height: size, ...style }}
        {...props}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
          <circle cx="12" cy="12" r="9" stroke="var(--sui-border-strong)" strokeWidth="3" />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="var(--sui-accent)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="sr-only">{label}</span>
      </span>
    );
  },
);
