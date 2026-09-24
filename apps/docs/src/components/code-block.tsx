import { highlightCode } from "@/lib/highlighter";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  lang?: string;
  /** Optional filename/label shown in the header bar. */
  filename?: string;
  className?: string;
}

/**
 * Server component: highlights code with Shiki at render time (dual-theme) and
 * renders a copy button. No client-side highlighter bundle is shipped.
 */
export async function CodeBlock({
  code,
  lang = "tsx",
  filename,
  className,
}: CodeBlockProps) {
  const html = await highlightCode(code, lang);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-[oklch(0.97_0.014_78)] dark:bg-[oklch(0.18_0.022_52)]",
        className,
      )}
    >
      {filename ? (
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
          <span className="font-mono text-xs text-muted">{filename}</span>
          <CopyButton value={code} />
        </div>
      ) : (
        <CopyButton
          value={code}
          className="absolute right-3 top-3 z-10 opacity-0 transition-opacity group-hover:opacity-100"
        />
      )}
      <div
        className="sui-code overflow-x-auto p-4 text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
