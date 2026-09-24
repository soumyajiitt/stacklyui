"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/** A multi-line text input matching the Input styling. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[5rem] w-full rounded-lg border border-input bg-surface px-3.5 py-2.5 text-sm text-fg shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
          className,
        )}
        {...props}
      />
    );
  },
);
