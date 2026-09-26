"use client";

import { useState } from "react";
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import { themes } from "prism-react-renderer";
import { useTheme } from "@stacklyui/ui";
import { playgroundScope } from "@/lib/playground-scope";
import { cn } from "@/lib/utils";

interface ComponentPlaygroundProps {
  /** Initial editable source. Must call render(<Demo/>) (noInline). */
  code: string;
  /** Extra classes on the preview stage. */
  previewClassName?: string;
}

/**
 * A live, editable code playground: source on the left, live render on the
 * right. Edits re-render the preview instantly. Built on react-live with the
 * full StacklyUI scope injected.
 */
export function ComponentPlayground({
  code: initialCode,
  previewClassName,
}: ComponentPlaygroundProps) {
  const { resolvedTheme } = useTheme();
  const [code, setCode] = useState(initialCode.trim());
  const [resetKey, setResetKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const prismTheme = resolvedTheme === "dark" ? themes.vsDark : themes.github;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  function reset() {
    setCode(initialCode.trim());
    setResetKey((k) => k + 1);
  }

  return (
    <LiveProvider
      key={resetKey}
      code={code}
      scope={playgroundScope}
      theme={prismTheme}
      noInline
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent-3/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          </span>
          <span className="ml-2 font-mono text-xs text-muted">
            playground.tsx
          </span>
          <span className="ml-auto flex items-center gap-1">
            <span className="mr-1 hidden items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-accent sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Editable — live
            </span>
            <button
              type="button"
              onClick={reset}
              data-cursor="hover"
              className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted transition-colors hover:bg-surface-strong hover:text-fg"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5" />
              </svg>
              Reset
            </button>
            <button
              type="button"
              onClick={copy}
              data-cursor="hover"
              className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted transition-colors hover:bg-surface-strong hover:text-fg"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </span>
        </div>

        {/* Split: editor | preview */}
        <div className="grid lg:grid-cols-2">
          <div
            data-lenis-prevent
            className="relative max-h-[32rem] overflow-auto border-b border-border bg-[oklch(0.97_0.008_75)] font-mono text-[13px] leading-relaxed lg:border-b-0 lg:border-r dark:bg-[oklch(0.16_0.014_52)]"
          >
            <LiveEditor
              onChange={setCode}
              className="sui-live-editor min-h-[16rem] !bg-transparent"
              style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
            />
          </div>
          <div
            className={cn(
              "relative flex min-h-[16rem] items-center justify-center overflow-hidden p-8",
              previewClassName,
            )}
            style={{
              backgroundImage:
                "radial-gradient(var(--color-border) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          >
            <div className="relative z-10 flex w-full items-center justify-center">
              <LivePreview />
            </div>
          </div>
        </div>

        <LiveError className="border-t border-destructive/30 bg-destructive/10 px-4 py-3 font-mono text-xs text-destructive" />
      </div>
    </LiveProvider>
  );
}
