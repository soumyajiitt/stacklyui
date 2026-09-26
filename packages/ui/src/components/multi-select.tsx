"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/cn";
import { useReducedMotion } from "../hooks/use-reduced-motion";

/* -------------------------------------------------------------------- Types */

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  group?: string;
  keywords?: string[];
  disabled?: boolean;
}

export type MultiSelectSize = "sm" | "md" | "lg";

export interface MultiSelectProps {
  options: MultiSelectOption[];
  /** Controlled selected values. */
  value?: string[];
  /** Uncontrolled initial values. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  /** Show a clear-all (×) button. @default true */
  clearable?: boolean;
  /** Offer a "Create …" row for values not in the list. */
  creatable?: boolean;
  onCreate?: (input: string) => void;
  loading?: boolean;
  disabled?: boolean;
  size?: MultiSelectSize;
  /** Collapse selected chips into "+N more" beyond this count. */
  maxDisplay?: number;
  /** Cap the number of selections. */
  maxSelected?: number;
  /** Show a "Select all" toggle above the list. @default true */
  showSelectAll?: boolean;
  className?: string;
  contentClassName?: string;
  filter?: (option: MultiSelectOption, query: string) => boolean;
  name?: string;
  id?: string;
  "aria-label"?: string;
}

/* ----------------------------------------------------------------- Helpers */

const SIZES: Record<MultiSelectSize, string> = {
  sm: "min-h-8 px-2 py-1 text-[0.8rem]",
  md: "min-h-10 px-2.5 py-1.5 text-sm",
  lg: "min-h-12 px-3 py-2 text-[0.95rem]",
};

function defaultFilter(option: MultiSelectOption, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [option.label, option.value, ...(option.keywords ?? [])]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

const IconChevron = () => (
  <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const IconCheck = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className ?? "size-3.5"} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconX = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className ?? "size-3.5"} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/** Track the trigger's viewport rect while `open`, recomputing on scroll/resize. */
function useAnchorRect(
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
): DOMRect | null {
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  React.useEffect(() => {
    if (!open) return;
    const el = ref.current;
    if (!el) return;
    const update = () => setRect(el.getBoundingClientRect());
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, ref]);
  return rect;
}

/* --------------------------------------------------------------- MultiSelect */

/**
 * A searchable multi-select with **inline chips** — the component shadcn never
 * shipped. Type to filter, `Enter` to toggle, `Backspace` to peel off the last
 * chip; selected values live as removable tags right in the control. Comes with
 * **Select all**, a `+N more` overflow collapse, an optional selection cap,
 * grouping, and creatable tags — all in one self-contained file (no Radix).
 */
export function MultiSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  emptyMessage = "No results found.",
  clearable = true,
  creatable = false,
  onCreate,
  loading = false,
  disabled = false,
  size = "md",
  maxDisplay,
  maxSelected,
  showSelectAll = true,
  className,
  contentClassName,
  filter,
  name,
  id,
  ...aria
}: MultiSelectProps) {
  const reduced = useReducedMotion();
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? []);
  const current = controlled ? (value as string[]) : internal;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const rect = useAnchorRect(triggerRef, open);
  const uid = React.useId();
  const listId = `${uid}-list`;

  const selectedSet = React.useMemo(() => new Set(current), [current]);
  const selectedOptions = React.useMemo<MultiSelectOption[]>(
    () =>
      current.map(
        (v) => options.find((o) => o.value === v) ?? { value: v, label: v },
      ),
    [current, options],
  );

  const filtered = React.useMemo(() => {
    const f = filter ?? defaultFilter;
    return options.filter((o) => f(o, query));
  }, [options, query, filter]);

  const navList = React.useMemo(() => filtered.filter((o) => !o.disabled), [filtered]);
  const trimmed = query.trim();
  const showCreate =
    creatable &&
    trimmed.length > 0 &&
    !options.some((o) => o.label.toLowerCase() === trimmed.toLowerCase()) &&
    !current.some((v) => v.toLowerCase() === trimmed.toLowerCase());
  const navCount = navList.length + (showCreate ? 1 : 0);
  const activeValue = navList[activeIndex]?.value;
  const atMax = maxSelected != null && current.length >= maxSelected;
  const allSelected =
    navList.length > 0 && navList.every((o) => selectedSet.has(o.value));

  React.useEffect(() => {
    setActiveIndex((i) => Math.min(Math.max(0, i), Math.max(0, navCount - 1)));
  }, [navCount]);

  const setValues = (next: string[]) => {
    if (!controlled) setInternal(next);
    onValueChange?.(next);
  };
  const toggle = (val: string) => {
    if (selectedSet.has(val)) setValues(current.filter((v) => v !== val));
    else if (!atMax) setValues([...current, val]);
  };
  const removeValue = (val: string) => setValues(current.filter((v) => v !== val));
  const clearAll = () => setValues([]);
  const toggleAll = () => {
    if (allSelected) {
      setValues(current.filter((v) => !navList.some((o) => o.value === v)));
    } else {
      const add = navList.map((o) => o.value).filter((v) => !selectedSet.has(v));
      const merged = [...current, ...add];
      setValues(maxSelected != null ? merged.slice(0, maxSelected) : merged);
    }
  };
  const create = () => {
    onCreate?.(trimmed);
    if (!current.includes(trimmed) && !atMax) setValues([...current, trimmed]);
    setQuery("");
  };

  const openMenu = () => {
    if (disabled) return;
    setActiveIndex(0);
    setOpen(true);
  };
  const closeMenu = (focusTrigger = true) => {
    setOpen(false);
    setQuery("");
    if (focusTrigger) requestAnimationFrame(() => triggerRef.current?.focus());
  };
  const chooseActive = () => {
    if (activeIndex < navList.length) {
      const opt = navList[activeIndex];
      if (opt) toggle(opt.value);
    } else if (showCreate) {
      create();
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
      setQuery("");
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && query === "" && current.length > 0) {
      const last = current[current.length - 1];
      if (last != null) removeValue(last);
      return;
    }
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    const n = Math.max(1, navCount);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % n);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + n) % n);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(navCount - 1);
        break;
      case "Enter":
        e.preventDefault();
        chooseActive();
        break;
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
      case "Tab":
        closeMenu(false);
        break;
      default:
        break;
    }
  };

  const GAP = 6;
  const MAX_H = 320;
  let panelStyle: React.CSSProperties = { position: "fixed", visibility: "hidden" };
  if (rect && typeof window !== "undefined") {
    const below = window.innerHeight - rect.bottom - GAP;
    const above = rect.top - GAP;
    const placeAbove = below < Math.min(MAX_H, 220) && above > below;
    const maxHeight = Math.min(MAX_H, Math.max(140, placeAbove ? above : below));
    panelStyle = {
      position: "fixed",
      left: rect.left,
      width: rect.width,
      maxHeight,
      ...(placeAbove
        ? { bottom: window.innerHeight - rect.top + GAP }
        : { top: rect.bottom + GAP }),
    };
  }

  const displayed =
    maxDisplay != null ? selectedOptions.slice(0, maxDisplay) : selectedOptions;
  const overflow = selectedOptions.length - displayed.length;
  let lastGroup: string | undefined;

  return (
    <>
      {name
        ? current.map((v) => <input key={v} type="hidden" name={name} value={v} />)
        : null}
      <div
        ref={triggerRef}
        role="combobox"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={aria["aria-label"]}
        data-state={open ? "open" : "closed"}
        onClick={() => {
          if (disabled) return;
          if (!open) openMenu();
          inputRef.current?.focus();
        }}
        className={cn(
          "sui-raise-sm flex w-full flex-wrap items-center gap-1.5 rounded-lg border-2 border-border-strong bg-surface text-fg outline-none transition-[border-color] focus-within:border-accent focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-bg data-[state=open]:border-accent",
          disabled && "pointer-events-none opacity-50",
          SIZES[size],
          className,
        )}
      >
        {displayed.map((opt) => (
          <span
            key={opt.value}
            className="inline-flex max-w-full items-center gap-1 rounded-md border border-border bg-surface-strong py-0.5 pl-2 pr-1 text-[0.8em] text-fg"
          >
            {opt.icon ? <span className="[&_svg]:size-3">{opt.icon}</span> : null}
            <span className="truncate">{opt.label}</span>
            <button
              type="button"
              tabIndex={-1}
              aria-label={`Remove ${opt.label}`}
              onClick={(e) => {
                e.stopPropagation();
                removeValue(opt.value);
              }}
              className="flex size-4 items-center justify-center rounded-sm text-muted transition-colors hover:bg-accent/15 hover:text-accent"
            >
              <IconX className="size-3" />
            </button>
          </span>
        ))}
        {overflow > 0 ? (
          <span className="rounded-md bg-accent/12 px-1.5 py-0.5 text-[0.8em] font-medium text-accent">
            +{overflow} more
          </span>
        ) : null}
        <input
          ref={inputRef}
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) openMenu();
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={current.length === 0 ? placeholder : ""}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-activedescendant={activeValue ? `${uid}-opt-${activeValue}` : undefined}
          className="h-6 min-w-[4rem] flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted/70"
        />
        <span className="flex shrink-0 items-center gap-1 self-center">
          {clearable && current.length > 0 && !disabled ? (
            <button
              type="button"
              tabIndex={-1}
              aria-label="Clear all"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="flex size-5 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-strong hover:text-fg"
            >
              <IconX />
            </button>
          ) : null}
          <IconChevron />
        </span>
      </div>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="panel"
                ref={panelRef}
                style={panelStyle}
                initial={reduced ? false : { opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "sui-paper z-50 flex flex-col overflow-hidden rounded-xl border-2 border-border-strong bg-popover text-fg outline-none",
                  contentClassName,
                )}
              >
                {showSelectAll && navList.length > 0 && !loading ? (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={toggleAll}
                    className="flex items-center justify-between gap-2 border-b border-line px-3 py-2 text-left text-sm text-muted transition-colors hover:text-fg"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
                          allSelected
                            ? "border-accent bg-accent text-accent-fg"
                            : "border-border-strong text-transparent",
                        )}
                      >
                        <IconCheck className="size-3" />
                      </span>
                      {allSelected ? "Clear all" : "Select all"}
                    </span>
                    <span className="tabular-nums text-xs text-muted">
                      {current.length}
                      {maxSelected != null ? ` / ${maxSelected}` : ""} selected
                    </span>
                  </button>
                ) : null}
                <div
                  ref={listRef}
                  id={listId}
                  role="listbox"
                  aria-multiselectable
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2 py-7 text-sm text-muted">
                      <span className="sui-spinner size-4 rounded-full border-2 border-border-strong border-t-accent" />
                      Loading…
                    </div>
                  ) : filtered.length === 0 && !showCreate ? (
                    <div className="py-7 text-center text-sm text-muted">{emptyMessage}</div>
                  ) : (
                    <>
                      {filtered.map((opt) => {
                        const showHeader = !!opt.group && opt.group !== lastGroup;
                        lastGroup = opt.group;
                        const isActive = !opt.disabled && opt.value === activeValue;
                        const isSelected = selectedSet.has(opt.value);
                        const blocked = !isSelected && atMax;
                        return (
                          <React.Fragment key={opt.value}>
                            {showHeader && (
                              <div className="px-2.5 pb-1 pt-2 text-[0.7rem] font-semibold uppercase tracking-wider text-muted">
                                {opt.group}
                              </div>
                            )}
                            <div
                              id={`${uid}-opt-${opt.value}`}
                              role="option"
                              aria-selected={isSelected}
                              aria-disabled={opt.disabled || blocked || undefined}
                              data-active={isActive || undefined}
                              onPointerMove={
                                opt.disabled
                                  ? undefined
                                  : () =>
                                      setActiveIndex(
                                        navList.findIndex((o) => o.value === opt.value),
                                      )
                              }
                              onClick={
                                opt.disabled || blocked ? undefined : () => toggle(opt.value)
                              }
                              className={cn(
                                "relative flex select-none items-center gap-2.5 rounded-lg py-2 pl-2.5 pr-3 text-sm outline-none transition-colors",
                                opt.disabled || blocked
                                  ? "pointer-events-none opacity-40"
                                  : "cursor-pointer",
                                isActive ? "bg-accent/12 text-accent" : "text-fg",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
                                  isSelected
                                    ? "border-accent bg-accent text-accent-fg"
                                    : "border-border-strong text-transparent",
                                )}
                              >
                                <IconCheck className="size-3" />
                              </span>
                              {opt.icon ? (
                                <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                                  {opt.icon}
                                </span>
                              ) : null}
                              <span className="min-w-0 flex-1">
                                <span className="block truncate">{opt.label}</span>
                                {opt.description ? (
                                  <span className="block truncate text-xs text-muted">
                                    {opt.description}
                                  </span>
                                ) : null}
                              </span>
                            </div>
                          </React.Fragment>
                        );
                      })}
                      {showCreate && (
                        <div
                          role="option"
                          aria-selected={false}
                          data-active={activeIndex >= navList.length || undefined}
                          onPointerMove={() => setActiveIndex(navList.length)}
                          onClick={create}
                          className={cn(
                            "mt-0.5 flex cursor-pointer select-none items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors",
                            activeIndex >= navList.length
                              ? "bg-accent/12 text-accent"
                              : "text-fg",
                          )}
                        >
                          <span className="text-muted">Create</span>
                          <span className="font-medium">“{trimmed}”</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

MultiSelect.displayName = "MultiSelect";




