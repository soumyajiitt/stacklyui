"use client";

import * as React from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { cn } from "../lib/cn";
import { useReducedMotion } from "../hooks/use-reduced-motion";

/* -------------------------------------------------------------------- Types */

export type CalendarMode = "single" | "multiple" | "range";

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

export type CalendarValue = Date | Date[] | DateRange | undefined;

/** A coloured dot rendered beneath a day — for events, availability, etc. */
export type CalendarMarker =
  | "accent"
  | "accent-2"
  | "accent-3"
  | "destructive"
  | "muted";

/** A one-click shortcut shown in the side rail (e.g. "Last 7 days"). */
export interface CalendarPreset {
  /** Text shown on the quick-pick button. */
  label: string;
  /** Selection to apply — a value, or a factory evaluated on click. */
  value: CalendarValue | (() => CalendarValue);
}

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Selection behaviour. @default "single" */
  mode?: CalendarMode;
  /** Controlled selection — a `Date`, `Date[]`, or `{ from, to }` by mode. */
  selected?: CalendarValue;
  /** Uncontrolled initial selection. */
  defaultSelected?: CalendarValue;
  /** Called with the next selection when the user picks a day. */
  onSelect?: (value: CalendarValue) => void;
  /** Controlled displayed month (the first panel). */
  month?: Date;
  /** Uncontrolled initial displayed month. */
  defaultMonth?: Date;
  /** Fires whenever the displayed month changes. */
  onMonthChange?: (month: Date) => void;
  /** Month panels shown side by side (1–4). @default 1 */
  numberOfMonths?: number;
  /** First day of the week: 0 = Sunday … 6 = Saturday. @default 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** BCP-47 locale for day/month names (via `Intl`). Defaults to the runtime locale. */
  locale?: string;
  /** Earliest selectable day, inclusive. */
  fromDate?: Date;
  /** Latest selectable day, inclusive. */
  toDate?: Date;
  /** Return `true` to disable a specific day. */
  disabled?: (date: Date) => boolean;
  /** Render leading/trailing days from adjacent months. @default true */
  showOutsideDays?: boolean;
  /** Show an ISO week-number column. @default false */
  showWeekNumbers?: boolean;
  /** In single mode, keep a day selected when it is clicked again. */
  required?: boolean;
  /** Decorate days with up to three coloured dots (events, availability…). */
  markers?: (date: Date) => CalendarMarker | CalendarMarker[] | undefined;
  /** Quick-pick shortcuts rendered in a side rail (e.g. "Last 7 days"). */
  presets?: CalendarPreset[];
  /** Show a footer with a "Today" jump and a "Clear" button. @default false */
  showToday?: boolean;
}

/* --------------------------------------------------------------- Date math */
/* Dependency-free. Every value is a LOCAL calendar day (midnight), so DST and
 * timezone offsets can never shift a date across a day boundary. */

const DAY_MS = 86_400_000;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function withMonthOffset(d: Date, months: number): Date {
  const inTarget = new Date(d.getFullYear(), d.getMonth() + months + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + months, Math.min(d.getDate(), inTarget));
}
function startOfWeek(d: Date, weekStartsOn: number): Date {
  return addDays(d, -((((d.getDay() - weekStartsOn) % 7) + 7) % 7));
}
function isSameDay(a?: Date | null, b?: Date | null): boolean {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}
function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function clampDay(d: Date, min?: Date, max?: Date): Date {
  if (min && isBefore(d, min)) return startOfDay(min);
  if (max && isAfter(d, max)) return startOfDay(max);
  return startOfDay(d);
}
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7) + 3);
  const firstThu = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  firstThu.setUTCDate(firstThu.getUTCDate() - ((firstThu.getUTCDay() + 6) % 7) + 3);
  return 1 + Math.round((d.getTime() - firstThu.getTime()) / (7 * DAY_MS));
}
function firstSelectedDate(value: CalendarValue): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value[0];
  return value.from ?? undefined;
}

const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 28 : -28, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? -28 : 28, opacity: 0 }),
};

const MARKER_BG: Record<CalendarMarker, string> = {
  accent: "bg-accent",
  "accent-2": "bg-accent-2",
  "accent-3": "bg-accent-3",
  destructive: "bg-destructive",
  muted: "bg-muted",
};

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/**
 * A self-contained, animated date picker — no `react-day-picker`, no
 * `date-fns`, just native `Date` + `Intl`. Single / multiple / range modes,
 * direction-aware sliding month transitions, a spring selection pop, range
 * hover-preview, full keyboard grid navigation, and a click-to-zoom
 * month → year quick-jump so you can cross decades in two clicks.
 *
 * Beyond the basics: colour-coded event **markers** (dots under any day), a
 * one-click **presets** rail ("Last 7 days", "This month", …), and an optional
 * **Today / Clear** footer — the stuff you normally bolt on by hand.
 */
export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  function Calendar(
    {
      mode = "single",
      selected,
      defaultSelected,
      onSelect,
      month,
      defaultMonth,
      onMonthChange,
      numberOfMonths = 1,
      weekStartsOn = 0,
      locale,
      fromDate,
      toDate,
      disabled,
      showOutsideDays = true,
      showWeekNumbers = false,
      required = false,
      markers,
      presets,
      showToday = false,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const reduced = useReducedMotion();
    const panels = Math.max(1, Math.min(numberOfMonths, 4));
    const today = React.useMemo(() => startOfDay(new Date()), []);

    // Selection (controlled / uncontrolled).
    const selControlled = selected !== undefined;
    const [selInternal, setSelInternal] = React.useState<CalendarValue>(
      () =>
        defaultSelected ??
        (mode === "multiple" ? [] : mode === "range" ? { from: undefined } : undefined),
    );
    const selection = selControlled ? selected : selInternal;

    // Displayed month (controlled / uncontrolled).
    const monthControlled = month !== undefined;
    const initialMonth = React.useMemo(
      () => startOfMonth(defaultMonth ?? firstSelectedDate(selection) ?? today),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );
    const [monthInternal, setMonthInternal] = React.useState(initialMonth);
    const firstMonth = startOfMonth(monthControlled ? (month as Date) : monthInternal);
    const lastMonth = withMonthOffset(firstMonth, panels - 1);

    const [view, setView] = React.useState<"day" | "month" | "year">("day");
    const [direction, setDirection] = React.useState(0);
    const [hovered, setHovered] = React.useState<Date | undefined>(undefined);
    const [focused, setFocused] = React.useState<Date>(() => {
      const base = firstSelectedDate(selection);
      if (base && isSameMonth(base, initialMonth)) return clampDay(base, fromDate, toDate);
      if (isSameMonth(today, initialMonth)) return clampDay(today, fromDate, toDate);
      return clampDay(initialMonth, fromDate, toDate);
    });

    const rootRef = React.useRef<HTMLDivElement>(null);
    const wantFocus = React.useRef(false);
    React.useEffect(() => {
      if (!wantFocus.current) return;
      wantFocus.current = false;
      rootRef.current
        ?.querySelector<HTMLButtonElement>(`[data-day="${dateKey(focused)}"]`)
        ?.focus();
    });

    const setRefs = (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    // Localised weekday / month names + the accessible per-day label.
    const { weekdays, monthsShort, monthsLong, dayFmt } = React.useMemo(() => {
      const wdShort = new Intl.DateTimeFormat(locale, { weekday: "short" });
      const wdLong = new Intl.DateTimeFormat(locale, { weekday: "long" });
      const sunday = new Date(2021, 7, 1); // a known Sunday
      const weekdays = Array.from({ length: 7 }, (_, i) => {
        const d = addDays(sunday, (weekStartsOn + i) % 7);
        return { short: wdShort.format(d), long: wdLong.format(d) };
      });
      const mShort = new Intl.DateTimeFormat(locale, { month: "short" });
      const mLong = new Intl.DateTimeFormat(locale, { month: "long" });
      const monthsShort = Array.from({ length: 12 }, (_, i) => mShort.format(new Date(2021, i, 1)));
      const monthsLong = Array.from({ length: 12 }, (_, i) => mLong.format(new Date(2021, i, 1)));
      const dayFmt = new Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return { weekdays, monthsShort, monthsLong, dayFmt };
    }, [locale, weekStartsOn]);

    const isDisabledDay = (day: Date) =>
      (!!fromDate && isBefore(day, fromDate)) ||
      (!!toDate && isAfter(day, toDate)) ||
      (disabled?.(day) ?? false);

    // Effective range, including the live hover preview while picking an end.
    const rangeView = React.useMemo(() => {
      if (mode !== "range") return null;
      const r = (selection as DateRange | undefined) ?? { from: undefined };
      let from = r.from;
      let to = r.to;
      if (from && !to && hovered) {
        if (isBefore(hovered, from)) {
          to = from;
          from = startOfDay(hovered);
        } else to = startOfDay(hovered);
      }
      return { from, to };
    }, [mode, selection, hovered]);

    const prevDisabled =
      view === "day" && !!fromDate && !isAfter(firstMonth, startOfMonth(fromDate));
    const nextDisabled =
      view === "day" && !!toDate && !isBefore(startOfMonth(lastMonth), startOfMonth(toDate));

    const commitMonth = (next: Date, dir: number) => {
      const m = startOfMonth(next);
      setDirection(dir);
      if (!monthControlled) setMonthInternal(m);
      onMonthChange?.(m);
    };
    const commitSelection = (value: CalendarValue) => {
      if (!selControlled) setSelInternal(value);
      onSelect?.(value);
    };

    const goPrev = () => {
      if (view === "day") {
        commitMonth(withMonthOffset(firstMonth, -1), -1);
        setFocused((f) => clampDay(withMonthOffset(f, -1), fromDate, toDate));
      } else if (view === "month") commitMonth(withMonthOffset(firstMonth, -12), -1);
      else commitMonth(withMonthOffset(firstMonth, -144), -1);
    };
    const goNext = () => {
      if (view === "day") {
        commitMonth(withMonthOffset(firstMonth, 1), 1);
        setFocused((f) => clampDay(withMonthOffset(f, 1), fromDate, toDate));
      } else if (view === "month") commitMonth(withMonthOffset(firstMonth, 12), 1);
      else commitMonth(withMonthOffset(firstMonth, 144), 1);
    };

    const selectDay = (day: Date) => {
      if (isDisabledDay(day)) return;
      const picked = startOfDay(day);
      setFocused(picked);
      if (mode === "single") {
        const cur = selection as Date | undefined;
        commitSelection(!required && isSameDay(cur, picked) ? undefined : picked);
      } else if (mode === "multiple") {
        const cur = (selection as Date[] | undefined) ?? [];
        const next = cur.some((d) => isSameDay(d, picked))
          ? cur.filter((d) => !isSameDay(d, picked))
          : [...cur, picked].sort((a, b) => a.getTime() - b.getTime());
        commitSelection(next);
      } else {
        const cur = (selection as DateRange | undefined) ?? { from: undefined };
        if (!cur.from || cur.to) commitSelection({ from: picked, to: undefined });
        else
          commitSelection(
            isBefore(picked, cur.from)
              ? { from: picked, to: cur.from }
              : { from: cur.from, to: picked },
          );
      }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (view !== "day") return;
      let next: Date | null = null;
      switch (e.key) {
        case "ArrowLeft": next = addDays(focused, -1); break;
        case "ArrowRight": next = addDays(focused, 1); break;
        case "ArrowUp": next = addDays(focused, -7); break;
        case "ArrowDown": next = addDays(focused, 7); break;
        case "Home": next = startOfWeek(focused, weekStartsOn); break;
        case "End": next = addDays(startOfWeek(focused, weekStartsOn), 6); break;
        case "PageUp": next = withMonthOffset(focused, e.shiftKey ? -12 : -1); break;
        case "PageDown": next = withMonthOffset(focused, e.shiftKey ? 12 : 1); break;
        case "Enter":
        case " ":
          e.preventDefault();
          selectDay(focused);
          return;
        default:
          return;
      }
      e.preventDefault();
      const clamped = clampDay(next, fromDate, toDate);
      setFocused(clamped);
      wantFocus.current = true;
      const clampedMonth = startOfMonth(clamped);
      if (isBefore(clampedMonth, firstMonth)) commitMonth(clampedMonth, -1);
      else if (isAfter(clampedMonth, startOfMonth(lastMonth)))
        commitMonth(withMonthOffset(clampedMonth, -(panels - 1)), 1);
    };

    const pickMonth = (index: number) => {
      commitMonth(
        new Date(firstMonth.getFullYear(), index, 1),
        index >= firstMonth.getMonth() ? 1 : -1,
      );
      setFocused((f) =>
        clampDay(new Date(firstMonth.getFullYear(), index, Math.min(f.getDate(), 28)), fromDate, toDate),
      );
      setView("day");
    };
    const pickYear = (year: number) => {
      commitMonth(new Date(year, firstMonth.getMonth(), 1), year >= firstMonth.getFullYear() ? 1 : -1);
      setFocused((f) =>
        clampDay(new Date(year, firstMonth.getMonth(), Math.min(f.getDate(), 28)), fromDate, toDate),
      );
      setView("day");
    };

    const hasSelection =
      mode === "single"
        ? !!(selection as Date | undefined)
        : mode === "multiple"
          ? ((selection as Date[] | undefined)?.length ?? 0) > 0
          : !!(selection as DateRange | undefined)?.from;

    const emptyValue: CalendarValue =
      mode === "multiple" ? [] : mode === "range" ? { from: undefined } : undefined;

    const goToday = () => {
      const t = clampDay(today, fromDate, toDate);
      commitMonth(startOfMonth(t), isBefore(t, firstMonth) ? -1 : 1);
      setFocused(t);
      setView("day");
      wantFocus.current = true;
    };

    const clearSelection = () => commitSelection(emptyValue);

    const applyPreset = (preset: CalendarPreset) => {
      const value = typeof preset.value === "function" ? preset.value() : preset.value;
      commitSelection(value);
      const anchor = firstSelectedDate(value);
      if (anchor) {
        commitMonth(startOfMonth(anchor), isBefore(anchor, firstMonth) ? -1 : 1);
        setFocused(clampDay(anchor, fromDate, toDate));
      }
      setView("day");
    };

    const renderDay = (day: Date, panelMonth: Date) => {
      const outside = !isSameMonth(day, panelMonth);
      const cellKey = `${dateKey(day)}#${panelMonth.getMonth()}`;
      if (outside && !showOutsideDays) {
        return <div key={cellKey} role="gridcell" aria-hidden className="h-9 w-9" />;
      }
      const disabledDay = isDisabledDay(day);
      const isToday = isSameDay(day, today);
      const weekend = day.getDay() === 0 || day.getDay() === 6;
      const isFocusTarget = isSameDay(day, focused);

      let selectedSolid = false;
      let inRange = false;
      let isStart = false;
      let isEnd = false;
      if (mode === "single") {
        selectedSolid = isSameDay(selection as Date | undefined, day);
      } else if (mode === "multiple") {
        selectedSolid = ((selection as Date[] | undefined) ?? []).some((d) => isSameDay(d, day));
      } else if (rangeView) {
        isStart = !!rangeView.from && isSameDay(day, rangeView.from);
        isEnd = !!rangeView.to && isSameDay(day, rangeView.to);
        selectedSolid = isStart || isEnd;
        inRange =
          !!rangeView.from &&
          !!rangeView.to &&
          isAfter(day, rangeView.from) &&
          isBefore(day, rangeView.to);
      }
      const fullRange =
        mode === "range" &&
        !!rangeView?.from &&
        !!rangeView?.to &&
        !isSameDay(rangeView.from, rangeView.to);
      const band = fullRange && (inRange || isStart || isEnd);

      const dayMarkers = markers
        ? ([] as CalendarMarker[]).concat(markers(day) ?? []).slice(0, 3)
        : [];
      const showTodayDot = isToday && !selectedSolid && dayMarkers.length === 0;

      return (
        <div
          key={cellKey}
          role="gridcell"
          aria-selected={selectedSolid || inRange || undefined}
          className="relative flex h-9 w-9 items-center justify-center"
        >
          {band && (
            <div
              aria-hidden
              className={cn(
                "absolute inset-y-1 left-0 right-0 bg-accent/10",
                isStart && "left-1 rounded-l-full",
                isEnd && "right-1 rounded-r-full",
              )}
            />
          )}
          <button
            type="button"
            data-day={dateKey(day)}
            tabIndex={isFocusTarget && !disabledDay ? 0 : -1}
            disabled={disabledDay}
            aria-label={dayFmt.format(day)}
            aria-current={isToday ? "date" : undefined}
            onClick={() => selectDay(day)}
            onMouseEnter={mode === "range" ? () => setHovered(startOfDay(day)) : undefined}
            className={cn(
              "relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm outline-none transition-[background-color,color,transform] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              !selectedSolid && !disabledDay && "hover:bg-surface-strong active:scale-90",
              outside ? "text-muted/40" : weekend ? "text-muted" : "text-fg",
              isToday && !selectedSolid && "font-semibold text-accent",
              disabledDay && "cursor-not-allowed text-muted/30 line-through",
            )}
          >
            {selectedSolid && (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-accent shadow-sm"
                initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              />
            )}
            <span
              className={cn(
                "relative z-10 tabular-nums",
                selectedSolid && "font-semibold text-accent-fg",
              )}
            >
              {day.getDate()}
            </span>
            {showTodayDot && (
              <span
                aria-hidden
                className="absolute bottom-[3px] left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
              />
            )}
            {dayMarkers.length > 0 && (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-[3px] z-10 flex items-center justify-center gap-[3px]"
              >
                {dayMarkers.map((m, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 w-1 rounded-full",
                      selectedSolid ? "bg-accent-fg/80" : MARKER_BG[m],
                    )}
                  />
                ))}
              </span>
            )}
          </button>
        </div>
      );
    };

    const renderPanel = (panelMonth: Date, panelIndex: number) => {
      const gridStart = startOfWeek(startOfMonth(panelMonth), weekStartsOn);
      return (
        <div
          key={panelIndex}
          role="grid"
          aria-label={`${monthsLong[panelMonth.getMonth()]} ${panelMonth.getFullYear()}`}
          className="space-y-1"
        >
          {panels > 1 && (
            <div className="pb-1 text-center text-sm font-semibold text-fg">
              {monthsLong[panelMonth.getMonth()]} {panelMonth.getFullYear()}
            </div>
          )}
          <div role="row" className="flex gap-1">
            {showWeekNumbers && (
              <div
                role="columnheader"
                aria-label="Week number"
                className="flex h-7 w-9 items-center justify-center text-[0.7rem] font-medium text-muted/60"
              >
                #
              </div>
            )}
            {weekdays.map((wd) => (
              <div
                key={wd.long}
                role="columnheader"
                aria-label={wd.long}
                className="flex h-7 w-9 items-center justify-center text-[0.7rem] font-medium uppercase tracking-wide text-muted"
              >
                {wd.short}
              </div>
            ))}
          </div>
          {Array.from({ length: 6 }, (_, wi) => {
            const rowStart = addDays(gridStart, wi * 7);
            return (
              <div key={wi} role="row" className="flex gap-1">
                {showWeekNumbers && (
                  <div
                    role="rowheader"
                    className="flex h-9 w-9 items-center justify-center text-[0.7rem] tabular-nums text-muted/60"
                  >
                    {isoWeek(rowStart)}
                  </div>
                )}
                {Array.from({ length: 7 }, (_, di) =>
                  renderDay(addDays(gridStart, wi * 7 + di), panelMonth),
                )}
              </div>
            );
          })}
        </div>
      );
    };

    const captionBtn =
      "rounded-lg px-2 py-1 text-sm font-semibold text-fg outline-none transition-colors hover:bg-surface-strong focus-visible:ring-2 focus-visible:ring-ring";
    const navBtn =
      "sui-raise-sm flex h-8 w-8 items-center justify-center rounded-lg border-2 border-border-strong bg-surface text-fg outline-none transition-[transform,background-color] hover:bg-surface-strong focus-visible:ring-2 focus-visible:ring-ring active:scale-90 disabled:pointer-events-none disabled:opacity-40 [&>svg]:h-4 [&>svg]:w-4";

    const decadeStart = Math.floor(firstMonth.getFullYear() / 12) * 12;

    const presetBtn =
      "rounded-lg px-3 py-1.5 text-left text-sm text-fg outline-none transition-colors hover:bg-surface-strong focus-visible:ring-2 focus-visible:ring-ring";
    const footerBtn =
      "rounded-lg px-3 py-1.5 text-sm font-medium text-accent outline-none transition-colors hover:bg-accent/10 focus-visible:ring-2 focus-visible:ring-ring";

    const renderMonthGrid = () => (
      <div role="grid" aria-label="Pick a month" className="grid grid-cols-3 gap-2 p-1">
        {monthsLong.map((name, i) => {
          const active = i === firstMonth.getMonth();
          return (
            <button
              key={name}
              type="button"
              aria-pressed={active}
              onClick={() => pickMonth(i)}
              className={cn(
                "rounded-xl py-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-accent font-semibold text-accent-fg"
                  : "text-fg hover:bg-surface-strong",
              )}
            >
              {monthsShort[i]}
            </button>
          );
        })}
      </div>
    );

    const renderYearGrid = () => (
      <div role="grid" aria-label="Pick a year" className="grid grid-cols-3 gap-2 p-1">
        {Array.from({ length: 12 }, (_, i) => decadeStart + i).map((year) => {
          const active = year === firstMonth.getFullYear();
          return (
            <button
              key={year}
              type="button"
              aria-pressed={active}
              onClick={() => pickYear(year)}
              className={cn(
                "rounded-xl py-3 text-sm tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-accent font-semibold text-accent-fg"
                  : "text-fg hover:bg-surface-strong",
              )}
            >
              {year}
            </button>
          );
        })}
      </div>
    );

    return (
      <div
        {...rest}
        ref={setRefs}
        role="group"
        aria-label={rest["aria-label"] ?? "Calendar"}
        className={cn(
          "sui-paper-sm inline-block select-none rounded-2xl border-2 border-border-strong bg-card p-3 text-fg",
          className,
        )}
      >
        <div className="flex gap-3">
          {presets && presets.length > 0 && (
            <div className="flex w-[8.5rem] flex-col gap-0.5 border-r border-line pr-3">
              <span className="px-3 pb-1 text-[0.7rem] font-medium uppercase tracking-wide text-muted">
                Shortcuts
              </span>
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={presetBtn}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex-1">
            <div className="mb-3 flex items-center justify-between gap-2 border-b border-line px-1 pb-3">
              <button
                type="button"
                className={navBtn}
                onClick={goPrev}
                disabled={prevDisabled}
                aria-label="Previous"
              >
                <ChevronLeft />
              </button>
              <div className="flex items-center gap-1">
                {view === "day" && panels === 1 && (
                  <>
                    <button type="button" className={captionBtn} onClick={() => setView("month")}>
                      {monthsLong[firstMonth.getMonth()]}
                    </button>
                    <button type="button" className={captionBtn} onClick={() => setView("year")}>
                      {firstMonth.getFullYear()}
                    </button>
                  </>
                )}
                {view === "day" && panels > 1 && (
                  <span className="px-2 text-sm font-semibold text-fg">
                    {monthsLong[firstMonth.getMonth()]} {firstMonth.getFullYear()} –{" "}
                    {monthsLong[lastMonth.getMonth()]} {lastMonth.getFullYear()}
                  </span>
                )}
                {view === "month" && (
                  <button type="button" className={captionBtn} onClick={() => setView("year")}>
                    {firstMonth.getFullYear()}
                  </button>
                )}
                {view === "year" && (
                  <span className="px-2 text-sm font-semibold tabular-nums text-fg">
                    {decadeStart} – {decadeStart + 11}
                  </span>
                )}
              </div>
              <button
                type="button"
                className={navBtn}
                onClick={goNext}
                disabled={nextDisabled}
                aria-label="Next"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="relative overflow-hidden">
              {view === "day" ? (
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                  <motion.div
                    key={firstMonth.getTime()}
                    custom={direction}
                    variants={reduced ? undefined : slideVariants}
                    initial={reduced ? false : "enter"}
                    animate="center"
                    exit={reduced ? undefined : "exit"}
                    transition={{ duration: 0.28, ease: EASE }}
                    onKeyDown={onKeyDown}
                    onMouseLeave={mode === "range" ? () => setHovered(undefined) : undefined}
                    className="flex gap-4"
                  >
                    {Array.from({ length: panels }, (_, i) =>
                      renderPanel(withMonthOffset(firstMonth, i), i),
                    )}
                  </motion.div>
                </AnimatePresence>
              ) : view === "month" ? (
                renderMonthGrid()
              ) : (
                renderYearGrid()
              )}
            </div>
          </div>
        </div>

        {showToday && (
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-2">
            <button type="button" onClick={goToday} className={footerBtn} aria-label="Go to today">
              Today
            </button>
            {hasSelection && !(required && mode === "single") && (
              <button type="button" onClick={clearSelection} className={footerBtn}>
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);

Calendar.displayName = "Calendar";
