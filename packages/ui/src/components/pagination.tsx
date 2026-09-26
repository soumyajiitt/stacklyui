"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/cn";
import { useReducedMotion } from "../hooks/use-reduced-motion";

/* -------------------------------------------------------------------- Types */

export type PaginationItem = number | "ellipsis";
export type PaginationSize = "sm" | "md" | "lg";

export interface PaginationRangeOptions {
  /** Current page, 1-based. */
  page: number;
  /** Total number of pages. */
  count: number;
  /** Pages shown on each side of the current page. @default 1 */
  siblingCount?: number;
  /** Pages pinned at the start and end. @default 1 */
  boundaryCount?: number;
}

export interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Controlled current page (1-based). */
  page?: number;
  /** Uncontrolled initial page. @default 1 */
  defaultPage?: number;
  /** Total number of items — with `pageSize`, derives the page count + summary. */
  total?: number;
  /** Items per page. @default 10 */
  pageSize?: number;
  /** Explicit page count — overrides the `total` / `pageSize` calculation. */
  pageCount?: number;
  /** Fires with the next page whenever it changes. */
  onPageChange?: (page: number) => void;
  /** Pages shown either side of the current page. @default 1 */
  siblingCount?: number;
  /** Pages pinned at each end. @default 1 */
  boundaryCount?: number;
  size?: PaginationSize;
  /** Render first / last jump buttons. @default true */
  showEdges?: boolean;
  /** Show a "Showing 1–10 of 240" summary (needs `total`). @default false */
  showSummary?: boolean;
  /** Show a "Go to page" number input. @default false */
  showJumper?: boolean;
  /** Render a slim accent progress meter that tracks page ÷ count. @default false */
  showProgress?: boolean;
  /** Offer a rows-per-page picker with these options. */
  pageSizeOptions?: number[];
  /** Fires when the rows-per-page picker changes. */
  onPageSizeChange?: (size: number) => void;
  disabled?: boolean;
}

/* --------------------------------------------------------------- Range math */

function span(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i += 1) out.push(i);
  return out;
}

/**
 * Compute the visible page items with ellipsis truncation — the logic you'd
 * otherwise reinvent every project. Returns numbers plus `"ellipsis"` gaps,
 * e.g. `[1, "ellipsis", 5, 6, 7, "ellipsis", 20]`.
 */
export function paginationRange({
  page,
  count,
  siblingCount = 1,
  boundaryCount = 1,
}: PaginationRangeOptions): PaginationItem[] {
  if (count <= 0) return [];
  const startPages = span(1, Math.min(boundaryCount, count));
  const endPages = span(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? (endPages[0] as number) - 2 : count - 1,
  );

  return [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? (["ellipsis"] as PaginationItem[])
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...span(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1
      ? (["ellipsis"] as PaginationItem[])
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),
    ...endPages,
  ];
}

/* ------------------------------------------------------------------- Glyphs */

const Chevron = ({ dir }: { dir: "left" | "right" | "first" | "last" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {dir === "first" && <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />}
    {dir === "last" && <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />}
    {dir === "left" && <path d="m15 18-6-6 6-6" />}
    {dir === "right" && <path d="m9 18 6-6-6-6" />}
  </svg>
);

const SIZES: Record<PaginationSize, string> = {
  sm: "h-8 min-w-8 px-2 text-[0.8rem]",
  md: "h-9 min-w-9 px-2.5 text-sm",
  lg: "h-11 min-w-11 px-3 text-[0.95rem]",
};

/**
 * A batteries-included pagination control. Unlike a bag of static links, this
 * one is *stateful*: give it a `total` (and optionally a `pageSize`) and it
 * computes the page count, the ellipsis-truncated range, the summary line, and
 * the disabled edge states for you — controlled or uncontrolled.
 *
 * Signature touch: the active page is a single accent pill that **glides**
 * between numbers (Motion `layoutId`). Opt into `showSummary`, `showJumper`,
 * or a `pageSizeOptions` rows-per-page picker for instant data-table controls.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    {
      page: pageProp,
      defaultPage = 1,
      total,
      pageSize = 10,
      pageCount,
      onPageChange,
      siblingCount = 1,
      boundaryCount = 1,
      size = "md",
      showEdges = true,
      showSummary = false,
      showJumper = false,
      showProgress = false,
      pageSizeOptions,
      onPageSizeChange,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) {
    const uid = React.useId();
    const reduced = useReducedMotion();
    const count = Math.max(
      1,
      pageCount ?? (total != null ? Math.ceil(total / Math.max(1, pageSize)) : 1),
    );

    const controlled = pageProp != null;
    const [internal, setInternal] = React.useState(() =>
      Math.min(Math.max(1, defaultPage), count),
    );
    const page = Math.min(Math.max(1, controlled ? (pageProp as number) : internal), count);

    const goTo = (next: number) => {
      const clamped = Math.min(Math.max(1, next), count);
      if (clamped === page) return;
      if (!controlled) setInternal(clamped);
      onPageChange?.(clamped);
    };

    const items = React.useMemo(
      () => paginationRange({ page, count, siblingCount, boundaryCount }),
      [page, count, siblingCount, boundaryCount],
    );

    // Ghost cell used for every control inside the segmented rail — the rail
    // itself supplies the frame + elevation, so the cells stay borderless.
    const cell =
      "relative inline-flex shrink-0 select-none items-center justify-center rounded-lg font-medium tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-40 [&>svg]:size-4";
    const navCell = cn(cell, SIZES[size], "text-muted hover:bg-surface-strong hover:text-fg");

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      // Don't hijack arrow keys inside the jumper input / rows-per-page select.
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "SELECT") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(page - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(page + 1);
      }
    };

    const from = total != null ? Math.min((page - 1) * pageSize + 1, total) : 0;
    const to = total != null ? Math.min(page * pageSize, total) : 0;
    const hasMetaLeft = showSummary && total != null;
    const hasMetaRight =
      showJumper || (pageSizeOptions != null && pageSizeOptions.length > 0);

    return (
      <nav
        {...rest}
        ref={ref}
        role="navigation"
        aria-label={rest["aria-label"] ?? "Pagination"}
        data-disabled={disabled || undefined}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full flex-col gap-3",
          disabled && "pointer-events-none opacity-60",
          className,
        )}
      >
        {(hasMetaLeft || hasMetaRight) && (
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
            {hasMetaLeft ? (
              <p className="text-sm text-muted" aria-live="polite">
                Showing <span className="font-medium text-fg tabular-nums">{from}</span>–
                <span className="font-medium text-fg tabular-nums">{to}</span> of{" "}
                <span className="font-medium text-fg tabular-nums">{total}</span>
              </p>
            ) : (
              <span />
            )}
            {hasMetaRight && (
              <div className="flex items-center gap-4">
                {pageSizeOptions && pageSizeOptions.length > 0 && (
                  <label className="flex items-center gap-2 text-sm text-muted">
                    Rows
                    <select
                      value={pageSize}
                      disabled={disabled}
                      onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                      className="h-9 rounded-lg border-2 border-border-strong bg-surface px-2 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {pageSizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {showJumper && (
                  <label className="flex items-center gap-2 text-sm text-muted">
                    Go to
                    <input
                      key={page}
                      type="number"
                      min={1}
                      max={count}
                      defaultValue={page}
                      disabled={disabled}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") goTo(Number(e.currentTarget.value));
                      }}
                      onBlur={(e) => goTo(Number(e.target.value))}
                      aria-label="Go to page"
                      className="h-9 w-16 rounded-lg border-2 border-border-strong bg-surface px-2 text-center text-sm tabular-nums text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        )}
        <div className="-mx-1 -my-2 flex overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full justify-center">
            <ul className="sui-raise-sm inline-flex items-center gap-0.5 rounded-xl border-2 border-border-strong bg-surface p-1">
              {showEdges && (
                <li>
                  <button
                    type="button"
                    className={navCell}
                    onClick={() => goTo(1)}
                    disabled={disabled || page <= 1}
                    aria-label="First page"
                  >
                    <Chevron dir="first" />
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  className={navCell}
                  onClick={() => goTo(page - 1)}
                  disabled={disabled || page <= 1}
                  aria-label="Previous page"
                >
                  <Chevron dir="left" />
                </button>
              </li>
              {items.map((item, i) => {
                if (item === "ellipsis") {
                  return (
                    <li
                      key={`gap-${i}`}
                      aria-hidden
                      className={cn(
                        "inline-flex shrink-0 items-center justify-center text-muted",
                        SIZES[size],
                      )}
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                        <circle cx="5" cy="12" r="1.6" />
                        <circle cx="12" cy="12" r="1.6" />
                        <circle cx="19" cy="12" r="1.6" />
                      </svg>
                    </li>
                  );
                }
                const active = item === page;
                return (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => goTo(item)}
                      disabled={disabled}
                      aria-current={active ? "page" : undefined}
                      aria-label={`Page ${item}`}
                      className={cn(
                        cell,
                        SIZES[size],
                        active ? "text-accent-fg" : "text-fg hover:bg-surface-strong",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId={`sui-page-${uid}`}
                          aria-hidden
                          className="sui-raise-accent absolute inset-0 rounded-lg bg-accent"
                          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10">{item}</span>
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  className={navCell}
                  onClick={() => goTo(page + 1)}
                  disabled={disabled || page >= count}
                  aria-label="Next page"
                >
                  <Chevron dir="right" />
                </button>
              </li>
              {showEdges && (
                <li>
                  <button
                    type="button"
                    className={navCell}
                    onClick={() => goTo(count)}
                    disabled={disabled || page >= count}
                    aria-label="Last page"
                  >
                    <Chevron dir="last" />
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
        {showProgress && count > 1 && (
          <div
            className="relative h-1 w-full overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={count}
            aria-valuenow={page}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-accent"
              initial={false}
              animate={{ width: `${(page / count) * 100}%` }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 32 }}
            />
          </div>
        )}
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";


