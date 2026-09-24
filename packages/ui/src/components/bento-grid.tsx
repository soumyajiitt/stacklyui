"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { usePointerVars } from "../hooks/use-pointer-vars";

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns on large screens. Default: 3. */
  columns?: number;
  children?: React.ReactNode;
}

/**
 * A responsive bento layout: a dense CSS grid whose cells can span multiple
 * columns/rows. Collapses to a single column on small screens.
 */
export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  function BentoGrid({ className, children, columns = 3, style, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("sui-bento-grid", className)}
        style={
          {
            "--sui-bento-cols": columns,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    );
  },
);

export interface BentoCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Column span on large screens. Default: 1. */
  colSpan?: number;
  /** Row span on large screens. Default: 1. */
  rowSpan?: number;
  /** Optional eyebrow / label shown above the title. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Visual/media slot rendered behind the text content. */
  media?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * A single bento cell. Hover lifts the card and reveals a pointer-tracked glow.
 * Provide `title`/`description`/`eyebrow` for the standard layout, or pass
 * `children` for full control.
 */
export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  function BentoCard(
    {
      className,
      children,
      colSpan = 1,
      rowSpan = 1,
      eyebrow,
      title,
      description,
      media,
      style,
      onPointerMove,
      onPointerLeave,
      onPointerEnter,
      ...props
    },
    ref,
  ) {
    const pointer = usePointerVars<HTMLDivElement>();

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        pointer.ref.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [pointer.ref, ref],
    );

    return (
      <div
        ref={setRefs}
        className={cn("sui-bento-card", className)}
        style={
          {
            "--sui-col-span": colSpan,
            "--sui-row-span": rowSpan,
            "--pointer-active": "0",
            ...style,
          } as React.CSSProperties
        }
        onPointerMove={(e) => {
          pointer.onPointerMove(e);
          onPointerMove?.(e);
        }}
        onPointerEnter={(e) => {
          pointer.onPointerEnter();
          onPointerEnter?.(e);
        }}
        onPointerLeave={(e) => {
          pointer.onPointerLeave();
          onPointerLeave?.(e);
        }}
        {...props}
      >
        <div aria-hidden className="sui-bento-card__glow" />
        {media ? (
          <div aria-hidden className="sui-bento-card__media">
            {media}
          </div>
        ) : null}
        <div className="sui-bento-card__body">
          {children ?? (
            <>
              {eyebrow ? (
                <span className="sui-bento-card__eyebrow">{eyebrow}</span>
              ) : null}
              {title ? <h3 className="sui-bento-card__title">{title}</h3> : null}
              {description ? (
                <p className="sui-bento-card__description">{description}</p>
              ) : null}
            </>
          )}
        </div>
      </div>
    );
  },
);
