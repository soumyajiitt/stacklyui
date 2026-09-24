import type { Metadata } from "next";
import { ComponentDoc } from "@/components/component-doc";
import { MagneticDemo } from "@/components/demos";

export const metadata: Metadata = {
  title: "Magnetic Button",
  description: "A button that leans toward the cursor, with a press ripple.",
};

const demoCode = `import { MagneticButton } from "@stacklyui/ui";

export function Example() {
  return (
    <div className="flex gap-4">
      <MagneticButton>Primary</MagneticButton>
      <MagneticButton variant="secondary">Secondary</MagneticButton>
      <MagneticButton variant="ghost">Ghost</MagneticButton>
    </div>
  );
}`;

export default function Page() {
  return (
    <ComponentDoc
      slug="magnetic-button"
      current="/docs/components/magnetic-button"
      title="Magnetic Button"
      description="A real <button> that springs toward the cursor while hovered and ripples on press. It's keyboard focusable, activates on Enter/Space, shows a visible focus ring, and disables the magnetic offset under reduced motion."
      demo={<MagneticDemo />}
      demoCode={demoCode}
      notes={
        <p>
          It forwards all native button props (<code>onClick</code>,{" "}
          <code>disabled</code>, <code>type</code>…). Choose a <code>variant</code>{" "}
          (<code>primary</code>, <code>secondary</code>, <code>ghost</code>) and{" "}
          <code>size</code> (<code>sm</code>, <code>md</code>, <code>lg</code>).
          Tune the pull with <code>strength</code>.
        </p>
      }
      props={[
        {
          name: "variant",
          type: '"primary" | "secondary" | "ghost"',
          default: '"primary"',
          description: "Visual style of the button.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Button size.",
        },
        {
          name: "strength",
          type: "number",
          default: "12",
          description: "Max magnetic travel toward the cursor, in pixels.",
        },
        {
          name: "ripple",
          type: "boolean",
          default: "true",
          description: "Show an expanding ripple on press.",
        },
      ]}
    />
  );
}
