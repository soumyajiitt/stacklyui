"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

/** A keyboard-key hint with a subtle 3D keycap look. */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, ...props },
  ref,
) {
  return (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border-strong bg-surface-strong px-1.5 font-mono text-[0.7rem] font-semibold text-fg shadow-[0_2px_0_0_var(--sui-offset)]",
        className,
      )}
      {...props}
    />
  );
});
