"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useTheme } from "./theme-provider";

export interface ThemeToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * An accessible sun/moon toggle that flips the theme. It's a real button with
 * an `aria-label` and `aria-pressed`, so it's keyboard operable and announced
 * correctly. The icon crossfades via CSS.
 */
export const ThemeToggle = React.forwardRef<
  HTMLButtonElement,
  ThemeToggleProps
>(function ThemeToggle({ className, onClick, ...props }, ref) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn("sui-theme-toggle", className)}
      onClick={(e) => {
        toggleTheme();
        onClick?.(e);
      }}
      {...props}
    >
      <svg
        className="sui-theme-toggle__icon sui-theme-toggle__sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        className="sui-theme-toggle__icon sui-theme-toggle__moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
});
