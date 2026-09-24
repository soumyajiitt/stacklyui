import type { Metadata } from "next";
import { ComponentDoc } from "@/components/component-doc";
import { MarqueeDemo } from "@/components/demos";

export const metadata: Metadata = {
  title: "Marquee",
  description: "An infinite, GPU-driven marquee with pause-on-hover.",
};

const demoCode = `import { Marquee } from "@stacklyui/ui";

export function Example() {
  const items = ["Vercel", "Linear", "Stripe", "Raycast", "Supabase"];
  return (
    <Marquee duration={22}>
      {items.map((item) => (
        <span key={item} className="mx-2 rounded-xl border px-6 py-3">
          {item}
        </span>
      ))}
    </Marquee>
  );
}`;

export default function Page() {
  return (
    <ComponentDoc
      slug="marquee"
      current="/docs/components/marquee"
      title="Marquee"
      description="An infinite scrolling strip for logos, testimonials, or tags. The track is duplicated and translated with a single CSS keyframe, so it runs on the compositor and pauses on hover. Freezes to a scrollable row under reduced motion."
      demo={<MarqueeDemo />}
      demoCode={demoCode}
      notes={
        <p>
          Pass any children — they&apos;re repeated <code>repeat</code> times to
          fill the track. Go vertical with <code>vertical</code>, flip direction
          with <code>reverse</code>, and set <code>duration</code>/<code>gap</code>{" "}
          to taste. The edge fade is on by default via <code>fade</code>.
        </p>
      }
      props={[
        {
          name: "duration",
          type: "number",
          default: "40",
          description: "Seconds for one full loop.",
        },
        {
          name: "vertical",
          type: "boolean",
          default: "false",
          description: "Scroll vertically instead of horizontally.",
        },
        {
          name: "reverse",
          type: "boolean",
          default: "false",
          description: "Reverse the scroll direction.",
        },
        {
          name: "pauseOnHover",
          type: "boolean",
          default: "true",
          description: "Pause the animation while hovered.",
        },
        {
          name: "fade",
          type: "boolean",
          default: "true",
          description: "Mask-fade the leading/trailing edges.",
        },
        {
          name: "repeat",
          type: "number",
          default: "2",
          description: "How many times children repeat to fill the track.",
        },
      ]}
    />
  );
}
