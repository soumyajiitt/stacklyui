"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { motion } from "motion/react";
import { cn } from "../lib/cn";

const TabsValueContext = React.createContext<string | undefined>(undefined);
const TabsIdContext = React.createContext<string>("tabs");

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {}

/**
 * Tabs with a sliding active indicator that animates between triggers
 * (Motion `layoutId`). Wraps Radix Tabs, so keyboard arrow-navigation and
 * roving focus come for free.
 */
export const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(function Tabs(
  { className, value, defaultValue, onValueChange, ...props },
  ref,
) {
  const [internal, setInternal] = React.useState<string | undefined>(
    value ?? defaultValue,
  );
  const active = value ?? internal;
  const id = React.useId();

  const handleChange = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };

  return (
    <TabsIdContext.Provider value={id}>
      <TabsValueContext.Provider value={active}>
        <TabsPrimitive.Root
          ref={ref}
          className={cn("w-full", className)}
          value={active}
          defaultValue={defaultValue}
          onValueChange={handleChange}
          {...props}
        />
      </TabsValueContext.Provider>
    </TabsIdContext.Provider>
  );
});

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(function TabsList({ className, ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border bg-surface p-1",
        className,
      )}
      {...props}
    />
  );
});

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, value, children, ...props }, ref) {
  const active = React.useContext(TabsValueContext);
  const id = React.useContext(TabsIdContext);
  const isActive = active === value;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      className={cn(
        "relative z-10 inline-flex items-center justify-center rounded-lg px-3.5 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        isActive ? "text-fg" : "text-muted hover:text-fg",
        className,
      )}
      {...props}
    >
      {isActive ? (
        <motion.span
          layoutId={`${id}-tab`}
          className="absolute inset-0 -z-10 rounded-lg bg-surface-strong shadow-sm"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      ) : null}
      {children}
    </TabsPrimitive.Trigger>
  );
});

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-3 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
});
