"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "motion/react";

/** Wrap `v` into the [min, max) range (handles min > max too). */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

const ROW_A = ["Animated", "Accessible", "Token-driven", "Copy-paste", "Yours"];
const ROW_B = ["Motion", "OKLCH", "Radix", "60fps", "Reduced-motion"];

function Word({ text, filled }: { text: string; filled: boolean }) {
  return (
    <span className="mx-6 inline-flex items-center gap-6">
      <span
        className={
          filled
            ? "text-fg"
            : "text-transparent [-webkit-text-stroke:1.5px_var(--color-border-strong)]"
        }
      >
        {text}
      </span>
      <span className="text-accent">✦</span>
    </span>
  );
}

function VelocityRow({
  words,
  baseVelocity,
}: {
  words: string[];
  baseVelocity: number;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });
  // Four identical copies → wrap by one quarter of the track for a seamless loop.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const line = words.map((w, i) => (
    <Word key={w} text={w} filled={i % 2 === 0} />
  ));

  return (
    <motion.div style={{ x }} className="flex whitespace-nowrap">
      {[0, 1, 2, 3].map((copy) => (
        <span key={copy} className="flex shrink-0" aria-hidden={copy !== 0}>
          {line}
        </span>
      ))}
    </motion.div>
  );
}

export function ScrollMarquee() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <section
        aria-hidden
        className="overflow-hidden border-y border-line bg-surface/40 py-10"
      >
        <div className="display flex justify-center gap-6 text-4xl text-fg sm:text-5xl">
          {ROW_A.map((w, i) => (
            <Word key={w} text={w} filled={i % 2 === 0} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-hidden
      className="flex flex-col gap-3 overflow-hidden border-y border-line bg-surface/40 py-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <div className="display text-[clamp(2.5rem,8vw,7rem)] leading-none">
        <VelocityRow words={ROW_A} baseVelocity={2.4} />
      </div>
      <div className="display text-[clamp(2.5rem,8vw,7rem)] leading-none">
        <VelocityRow words={ROW_B} baseVelocity={-2.4} />
      </div>
    </section>
  );
}
