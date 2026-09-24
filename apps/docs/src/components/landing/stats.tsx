"use client";

import { NumberTicker, Reveal } from "@stacklyui/ui";

const STATS = [
  { value: 8, suffix: "+", label: "Signature components" },
  { value: 100, suffix: "%", label: "Reduced-motion aware" },
  { value: 60, suffix: "fps", label: "Compositor-driven" },
  { value: 2, label: "Ways to install" },
];

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-accent text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <div className="relative mx-auto grid max-w-[86rem] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 0.1}
            className="relative border-white/15 px-6 py-16 text-center [&:not(:first-child)]:border-l"
          >
            <span className="absolute left-6 top-6 font-mono text-xs text-white/50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="display text-6xl text-white sm:text-7xl">
              <NumberTicker value={stat.value} suffix={stat.suffix} />
            </div>
            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-white/70">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
