"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PM_ORDER, type PackageManager } from "@/lib/pm-commands";
import { cn } from "@/lib/utils";

interface CommandBlockProps {
  /** Command per package manager. Only the provided PMs render as tabs. */
  commands: Partial<Record<PackageManager, string>>;
  className?: string;
  /** Compact height (used inline, e.g. in the hero). */
  size?: "sm" | "md";
}

/**
 * A terminal-style, one-click-copyable command block with package-manager tabs
 * — the pattern popularized by shadcn / Magic UI. Clicking the clipboard copies
 * the currently selected PM's command and pops a "Copied" confirmation.
 */
export function CommandBlock({
  commands,
  className,
  size = "md",
}: CommandBlockProps) {
  const tabs = PM_ORDER.filter((pm) => commands[pm]);
  const [active, setActive] = useState<PackageManager>(tabs[0] ?? "pnpm");
  const [copied, setCopied] = useState(false);
  const command = commands[active] ?? "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked (insecure context) — ignore */
    }
  }

  return (
    <div
      className={cn(
        "group/cmd overflow-hidden rounded-xl border border-border bg-surface-strong shadow-sm backdrop-blur-md",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/70 px-2.5 py-2">
        {/* Terminal glyph */}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-fg text-bg">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m5 8 4 4-4 4M13 16h6" />
          </svg>
        </span>

        <div role="tablist" aria-label="Package manager" className="flex items-center gap-0.5">
          {tabs.map((pm) => (
            <button
              key={pm}
              role="tab"
              aria-selected={active === pm}
              onClick={() => setActive(pm)}
              data-cursor="hover"
              className={cn(
                "relative rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                active === pm
                  ? "text-fg"
                  : "text-muted hover:text-fg",
              )}
            >
              {active === pm ? (
                <motion.span
                  layoutId="cmd-tab"
                  className="absolute inset-0 rounded-md bg-accent/12"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              ) : null}
              <span className="relative">{pm}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={copy}
          data-cursor="hover"
          aria-label={copied ? "Copied" : "Copy command"}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-accent/12 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.svg
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                viewBox="0 0 24 24"
                className="h-4 w-4 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20 6 9 17l-5-5" />
              </motion.svg>
            ) : (
              <motion.svg
                key="copy"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </motion.svg>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div
        className={cn(
          "overflow-x-auto px-4 font-mono text-fg/90",
          size === "sm" ? "py-2.5 text-xs" : "py-3.5 text-[13px]",
        )}
      >
        <AnimatePresence mode="wait">
          <motion.code
            key={command}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="block whitespace-nowrap"
          >
            <span className="mr-2 select-none text-accent">$</span>
            {command}
          </motion.code>
        </AnimatePresence>
      </div>
    </div>
  );
}
