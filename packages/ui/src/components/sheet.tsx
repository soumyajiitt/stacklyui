"use client";

import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

type Side = "top" | "right" | "bottom" | "left";

const SIDE: Record<Side, string> = {
  right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l-2 sui-sheet-right",
  left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r-2 sui-sheet-left",
  top: "inset-x-0 top-0 w-full border-b-2 sui-sheet-top",
  bottom: "inset-x-0 bottom-0 w-full border-t-2 sui-sheet-bottom",
};

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & { side?: Side }
>(function SheetContent({ className, children, side = "right", ...props }, ref) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="sui-overlay fixed inset-0 z-50 bg-[oklch(0.2_0.02_50/0.5)] backdrop-blur-sm" />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col gap-4 border-border-strong bg-popover p-6 outline-none",
          SIDE[side],
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted outline-none transition-colors hover:bg-surface-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
});

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Title
      ref={ref}
      className={cn("text-xl font-bold tracking-tight text-fg", className)}
      {...props}
    />
  );
});

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Description
      ref={ref}
      className={cn("text-sm leading-relaxed text-muted", className)}
      {...props}
    />
  );
});
