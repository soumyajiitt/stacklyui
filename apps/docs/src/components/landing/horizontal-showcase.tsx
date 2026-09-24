"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import {
  Card3D,
  GradientText,
  Marquee,
  NumberTicker,
  SpotlightCard,
} from "@stacklyui/ui";

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

interface Panel {
  no: string;
  name: string;
  tag: string;
  href: string;
  blurb: string;
  points: string[];
  visual: React.ReactNode;
}

const PANELS: Panel[] = [
  {
    no: "01",
    name: "Spotlight Card",
    tag: "Pointer",
    href: "/docs/components/spotlight-card",
    blurb: "A glow tracks your cursor — pure CSS variables, zero re-renders.",
    points: ["CSS vars", "No re-render"],
    visual: (
      <SpotlightCard className="flex h-32 w-full items-center justify-center rounded-xl">
        <span className="text-sm text-muted">Move your cursor here</span>
      </SpotlightCard>
    ),
  },
  {
    no: "02",
    name: "3D Tilt Card",
    tag: "Depth",
    href: "/docs/components/card-3d",
    blurb: "Perspective tilt with a moving glare, driven by pointer position.",
    points: ["Perspective", "Glare"],
    visual: (
      <Card3D tilt={16} className="w-40">
        <div className="p-5 text-center">
          <span className="display text-3xl text-accent">3D</span>
          <p className="mt-1 text-xs text-muted">Tilt me</p>
        </div>
      </Card3D>
    ),
  },
  {
    no: "03",
    name: "Gradient Text",
    tag: "Type",
    href: "/docs/components/gradient-text",
    blurb: "An animated OKLCH gradient sweeps across your headline type.",
    points: ["OKLCH", "Any tag"],
    visual: <GradientText as="span" className="display text-7xl">Aa</GradientText>,
  },
  {
    no: "04",
    name: "Number Ticker",
    tag: "Data",
    href: "/docs/components/number-ticker",
    blurb: "Counts up when it scrolls into view, with locale formatting.",
    points: ["On view", "Locale-aware"],
    visual: (
      <span className="display text-5xl">
        <NumberTicker
          value={2600000}
          className="bg-gradient-to-br from-accent to-accent-3 bg-clip-text text-transparent"
        />
      </span>
    ),
  },
  {
    no: "05",
    name: "Marquee",
    tag: "Motion",
    href: "/docs/components/marquee",
    blurb: "Infinite GPU-driven scroll with edge fades and pause-on-hover.",
    points: ["GPU loop", "Pause on hover"],
    visual: (
      <div className="w-full">
        <Marquee duration={12}>
          {["Ship", "Fast", "Warm", "Bold", "Accessible"].map((s) => (
            <span
              key={s}
              className="mx-2 rounded-lg border border-border bg-surface-strong px-3 py-1.5 text-sm font-medium text-fg"
            >
              {s}
            </span>
          ))}
        </Marquee>
      </div>
    ),
  },
];

function ShowcaseCard({ panel }: { panel: Panel }) {
  return (
    <Link
      href={panel.href}
      data-cursor="hover"
      className="sui-paper group relative flex h-[64vh] w-[82vw] shrink-0 flex-col overflow-hidden rounded-3xl border-2 border-border-strong bg-card p-7 sm:w-[48vw] lg:w-[34rem]"
    >
      {/* faint watermark number so the card never reads as empty */}
      <span
        aria-hidden
        className="display pointer-events-none absolute -right-4 -top-10 select-none text-[12rem] leading-none text-accent/[0.06]"
      >
        {panel.no}
      </span>

      <div className="relative flex items-center justify-between">
        <span className="rail-num">{panel.no}</span>
        <span className="eyebrow !text-[0.6rem]">{panel.tag}</span>
      </div>

      {/* Filled demo stage — flex-1 so it consumes the middle, no dead gap */}
      <div className="relative mt-5 flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface/50 p-6">
        <div
          aria-hidden
          className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_center,var(--color-border)_1px,transparent_1px)] [background-size:18px_18px]"
        />
        <div className="relative flex w-full items-center justify-center">
          {panel.visual}
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="display text-3xl">{panel.name}</h3>
          <p className="mt-2 max-w-xs text-sm text-muted">{panel.blurb}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {panel.points.map((p) => (
              <span
                key={p}
                className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[0.62rem] text-muted"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white">
          <Arrow className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function LeadPanel() {
  return (
    <div className="relative flex h-[64vh] w-[80vw] shrink-0 flex-col justify-center pr-2 sm:w-[42vw] lg:w-[36rem]">
      {/* giant ghost index, matching the section-heading language */}
      <span
        aria-hidden
        className="display pointer-events-none absolute -left-3 -top-4 select-none text-[13rem] leading-[0.7] text-accent/[0.07] sm:text-[17rem]"
      >
        003
      </span>
      <div className="relative">
        <span className="eyebrow">[003] — Signature set</span>
        <h2 className="display mt-4 text-7xl leading-[0.9] sm:text-8xl lg:text-[6.5rem]">
          Scroll
          <br />
          sideways.
        </h2>
        <p className="mt-6 max-w-sm border-l-2 border-accent pl-5 text-lg leading-relaxed text-muted">
          Keep going — the shelf glides across as you scroll. Signature
          components, each animated, accessible, and yours to copy.
        </p>
        <span className="eyebrow mt-8 inline-flex items-center gap-2 !text-[0.62rem]">
          Scroll to explore
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="text-accent"
          >
            →
          </motion.span>
        </span>
      </div>
    </div>
  );
}

function EndPanel() {
  return (
    <Link
      href="/components"
      data-cursor="hover"
      className="group flex h-[60vh] w-[80vw] shrink-0 flex-col items-center justify-center gap-5 rounded-3xl border-2 border-dashed border-border-strong text-center transition-colors hover:border-accent sm:w-[40vw] lg:w-[26rem]"
    >
      <span className="display text-5xl">
        See
        <br />
        everything
      </span>
      <span className="eyebrow !text-[0.62rem]">The full catalog</span>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white transition-transform group-hover:scale-110">
        <Arrow className="h-6 w-6" />
      </span>
    </Link>
  );
}

export function HorizontalShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(() => -distance.get() * scrollYProgress.get());

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      distance.set(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced, distance]);

  // Reduced motion / fallback: a plain scrollable shelf, no pinning.
  if (reduced) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
          <span className="eyebrow">[003] — Signature set</span>
          <h2 className="display mt-4 text-6xl">Signature set</h2>
        </div>
        <div className="mt-10 flex snap-x gap-6 overflow-x-auto px-5 pb-6 sm:px-8">
          {PANELS.map((p) => (
            <div key={p.name} className="snap-start">
              <ShowcaseCard panel={p} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative" style={{ height: "320vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-center gap-6 px-[6vw]"
        >
          <LeadPanel />
          {PANELS.map((p) => (
            <ShowcaseCard key={p.name} panel={p} />
          ))}
          <EndPanel />
        </motion.div>
        <motion.div
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-x-[6vw] bottom-8 h-px origin-left bg-accent"
        />
      </div>
    </section>
  );
}
