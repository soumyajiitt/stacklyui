import type { Metadata } from "next";
import { ComponentDoc } from "@/components/component-doc";
import { Card3DDemo } from "@/components/demos";

export const metadata: Metadata = {
  title: "3D Tilt Card",
  description: "A card that tilts in 3D toward the cursor with a light glare.",
};

const demoCode = `import { Card3D } from "@stacklyui/ui";

export function Example() {
  return (
    <Card3D tilt={14} className="max-w-xs">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Tilt me</h3>
        <p className="mt-2 text-sm text-muted">
          Move your cursor across the card — it leans toward the pointer.
        </p>
      </div>
    </Card3D>
  );
}`;

export default function Page() {
  return (
    <ComponentDoc
      slug="card-3d"
      current="/docs/components/card-3d"
      title="3D Tilt Card"
      description="A perspective card that rotates toward the cursor and lifts toward the viewer, with a moving light glare. Rotation is written to CSS variables on pointer move — no re-renders — and tilt is disabled under reduced motion."
      demo={<Card3DDemo />}
      notes={
        <p>
          Wrap any content. Tune the max rotation with <code>tilt</code>, the
          hover depth with <code>lift</code>, and toggle the specular sheen with{" "}
          <code>glare</code>. For layered depth, give child elements{" "}
          <code>transform: translateZ(...)</code> — the inner surface uses{" "}
          <code>preserve-3d</code>.
        </p>
      }
      demoCode={demoCode}
      props={[
        {
          name: "tilt",
          type: "number",
          default: "12",
          description: "Maximum tilt in degrees at the edges.",
        },
        {
          name: "lift",
          type: "number",
          default: "40",
          description: "How far the card lifts toward the viewer on hover (px).",
        },
        {
          name: "glare",
          type: "boolean",
          default: "true",
          description: "Show a moving light glare across the surface.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes applied to the outer perspective wrapper.",
        },
      ]}
    />
  );
}
