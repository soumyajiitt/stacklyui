"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "@stacklyui/ui";
import { SectionHeading } from "./section-heading";
import { openCommandPalette } from "@/components/command-palette";
import { cn } from "@/lib/utils";

function Tile({
  title,
  tag,
  className,
  children,
}: {
  title: string;
  tag: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border-2 border-border-strong bg-surface",
        className,
      )}
    >
      <div className="flex flex-1 flex-col p-6">{children}</div>
      <div className="flex items-center justify-between border-t border-border/70 px-4 py-3">
        <span className="text-sm font-semibold text-fg">{title}</span>
        <span className="eyebrow !text-[0.55rem]">{tag}</span>
      </div>
    </div>
  );
}

const TOAST_BUTTONS = [
  {
    key: "success",
    label: "Success",
    tone: "border-[oklch(0.7_0.15_150/0.4)] text-[oklch(0.55_0.13_150)] hover:bg-[oklch(0.7_0.15_150/0.1)]",
    fn: () =>
      toast.success("Deployment ready", {
        description: "Shipped to production in 1.2s.",
      }),
  },
  {
    key: "error",
    label: "Error",
    tone: "border-destructive/40 text-destructive hover:bg-destructive/10",
    fn: () =>
      toast.error("Build failed", {
        description: "2 type errors in checkout.ts.",
      }),
  },
  {
    key: "promise",
    label: "Promise",
    tone: "border-accent/40 text-accent hover:bg-accent/10",
    fn: () =>
      toast.promise(new Promise((res) => setTimeout(res, 1800)), {
        loading: "Publishing to the registry…",
        success: "Published · v0.7",
        error: "Upload failed",
      }),
  },
  {
    key: "action",
    label: "With action",
    tone: "border-border-strong text-fg hover:bg-surface-strong",
    fn: () =>
      toast.message("Message archived", {
        description: "Moved out of your inbox.",
        action: { label: "Undo", onClick: () => toast.success("Restored to inbox") },
      }),
  },
  {
    key: "info",
    label: "Info",
    tone: "border-border-strong text-fg hover:bg-surface-strong",
    fn: () =>
      toast.info("Update available", { description: "v0.7 is ready to install." }),
  },
] as const;
function ToastConsole() {
  return (
    <Tile title="Toaster" tag="Notifications" className="lg:col-span-2 lg:row-span-2">
      <div className="flex flex-1 flex-col">
        <p className="max-w-sm text-sm text-muted">
          A promise-aware toast system with actions, five intents and stacked
          swipe-to-dismiss. Fire one — it lands bottom-right.
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {TOAST_BUTTONS.map((b) => (
            <button
              key={b.key}
              type="button"
              onClick={b.fn}
              data-cursor="hover"
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                b.tone,
              )}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* faux notification stack — a visual anchor for the tile */}
        <div className="relative mt-auto pt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="mb-2 flex items-center gap-3 rounded-xl border border-border bg-surface-strong px-4 py-3 last:mb-0"
              style={{
                marginLeft: `${i * 14}px`,
                marginRight: `${i * 14}px`,
                opacity: 1 - i * 0.26,
              }}
            >
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  i === 0 ? "bg-accent" : "bg-border-strong",
                )}
              />
              <span className="h-2 flex-1 rounded-full bg-border" />
              <span className="h-2 w-8 rounded-full bg-border" />
            </div>
          ))}
        </div>
      </div>
    </Tile>
  );
}
function CommandTile() {
  return (
    <Tile title="Command palette" tag="⌘K">
      <div className="flex flex-1 flex-col">
        <p className="text-sm text-muted">
          Fuzzy-search every component, page and action — full keyboard control.
        </p>
        <button
          type="button"
          onClick={openCommandPalette}
          data-cursor="hover"
          className="group/cmd mt-5 flex w-full items-center gap-3 rounded-xl border-2 border-border-strong bg-surface-strong px-4 py-3 text-left transition-colors hover:border-accent"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-muted transition-colors group-hover/cmd:text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="flex-1 text-sm text-muted">Search…</span>
          <kbd className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.65rem] text-fg">
            ⌘K
          </kbd>
        </button>
      </div>
    </Tile>
  );
}
const BURST = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2;
  return { x: Math.cos(angle) * 34, y: Math.sin(angle) * 34 };
});

function ReactionTile() {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(1240);
  const [liked, setLiked] = useState(false);
  const [bursts, setBursts] = useState(0);

  function toggle() {
    setLiked((v) => {
      const next = !v;
      setCount((c) => c + (next ? 1 : -1));
      if (next) setBursts((b) => b + 1);
      return next;
    });
  }

  return (
    <Tile title="Optimistic UI" tag="Micro-interaction">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-2">
        <div className="relative">
          <button
            type="button"
            onClick={toggle}
            data-cursor="hover"
            aria-pressed={liked}
            aria-label={liked ? "Unlike" : "Like"}
            className={cn(
              "relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-colors",
              liked
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-border-strong text-muted hover:border-destructive/60 hover:text-destructive",
            )}
          >
            <motion.svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
              animate={reduced ? undefined : { scale: liked ? [1, 1.35, 1] : 1 }}
              transition={{ duration: 0.32 }}
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
            </motion.svg>

            {/* particle burst */}
            {!reduced && (
              <AnimatePresence>
                {liked &&
                  BURST.map((p, i) => (
                    <motion.span
                      key={`${bursts}-${i}`}
                      className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-destructive"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  ))}
              </AnimatePresence>
            )}
          </button>
        </div>
        <div className="text-center">
          <div className="display text-2xl tabular-nums text-fg">
            {count.toLocaleString()}
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {liked ? "You reacted" : "Tap to react"}
          </p>
        </div>
      </div>
    </Tile>
  );
}
const SNIPPET = `import { Button, toast } from "@stacklyui/ui";

<Button onClick={() => toast.success("Shipped")}>
  Deploy
</Button>`;

function CopyTile() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(SNIPPET);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Couldn’t copy");
    }
  }

  return (
    <Tile title="Copy & paste" tag="DX" className="lg:col-span-3">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <pre className="overflow-x-auto rounded-xl border border-border bg-[oklch(0.16_0.01_60)] px-4 py-3.5 font-mono text-[0.72rem] leading-relaxed text-[oklch(0.85_0.02_70)]">
          <code>{SNIPPET}</code>
        </pre>
        <button
          type="button"
          onClick={copy}
          data-cursor="hover"
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-border-strong bg-surface-strong px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent lg:h-full"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy snippet
            </>
          )}
        </button>
      </div>
    </Tile>
  );
}
export function InteractionLab() {
  return (
    <section
      id="interaction-lab"
      className="mx-auto max-w-[86rem] scroll-mt-24 px-5 py-28 sm:px-8"
    >
      <SectionHeading
        index="006"
        title="Interaction lab"
        description="Components you can poke. Fire a toast, react with a burst of particles, open the command palette, copy a snippet — every tile is live, not a screenshot."
      />
      <div className="mt-16 grid gap-5 lg:grid-cols-3">
        <ToastConsole />
        <CommandTile />
        <ReactionTile />
        <CopyTile />
      </div>
    </section>
  );
}
