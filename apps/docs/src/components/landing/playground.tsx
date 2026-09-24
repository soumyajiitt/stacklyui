"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  AnimatedBeam,
  AuroraBackground,
  Card3D,
  GradientText,
  MagneticButton,
  Marquee,
  NumberTicker,
  Reveal,
  SpotlightCard,
} from "@stacklyui/ui";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

function Tile({
  title,
  tag,
  hint,
  href,
  className,
  children,
  pad = true,
}: {
  title: string;
  tag: string;
  hint: string;
  href: string;
  className?: string;
  children: React.ReactNode;
  pad?: boolean;
}) {
  return (
    <Reveal className={cn("min-h-0", className)}>
      <div className="group/tile relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Live demo stage */}
        <div
          className={cn(
            "relative flex flex-1 items-center justify-center overflow-hidden",
            pad && "p-6",
          )}
        >
          {children}
          {/* playful hint pill */}
          <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-border bg-surface-strong px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-muted opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/tile:opacity-100">
            {hint}
          </span>
        </div>
        {/* Footer */}
        <Link
          href={href}
          data-cursor="hover"
          className="flex items-center justify-between border-t border-border/70 px-4 py-3 transition-colors hover:bg-surface-strong"
        >
          <span>
            <span className="block text-sm font-semibold text-fg">{title}</span>
            <span className="eyebrow !text-[0.58rem]">{tag}</span>
          </span>
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted transition-transform group-hover/tile:translate-x-0.5 group-hover/tile:text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </Reveal>
  );
}

function BeamTile() {
  const c = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  return (
    <div ref={c} className="relative flex h-full min-h-[9rem] w-full items-center justify-between px-8">
      <div ref={a} className="z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-strong text-accent">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10M2 17h20" /></svg>
      </div>
      <div ref={hub} className="z-10 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-accent bg-accent/12 text-accent">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 2v20M2 12h20" /></svg>
      </div>
      <div ref={b} className="z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-strong text-accent">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
      </div>
      <AnimatedBeam containerRef={c} fromRef={a} toRef={hub} />
      <AnimatedBeam containerRef={c} fromRef={hub} toRef={b} delay={0.6} />
    </div>
  );
}

export function Playground() {
  return (
    <section id="playground" className="mx-auto max-w-[86rem] scroll-mt-24 px-5 py-28 sm:px-8">
      <SectionHeading
        index="002"
        title="Play with it"
        description="Every tile is a real, working component — drag, hover, and tilt them. When you like one, grab it with a click."
      />

      <div className="sui-paper mt-16 overflow-hidden rounded-3xl border-2 border-border-strong bg-surface/40">
        <div className="flex items-center gap-2 border-b-2 border-border-strong bg-surface px-5 py-3">
          <span className="h-3 w-3 rounded-full bg-accent" />
          <span className="h-3 w-3 rounded-full bg-accent-2" />
          <span className="h-3 w-3 rounded-full bg-accent-3" />
          <span className="ml-3 font-mono text-xs uppercase tracking-wider text-muted">
            playground.tsx — live components
          </span>
        </div>
        <div className="grid auto-rows-[minmax(11rem,auto)] grid-cols-2 gap-4 p-4 sm:p-6 lg:grid-cols-4">
        {/* Magnetic button — hero tile */}
        <Tile
          title="Magnetic Button"
          tag="Interactive"
          hint="hover + click me"
          href="/docs/components/magnetic-button"
          className="col-span-2 row-span-2"
        >
          <AuroraBackground className="absolute inset-0 -z-10 opacity-70" />
          <div className="flex flex-col items-center gap-5 text-center">
            <span className="eyebrow !text-[0.58rem]">Pulls toward your cursor</span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <MagneticButton size="lg" strength={18}>
                Get started
              </MagneticButton>
              <MagneticButton size="md" variant="secondary">
                Docs
              </MagneticButton>
            </div>
            <MagneticButton size="sm" variant="ghost" strength={22}>
              or drag me around ✦
            </MagneticButton>
          </div>
        </Tile>

        {/* 3D tilt */}
        <Tile
          title="3D Tilt Card"
          tag="3D"
          hint="tilt me"
          href="/docs/components/card-3d"
          className="col-span-2 row-span-2"
          pad={false}
        >
          <div className="flex h-full w-full items-center justify-center p-6">
            <Card3D tilt={16} className="w-full max-w-[15rem]">
              <div className="p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3 2 8.5 12 14l10-5.5L12 3ZM2 15.5 12 21l10-5.5" /></svg>
                </span>
                <h4 className="mt-3 font-semibold text-fg">Depth on hover</h4>
                <p className="mt-1 text-xs text-muted">Move your cursor across me.</p>
              </div>
            </Card3D>
          </div>
        </Tile>

        {/* Spotlight */}
        <Tile
          title="Spotlight Card"
          tag="Pointer"
          hint="move cursor"
          href="/docs/components/spotlight-card"
          className="col-span-2"
          pad={false}
        >
          <SpotlightCard className="h-full w-full rounded-none border-0 bg-transparent">
            <div className="flex h-full flex-col justify-center gap-3 px-6 py-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /></svg>
              </span>
              <h4 className="text-lg font-semibold text-fg">Pointer spotlight</h4>
              <p className="max-w-sm text-sm text-muted">
                A radial glow follows your cursor — written straight to CSS
                variables, so it never triggers a React re-render.
              </p>
            </div>
          </SpotlightCard>
        </Tile>

        {/* Number ticker */}
        <Tile title="Number Ticker" tag="Data" hint="counts on view" href="/docs/components/number-ticker">
          <div className="text-center">
            <div className="display text-5xl">
              <NumberTicker value={98765} className="bg-gradient-to-br from-accent to-accent-3 bg-clip-text text-transparent" />
            </div>
            <span className="eyebrow mt-2 block !text-[0.58rem]">Downloads</span>
          </div>
        </Tile>

        {/* Gradient text */}
        <Tile title="Gradient Text" tag="Type" hint="always moving" href="/docs/components/gradient-text">
          <GradientText as="span" className="display text-3xl">
            Shimmer
          </GradientText>
        </Tile>

        {/* Marquee — wide */}
        <Tile
          title="Marquee"
          tag="Motion"
          hint="hover to pause"
          href="/docs/components/marquee"
          className="col-span-2 lg:col-span-3"
          pad={false}
        >
          <div className="flex w-full flex-col gap-3 py-6">
            <Marquee duration={18}>
              {["React", "Next.js", "Motion", "Tailwind", "TypeScript", "OKLCH"].map((x) => (
                <span key={x} className="mx-2 rounded-lg border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-fg">
                  {x}
                </span>
              ))}
            </Marquee>
            <Marquee duration={24} reverse>
              {["Accessible", "60fps", "Reduced-motion", "Radix", "Copy-paste", "Yours"].map((x) => (
                <span key={x} className="mx-2 rounded-lg border border-accent/25 bg-accent/8 px-4 py-2 text-sm font-medium text-accent">
                  {x}
                </span>
              ))}
            </Marquee>
          </div>
        </Tile>

        {/* Beam */}
        <Tile title="Animated Beam" tag="Connect" hint="watch it travel" href="/docs/components/animated-beam">
          <BeamTile />
        </Tile>
        </div>
      </div>
    </section>
  );
}
