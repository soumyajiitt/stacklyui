"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/** A text input with a soft surface, clear focus ring, and invalid state. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, type = "text", ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-surface px-3.5 text-sm text-fg shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/30 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-fg",
          className,
        )}
        {...props}
      />
    );
  },
);
