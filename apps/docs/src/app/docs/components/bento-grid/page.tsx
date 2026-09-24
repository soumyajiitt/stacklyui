import type { Metadata } from "next";
import { ComponentDoc } from "@/components/component-doc";
import { BentoDemo } from "@/components/demos";

export const metadata: Metadata = {
  title: "Bento Grid",
  description: "A responsive bento layout with hover lift and pointer glow.",
};

const demoCode = `import { BentoGrid, BentoCard } from "@stacklyui/ui";

export function Example() {
  return (
    <BentoGrid columns={3}>
      <BentoCard
        colSpan={2}
        eyebrow="Featured"
        title="Wide cell"
        description="Cells span multiple columns and rows."
      />
      <BentoCard eyebrow="Compact" title="Tall" description="Hover to lift." />
      <BentoCard eyebrow="Detail" title="One" description="Pointer glow." />
      <BentoCard
        colSpan={2}
        eyebrow="Detail"
        title="Another wide one"
        description="Collapses to one column on mobile."
      />
    </BentoGrid>
  );
}`;

export default function Page() {
  return (
    <ComponentDoc
      slug="bento-grid"
      current="/docs/components/bento-grid"
      title="Bento Grid"
      description="A dense, responsive grid whose cells can span multiple columns and rows. Each card lifts on hover and reveals a pointer-tracked glow. Collapses to a single column on small screens."
      demo={<BentoDemo />}
      demoCode={demoCode}
      previewClassName="items-stretch"
      notes={
        <p>
          Use the built-in <code>eyebrow</code>/<code>title</code>/
          <code>description</code> slots, or pass <code>children</code> for full
          control. Add a background layer with the <code>media</code> prop. Set{" "}
          <code>colSpan</code>/<code>rowSpan</code> per card and{" "}
          <code>columns</code> on the grid.
        </p>
      }
      props={[
        {
          name: "columns",
          type: "number",
          default: "3",
          description: "Column count on large screens (BentoGrid).",
        },
        {
          name: "colSpan",
          type: "number",
          default: "1",
          description: "Columns this card spans (BentoCard).",
        },
        {
          name: "rowSpan",
          type: "number",
          default: "1",
          description: "Rows this card spans (BentoCard).",
        },
        {
          name: "eyebrow / title / description",
          type: "ReactNode",
          description: "Standard content slots for a BentoCard.",
        },
        {
          name: "media",
          type: "ReactNode",
          description: "Visual rendered behind the card's text content.",
        },
      ]}
    />
  );
}
