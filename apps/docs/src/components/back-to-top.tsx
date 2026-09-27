"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** Floating "back to top" control. Docks bottom-left so it never collides with
 *  the bottom-right toast stack. Appears once you're a viewport deep. */
export function BackToTop() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
          }
          data-cursor="hover"
          aria-label="Back to top"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 z-[90] flex h-11 w-11 items-center justify-center rounded-full border-2 border-border-strong bg-popover text-fg shadow-lg transition-colors hover:border-accent hover:text-accent"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
