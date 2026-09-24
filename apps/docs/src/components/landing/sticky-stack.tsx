"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

interface Reason {
  no: string;
  title: string;
  description: string;
  keywords: string[];
}

const REASONS: Reason[] = [
  {
    no: "01",
    title: "Motion, done responsibly",
    description:
      "Scroll reveals, magnetic buttons, pointer glows and 3D tilt — every animation honors prefers-reduced-motion and keeps focus and keyboard support intact.",
    keywords: ["reduced-motion", "focus-visible", "ARIA", "keyboard"],
  },
  {
    no: "02",
    title: "GPU-only performance",
    description:
      "Transforms and opacity on the compositor. Pointer effects write CSS variables instead of triggering React re-renders, so interactions stay at 60fps.",
    keywords: ["transform", "opacity", "no re-renders", "60fps"],
  },
  {
    no: "03",
    title: "Warm dual themes",
    description:
      "OKLCH tokens tuned for a real light and dark mode. Rebrand the whole system by overriding a handful of CSS variables.",
    keywords: ["OKLCH", "light", "dark", "tokens"],
  },
  {
    no: "04",
    title: "Copy-paste or install",
    description:
      "Own the source through the registry CLI, or pull the npm package. Same components — your call, no lock-in.",
    keywords: ["registry CLI", "npm", "no lock-in", "yours"],
  },
];

/* ----- Per-reason live visuals (each reduced-motion aware) ----- */

function Bars() {
  const reduced = useReducedMotion();
  const bars = [0.45, 0.8, 0.6, 1, 0.55, 0.85, 0.5];
  return (
    <div className="flex h-40 w-full items-end justify-center gap-2.5">
      {bars.map((h, i) =>
        reduced ? (
          <span
            key={i}
            style={{ height: `${h * 100}%` }}
            className="w-3.5 rounded-full bg-gradient-to-t from-accent to-accent-3"
          />
        ) : (
          <motion.span
            key={i}
            className="w-3.5 origin-bottom rounded-full bg-gradient-to-t from-accent to-accent-3"
            style={{ height: `${h * 100}%` }}
            animate={{ scaleY: [1, 0.4, 0.9, 0.55, 1] }}
            transition={{
              duration: 1.4 + i * 0.13,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.09,
            }}
          />
        ),
      )}
    </div>
  );
}

function FpsMeter() {
  const reduced = useReducedMotion();
  const ticks = Array.from({ length: 22 });
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex items-baseline gap-2">
        <span className="display bg-gradient-to-br from-accent to-accent-3 bg-clip-text text-6xl text-transparent">
          60
        </span>
        <span className="eyebrow !text-[0.6rem]">fps</span>
      </div>
      <div className="relative flex h-14 w-full items-end justify-center gap-1 overflow-hidden">
        {ticks.map((_, i) => {
          const h = 0.35 + 0.6 * Math.abs(Math.sin(i * 0.7));
          return (
            <span
              key={i}
              style={{ height: `${h * 100}%` }}
              className="w-1.5 rounded-full bg-accent/30"
            />
          );
        })}
        {!reduced ? (
          <motion.span
            aria-hidden
            className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-accent/25 to-transparent"
            animate={{ x: ["-120%", "520%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
      </div>
      <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[0.65rem] text-accent">
        no dropped frames
      </span>
    </div>
  );
}

function ThemeSwatches() {
  const dots = ["bg-accent", "bg-accent-2", "bg-accent-3"];
  const themes = [
    {
      label: "Light",
      bg: "bg-[oklch(0.94_0.006_70)]",
      fg: "text-[oklch(0.28_0.02_60)]",
      ring: "border-black/10",
    },
    {
      label: "Dark",
      bg: "bg-[oklch(0.18_0.01_60)]",
      fg: "text-[oklch(0.95_0.01_70)]",
      ring: "border-white/10",
    },
  ];
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {themes.map((t) => (
        <div key={t.label} className={cn("rounded-xl border p-4", t.bg, t.ring)}>
          <span className={cn("display text-3xl", t.fg)}>Aa</span>
          <div className="mt-3 flex gap-1.5">
            {dots.map((s) => (
              <span key={s} className={cn("h-4 w-4 rounded-full", s)} />
            ))}
          </div>
          <span
            className={cn(
              "mt-4 block font-mono text-[0.58rem] uppercase tracking-[0.2em] opacity-60",
              t.fg,
            )}
          >
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function InstallTerminal() {
  const reduced = useReducedMotion();
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border-strong bg-[oklch(0.16_0.01_60)] font-mono text-sm">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.18_25)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.8_0.15_85)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.75_0.15_150)]" />
        <span className="ml-2 text-[0.65rem] text-white/40">terminal</span>
      </div>
      <div className="space-y-2 px-4 py-4 text-[oklch(0.9_0.01_70)]">
        <p>
          <span className="text-accent">$</span> npx shadcn add{" "}
          <span className="text-[oklch(0.85_0.12_85)]">@stacklyui/spotlight-card</span>
          {!reduced ? (
            <motion.span
              aria-hidden
              className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-accent"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            />
          ) : null}
        </p>
        <p className="text-[oklch(0.68_0.13_150)]">✓ Added spotlight-card.tsx</p>
        <p className="text-white/40">Own the code — no lock-in.</p>
      </div>
    </div>
  );
}

function ReasonVisual({ no }: { no: string }) {
  if (no === "01") return <Bars />;
  if (no === "02") return <FpsMeter />;
  if (no === "03") return <ThemeSwatches />;
  return <InstallTerminal />;
}

function CardBody({ reason }: { reason: Reason }) {
  return (
    <div className="sui-paper grid items-center gap-8 overflow-hidden rounded-3xl border-2 border-border-strong bg-card p-8 sm:p-10 md:grid-cols-[1fr_0.85fr]">
      <div>
        <div className="flex items-center gap-4">
          <span className="display text-5xl text-accent/30 sm:text-6xl">
            {reason.no}
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <h3 className="display mt-5 text-3xl sm:text-4xl md:text-5xl">
          {reason.title}
        </h3>
        <p className="mt-4 max-w-md border-l-2 border-accent pl-5 text-base leading-relaxed text-muted sm:text-lg">
          {reason.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {reason.keywords.map((k) => (
            <span
              key={k}
              className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[0.68rem] text-muted"
            >
              {k}
            </span>
          ))}
        </div>
      </div>
      <div className="relative flex min-h-[15rem] items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface/50 p-6">
        <div
          aria-hidden
          className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_center,var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]"
        />
        <div className="relative w-full">
          <ReasonVisual no={reason.no} />
        </div>
      </div>
    </div>
  );
}

function StackCard({
  reason,
  index,
  total,
  progress,
}: {
  reason: Reason;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Earlier cards shrink slightly as the stack accumulates, giving depth.
  const scale = useTransform(
    progress,
    [index / total, 1],
    [1, 1 - (total - 1 - index) * 0.04],
  );
  return (
    <div className="sticky" style={{ top: `calc(5rem + ${index * 1.75}rem)` }}>
      <motion.div style={{ scale }} className="origin-top">
        <CardBody reason={reason} />
      </motion.div>
    </div>
  );
}

export function StickyStack() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="sui-invert relative bg-bg py-28 text-fg">
      <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
        <SectionHeading
          index="005"
          title="Why it's different"
          description="Four commitments that set StacklyUI apart from the flashy-but-fragile alternatives — each one visible, not just claimed."
        />

        {reduced ? (
          <div className="mt-16 space-y-6">
            {REASONS.map((r) => (
              <CardBody key={r.no} reason={r} />
            ))}
          </div>
        ) : (
          <div ref={containerRef} className="mt-16 space-y-6 pb-[16vh]">
            {REASONS.map((r, i) => (
              <StackCard
                key={r.no}
                reason={r}
                index={i}
                total={REASONS.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
