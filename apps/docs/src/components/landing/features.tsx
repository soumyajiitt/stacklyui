"use client";

import { Card3D, Reveal } from "@stacklyui/ui";
import { SectionHeading } from "./section-heading";

const REASONS = [
  {
    no: "01",
    title: "Motion, done responsibly",
    description:
      "Scroll reveals, magnetic buttons, pointer glows and 3D tilt — every animation honors prefers-reduced-motion and keeps focus and keyboard support intact.",
  },
  {
    no: "02",
    title: "GPU-only performance",
    description:
      "Transforms and opacity on the compositor. Pointer effects write CSS variables instead of triggering React re-renders, so interactions stay at 60fps.",
  },
  {
    no: "03",
    title: "Warm dual themes",
    description:
      "OKLCH tokens tuned for a real light and dark mode. Rebrand the whole system by overriding a handful of CSS variables.",
  },
  {
    no: "04",
    title: "Copy-paste or install",
    description:
      "Own the source through the registry CLI, or pull the npm package. Same components — your call, no lock-in.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-[86rem] px-5 py-28 sm:px-8">
      <SectionHeading
        index="004"
        title="Why it's different"
        description="The polish of a design system with the freedom of copy-paste. Built to beat the libraries you already reach for."
      />

      <div className="mt-16 grid gap-5 md:grid-cols-2">
        {REASONS.map((reason, i) => (
          <Reveal key={reason.no} delay={(i % 2) * 0.08}>
            <Card3D tilt={8} lift={28} className="h-full">
              <div className="flex h-full flex-col gap-3 p-7">
                <span className="font-mono text-sm text-accent">{reason.no}</span>
                <h3 className="display text-2xl">{reason.title}</h3>
                <p className="text-[0.95rem] leading-relaxed text-muted">
                  {reason.description}
                </p>
              </div>
            </Card3D>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
