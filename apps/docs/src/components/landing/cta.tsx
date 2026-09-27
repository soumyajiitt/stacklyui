"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import {
  GradientText,
  MagneticButton,
  NumberTicker,
  Reveal,
  toast,
} from "@stacklyui/ui";
import { cn } from "@/lib/utils";

const COMPONENTS = [
  { label: "Aurora", slug: "aurora-background" },
  { label: "Spotlight", slug: "spotlight-card" },
  { label: "3D Tilt", slug: "card-3d" },
  { label: "Gradient Text", slug: "gradient-text" },
  { label: "Marquee", slug: "marquee" },
  { label: "Magnetic", slug: "magnetic-button" },
  { label: "Beam", slug: "animated-beam" },
  { label: "Ticker", slug: "number-ticker" },
];

const MANAGERS = {
  pnpm: "pnpm dlx shadcn@latest add",
  npm: "npx shadcn@latest add",
  yarn: "yarn dlx shadcn@latest add",
  bun: "bunx shadcn@latest add",
} as const;
type Manager = keyof typeof MANAGERS;

export function CTA() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const ringY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const [pm, setPm] = useState<Manager>("pnpm");
  const [picked, setPicked] = useState<string[]>([
    "spotlight-card",
    "aurora-background",
  ]);
  const [copied, setCopied] = useState(false);

  // Cursor-tracked spotlight that washes accent light across the panel.
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(26rem 26rem at ${mx}% ${my}%, color-mix(in oklch, var(--color-accent) 22%, transparent), transparent 68%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  }

  function toggle(slug: string) {
    setPicked((p) =>
      p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug],
    );
  }

  const allOn = picked.length === COMPONENTS.length;
  const args = picked.length
    ? picked.map((s) => `@stacklyui/${s}`).join(" ")
    : "@stacklyui/…";
  const command = `${MANAGERS[pm]} ${args}`;

  async function copy() {
    if (!picked.length) {
      toast.warning("Pick at least one component first");
      return;
    }
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      toast.success(
        `Copied — ${picked.length} component${picked.length > 1 ? "s" : ""}`,
        { description: "Paste it into your terminal to install." },
      );
    } catch {
      toast.error("Couldn’t copy to clipboard");
    }
  }

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

      <Reveal className="relative mx-auto max-w-5xl text-center">
        <span className="eyebrow">[010] — Get started</span>
        <h2 className="display mx-auto mt-6 max-w-3xl text-6xl leading-[0.92] sm:text-[6.5rem]">
          Build something{" "}
          <GradientText as="span">unforgettable</GradientText>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-lg text-muted">
          Tap the components you want — we build the install command live. Copy
          it and you’re shipping in under a minute.
        </p>

        {/* ---- Interactive install composer ---- */}
        <div
          onMouseMove={onMove}
          className="group relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border-2 border-border-strong bg-surface/70 p-6 text-left backdrop-blur-md sm:p-8"
        >
          {!reduced && (
            <motion.div
              aria-hidden
              style={{ background: spotlight }}
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}

          <div className="relative flex items-center justify-between gap-4">
            <span className="eyebrow !text-[0.62rem]">Compose your stack</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted">
                <span className="text-accent">
                  <NumberTicker value={picked.length} />
                </span>{" "}
                selected
              </span>
              <button
                type="button"
                data-cursor="hover"
                onClick={() =>
                  setPicked(allOn ? [] : COMPONENTS.map((c) => c.slug))
                }
                className="rounded-full border border-border px-3 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-accent"
              >
                {allOn ? "Clear" : "Select all"}
              </button>
            </div>
          </div>

          {/* chip cloud — toggle components into your install */}
          <div className="relative mt-5 flex flex-wrap gap-2">
            {COMPONENTS.map((c) => {
              const on = picked.includes(c.slug);
              return (
                <button
                  key={c.slug}
                  type="button"
                  data-cursor="hover"
                  onClick={() => toggle(c.slug)}
                  aria-pressed={on}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-all",
                    on
                      ? "border-accent bg-accent/15 text-fg"
                      : "border-border bg-surface/60 text-muted hover:border-accent/60 hover:text-fg",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-3.5 w-3.5 place-items-center rounded-full border text-[0.5rem] leading-none transition-colors",
                      on
                        ? "border-accent bg-accent text-white"
                        : "border-border-strong",
                    )}
                  >
                    {on ? "✓" : "+"}
                  </span>
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* generated command — live install line */}
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-border-strong bg-[oklch(0.16_0.01_60)]">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
              <div className="flex items-center gap-1">
                {(Object.keys(MANAGERS) as Manager[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    data-cursor="hover"
                    onClick={() => setPm(m)}
                    className={cn(
                      "rounded-md px-2.5 py-1 font-mono text-[0.68rem] transition-colors",
                      pm === m
                        ? "bg-white/10 text-white"
                        : "text-white/45 hover:text-white/80",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <button
                type="button"
                data-cursor="hover"
                onClick={copy}
                className="flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1 font-mono text-[0.6rem] text-white/70 transition-colors hover:border-accent hover:text-accent"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {copied ? (
                    <path d="M20 6 9 17l-5-5" />
                  ) : (
                    <>
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </>
                  )}
                </svg>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex items-start gap-2 overflow-x-auto px-4 py-3.5 font-mono text-[0.78rem] leading-relaxed">
              <span className="shrink-0 text-accent">$</span>
              <code className="whitespace-pre text-[oklch(0.9_0.02_75)]">
                <span className="text-white/55">{MANAGERS[pm]} </span>
                {picked.length ? (
                  picked.map((s) => (
                    <span key={s} className="text-white">
                      @stacklyui/{s}{" "}
                    </span>
                  ))
                ) : (
                  <span className="text-white/40">@stacklyui/…</span>
                )}
              </code>
            </div>
          </div>
        </div>

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
      </Reveal>
    </section>
  );
}
