import type { Metadata } from "next";
import { ComponentDoc } from "@/components/component-doc";
import { AuroraDemo } from "@/components/demos";

export const metadata: Metadata = {
  title: "Aurora Background",
  description: "A full-bleed animated aurora backdrop for heroes and sections.",
};

const demoCode = `import { AuroraBackground } from "@stacklyui/ui";

export function Example() {
  return (
    <AuroraBackground className="min-h-dvh flex items-center justify-center">
      <p className="text-2xl font-semibold text-white">Aurora backdrop</p>
    </AuroraBackground>
  );
}`;

export default function Page() {
  return (
    <ComponentDoc
      slug="aurora-background"
      current="/docs/components/aurora-background"
      title="Aurora Background"
      description="Layered gradient blobs that drift slowly behind your content. The motion runs entirely on the compositor and freezes to a static gradient under reduced motion."
      demo={<AuroraDemo />}
      demoCode={demoCode}
      previewClassName="p-0"
      notes={
        <p>
          Wrap any hero or section. The component is <code>position: relative</code>{" "}
          and clips its own overflow, so place your content as children — it
          renders above the aurora automatically. Pass <code>static</code> to
          disable motion, or <code>speed</code> to tune the drift.
        </p>
      }
      props={[
        {
          name: "static",
          type: "boolean",
          default: "false",
          description: "Render a static gradient with no animation.",
        },
        {
          name: "vignette",
          type: "boolean",
          default: "true",
          description: "Darken the edges with a radial vignette.",
        },
        {
          name: "speed",
          type: "number",
          default: "1",
          description: "Animation speed multiplier (2 = twice as fast).",
        },
        {
          name: "className",
          type: "string",
          description: "Classes for the container (e.g. min-height, layout).",
        },
      ]}
    />
  );
}
