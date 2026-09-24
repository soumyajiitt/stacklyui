"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Thin scroll-progress bar pinned to the very top of the page. Sits above the
 * static `.edtop` gradient hairline and fills left→right as you scroll the
 * landing page. Spring-smoothed so fast flicks feel fluid.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[101] h-[3px] origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3"
    />
  );
}
