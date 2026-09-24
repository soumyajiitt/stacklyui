import type { Metadata } from "next";
import { ComponentDoc } from "@/components/component-doc";
import { BeamDemo } from "@/components/demos";

export const metadata: Metadata = {
  title: "Animated Beam",
  description: "A traveling light beam drawn between two DOM elements.",
};

const demoCode = `import { useRef } from "react";
import { AnimatedBeam } from "@stacklyui/ui";

export function Example() {
  const container = useRef<HTMLDivElement>(null);
  const from = useRef<HTMLDivElement>(null);
  const to = useRef<HTMLDivElement>(null);

  return (
    <div ref={container} className="relative flex items-center justify-between">
      <div ref={from}>{/* start node */}</div>
      <div ref={to}>{/* end node */}</div>
      <AnimatedBeam containerRef={container} fromRef={from} toRef={to} />
    </div>
  );
}`;

export default function Page() {
  return (
    <ComponentDoc
      slug="animated-beam"
      current="/docs/components/animated-beam"
      title="Animated Beam"
      description="Draws an SVG line between two elements and animates a light traveling along it — perfect for integration and 'how it works' diagrams. The path recomputes on resize via ResizeObserver and renders statically under reduced motion."
      demo={<BeamDemo />}
      demoCode={demoCode}
      notes={
        <p>
          Give the beam three refs: a <code>containerRef</code> (the positioned
          ancestor defining the coordinate space) plus <code>fromRef</code> and{" "}
          <code>toRef</code> for the endpoints. Chain several with staggered{" "}
          <code>delay</code> values and alternate <code>curvature</code> signs to
          build a network.
        </p>
      }
      props={[
        {
          name: "containerRef",
          type: "RefObject",
          description: "Positioned ancestor that defines the SVG space.",
        },
        {
          name: "fromRef / toRef",
          type: "RefObject",
          description: "Start and end element refs.",
        },
        {
          name: "curvature",
          type: "number",
          default: "0",
          description: "Bow of the beam. Positive up, negative down.",
        },
        {
          name: "duration",
          type: "number",
          default: "3",
          description: "Seconds for one travel pass.",
        },
        {
          name: "delay",
          type: "number",
          default: "0",
          description: "Seconds before the animation begins.",
        },
        {
          name: "reverse",
          type: "boolean",
          default: "false",
          description: "Reverse the travel direction.",
        },
      ]}
    />
  );
}
