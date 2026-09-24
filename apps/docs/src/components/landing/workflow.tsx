"use client";

import { useRef } from "react";
import { AnimatedBeam, Reveal, SpotlightCard } from "@stacklyui/ui";
import { SectionHeading } from "./section-heading";

function Node({
  refEl,
  label,
  children,
}: {
  refEl: React.RefObject<HTMLDivElement | null>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={refEl}
        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-strong text-accent shadow-lg backdrop-blur-md"
      >
        {children}
      </div>
      <span className="font-mono text-xs uppercase tracking-wider text-muted">
        {label}
      </span>
    </div>
  );
}

const STEPS = [
  {
    no: "01",
    title: "Add it",
    desc: "One command drops the source straight into your project — hooks and utilities included.",
  },
  {
    no: "02",
    title: "It themes itself",
    desc: "Tokens map to your palette automatically. Light and dark, both tuned from the same OKLCH scale.",
  },
  {
    no: "03",
    title: "Own every line",
    desc: "No runtime lock-in. Edit the code freely — it's yours from the first paste.",
  },
];

export function Workflow() {
  const container = useRef<HTMLDivElement>(null);
  const install = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const ship = useRef<HTMLDivElement>(null);
  const design = useRef<HTMLDivElement>(null);

  return (
    <section className="mx-auto max-w-[86rem] px-5 py-28 sm:px-8">
      <SectionHeading
        index="006"
        title="Ship in minutes"
        description="Add a component with one command or a single import. It arrives fully themed, animated, and accessible."
      />

      <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="right">
          <ol className="relative space-y-8 border-l border-line pl-8">
            {STEPS.map((step) => (
              <li key={step.no} className="relative">
                <span className="absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full border border-border-strong bg-surface font-mono text-xs text-accent">
                  {step.no}
                </span>
                <h3 className="display text-2xl sm:text-3xl">{step.title}</h3>
                <p className="mt-1.5 max-w-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
          <div className="sui-paper-sm mt-8 inline-flex items-center gap-3 rounded-xl border-2 border-border-strong bg-surface px-4 py-3 font-mono text-sm">
            <span className="text-accent">$</span>
            <span className="text-fg">npx shadcn add @stacklyui/spotlight-card</span>
          </div>
        </Reveal>

        <Reveal direction="left">
          <SpotlightCard className="min-h-[20rem]">
            <div
              ref={container}
              className="relative flex h-full min-h-[18rem] items-center justify-between px-4 py-8"
            >
              <Node refEl={install} label="Install">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </Node>

              <div className="flex flex-col items-center gap-16">
                <Node refEl={design} label="Theme">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z" />
                  </svg>
                </Node>
                <Node refEl={hub} label="Compose">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                </Node>
              </div>

              <Node refEl={ship} label="Ship">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                </svg>
              </Node>

              <AnimatedBeam containerRef={container} fromRef={install} toRef={design} curvature={40} />
              <AnimatedBeam containerRef={container} fromRef={install} toRef={hub} curvature={-40} delay={0.5} />
              <AnimatedBeam containerRef={container} fromRef={design} toRef={ship} curvature={40} delay={1} />
              <AnimatedBeam containerRef={container} fromRef={hub} toRef={ship} curvature={-40} delay={1.5} />
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
