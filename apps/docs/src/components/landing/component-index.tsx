"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@stacklyui/ui";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

interface Item {
  name: string;
  tag: string;
  href: string;
}

interface Group {
  title: string;
  items: Item[];
  featured?: number;
}

const GROUPS: Group[] = [
  {
    title: "Backgrounds & Layout",
    featured: 1,
    items: [
      { name: "Aurora Background", tag: "Backdrop", href: "/docs/components/aurora-background" },
      { name: "Bento Grid", tag: "Layout", href: "/docs/components/bento-grid" },
      { name: "Marquee", tag: "Motion", href: "/docs/components/marquee" },
    ],
  },
  {
    title: "Cards & Surfaces",
    featured: 1,
    items: [
      { name: "Spotlight Card", tag: "Pointer", href: "/docs/components/spotlight-card" },
      { name: "3D Tilt Card", tag: "3D", href: "/docs/components/card-3d" },
    ],
  },
  {
    title: "Text & Numbers",
    items: [
      { name: "Gradient Text", tag: "Type", href: "/docs/components/gradient-text" },
      { name: "Number Ticker", tag: "Data", href: "/docs/components/number-ticker" },
    ],
  },
  {
    title: "Interactive",
    featured: 1,
    items: [
      { name: "Magnetic Button", tag: "Input", href: "/docs/components/magnetic-button" },
      { name: "Animated Beam", tag: "Connect", href: "/docs/components/animated-beam" },
    ],
  },
];

function Row({ group, index }: { group: Group; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="border-t border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-cursor="hover"
        className="group flex w-full items-center gap-5 py-6 text-left"
      >
        <span className="rail-num w-6 shrink-0">{num}</span>
        <h3 className="display text-2xl sm:text-3xl">{group.title}</h3>
        <span className="ml-auto flex items-center gap-4">
          <span className="hidden font-mono text-xs text-muted sm:inline">
            {group.items.length} {group.items.length === 1 ? "component" : "components"}
            {group.featured ? (
              <span className="ml-2 text-accent">★ {group.featured} featured</span>
            ) : null}
          </span>
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
              open
                ? "border-accent bg-accent text-white"
                : "border-border text-muted group-hover:border-accent group-hover:text-accent",
            )}
          >
            <motion.svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              aria-hidden
            >
              <path d="m6 9 6 6 6-6" />
            </motion.svg>
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-3 pb-8 pl-0 sm:grid-cols-2 lg:grid-cols-3 lg:pl-11">
              {group.items.map((item, i) => (
                <Link
                  key={item.name}
                  href={item.href}
                  data-cursor="hover"
                  className="group/card relative flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-accent/60"
                >
                  <span className="absolute right-3 top-3 font-mono text-[0.65rem] text-muted/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/12 font-mono text-sm font-bold text-accent">
                    {item.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-fg">
                      {item.name}
                    </span>
                    <span className="eyebrow !text-[0.6rem] !tracking-[0.2em]">
                      {item.tag}
                    </span>
                  </span>
                  <svg viewBox="0 0 24 24" className="ml-auto h-4 w-4 shrink-0 text-muted transition-transform group-hover/card:translate-x-0.5 group-hover/card:text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function ComponentIndex() {
  return (
    <section className="mx-auto max-w-[86rem] px-5 py-28 sm:px-8">
      <SectionHeading
        index="004"
        title="The catalog"
        description="Signature building blocks for standout interfaces — grouped by what they do. Every one is animated, accessible, and yours to copy."
      />
      <Reveal className="mt-16">
        <div className="border-b border-line">
          {GROUPS.map((group, i) => (
            <Row key={group.title} group={group} index={i} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
