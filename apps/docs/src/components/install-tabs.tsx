"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

interface InstallTabsProps {
  /** Map of tab label -> command string. */
  commands: Record<string, string>;
}

/**
 * A compact package-manager / CLI command switcher with a copy button.
 *
 * @example
 * <InstallTabs commands={{ pnpm: "pnpm add @stacklyui/ui", npm: "npm i @stacklyui/ui" }} />
 */
export function InstallTabs({ commands }: InstallTabsProps) {
  const labels = Object.keys(commands);
  const [active, setActive] = useState(labels[0] ?? "");
  const command = commands[active] ?? "";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[oklch(0.97_0.014_78)] dark:bg-[oklch(0.18_0.022_52)]">
      <div
        role="tablist"
        aria-label="Install command"
        className="flex items-center border-b border-border/70 px-2"
      >
        {labels.map((label) => (
          <button
            key={label}
            role="tab"
            aria-selected={active === label}
            onClick={() => setActive(label)}
            className={cn(
              "relative px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none",
              active === label ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            {label}
            {active === label ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
            ) : null}
          </button>
        ))}
        <div className="ml-auto pr-2">
          <CopyButton value={command} />
        </div>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] text-fg/90">
        <code>
          <span className="mr-2 select-none text-accent-3">$</span>
          {command}
        </code>
      </pre>
    </div>
  );
}
