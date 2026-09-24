"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "../lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "sui-raise sui-raise-accent border-transparent bg-accent text-accent-fg hover:brightness-105",
  secondary:
    "sui-raise border-border-strong bg-surface-strong text-fg",
  outline: "sui-raise border-border-strong bg-bg text-fg hover:bg-surface-strong",
  ghost: "border-transparent text-fg hover:bg-surface-strong active:scale-[0.97]",
  destructive:
    "sui-raise border-transparent bg-destructive text-destructive-fg hover:brightness-105",
  link: "border-transparent text-accent underline-offset-4 hover:underline",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-[0.8rem]",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-[0.95rem]",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as the single child element instead of a <button> (e.g. an <a>). */
  asChild?: boolean;
}

/**
 * A versatile button with six variants and four sizes.
 *
 * It has a spring-like press (scale on `:active`), a clear focus-visible ring,
 * and `asChild` support so it can style a link or any element while staying a
 * real, accessible control.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", asChild = false, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex select-none items-center justify-center rounded-lg border font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          VARIANTS[variant],
          SIZES[size],
          className,
        )}
        {...props}
      />
    );
  },
);
