"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import {
  Calendar,
  type CalendarMarker,
  type CalendarPreset,
  type DateRange,
} from "./calendar";

/* -------------------------------------------------------------------- Types */

export type DatePickerMode = "single" | "range";
export type DatePickerSize = "sm" | "md" | "lg";

/** Value shape by mode: a `Date` for "single", a `{ from, to }` for "range". */
export type DatePickerValue = Date | DateRange | undefined;

export interface DatePickerProps {
  /** Selection behaviour. @default "single" */
  mode?: DatePickerMode;
  /** Controlled value — a `Date` (single) or `{ from, to }` (range). */
  value?: DatePickerValue;
  /** Uncontrolled initial value. */
  defaultValue?: DatePickerValue;
  onChange?: (value: DatePickerValue) => void;
  placeholder?: string;
  /** Fully custom day formatter — overrides `formatOptions` / `locale`. */
  format?: (date: Date) => string;
  /** `Intl.DateTimeFormat` options for the trigger label. */
  formatOptions?: Intl.DateTimeFormatOptions;
  /** BCP-47 locale for the trigger label + calendar. */
  locale?: string;
  size?: DatePickerSize;
  /** Show a clear (×) button once a value is picked. @default true */
  clearable?: boolean;
  disabled?: boolean;
  /** Month panels shown side by side (great for ranges). @default 1 */
  numberOfMonths?: number;
  /** First day of the week: 0 = Sunday … 6 = Saturday. @default 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  fromDate?: Date;
  toDate?: Date;
  /** Return `true` to disable a specific day. */
  disabledDate?: (date: Date) => boolean;
  /** Colour-coded dots under days. */
  markers?: (date: Date) => CalendarMarker | CalendarMarker[] | undefined;
  /** Quick-pick shortcuts in the calendar's side rail. */
  presets?: CalendarPreset[];
  /** Show the calendar's Today / Clear footer. @default true */
  showToday?: boolean;
  /** Close the popover as soon as a (complete) selection is made. @default true */
  closeOnSelect?: boolean;
  align?: "start" | "center" | "end";
  className?: string;
  contentClassName?: string;
  name?: string;
  id?: string;
  "aria-label"?: string;
}

/* ----------------------------------------------------------------- Helpers */

const SIZES: Record<DatePickerSize, string> = {
  sm: "h-8 px-2.5 text-[0.8rem]",
  md: "h-10 px-3.5 text-sm",
  lg: "h-12 px-4 text-[0.95rem]",
};

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18M8 2v4M16 2v4" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/* ------------------------------------------------------------------ DatePicker */

/**
 * A polished date field — a formatted trigger wired to the self-contained
 * {@link Calendar} in a popover. Single **or** range mode, dual-month panels,
 * quick-pick presets, colour-coded markers, a clearable value, and native form
 * support — all dependency-free (native `Date` + `Intl`, no `date-fns`).
 */
export function DatePicker({
  mode = "single",
  value,
  defaultValue,
  onChange,
  placeholder = "Pick a date",
  format,
  formatOptions,
  locale,
  size = "md",
  clearable = true,
  disabled = false,
  numberOfMonths,
  weekStartsOn = 0,
  fromDate,
  toDate,
  disabledDate,
  markers,
  presets,
  showToday = true,
  closeOnSelect = true,
  align = "start",
  className,
  contentClassName,
  name,
  id,
  ...aria
}: DatePickerProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<DatePickerValue>(defaultValue);
  const current = controlled ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [clearCount, setClearCount] = React.useState(0);

  const fmt = React.useMemo(() => {
    if (format) return format;
    const dtf = new Intl.DateTimeFormat(locale, formatOptions ?? DEFAULT_FORMAT);
    return (d: Date) => dtf.format(d);
  }, [format, formatOptions, locale]);

  const range = mode === "range" ? (current as DateRange | undefined) : undefined;
  const single = mode === "single" ? (current as Date | undefined) : undefined;
  const hasValue = mode === "range" ? !!range?.from : !!single;

  const label = React.useMemo(() => {
    if (mode === "single") return single ? fmt(single) : null;
    if (!range?.from) return null;
    return range.to ? `${fmt(range.from)} – ${fmt(range.to)}` : `${fmt(range.from)} – …`;
  }, [mode, single, range, fmt]);

  const commit = (next: DatePickerValue) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };

  const handleSelect = (next: Date | DateRange | Date[] | undefined) => {
    if (mode === "single") {
      const d = next as Date | undefined;
      commit(d);
      if (closeOnSelect && d) setOpen(false);
    } else {
      const r = (next as DateRange | undefined) ?? { from: undefined };
      commit(r);
      if (closeOnSelect && r.from && r.to) setOpen(false);
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    commit(mode === "range" ? { from: undefined } : undefined);
    setClearCount((c) => c + 1);
  };

  const panels = numberOfMonths ?? (mode === "range" ? 2 : 1);

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-label={aria["aria-label"]}
          data-state={open ? "open" : "closed"}
          data-placeholder={!hasValue || undefined}
          className={cn(
            "sui-raise-sm flex w-full items-center gap-2 rounded-lg border-2 border-border-strong bg-surface text-left text-fg outline-none transition-[border-color] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 data-[state=open]:border-accent",
            SIZES[size],
            className,
          )}
        >
          <IconCalendar />
          <span className={cn("flex-1 truncate tabular-nums", !hasValue && "text-muted/70")}>
            {label ?? placeholder}
          </span>
          {clearable && hasValue && !disabled ? (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear date"
              onPointerDown={clear}
              className="flex size-5 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-strong hover:text-fg"
            >
              <IconX />
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        style={{ boxShadow: "none" }}
        className={cn("w-auto border-0 bg-transparent p-0 shadow-none", contentClassName)}
      >
        <Calendar
          key={clearCount}
          mode={mode}
          numberOfMonths={panels}
          selected={
            mode === "range" ? (range ?? { from: undefined }) : single
          }
          onSelect={(v) => handleSelect(v as Date | DateRange | undefined)}
          weekStartsOn={weekStartsOn}
          locale={locale}
          fromDate={fromDate}
          toDate={toDate}
          disabled={disabledDate}
          markers={markers}
          presets={presets}
          showToday={showToday}
        />
      </PopoverContent>
      {name
        ? mode === "range"
          ? (
            <>
              <input type="hidden" name={`${name}.from`} value={range?.from ? toISO(range.from) : ""} />
              <input type="hidden" name={`${name}.to`} value={range?.to ? toISO(range.to) : ""} />
            </>
          )
          : <input type="hidden" name={name} value={single ? toISO(single) : ""} />
        : null}
    </Popover>
  );
}

DatePicker.displayName = "DatePicker";

