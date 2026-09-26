"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/cn";
import { useReducedMotion } from "../hooks/use-reduced-motion";

/* -------------------------------------------------------------------- Types */

export interface ComboboxOption {
  value: string;
  label: string;
  /** Secondary line shown under the label. */
  description?: string;
  /** Leading visual (icon, flag, avatar…). */
  icon?: React.ReactNode;
  /** Group heading this option is filed under. */
  group?: string;
  /** Extra terms that should match this option when searching. */
  keywords?: string[];
  disabled?: boolean;
}

export type ComboboxSize = "sm" | "md" | "lg";

export interface ComboboxProps {
  options: ComboboxOption[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Enable the typeahead search box. @default true */
  searchable?: boolean;
  /** Show a clear (×) button once a value is picked. @default false */
  clearable?: boolean;
  /** Offer a "Create …" row for values not in the list. */
  creatable?: boolean;
  onCreate?: (input: string) => void;
  /** Render a spinner + message instead of the list. */
  loading?: boolean;
  disabled?: boolean;
  size?: ComboboxSize;
  className?: string;
  contentClassName?: string;
  /** Override the default (case-insensitive substring) match. */
  filter?: (option: ComboboxOption, query: string) => boolean;
  name?: string;
  id?: string;
  "aria-label"?: string;
}

/* ----------------------------------------------------------------- Helpers */

const SIZES: Record<ComboboxSize, string> = {
  sm: "h-8 px-2.5 text-[0.8rem]",
  md: "h-10 px-3.5 text-sm",
  lg: "h-12 px-4 text-[0.95rem]",
};

function defaultFilter(option: ComboboxOption, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [option.label, option.value, ...(option.keywords ?? [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

const IconChevron = () => (
  <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted transition-transform" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/** Track the trigger's viewport rect while `open`, recomputing on scroll/resize. */
export function useAnchorRect(
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

/* ------------------------------------------------------------------ Combobox */

/**
 * A searchable, data-driven single-select — the "combobox" you normally
 * hand-assemble from a popover + command list. Pass `options` and it handles
 * typeahead filtering, grouping, keyboard navigation (ARIA combobox pattern),
 * an optional **Create "…"** row, a clearable value, and a loading state — with
 * a self-contained, portal-positioned dropdown (no Radix, no cmdk).
 */
export function Combobox({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  searchable = true,
  clearable = false,
  creatable = false,
  onCreate,
  loading = false,
  disabled = false,
  size = "md",
  className,
  contentClassName,
  filter,
  name,
  id,
  ...aria
}: ComboboxProps) {
  const reduced = useReducedMotion();
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const current = controlled ? (value as string) : internal;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const rect = useAnchorRect(triggerRef, open);
  const uid = React.useId();
  const listId = `${uid}-list`;

  const selected = React.useMemo(
    () => options.find((o) => o.value === current),
    [options, current],
  );

  const filtered = React.useMemo(() => {
    if (!searchable) return options;
    const f = filter ?? defaultFilter;
    return options.filter((o) => f(o, query));
  }, [options, query, searchable, filter]);

  const navList = React.useMemo(() => filtered.filter((o) => !o.disabled), [filtered]);
  const trimmed = query.trim();
  const showCreate =
    creatable &&
    trimmed.length > 0 &&
    !options.some((o) => o.label.toLowerCase() === trimmed.toLowerCase());
  const navCount = navList.length + (showCreate ? 1 : 0);
  const activeValue = navList[activeIndex]?.value;

  React.useEffect(() => {
    setActiveIndex((i) => Math.min(Math.max(0, i), Math.max(0, navCount - 1)));
  }, [navCount]);

  const openMenu = () => {
    if (disabled) return;
    setQuery("");
    const idx = navList.findIndex((o) => o.value === current);
    setActiveIndex(idx >= 0 ? idx : 0);
    setOpen(true);
  };
  const closeMenu = (focusTrigger = true) => {
    setOpen(false);
    setQuery("");
    if (focusTrigger) requestAnimationFrame(() => triggerRef.current?.focus());
  };
  const commit = (val: string) => {
    if (!controlled) setInternal(val);
    onValueChange?.(val);
    closeMenu();
  };
  const chooseActive = () => {
    if (activeIndex < navList.length) {
      const opt = navList[activeIndex];
      if (opt) commit(opt.value);
    } else if (showCreate) {
      onCreate?.(trimmed);
      closeMenu();
    }
  };

  // Focus management on open.
  React.useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      if (searchable) inputRef.current?.focus();
      else panelRef.current?.focus();
    });
  }, [open, searchable]);

  // Close on outside pointer down.
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

  // Keep the active option scrolled into view.
  React.useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
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

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    }
  };

  // Portal panel placement (client-only; rect is null during SSR).
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

  let lastGroup: string | undefined;

  return (
    <>
      {name ? <input type="hidden" name={name} value={current} /> : null}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={aria["aria-label"]}
        disabled={disabled}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        data-state={open ? "open" : "closed"}
        className={cn(
          "sui-raise-sm flex w-full items-center justify-between gap-2 rounded-lg border-2 border-border-strong bg-surface text-fg outline-none transition-[border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 data-[state=open]:border-accent",
          SIZES[size],
          className,
        )}
      >
        <span className={cn("flex min-w-0 items-center gap-2", !selected && "text-muted/70")}>
          {selected?.icon ? (
            <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
              {selected.icon}
            </span>
          ) : null}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {clearable && selected && !disabled ? (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear selection"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!controlled) setInternal("");
                onValueChange?.("");
              }}
              className="flex size-5 items-center justify-center rounded-md text-muted hover:bg-surface-strong hover:text-fg"
            >
              <IconX />
            </span>
          ) : null}
          <IconChevron />
        </span>
      </button>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="panel"
                ref={panelRef}
                tabIndex={-1}
                style={panelStyle}
                onKeyDown={onKeyDown}
                initial={reduced ? false : { opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "sui-paper z-50 flex flex-col overflow-hidden rounded-xl border-2 border-border-strong bg-popover text-fg outline-none",
                  contentClassName,
                )}
              >
                {searchable && (
                  <div className="flex items-center gap-2 border-b border-line px-3">
                    <IconSearch />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveIndex(0);
                      }}
                      placeholder={searchPlaceholder}
                      aria-autocomplete="list"
                      aria-controls={listId}
                      aria-activedescendant={
                        activeValue ? `${uid}-opt-${activeValue}` : undefined
                      }
                      className="h-11 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted/70"
                    />
                  </div>
                )}
                <div
                  ref={listRef}
                  id={listId}
                  role="listbox"
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
                        const isSelected = opt.value === current;
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
                              aria-disabled={opt.disabled || undefined}
                              data-active={isActive || undefined}
                              onPointerMove={
                                opt.disabled
                                  ? undefined
                                  : () =>
                                      setActiveIndex(
                                        navList.findIndex((o) => o.value === opt.value),
                                      )
                              }
                              onClick={opt.disabled ? undefined : () => commit(opt.value)}
                              className={cn(
                                "relative flex select-none items-center gap-2.5 rounded-lg py-2 pl-2.5 pr-8 text-sm outline-none transition-colors",
                                opt.disabled
                                  ? "pointer-events-none opacity-40"
                                  : "cursor-pointer",
                                isActive ? "bg-accent/12 text-accent" : "text-fg",
                              )}
                            >
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
                              {isSelected ? (
                                <motion.span
                                  className="absolute right-2.5 text-accent"
                                  initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                                >
                                  <IconCheck />
                                </motion.span>
                              ) : null}
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
                          onClick={() => {
                            onCreate?.(trimmed);
                            closeMenu();
                          }}
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

Combobox.displayName = "Combobox";



