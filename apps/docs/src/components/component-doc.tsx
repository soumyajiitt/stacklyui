import type { ReactNode } from "react";
import { highlightCode } from "@/lib/highlighter";
import { ComponentPreview } from "./component-preview";
import { CommandBlock } from "./command-block";
import { installCommands, registryCommands } from "@/lib/pm-commands";
import {
  DocHeader,
  DocPager,
  DocSectionTitle,
  PropsTable,
  Prose,
  type PropDef,
} from "./docs-ui";

export interface ComponentDocProps {
  /** URL slug of the registry item, e.g. "spotlight-card". */
  slug: string;
  title: string;
  description: string;
  /** Live rendered demo (client component). */
  demo: ReactNode;
  /** Source of the demo, shown in the Code tab. */
  demoCode: string;
  /** Alignment tweaks for the preview stage. */
  previewClassName?: string;
  /** Extra usage notes rendered under "Usage". */
  notes?: ReactNode;
  props: PropDef[];
  /** Route path for prev/next paging. */
  current: string;
}

/**
 * Standard layout for a component documentation page: header, live preview with
 * code, install commands, usage notes, and a props table. Highlights the demo
 * code with Shiki on the server.
 */
export async function ComponentDoc({
  slug,
  title,
  description,
  demo,
  demoCode,
  previewClassName,
  notes,
  props,
  current,
}: ComponentDocProps) {
  const codeHtml = await highlightCode(demoCode, "tsx");

  return (
    <article>
      <DocHeader eyebrow="Component" title={title} description={description} />

      <ComponentPreview
        codeHtml={codeHtml}
        code={demoCode}
        previewClassName={previewClassName}
      >
        {demo}
      </ComponentPreview>

      <DocSectionTitle id="installation">Installation</DocSectionTitle>
      <Prose>
        <p>
          <strong>Registry CLI</strong> — copy the source straight into your
          project:
        </p>
      </Prose>
      <div className="mt-4">
        <CommandBlock commands={registryCommands(slug)} />
      </div>
      <Prose className="mt-6">
        <p>
          <strong>Or install the package</strong> and import it:
        </p>
      </Prose>
      <div className="mt-4">
        <CommandBlock commands={installCommands("@stacklyui/ui", "motion")} />
      </div>

      {notes ? (
        <>
          <DocSectionTitle id="usage">Usage</DocSectionTitle>
          <Prose>{notes}</Prose>
        </>
      ) : null}

      <DocSectionTitle id="props">Props</DocSectionTitle>
      <PropsTable props={props} />

      <DocPager current={current} />
    </article>
  );
}
