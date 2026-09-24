"use client";

import { useEffect, useRef, useState } from "react";

export interface UseInViewOptions {
  /** Fire only the first time the element enters the viewport. Default: true. */
  once?: boolean;
  /** IntersectionObserver rootMargin, e.g. "-10% 0px". */
  rootMargin?: string;
  /** 0..1 visibility ratio required to count as "in view". Default: 0.2. */
  amount?: number;
}

/**
 * Reports whether the referenced element is in the viewport, using a single
 * IntersectionObserver (no scroll listeners, no layout thrash).
 *
 * @example
 * const { ref, inView } = useInView<HTMLDivElement>();
 * return <div ref={ref}>{inView ? "visible" : "hidden"}</div>;
 */
export function useInView<T extends Element = HTMLElement>(
  options: UseInViewOptions = {},
) {
  const { once = true, rootMargin = "0px", amount = 0.2 } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Guard for SSR / very old browsers.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold: amount },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, amount]);

  return { ref, inView } as const;
}
