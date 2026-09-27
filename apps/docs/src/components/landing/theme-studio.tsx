"use client";

import { useMemo, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  GradientText,
  NumberTicker,
  Progress,
  Reveal,
  Slider,
  SpotlightCard,
  toast,
} from "@stacklyui/ui";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

interface Preset {
  name: string;
  hue: number;
  chroma: number;
}

const PRESETS: Preset[] = [
  { name: "Ember", hue: 30, chroma: 0.19 },
  { name: "Sunset", hue: 12, chroma: 0.2 },
  { name: "Amber", hue: 75, chroma: 0.16 },
  { name: "Forest", hue: 150, chroma: 0.15 },
  { name: "Ocean", hue: 230, chroma: 0.16 },
  { name: "Violet", hue: 292, chroma: 0.17 },
  { name: "Rose", hue: 350, chroma: 0.18 },
];

const r1 = (n: number) => Math.round(n);
const r3 = (n: number) => Math.round(n * 1000) / 1000;

/** Derive the three-stop accent ramp from a base hue + chroma, matching the
 *  hue/lightness offsets StacklyUI ships with (H, H+18, H+42). */
function ramp(hue: number, chroma: number) {
  const h1 = r1(hue % 360);
  const h2 = r1((hue + 18) % 360);
  const h3 = r1((hue + 42) % 360);
  const a1 = `oklch(0.64 ${r3(chroma)} ${h1})`;
  const a2 = `oklch(0.71 ${r3(chroma * 0.9)} ${h2})`;
  const a3 = `oklch(0.81 ${r3(chroma * 0.7)} ${h3})`;
  return { h1, a1, a2, a3 };
}

export function ThemeStudio() {
  const [hue, setHue] = useState(30);
  const [chroma, setChroma] = useState(0.19);
  const [radius, setRadius] = useState(12);

  const { h1, a1, a2, a3 } = useMemo(() => ramp(hue, chroma), [hue, chroma]);

  // Scoped token overrides — the exact same variables a consumer would set to
  // rebrand the whole system. Applied to the panel wrapper only.
  const vars = {
    "--color-accent": a1,
    "--color-accent-2": a2,
    "--color-accent-3": a3,
    "--color-ring": a1,
    "--sui-accent": a1,
    "--sui-accent-2": a2,
    "--sui-accent-3": a3,
    "--sui-accent-glow": `oklch(0.64 ${r3(chroma)} ${h1} / 0.35)`,
    "--sui-accent-gradient": `linear-gradient(110deg, ${a1}, ${a2}, ${a3})`,
    "--sui-offset-accent": `oklch(0.5 ${r3(chroma)} ${h1})`,
    "--sui-radius": `${r3(radius / 16)}rem`,
    "--sui-radius-sm": `${r3((radius * 0.66) / 16)}rem`,
    "--radius-xl": `${r3(radius / 16)}rem`,
  } as React.CSSProperties;

  const css = `:root {
  --accent:   ${a1};
  --accent-2: ${a2};
  --accent-3: ${a3};
  --radius:   ${r3(radius / 16)}rem;
}`;

  const isPreset = (p: Preset) => p.hue === hue && Math.abs(p.chroma - chroma) < 0.001;

  function applyPreset(p: Preset) {
    setHue(p.hue);
    setChroma(p.chroma);
  }

  function randomize() {
    setHue(r1(Math.random() * 360));
    setChroma(r3(0.12 + Math.random() * 0.1));
  }

  async function copyCss() {
    try {
      await navigator.clipboard.writeText(css);
      toast.success("Tokens copied", {
        description: "Paste them into your globals.css to rebrand.",
      });
    } catch {
      toast.error("Couldn’t copy to clipboard");
    }
  }

  return (
    <section id="theme-studio" className="mx-auto max-w-[86rem] scroll-mt-24 px-5 py-28 sm:px-8">
      <SectionHeading
        index="003"
        title="Make it yours"
        description="Every component reads from a handful of OKLCH tokens. Drag the hue, dial the vibrance, round the corners — the whole panel rebrands live. Copy the four variables and you’re done."
      />
      <Reveal className="mt-16">
        <div
          style={vars}
          className="sui-paper grid overflow-hidden rounded-3xl border-2 border-border-strong bg-card transition-colors duration-500 lg:grid-cols-[minmax(0,21rem)_1fr]"
        >
          {/* ---- Controls ---- */}
          <div className="border-b-2 border-border-strong p-6 sm:p-8 lg:border-b-0 lg:border-r-2">
            <div className="flex items-center justify-between">
              <span className="eyebrow !text-[0.6rem]">Controls</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={randomize}
                  data-cursor="hover"
                  aria-label="Randomize palette"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M18 4l3 3-3 3M21 7h-5.5a4 4 0 0 0-3.4 2M3 7h3.5a4 4 0 0 1 3.4 2M18 20l3-3-3-3M21 17h-5.5a4 4 0 0 1-3.4-2M3 17h3.5a4 4 0 0 0 3.4-2" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(PRESETS[0]!)}
                  data-cursor="hover"
                  className="rounded-full border border-border px-3 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-7 space-y-7">
              <Control label="Hue" value={`${r1(hue)}°`}>
                <Slider value={[hue]} min={0} max={360} step={1} onValueChange={(v) => setHue(v[0] ?? hue)} aria-label="Accent hue" />
              </Control>
              <Control label="Vibrance" value={`${r1((chroma / 0.24) * 100)}%`}>
                <Slider value={[chroma]} min={0.02} max={0.24} step={0.005} onValueChange={(v) => setChroma(r3(v[0] ?? chroma))} aria-label="Accent vibrance" />
              </Control>
              <Control label="Radius" value={`${radius}px`}>
                <Slider value={[radius]} min={0} max={20} step={1} onValueChange={(v) => setRadius(v[0] ?? radius)} aria-label="Corner radius" />
              </Control>
            </div>

            <div className="mt-8">
              <span className="eyebrow !text-[0.6rem]">Presets</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => applyPreset(p)}
                    data-cursor="hover"
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      isPreset(p)
                        ? "border-accent bg-accent/12 text-fg"
                        : "border-border text-muted hover:border-accent/60 hover:text-fg",
                    )}
                  >
                    <span className="h-3 w-3 rounded-full" style={{ background: `oklch(0.64 ${p.chroma} ${p.hue})` }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* ---- Live preview + generated tokens ---- */}
          <div className="relative grid gap-5 p-6 sm:p-8 lg:grid-cols-[1.15fr_1fr]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_center,var(--color-border)_1px,transparent_1px)] [background-size:18px_18px]"
            />

            {/* live product card */}
            <SpotlightCard className="relative rounded-2xl border-2 border-border-strong bg-surface-strong p-6">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>SU</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-fg">Live preview</p>
                  <p className="truncate text-xs text-muted">Reads your tokens</p>
                </div>
                <Badge variant="solid" className="ml-auto">
                  Pro
                </Badge>
              </div>

              <GradientText as="p" className="display mt-6 text-3xl">
                Rebrand it
              </GradientText>

              <div className="mt-4">
                <span className="eyebrow !text-[0.58rem]">Adoption</span>
                <div className="display mt-1 text-3xl text-accent">
                  <NumberTicker value={9240} />
                </div>
                <div className="mt-3">
                  <Progress value={68} />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="secondary">
                  Secondary
                </Button>
                <span className="ml-auto flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-accent" />
                  <span className="h-3.5 w-3.5 rounded-full bg-accent-2" />
                  <span className="h-3.5 w-3.5 rounded-full bg-accent-3" />
                </span>
              </div>
            </SpotlightCard>
            {/* generated tokens */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-border-strong bg-[oklch(0.16_0.01_60)]">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
                <span className="font-mono text-[0.62rem] uppercase tracking-wider text-white/40">
                  globals.css
                </span>
                <button
                  type="button"
                  onClick={copyCss}
                  data-cursor="hover"
                  className="flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1 font-mono text-[0.6rem] text-white/70 transition-colors hover:border-accent hover:text-accent"
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </button>
              </div>
              <pre className="flex-1 overflow-x-auto px-4 py-4 font-mono text-[0.72rem] leading-relaxed text-[oklch(0.85_0.02_70)]">
                <code>{css}</code>
              </pre>
              <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
                <span
                  className="h-6 w-6 shrink-0 rounded-md"
                  style={{ background: `linear-gradient(135deg, ${a1}, ${a3})` }}
                />
                <span className="font-mono text-[0.62rem] text-white/50">
                  4 variables · every component follows
                </span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

    </section>
  );
}

function Control({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-fg">{label}</span>
        <span className="font-mono text-xs tabular-nums text-muted">{value}</span>
      </div>
      {children}
    </div>
  );
}
