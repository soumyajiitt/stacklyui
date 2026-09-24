"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {}

/** A range slider with a gradient track and a crisp paper thumb (Radix). */
export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(function Slider({ className, ...props }, ref) {
  const count =
    (Array.isArray(props.value)
      ? props.value.length
      : Array.isArray(props.defaultValue)
        ? props.defaultValue.length
        : 1) || 1;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-border">
        <SliderPrimitive.Range className="absolute h-full bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-2))]" />
      </SliderPrimitive.Track>
      {Array.from({ length: count }).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="sui-paper-sm block h-5 w-5 rounded-full border-2 border-border-strong bg-card outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-110"
        />
      ))}
    </SliderPrimitive.Root>
  );
});
