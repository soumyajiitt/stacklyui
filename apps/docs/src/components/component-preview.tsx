"use client";

import { useState, type ReactNode } from "react";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

interface ComponentPreviewProps {
  /** The live, rendered component demo. */
  children: ReactNode;
  /** Pre-highlighted code HTML (from Shiki, server-side). */
  codeHtml: string;
  /** Raw code string, for the copy button. */
  code: string;
  /** Extra classes on the preview stage (e.g. min-height, alignment). */
  previewClassName?: string;
}

type Tab = "preview" | "code";

/**
 * The docs preview shell: a framed stage that renders the live component with a
 * Preview / Code tab switch. Code is highlighted on the server and passed in as
 * HTML so no highlighter ships to the client.
 */
export function ComponentPreview({
  children,
  codeHtml,
  code,
  previewClassName,
}: ComponentPreviewProps) {
  const [tab, setTab] = useState<Tab>("preview");

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface/30">
      <div
        role="tablist"
        aria-label="Component preview"
        className="flex items-center gap-1 border-b border-border/70 px-3 py-2"
      >
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              tab === t ? "bg-surface text-fg" : "text-muted hover:text-fg",
            )}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto">
          <CopyButton value={code} />
        </div>
      </div>

      {tab === "preview" ? (
        <div
          role="tabpanel"
          className={cn(
            "sui-page-grid flex min-h-[22rem] items-center justify-center overflow-hidden p-8",
            previewClassName,
          )}
        >
          {children}
        </div>
      ) : (
        <div
          role="tabpanel"
          className="sui-code max-h-[32rem] overflow-auto p-4 text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        />
      )}
    </div>
  );
}
