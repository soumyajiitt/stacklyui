import type { Metadata } from "next";
import { ComponentDoc } from "@/components/component-doc";
import { SpotlightDemo } from "@/components/demos";

export const metadata: Metadata = {
  title: "Spotlight Card",
  description: "A glass card with a spotlight glow that follows the cursor.",
};

const demoCode = `import { SpotlightCard } from "@stacklyui/ui";

export function Example() {
  return (
    <SpotlightCard className="max-w-sm">
      <h3 className="text-lg font-semibold">Move your cursor</h3>
      <p className="mt-2 text-sm text-muted">
        The glow tracks your pointer through CSS variables.
      </p>
    </SpotlightCard>
  );
}`;

export default function Page() {
  return (
    <ComponentDoc
      slug="spotlight-card"
      current="/docs/components/spotlight-card"
      title="Spotlight Card"
      description="A frosted-glass card with a radial glow that follows the cursor and an optional pointer-aware border sheen. The glow is driven by CSS custom properties, so tracking the mouse never re-renders React."
      demo={<SpotlightDemo />}
      demoCode={demoCode}
      notes={
        <p>
          Content goes in as children and renders inside a padded content layer
          above the glow. Set <code>glow</code> to any CSS color and{" "}
          <code>radius</code> to size the spotlight. Turn off the animated border
          with <code>border={"{false}"}</code>.
        </p>
      }
      props={[
        {
          name: "radius",
          type: "number",
          default: "350",
          description: "Radius of the spotlight glow in pixels.",
        },
        {
          name: "glow",
          type: "string",
          default: "accent",
          description: "CSS color of the glow. Defaults to the accent token.",
        },
        {
          name: "border",
          type: "boolean",
          default: "true",
          description: "Show the pointer-tracked animated border.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes applied to the card element.",
        },
      ]}
    />
  );
}
