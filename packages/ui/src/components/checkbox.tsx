"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { motion } from "motion/react";
import { cn } from "../lib/cn";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

/**
 * A checkbox with a spring pop and an animated check-draw on toggle
 * (wraps Radix Checkbox — fully keyboard and screen-reader accessible).
 */
export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(function Checkbox({ className, ...props }, ref) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.375rem] border border-border-strong bg-surface outline-none transition-[background-color,border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        {props.checked === "indeterminate" ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="h-0.5 w-2.5 rounded-full bg-accent-fg"
          />
        ) : (
          <motion.svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 text-accent-fg"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <motion.path
              d="M20 6 9 17l-5-5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </motion.svg>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
