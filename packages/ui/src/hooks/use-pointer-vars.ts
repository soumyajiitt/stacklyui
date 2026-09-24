"use client";

import { useCallback, useRef } from "react";

export interface PointerVarsOptions {
  /** CSS custom property that receives the pointer X within the element (px). */
  xVar?: string;
  /** CSS custom property that receives the pointer Y within the element (px). */
  yVar?: string;
  /** Optional 0..1 normalized X. */
  xRelVar?: string;
  /** Optional 0..1 normalized Y. */
  yRelVar?: string;
}

/**
 * Writes the pointer position into CSS custom properties on the target element
 * via `requestAnimationFrame`, without triggering React re-renders.
 *
 * This is the performance trick behind the spotlight / glow effects: the glow
 * is a CSS radial-gradient positioned by `var(--pointer-x)`, so moving the
 * mouse only mutates style variables, never React state.
 *
 * @example
 * const { ref, onPointerMove, onPointerLeave } = usePointerVars();
 * <div ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} />
 */
export function usePointerVars<T extends HTMLElement = HTMLDivElement>(
  options: PointerVarsOptions = {},
) {
  const {
    xVar = "--pointer-x",
    yVar = "--pointer-y",
    xRelVar,
    yRelVar,
  } = options;

  const ref = useRef<T | null>(null);
  const frame = useRef<number | null>(null);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        node.style.setProperty(xVar, `${x}px`);
        node.style.setProperty(yVar, `${y}px`);
        if (xRelVar) node.style.setProperty(xRelVar, `${x / rect.width}`);
        if (yRelVar) node.style.setProperty(yRelVar, `${y / rect.height}`);
      });
    },
    [xVar, yVar, xRelVar, yRelVar],
  );

  const onPointerLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--pointer-active", "0");
  }, []);

  const onPointerEnter = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--pointer-active", "1");
  }, []);

  return { ref, onPointerMove, onPointerEnter, onPointerLeave } as const;
}
