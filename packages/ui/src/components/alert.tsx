"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export type AlertVariant = "info" | "success" | "warning" | "destructive";

const VARIANTS: Record<AlertVariant, string> = {
  info: "border-border-strong bg-card text-fg [&_.sui-alert-accent]:bg-accent",
  success:
    "border-[oklch(0.72_0.15_150/0.4)] bg-[oklch(0.72_0.15_150/0.08)] text-fg [&_.sui-alert-accent]:bg-[oklch(0.6_0.14_150)]",
  warning:
    "border-accent-3/50 bg-accent-3/10 text-fg [&_.sui-alert-accent]:bg-accent-3",
  destructive:
    "border-destructive/40 bg-destructive/8 text-fg [&_.sui-alert-accent]:bg-destructive",
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

/**
 * A callout banner. A colored accent rail down the left edge is the StacklyUI
 * signature that sets it apart from a plain bordered box.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert({ className, variant = "info", children, ...props }, ref) {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "sui-paper-sm relative overflow-hidden rounded-xl border-2 px-4 py-3.5 pl-5",
          VARIANTS[variant],
          className,
        )}
        {...props}
      >
        <span
          aria-hidden
          className="sui-alert-accent absolute inset-y-0 left-0 w-1.5"
        />
        <div className="flex gap-3">{children}</div>
      </div>
    );
  },
);

export function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("mb-0.5 font-semibold leading-tight tracking-tight", className)}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={cn("text-sm leading-relaxed text-muted", className)} {...props} />
  );
}
