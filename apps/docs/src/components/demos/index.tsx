"use client";

import { useRef } from "react";
import {
  AnimatedBeam,
  AuroraBackground,
  BentoCard,
  BentoGrid,
  Card3D,
  GradientText,
  MagneticButton,
  Marquee,
  NumberTicker,
  SpotlightCard,
} from "@stacklyui/ui";

export function AuroraDemo() {
  return (
    <AuroraBackground className="flex h-64 w-full max-w-xl items-center justify-center rounded-2xl">
      <p className="text-2xl font-semibold text-white">Aurora backdrop</p>
    </AuroraBackground>
  );
}

export function SpotlightDemo() {
  return (
    <SpotlightCard className="max-w-sm">
      <h3 className="text-lg font-semibold text-fg">Move your cursor</h3>
      <p className="mt-2 text-sm text-muted">
        The glow tracks your pointer through CSS variables — no re-renders, just
        smooth compositor work.
      </p>
    </SpotlightCard>
  );
}

export function Card3DDemo() {
  return (
    <Card3D tilt={14} className="w-full max-w-xs">
      <div className="flex flex-col gap-3 p-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3 2 8.5 12 14l10-5.5L12 3ZM2 15.5 12 21l10-5.5" />
          </svg>
        </span>
        <h3 className="text-lg font-semibold text-fg">Tilt me</h3>
        <p className="text-sm leading-relaxed text-muted">
          Move your cursor across the card — it leans in 3D toward the pointer
          with a moving glare.
        </p>
      </div>
    </Card3D>
  );
}

export function GradientTextDemo() {
  return (
    <div className="text-center">
      <GradientText as="h2" className="text-5xl font-bold">
        Gradient in motion
      </GradientText>
      <GradientText
        as="p"
        className="mt-4 text-xl font-semibold"
        colors={["#f472b6", "#f97316", "#facc15"]}
        duration={4}
      >
        Custom colors, your tempo
      </GradientText>
    </div>
  );
}

export function BentoDemo() {
  return (
    <BentoGrid columns={3} className="w-full max-w-2xl">
      <BentoCard
        colSpan={2}
        eyebrow="Featured"
        title="Wide cell"
        description="Cells span multiple columns and rows to build an editorial rhythm."
      />
      <BentoCard eyebrow="Compact" title="Tall" description="Hover to lift." />
      <BentoCard eyebrow="Detail" title="One" description="Pointer-tracked glow." />
      <BentoCard
        colSpan={2}
        eyebrow="Detail"
        title="Another wide one"
        description="Fully responsive — collapses to a single column on mobile."
      />
    </BentoGrid>
  );
}

export function BeamDemo() {
  const container = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      className="relative flex h-56 w-full max-w-lg items-center justify-between px-10"
    >
      <div
        ref={a}
        className="z-10 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface text-accent-3"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10M2 17h20" />
        </svg>
      </div>
      <div
        ref={b}
        className="z-10 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface text-accent-3"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <AnimatedBeam containerRef={container} fromRef={a} toRef={b} />
    </div>
  );
}

export function MarqueeDemo() {
  const items = ["Vercel", "Linear", "Stripe", "Raycast", "Supabase", "Resend"];
  return (
    <Marquee duration={22} className="w-full max-w-xl py-4">
      {items.map((item) => (
        <span
          key={item}
          className="mx-2 rounded-xl border border-border bg-surface/50 px-6 py-3 text-sm font-medium text-fg"
        >
          {item}
        </span>
      ))}
    </Marquee>
  );
}

export function MagneticDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <MagneticButton>Primary</MagneticButton>
      <MagneticButton variant="secondary">Secondary</MagneticButton>
      <MagneticButton variant="ghost">Ghost</MagneticButton>
    </div>
  );
}

export function NumberTickerDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 text-center">
      <div>
        <div className="text-5xl font-bold">
          <NumberTicker value={1284} />
        </div>
        <p className="mt-1 text-sm text-muted">Stars</p>
      </div>
      <div>
        <div className="text-5xl font-bold">
          <NumberTicker value={99.9} decimals={1} suffix="%" />
        </div>
        <p className="mt-1 text-sm text-muted">Uptime</p>
      </div>
      <div>
        <div className="text-5xl font-bold">
          <NumberTicker value={42000} prefix="$" />
        </div>
        <p className="mt-1 text-sm text-muted">MRR</p>
      </div>
    </div>
  );
}
