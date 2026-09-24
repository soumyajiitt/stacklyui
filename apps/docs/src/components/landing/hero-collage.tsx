"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  GradientText,
  Kbd,
  NumberTicker,
  Progress,
  SpotlightCard,
  Switch,
} from "@stacklyui/ui";

/**
 * The hero's interactive centerpiece: a cluster of real StacklyUI components
 * arranged like a floating dashboard. Layers drift with the pointer at
 * different depths (parallax), so it feels alive without a single re-render on
 * move. Falls back to a static cluster under reduced motion.
 */
export function HeroCollage() {
  const reduced = useReducedMotion();
  const [on, setOn] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.4 });

  const x1 = useTransform(sx, (v) => v * 12);
  const y1 = useTransform(sy, (v) => v * 12);
  const x2 = useTransform(sx, (v) => v * 26);
  const y2 = useTransform(sy, (v) => v * 26);
  const x3 = useTransform(sx, (v) => v * 42);
  const y3 = useTransform(sy, (v) => v * 42);
  const rotate = useTransform(sx, (v) => v * 5);

  function handleMove(e: React.MouseEvent) {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative mx-auto h-[27rem] w-full max-w-sm sm:h-[30rem] lg:max-w-none"
    >
      {/* soft accent glow behind the deck */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[80px]"
      />

      {/* Base "dashboard" card */}
      <motion.div
        style={{ x: x1, y: y1, rotate }}
        className="absolute left-1/2 top-1/2 w-[19rem] -translate-x-1/2 -translate-y-1/2"
      >
        <SpotlightCard className="sui-paper rounded-2xl border-2 border-border-strong bg-card p-5">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>SB</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg">Aria Sync</p>
              <p className="truncate text-xs text-muted">Design system</p>
            </div>
            <Badge variant="solid" className="ml-auto">
              Pro
            </Badge>
          </div>

          <div className="mt-5">
            <span className="eyebrow !text-[0.6rem]">Monthly reach</span>
            <div className="display mt-1 text-4xl">
              <NumberTicker value={128480} />
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs text-muted">
              <span>Adoption</span>
              <span>72%</span>
            </div>
            <Progress value={72} />
          </div>

          <Button size="sm" className="mt-5 w-full">
            Upgrade plan
          </Button>
        </SpotlightCard>
      </motion.div>

      {/* Floating: motion toggle (top-left) */}
      <motion.div
        style={{ x: x2, y: y2 }}
        className="sui-paper-sm absolute left-0 top-8 flex items-center gap-2.5 rounded-xl border-2 border-border-strong bg-surface-strong px-3.5 py-2.5"
      >
        <Switch checked={on} onCheckedChange={setOn} />
        <span className="text-xs font-medium text-fg">
          {on ? "Motion on" : "Motion off"}
        </span>
      </motion.div>

      {/* Floating: badges (bottom-right) */}
      <motion.div
        style={{ x: x2, y: y2 }}
        className="sui-paper-sm absolute bottom-12 right-0 flex flex-col gap-2 rounded-xl border-2 border-border-strong bg-surface-strong p-3"
      >
        <div className="flex gap-1.5">
          <Badge variant="success">Live</Badge>
          <Badge variant="outline">v0.6</Badge>
        </div>
        <span className="eyebrow !text-[0.55rem]">32+ components</span>
      </motion.div>

      {/* Floating: shortcut (top-right) */}
      <motion.div
        style={{ x: x3, y: y3 }}
        className="sui-paper-sm absolute right-4 top-0 flex items-center gap-1.5 rounded-xl border-2 border-border-strong bg-surface-strong px-3 py-2 text-xs text-muted"
      >
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        <span className="ml-0.5">Search</span>
      </motion.div>

      {/* Floating: rating pill (bottom-left) */}
      <motion.div
        style={{ x: x3, y: y3 }}
        className="sui-paper-sm absolute bottom-2 left-6 flex items-center gap-2 rounded-full border-2 border-border-strong bg-accent px-3.5 py-2 text-white"
      >
        <span className="text-sm tracking-tight">★★★★★</span>
        <span className="text-xs font-semibold">Loved by devs</span>
      </motion.div>

      {/* Floating: gradient tag (mid-right) */}
      <motion.div
        style={{ x: x3, y: y3 }}
        className="sui-paper-sm absolute right-2 top-1/2 rounded-xl border-2 border-border-strong bg-card px-3 py-2"
      >
        <GradientText as="span" className="text-sm font-bold">
          Aa
        </GradientText>
      </motion.div>
    </div>
  );
}
