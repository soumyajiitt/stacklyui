import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocPager, DocSectionTitle, Prose } from "@/components/docs-ui";
import { DOCS_NAV } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "StacklyUI is an animated, accessible React component library you can copy-paste or install.",
};

const PRINCIPLES = [
  {
    title: "Accessible by default",
    body: "prefers-reduced-motion is honored everywhere, interactive components are keyboard operable with visible focus, and ARIA is wired where it matters.",
  },
  {
    title: "Performance first",
    body: "Animations run on the compositor (transform/opacity). Pointer-driven effects write CSS variables instead of triggering React re-renders.",
  },
  {
    title: "Token-driven theming",
    body: "An OKLCH token scale tuned for both light and dark. Retheme the whole library by overriding a handful of CSS variables.",
  },
  {
    title: "Your code, your call",
    body: "Copy the source in via the registry CLI and own it, or install the npm package. Same components either way.",
  },
];

export default function DocsIntroPage() {
  const components = DOCS_NAV.find((s) => s.title === "Motion & effects");

  return (
    <article>
      <DocHeader
        eyebrow="Getting started"
        title="Introduction"
        description="StacklyUI is a collection of beautifully animated, accessible React components — built on Tailwind and Motion, designed to help you ship interfaces that stand out."
      />

      <Prose>
        <p>
          Most animated component libraries make you choose: dazzling demos with
          accessibility and performance gaps, or safe components that look like
          everything else. StacklyUI refuses that tradeoff. Every component is
          crafted to look striking <strong>and</strong> behave responsibly.
        </p>
      </Prose>

      <DocSectionTitle id="principles">Principles</DocSectionTitle>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <div
            key={p.title}
            className="sui-paper-sm rounded-2xl border-2 border-border-strong bg-card p-5"
          >
            <span className="rail-num">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 font-semibold text-fg">{p.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>

      <DocSectionTitle id="components">Explore components</DocSectionTitle>
      <Prose>
        <p>
          Eight signature components ship in this release. Each has a live
          preview, copy-paste code, and a full props reference.
        </p>
      </Prose>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {components?.links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center justify-between rounded-xl border border-border bg-surface/30 px-5 py-4 transition-colors hover:border-border/80 hover:bg-surface/50"
          >
            <span className="font-medium text-fg">{link.label}</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        ))}
      </div>

      <DocPager current="/docs" />
    </article>
  );
}
