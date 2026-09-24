"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Index shown as [00x] and as the giant ghost number. */
  index: string;
  title: string;
  description?: string;
  className?: string;
}

/**
 * Oversized, asymmetric editorial header. A giant ghost index parallaxes behind
 * the title; the title itself reveals word-by-word on scroll. Colors are
 * token-driven, so it adapts to an inverted (.sui-invert) band automatically.
 * Reduced motion renders everything static and in place.
 */
export function SectionHeading({
  index,
  title,
  description,
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const numY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const words = title.split(" ");

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.span
        aria-hidden
        style={reduced ? undefined : { y: numY }}
        className="display pointer-events-none absolute -left-2 -top-[0.35em] select-none text-[9rem] leading-[0.7] text-accent/[0.08] sm:text-[15rem]"
      >
        {index}
      </motion.span>

      <div className="relative">
        <span className="eyebrow">[{index}] — section</span>
        <h2 className="display mt-4 text-5xl leading-[0.92] sm:text-7xl lg:text-[5.5rem]">
          {words.map((w, i) => (
            <span
              key={`${w}-${i}`}
              className="mr-[0.24em] inline-block overflow-hidden align-bottom"
            >
              <motion.span
                className="inline-block"
                initial={reduced ? false : { y: "115%" }}
                whileInView={reduced ? undefined : { y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h2>
        {description ? (
          <p className="mt-7 max-w-xl border-l-2 border-accent pl-5 text-lg leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
