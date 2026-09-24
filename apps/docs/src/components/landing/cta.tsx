"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { GradientText, MagneticButton, Reveal } from "@stacklyui/ui";

const CHIPS = [
  "Aurora",
  "Spotlight",
  "3D Tilt",
  "Gradient Text",
  "Marquee",
  "Magnetic",
  "Beam",
  "Ticker",
];

export function CTA() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const ringY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={ref}
      className="sui-invert relative overflow-hidden bg-bg px-5 py-40 text-fg sm:px-8"
    >
      {/* faint dot texture + parallax ring for a bold full-bleed finale */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_center,var(--color-fg)_1px,transparent_1px)] [background-size:26px_26px]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          style={reduced ? undefined : { y: ringY }}
          className="deco-ring absolute -bottom-52 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 opacity-60"
        />
      </div>
      {/* giant ghost wordmark, echoing the section-heading language */}
      <span
        aria-hidden
        className="display pointer-events-none absolute inset-x-0 -bottom-6 select-none text-center text-[24vw] leading-none text-fg/[0.04]"
      >
        Stackly
      </span>
      <Reveal className="relative mx-auto max-w-4xl text-center">
        <span className="eyebrow">[007] — Get started</span>
        <h2 className="display mx-auto mt-6 max-w-3xl text-7xl leading-[0.92] sm:text-[7rem]">
          Build something{" "}
          <GradientText as="span">unforgettable</GradientText>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-lg text-muted">
          Drop in your first StacklyUI component in under a minute. No config, no
          lock-in — just polished code you own.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/docs/installation" data-cursor="hover">
            <MagneticButton size="lg">Read the docs</MagneticButton>
          </Link>
          <Link href="/docs/components/aurora-background" data-cursor="hover">
            <MagneticButton size="lg" variant="secondary">
              See every component
            </MagneticButton>
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {CHIPS.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted"
            >
              {c}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
