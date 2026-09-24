import type { Metadata } from "next";
import { ComponentDoc } from "@/components/component-doc";
import { GradientTextDemo } from "@/components/demos";

export const metadata: Metadata = {
  title: "Gradient Text",
  description: "Text painted with an animated, clipped gradient.",
};

const demoCode = `import { GradientText } from "@stacklyui/ui";

export function Example() {
  return (
    <>
      <GradientText as="h2" className="text-5xl font-bold">
        Gradient in motion
      </GradientText>
      <GradientText
        colors={["#f472b6", "#f97316", "#facc15"]}
        duration={4}
      >
        Custom colors, your tempo
      </GradientText>
    </>
  );
}`;

export default function Page() {
  return (
    <ComponentDoc
      slug="gradient-text"
      current="/docs/components/gradient-text"
      title="Gradient Text"
      description="Applies an animated gradient clipped to the glyphs. The sweep is a pure CSS background-position animation, and the text stays fully selectable and readable by assistive tech."
      demo={<GradientTextDemo />}
      demoCode={demoCode}
      notes={
        <p>
          Render as any element with <code>as</code> (defaults to{" "}
          <code>span</code>). Provide your own <code>colors</code> array or use
          the brand gradient. Set <code>animate={"{false}"}</code> for a static
          gradient.
        </p>
      }
      props={[
        {
          name: "as",
          type: "ElementType",
          default: '"span"',
          description: "Element/tag to render (e.g. \"h1\", \"p\").",
        },
        {
          name: "colors",
          type: "string[]",
          description: "Gradient stops. Defaults to the accent gradient.",
        },
        {
          name: "animate",
          type: "boolean",
          default: "true",
          description: "Animate the gradient sweep.",
        },
        {
          name: "duration",
          type: "number",
          default: "6",
          description: "Seconds for one sweep.",
        },
      ]}
    />
  );
}
