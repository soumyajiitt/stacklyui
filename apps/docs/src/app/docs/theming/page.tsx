import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import {
  DocHeader,
  DocPager,
  DocSectionTitle,
  Prose,
} from "@/components/docs-ui";

export const metadata: Metadata = {
  title: "Theming",
  description:
    "Retheme all of StacklyUI by overriding a handful of OKLCH design tokens.",
};

const tokens = `:root {
  /* Surfaces & text */
  --sui-bg: oklch(0.16 0.015 275);
  --sui-surface: oklch(1 0 0 / 0.04);
  --sui-border: oklch(1 0 0 / 0.1);
  --sui-fg: oklch(0.96 0.005 275);
  --sui-muted: oklch(0.72 0.02 275);

  /* Accent ramp — the brand gradient */
  --sui-accent:   oklch(0.62 0.19 288);
  --sui-accent-2: oklch(0.58 0.20 268);
  --sui-accent-3: oklch(0.78 0.13 205);

  --sui-radius: 1rem;
}`;

const rebrand = `:root {
  /* Swap violet→cyan for an emerald→lime brand */
  --sui-accent:   oklch(0.72 0.17 155);
  --sui-accent-2: oklch(0.78 0.18 140);
  --sui-accent-3: oklch(0.86 0.19 125);
  --sui-accent-gradient: linear-gradient(
    110deg,
    var(--sui-accent),
    var(--sui-accent-2),
    var(--sui-accent-3)
  );
  --sui-accent-glow: oklch(0.72 0.17 155 / 0.4);
}`;

const perInstance = `<SpotlightCard
  glow="oklch(0.78 0.18 30)"
  style={{ "--sui-radius": "1.5rem" }}
>
  Warm glow, rounder corners — just this card.
</SpotlightCard>`;

export default function ThemingPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Getting started"
        title="Theming"
        description="Every StacklyUI component reads from CSS custom properties. Override them globally to rebrand the whole library, or per-instance for one-off tweaks."
      />

      <DocSectionTitle id="tokens">The token set</DocSectionTitle>
      <Prose>
        <p>
          Colors are defined in <code>OKLCH</code>, so lightness, chroma, and
          hue are independent — nudging one token keeps the palette perceptually
          balanced. These are the defaults:
        </p>
      </Prose>
      <div className="mt-4">
        <CodeBlock code={tokens} lang="css" filename="tokens.css" />
      </div>

      <DocSectionTitle id="dark">Light &amp; dark</DocSectionTitle>
      <Prose>
        <p>
          Both themes are tuned, not derived. StacklyUI switches on a{" "}
          <code>.dark</code> class on <code>&lt;html&gt;</code> (managed for you
          by <code>ThemeProvider</code>). Light-mode overrides live under a{" "}
          <code>.light</code> selector, so you never get a washed-out
          afterthought.
        </p>
      </Prose>

      <DocSectionTitle id="rebrand">Rebrand in seconds</DocSectionTitle>
      <Prose>
        <p>
          Override the accent ramp anywhere in your global CSS to change the
          entire library&apos;s personality:
        </p>
      </Prose>
      <div className="mt-4">
        <CodeBlock code={rebrand} lang="css" filename="globals.css" />
      </div>

      <DocSectionTitle id="per-instance">Per-instance overrides</DocSectionTitle>
      <Prose>
        <p>
          Because tokens cascade, you can scope changes to a single component
          via inline styles or a wrapping class:
        </p>
      </Prose>
      <div className="mt-4">
        <CodeBlock code={perInstance} filename="example.tsx" />
      </div>

      <DocPager current="/docs/theming" />
    </article>
  );
}
