"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Enables buttery smooth scrolling across the whole site via Lenis.
 *
 * It drives the real window scroll (so sticky headers, anchor links, and
 * Motion's useScroll all keep working) through a requestAnimationFrame loop.
 * Users who prefer reduced motion get native scrolling — Lenis is never
 * initialized for them.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
