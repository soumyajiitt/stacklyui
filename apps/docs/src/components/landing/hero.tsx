"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { GradientText, MagneticButton } from "@stacklyui/ui";
import { CommandBlock } from "@/components/command-block";
import { registryCommands } from "@/lib/pm-commands";
import { HeroCollage } from "./hero-collage";

const WORDS = ["Build", "interfaces", "that", "stand", "out."];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const ringY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const collageY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-5 pt-32 pb-16 sm:px-8 sm:pt-40"
    >
      <motion.div
        aria-hidden
        style={{ y: ringY }}
        className="pointer-events-none absolute -right-40 -top-10 -z-10"
      >
        <div className="deco-ring h-[34rem] w-[34rem]" />
        <div className="deco-ring absolute left-16 top-16 h-[26rem] w-[26rem]" />
      </motion.div>
      <div aria-hidden className="sui-page-grid pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-[86rem] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        {/* Left — editorial type + copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow block"
          >
            [001] — React component library
          </motion.span>

          <h1 className="display mt-6 text-[clamp(2.75rem,7vw,6.5rem)]">
            {WORDS.map((word, i) => (
              <span
                key={word}
                className="mr-[0.24em] inline-block overflow-hidden align-top"
              >
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.1 + i * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {word === "out." ? (
                    <GradientText as="span">{word}</GradientText>
                  ) : (
                    word
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62 }}
            className="mt-8 max-w-xl border-l-2 border-accent pl-5"
          >
            <p className="text-lg leading-relaxed text-muted">
              A beautifully animated, accessible React component library.
              Copy-paste the source or install the package — tuned for light and
              dark, with motion baked in.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.72 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/docs" data-cursor="hover">
              <MagneticButton size="lg">
                Get started
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </MagneticButton>
            </Link>
            <Link href="/components" data-cursor="hover">
              <MagneticButton size="lg" variant="secondary">
                Browse components
              </MagneticButton>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.82 }}
            className="mt-8 w-full max-w-md"
          >
            <span className="eyebrow mb-2 block !text-[0.62rem]">
              Add a component
            </span>
            <CommandBlock commands={registryCommands("spotlight-card")} size="sm" />
          </motion.div>
        </div>

        {/* Right — live interactive component deck */}
        <motion.div
          style={{ y: collageY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroCollage />
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mx-auto mt-12 flex max-w-[86rem] items-center gap-3 text-muted"
      >
        <span className="rail-num">SCROLL</span>
        <span className="h-px w-16 bg-line" />
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="text-accent"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
