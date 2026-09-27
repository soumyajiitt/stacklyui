"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { NumberTicker } from "@stacklyui/ui";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
  detail: string;
  /** Ring fill, 0–1. */
  ring: number;
  icon: React.ReactNode;
}

const STATS: Stat[] = [
  {
    value: 50,
    suffix: "+",
    label: "Components",
    detail: "and counting",
    ring: 0.82,
    icon: (
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
    ),
  },
  {
    value: 100,
    suffix: "%",
    label: "Reduced-motion aware",
    detail: "every animation",
    ring: 1,
    icon: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 12l3 3 5-6" />,
  },
  {
    value: 60,
    suffix: "fps",
    label: "Compositor-driven",
    detail: "no dropped frames",
    ring: 0.95,
    icon: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />,
  },
  {
    value: 2,
    label: "Ways to install",
    detail: "CLI or npm",
    ring: 0.5,
    icon: <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7 12 12l8.7-5M12 22V12" />,
  },
];

const R = 52;
const C = 2 * Math.PI * R;
function StatCell({ stat, index }: { stat: Stat; index: number }) {
  const reduced = useReducedMotion();
  const offset = C * (1 - stat.ring);

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col items-center px-6 py-14 text-center transition-colors duration-300 hover:bg-white/[0.06] [&:not(:first-child)]:border-l border-white/15"
    >
      <span className="absolute left-6 top-6 font-mono text-xs text-white/40">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* animated progress ring with the number at its center */}
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="5" />
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={reduced ? { strokeDashoffset: offset } : { strokeDashoffset: C }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 1.4, delay: index * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="mb-1 flex h-6 w-6 items-center justify-center text-white/60 transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {stat.icon}
            </svg>
          </span>
          <span className="display text-4xl leading-none text-white sm:text-5xl">
            <NumberTicker value={stat.value} suffix={stat.suffix} />
          </span>
        </div>
      </div>

      <p className="mt-5 font-mono text-xs uppercase tracking-wider text-white/75">
        {stat.label}
      </p>
      <p className="mt-1 text-[0.7rem] text-white/45">{stat.detail}</p>
    </motion.div>
  );
}
export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax the two glow blobs and the dot texture at different depths.
  const blobA = useTransform(scrollYProgress, [0, 1], ["-18%", "22%"]);
  const blobB = useTransform(scrollYProgress, [0, 1], ["20%", "-16%"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-accent text-white"
    >
      {/* parallax dot texture */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: gridY }}
        className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:22px_22px]"
      />
      {/* parallax glow blobs */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { x: blobA }}
        className="pointer-events-none absolute -top-24 left-[10%] h-72 w-72 rounded-full bg-white/20 blur-[90px]"
      />
      <motion.div
        aria-hidden
        style={reduced ? undefined : { x: blobB }}
        className="pointer-events-none absolute -bottom-28 right-[8%] h-80 w-80 rounded-full bg-accent-3/40 blur-[100px]"
      />

      <div className="relative mx-auto max-w-[86rem] px-5 sm:px-8">
        <div className="flex items-center justify-center gap-3 pt-16 text-white/70">
          <span className="h-px w-8 bg-white/30" />
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.25em]">
            Built for production
          </span>
          <span className="h-px w-8 bg-white/30" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatCell key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
