import type { Metadata } from "next";
import { ComponentDoc } from "@/components/component-doc";
import { NumberTickerDemo } from "@/components/demos";

export const metadata: Metadata = {
  title: "Number Ticker",
  description: "Animates a number counting up when it scrolls into view.",
};

const demoCode = `import { NumberTicker } from "@stacklyui/ui";

export function Example() {
  return (
    <div className="flex gap-12">
      <NumberTicker value={1284} />
      <NumberTicker value={99.9} decimals={1} suffix="%" />
      <NumberTicker value={42000} prefix="$" />
    </div>
  );
}`;

export default function Page() {
  return (
    <ComponentDoc
      slug="number-ticker"
      current="/docs/components/number-ticker"
      title="Number Ticker"
      description="Counts from a starting value to the target when it scrolls into view. The tween writes formatted text straight to the DOM (no per-frame re-render), and under reduced motion it renders the final value immediately."
      demo={<NumberTickerDemo />}
      demoCode={demoCode}
      notes={
        <p>
          Format with <code>decimals</code>, <code>locale</code>, and the full{" "}
          <code>Intl.NumberFormat</code> <code>format</code> options, plus{" "}
          <code>prefix</code>/<code>suffix</code> for currency and units. It
          triggers once when scrolled into view.
        </p>
      }
      props={[
        {
          name: "value",
          type: "number",
          description: "The target value to count to. Required.",
        },
        {
          name: "from",
          type: "number",
          default: "0",
          description: "Starting value.",
        },
        {
          name: "duration",
          type: "number",
          default: "1.6",
          description: "Seconds for the count.",
        },
        {
          name: "decimals",
          type: "number",
          default: "0",
          description: "Decimal places to display.",
        },
        {
          name: "prefix / suffix",
          type: "string",
          description: "Text before/after the number (e.g. \"$\", \"%\").",
        },
        {
          name: "format",
          type: "Intl.NumberFormatOptions",
          description: "Extra Intl formatting (e.g. currency style).",
        },
      ]}
    />
  );
}
