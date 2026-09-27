"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Reveal,
} from "@stacklyui/ui";
import { SectionHeading } from "./section-heading";

interface QA {
  q: string;
  a: React.ReactNode;
}

const FAQS: QA[] = [
  {
    q: "Do I install a package or copy the source?",
    a: (
      <>
        Both work. Install <code className="font-mono text-fg">@stacklyui/ui</code> for
        the whole library, or copy any component’s source straight from its docs
        page — it’s yours to edit, with no lock-in.
      </>
    ),
  },
  {
    q: "How does theming work?",
    a: (
      <>
        Every component reads from a small set of OKLCH design tokens. Override a
        handful of CSS variables — <code className="font-mono text-fg">--accent</code>,
        radius, and friends — and the entire system rebrands. Try it live in the{" "}
        <Link href="#theme-studio" data-cursor="hover" className="text-accent underline-offset-4 hover:underline">
          Theme Studio
        </Link>{" "}
        above.
      </>
    ),
  },
  {
    q: "Is it accessible?",
    a: "Interactive components build on Radix primitives, so you get focus management, keyboard navigation and ARIA out of the box. Every animation respects prefers-reduced-motion.",
  },
  {
    q: "Does it work with dark mode?",
    a: "Yes — every token has a light and dark value, and the ThemeProvider handles the switch with no flash of the wrong theme on first paint.",
  },
  {
    q: "Which frameworks are supported?",
    a: (
      <>
        StacklyUI targets React 18+ and is built for the Next.js App Router, but
        the components are framework-agnostic React — they run anywhere React
        does. Styling is Tailwind v4 plus a self-contained stylesheet.
      </>
    ),
  },
  {
    q: "What does it cost?",
    a: (
      <>
        Nothing. StacklyUI is open source under the MIT license — use it in
        personal and commercial projects freely.
      </>
    ),
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="mx-auto max-w-[86rem] scroll-mt-24 px-5 py-28 sm:px-8"
    >
      <SectionHeading
        index="009"
        title="Questions"
        description="The things people ask before they adopt a component library. Still curious? The docs go deeper."
      />
      <Reveal className="mt-16 grid gap-x-16 gap-y-4 lg:grid-cols-[0.7fr_1fr] lg:items-start">
        <div className="hidden lg:block">
          <p className="display text-[7rem] leading-[0.8] text-accent/[0.1]">?</p>
          <Link
            href="/docs"
            data-cursor="hover"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors hover:text-accent"
          >
            Read the full docs
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
        <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
          {FAQS.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="max-w-xl text-[0.95rem]">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}

