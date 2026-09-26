"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/cn";
import { useReducedMotion } from "../hooks/use-reduced-motion";

/* -------------------------------------------------------------------- Types */

export type ToastType =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastAction {
  label: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ToastOptions {
  /** Provide your own id to update an existing toast in place. */
  id?: string | number;
  /** Secondary line under the title. */
  description?: React.ReactNode;
  /** Override the type's default leading icon (or pass `null` to hide it). */
  icon?: React.ReactNode | null;
  /** Auto-dismiss after N ms. `Infinity` keeps it until dismissed. */
  duration?: number;
  /** Primary call-to-action button. */
  action?: ToastAction;
  /** Secondary / cancel button. */
  cancel?: ToastAction;
  /** Allow dismissing by swipe / close button. @default true */
  dismissible?: boolean;
  onDismiss?: (id: string | number) => void;
  onAutoClose?: (id: string | number) => void;
  className?: string;
}

export interface ToastRecord extends ToastOptions {
  id: string | number;
  type: ToastType;
  title: React.ReactNode;
  /** Fully custom body — replaces the default title/description layout. */
  jsx?: React.ReactNode;
  createdAt: number;
}

export interface PromiseMessages<T> {
  loading: React.ReactNode;
  success: React.ReactNode | ((data: T) => React.ReactNode);
  error: React.ReactNode | ((error: unknown) => React.ReactNode);
  description?: React.ReactNode;
}

/* -------------------------------------------------------------------- Store */

/**
 * A tiny framework-agnostic store. `toast()` pushes/updates records; `Toaster`
 * subscribes via `useSyncExternalStore`. Newest toast is always at index 0.
 */
class ToastStore {
  private toasts: ToastRecord[] = [];
  private listeners = new Set<() => void>();

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  getSnapshot = () => this.toasts;

  private emit() {
    for (const l of this.listeners) l();
  }

  add(toast: ToastRecord): string | number {
    const exists = this.toasts.some((t) => t.id === toast.id);
    this.toasts = exists
      ? this.toasts.map((t) => (t.id === toast.id ? { ...t, ...toast } : t))
      : [toast, ...this.toasts];
    this.emit();
    return toast.id;
  }

  dismiss(id?: string | number) {
    this.toasts =
      id == null ? [] : this.toasts.filter((t) => t.id !== id);
    this.emit();
  }
}

export const toastStore = new ToastStore();
const EMPTY: ToastRecord[] = [];

let counter = 0;
const genId = () => (++counter).toString();

function create(
  title: React.ReactNode,
  type: ToastType,
  opts: ToastOptions = {},
): string | number {
  const id = opts.id ?? genId();
  return toastStore.add({
    ...opts,
    id,
    type,
    title,
    duration: opts.duration,
    createdAt: Date.now(),
  });
}

/* ---------------------------------------------------------------------- API */

interface ToastFn {
  (title: React.ReactNode, opts?: ToastOptions): string | number;
  message: (title: React.ReactNode, opts?: ToastOptions) => string | number;
  success: (title: React.ReactNode, opts?: ToastOptions) => string | number;
  error: (title: React.ReactNode, opts?: ToastOptions) => string | number;
  warning: (title: React.ReactNode, opts?: ToastOptions) => string | number;
  info: (title: React.ReactNode, opts?: ToastOptions) => string | number;
  loading: (title: React.ReactNode, opts?: ToastOptions) => string | number;
  custom: (
    jsx: React.ReactNode | ((id: string | number) => React.ReactNode),
    opts?: ToastOptions,
  ) => string | number;
  dismiss: (id?: string | number) => void;
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: PromiseMessages<T>,
    opts?: ToastOptions,
  ) => string | number;
}

const toastBase = (title: React.ReactNode, opts?: ToastOptions) =>
  create(title, "default", opts);

export const toast = toastBase as ToastFn;
toast.message = (title, opts) => create(title, "default", opts);
toast.success = (title, opts) => create(title, "success", opts);
toast.error = (title, opts) => create(title, "error", opts);
toast.warning = (title, opts) => create(title, "warning", opts);
toast.info = (title, opts) => create(title, "info", opts);
toast.loading = (title, opts) =>
  create(title, "loading", { duration: Infinity, ...opts });
toast.dismiss = (id) => toastStore.dismiss(id);
toast.custom = (jsx, opts = {}) => {
  const id = opts.id ?? genId();
  const node = typeof jsx === "function" ? jsx(id) : jsx;
  return toastStore.add({
    ...opts,
    id,
    type: "default",
    title: null,
    jsx: node,
    duration: opts.duration,
    createdAt: Date.now(),
  });
};
toast.promise = (promise, messages, opts = {}) => {
  const id = opts.id ?? genId();
  create(messages.loading, "loading", {
    ...opts,
    id,
    duration: Infinity,
    description: messages.description,
  });
  const p = typeof promise === "function" ? promise() : promise;
  p.then((data) => {
    const title =
      typeof messages.success === "function"
        ? messages.success(data)
        : messages.success;
    create(title, "success", { ...opts, id });
  }).catch((err) => {
    const title =
      typeof messages.error === "function"
        ? messages.error(err)
        : messages.error;
    create(title, "error", { ...opts, id });
  });
  return id;
};

/* ------------------------------------------------------------------- Glyphs */

const IconSuccess = () => (
  <svg viewBox="0 0 24 24" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconError = () => (
  <svg viewBox="0 0 24 24" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconWarning = () => (
  <svg viewBox="0 0 24 24" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
  </svg>
);
const IconInfo = () => (
  <svg viewBox="0 0 24 24" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const TYPE_ICON: Record<ToastType, React.ReactNode> = {
  default: null,
  success: <IconSuccess />,
  error: <IconError />,
  warning: <IconWarning />,
  info: <IconInfo />,
  loading: (
    <span className="sui-spinner block size-full rounded-full border-2 border-border-strong border-t-accent" />
  ),
};

/** Icon chip tint per type (used both plain and in rich-colors mode). */
const TYPE_ICON_COLOR: Record<ToastType, string> = {
  default: "text-fg",
  success: "text-[oklch(0.62_0.17_150)]",
  error: "text-destructive",
  warning: "text-[oklch(0.72_0.16_75)]",
  info: "text-accent",
  loading: "text-muted",
};

/** Full-card tint for `richColors`. */
const RICH_COLOR: Record<ToastType, string> = {
  default: "",
  success:
    "border-[oklch(0.62_0.17_150/0.4)] bg-[oklch(0.62_0.17_150/0.12)] text-[oklch(0.42_0.13_150)] dark:text-[oklch(0.86_0.13_150)]",
  error:
    "border-destructive/40 bg-destructive/12 text-destructive",
  warning:
    "border-[oklch(0.72_0.16_75/0.45)] bg-[oklch(0.72_0.16_75/0.14)] text-[oklch(0.46_0.12_70)] dark:text-[oklch(0.86_0.13_80)]",
  info: "border-accent/40 bg-accent/12 text-accent",
  loading: "",
};

const POSITION_CLASS: Record<ToastPosition, string> = {
  "top-left": "top-0 left-0 items-start",
  "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-0 right-0 items-end",
  "bottom-left": "bottom-0 left-0 items-start",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-0 right-0 items-end",
};

/* ----------------------------------------------------------------- Toaster */

export interface ToasterProps {
  /** Corner the stack docks to. @default "bottom-right" */
  position?: ToastPosition;
  /** Default auto-dismiss (ms) for toasts that don't set their own. @default 4000 */
  duration?: number;
  /** Toasts shown before the rest collapse under the stack. @default 3 */
  visibleToasts?: number;
  /** Distance from the viewport edge, in px. @default 24 */
  offset?: number;
  /** Gap between toasts when the stack is expanded, in px. @default 14 */
  gap?: number;
  /** Toast width in px. @default 356 */
  width?: number;
  /** Keep the stack permanently expanded instead of collapsing. @default false */
  expand?: boolean;
  /** Tint each toast by its type. @default false */
  richColors?: boolean;
  /** Always render a close (×) button. @default false */
  closeButton?: boolean;
  className?: string;
  toastClassName?: string;
}

interface Measured {
  id: string | number;
  height: number;
}

export function Toaster({
  position = "bottom-right",
  duration = 4000,
  visibleToasts = 3,
  offset = 24,
  gap = 14,
  width = 356,
  expand = false,
  richColors = false,
  closeButton = false,
  className,
  toastClassName,
}: ToasterProps) {
  const toasts = React.useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    () => EMPTY,
  );
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [hovered, setHovered] = React.useState(false);
  const [heights, setHeights] = React.useState<Measured[]>([]);
  const expanded = expand || hovered;
  const isTop = position.startsWith("top");
  const dir = isTop ? 1 : -1;

  const setHeight = React.useCallback((id: string | number, height: number) => {
    setHeights((prev) => {
      const existing = prev.find((h) => h.id === id);
      if (existing) {
        if (existing.height === height) return prev;
        return prev.map((h) => (h.id === id ? { id, height } : h));
      }
      return [...prev, { id, height }];
    });
  }, []);
  const clearHeight = React.useCallback((id: string | number) => {
    setHeights((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const heightMap = React.useMemo(() => {
    const m = new Map<string | number, number>();
    for (const h of heights) m.set(h.id, h.height);
    return m;
  }, [heights]);

  React.useEffect(() => {
    if (toasts.length === 0 && hovered) setHovered(false);
  }, [toasts.length, hovered]);

  if (!mounted) return null;

  const frontHeight = toasts[0] ? (heightMap.get(toasts[0].id) ?? 0) : 0;
  let stackHeight = frontHeight;
  if (expanded) {
    const shown = toasts.slice(0, Math.max(visibleToasts, toasts.length));
    stackHeight =
      shown.reduce((sum, t) => sum + (heightMap.get(t.id) ?? 0), 0) +
      gap * Math.max(0, shown.length - 1);
  }

  return createPortal(
    <section
      aria-label="Notifications"
      aria-live="polite"
      className={cn("pointer-events-none fixed z-[100] flex flex-col", POSITION_CLASS[position], className)}
      style={{ padding: offset }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false);
      }}
    >
      <ol
        className="pointer-events-auto relative m-0 list-none p-0"
        style={{
          width,
          maxWidth: "calc(100vw - 2rem)",
          height: stackHeight,
          transition: "height 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <AnimatePresence initial={false}>
          {toasts.map((t, i) => {
            const heightBefore = toasts
              .slice(0, i)
              .reduce((sum, x) => sum + (heightMap.get(x.id) ?? 0), 0);
            return (
              <ToastItem
                key={t.id}
                toast={t}
                index={i}
                expanded={expanded}
                paused={hovered || expand}
                visible={i < visibleToasts || expanded}
                dir={dir}
                isTop={isTop}
                gap={gap}
                heightBefore={heightBefore}
                defaultDuration={duration}
                richColors={richColors}
                closeButton={closeButton}
                toastClassName={toastClassName}
                onHeight={setHeight}
                onRemoved={clearHeight}
              />
            );
          })}
        </AnimatePresence>
      </ol>
    </section>,
    document.body,
  );
}

Toaster.displayName = "Toaster";

/* --------------------------------------------------------------- ToastItem */

interface ToastItemProps {
  toast: ToastRecord;
  index: number;
  expanded: boolean;
  paused: boolean;
  visible: boolean;
  dir: number;
  isTop: boolean;
  gap: number;
  heightBefore: number;
  defaultDuration: number;
  richColors: boolean;
  closeButton: boolean;
  toastClassName?: string;
  onHeight: (id: string | number, height: number) => void;
  onRemoved: (id: string | number) => void;
}

const PEEK = 16; // collapsed vertical peek per toast, px

function ToastItem({
  toast: t,
  index,
  expanded,
  paused,
  visible,
  dir,
  isTop,
  gap,
  heightBefore,
  defaultDuration,
  richColors,
  closeButton,
  toastClassName,
  onHeight,
  onRemoved,
}: ToastItemProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLLIElement>(null);
  const duration = t.duration ?? defaultDuration;
  const persistent = t.type === "loading" || !Number.isFinite(duration);
  const dismissible = t.dismissible !== false;

  const dismiss = React.useCallback(() => {
    t.onDismiss?.(t.id);
    toastStore.dismiss(t.id);
  }, [t]);

  // Measure height (content-driven) and report upward.
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => onHeight(t.id, el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [t.id, onHeight, t.title, t.description, t.jsx]);

  React.useEffect(() => () => onRemoved(t.id), [t.id, onRemoved]);

  // Auto-dismiss timer — pauses while the stack is hovered/focused.
  const remaining = React.useRef(duration);
  React.useEffect(() => {
    remaining.current = duration;
  }, [duration, t.createdAt]);

  React.useEffect(() => {
    if (persistent || paused) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => {
      t.onAutoClose?.(t.id);
      toastStore.dismiss(t.id);
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [persistent, paused, t.createdAt, t]);

  const y = expanded ? dir * (heightBefore + gap * index) : dir * index * PEEK;
  const scale = expanded ? 1 : Math.max(0.85, 1 - index * 0.06);
  const icon = t.icon === null ? null : (t.icon ?? TYPE_ICON[t.type]);
  const showProgress = !persistent && !reduced && Number.isFinite(duration);

  return (
    <motion.li
      ref={ref}
      drag={dismissible ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) dismiss();
      }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: dir * 24, scale: 0.9 }}
      animate={{
        opacity: visible ? 1 : 0,
        y,
        scale,
        transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
      }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        [isTop ? "top" : "bottom"]: 0,
        transformOrigin: isTop ? "center top" : "center bottom",
        zIndex: 100 - index,
        touchAction: "pan-y",
      }}
    >
      <div
        role="status"
        className={cn(
          "sui-paper-sm group relative flex items-start gap-3 overflow-hidden rounded-xl border-2 border-border-strong bg-popover p-4 text-fg",
          richColors && RICH_COLOR[t.type],
          t.className,
          toastClassName,
        )}
      >
        {icon ? (
          <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center", !richColors && TYPE_ICON_COLOR[t.type])}>
            {icon}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          {t.jsx ?? (
            <>
              {t.title ? (
                <div className="text-sm font-semibold leading-snug">{t.title}</div>
              ) : null}
              {t.description ? (
                <div className={cn("text-sm leading-snug", richColors ? "opacity-80" : "text-muted")}>
                  {t.description}
                </div>
              ) : null}
              {(t.action || t.cancel) && (
                <div className="mt-2.5 flex items-center gap-2">
                  {t.action ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        t.action?.onClick(e);
                        if (!e.defaultPrevented) dismiss();
                      }}
                      className="sui-raise-sm rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-accent-fg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t.action.label}
                    </button>
                  ) : null}
                  {t.cancel ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        t.cancel?.onClick(e);
                        if (!e.defaultPrevented) dismiss();
                      }}
                      className="rounded-md px-2.5 py-1 text-xs font-medium text-muted outline-none transition-colors hover:bg-surface-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t.cancel.label}
                    </button>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
        {closeButton && dismissible ? (
          <button
            type="button"
            aria-label="Close"
            onClick={dismiss}
            className="-mr-1 -mt-1 flex size-6 shrink-0 items-center justify-center rounded-md text-muted opacity-0 outline-none transition-opacity hover:bg-surface-strong hover:text-fg focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
          >
            <IconClose />
          </button>
        ) : null}
        {showProgress ? (
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-current opacity-40"
          >
            <span
              key={t.createdAt}
              data-paused={paused || undefined}
              className="sui-toast-progress block h-full w-full bg-current"
              style={{ "--sui-toast-duration": `${duration}ms` } as React.CSSProperties}
            />
          </span>
        ) : null}
      </div>
    </motion.li>
  );
}




