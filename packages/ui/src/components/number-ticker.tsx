"use client";

import * as React from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { cn } from "../lib/cn";

export interface NumberTickerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The final value to count up (or down) to. */
  value: number;
  /** Starting value. Default: 0. */
  from?: number;
  /** Duration of the count in seconds. Default: 1.6. */
  duration?: number;
  /** Delay before starting once in view, in seconds. Default: 0. */
  delay?: number;
  /** Decimal places to display. Default: 0. */
  decimals?: number;
  /** Locale for number formatting. Default: "en-US". */
  locale?: string;
  /** Extra Intl.NumberFormat options (e.g. currency). */
  format?: Intl.NumberFormatOptions;
  /** Text prepended to the number (e.g. "$"). */
  prefix?: string;
  /** Text appended to the number (e.g. "+", "%"). */
  suffix?: string;
}

/**
 * Animates a number from `from` to `value` when it scrolls into view.
 *
 * The tween drives a Motion value and writes formatted text straight to the
 * DOM node (no per-frame React re-render). Under reduced motion it renders the
 * final value immediately. The formatted number is exposed to assistive tech.
 */
export function NumberTicker({
  className,
  value,
  from = 0,
  duration = 1.6,
  delay = 0,
  decimals = 0,
  locale = "en-US",
  format,
  prefix = "",
  suffix = "",
  ...props
}: NumberTickerProps) {
  const reduced = useReducedMotion();
  const spanRef = React.useRef<HTMLSpanElement | null>(null);
  const inView = useInView(spanRef, { once: true, margin: "0px 0px -15% 0px" });
  const motionValue = useMotionValue(from);

  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        ...format,
      }),
    [locale, decimals, format],
  );

  const render = React.useCallback(
    (n: number) => {
      const node = spanRef.current;
      if (node) node.textContent = `${prefix}${formatter.format(n)}${suffix}`;
    },
    [formatter, prefix, suffix],
  );

  React.useEffect(() => {
    if (reduced) {
      render(value);
      return;
    }
    if (!inView) {
      render(from);
      return;
    }
    const controls = animate(motionValue, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: render,
    });
    return () => controls.stop();
  }, [inView, reduced, value, from, duration, delay, motionValue, render]);

  return (
    <span
      ref={spanRef}
      className={cn("sui-number-ticker tabular-nums", className)}
      {...props}
    >
      {`${prefix}${formatter.format(reduced ? value : from)}${suffix}`}
    </span>
  );
}
