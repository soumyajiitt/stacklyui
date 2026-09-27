"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "@stacklyui/ui";
import { DOCS_NAV } from "@/lib/docs-nav";
import { cn } from "@/lib/utils";
import { BUYMEACOFFEE_URL, GITHUB_URL } from "@/lib/site";
import { openSuggestDialog } from "./suggest-component-dialog";

const CMDK_EVENT = "stackly:cmdk";

/** Open the global command palette from anywhere on the page. */
export function openCommandPalette() {
  window.dispatchEvent(new Event(CMDK_EVENT));
}

interface Cmd {
  id: string;
  label: string;
  group: string;
  hint?: string;
  keywords?: string;
  run: () => void;
}

/**
 * A global ⌘K / Ctrl+K command palette. Fuzzy-searches every documented
 * component plus quick actions (navigate, toggle theme, jump to Theme Studio),
 * with full keyboard control and a focus-safe portal overlay. Reduced-motion
 * aware — it fades instead of springing.
 */
export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);
  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  // Build the command list: actions first, then every documented component.
  const commands = useMemo<Cmd[]>(() => {
    const actions: Cmd[] = [
      { id: "home", label: "Go to home", group: "Navigate", hint: "Page", run: () => go("/") },
      { id: "all", label: "Browse all components", group: "Navigate", hint: "Page", keywords: "gallery catalog", run: () => go("/components") },
      { id: "docs", label: "Read the docs", group: "Navigate", hint: "Page", run: () => go("/docs") },
      { id: "install", label: "Installation guide", group: "Navigate", hint: "Page", keywords: "setup npm", run: () => go("/docs/installation") },
      { id: "theming", label: "Theming guide", group: "Navigate", hint: "Page", keywords: "color tokens", run: () => go("/docs/theming") },
      {
        id: "theme",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        group: "Actions",
        hint: "Toggle",
        keywords: "dark light mode appearance",
        run: () => {
          setTheme(theme === "dark" ? "light" : "dark");
          setOpen(false);
        },
      },
      {
        id: "studio",
        label: "Open Theme Studio",
        group: "Actions",
        hint: "Jump",
        keywords: "color accent hue customize brand",
        run: () => {
          setOpen(false);
          document
            .getElementById("theme-studio")
            ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        },
      },
      {
        id: "github",
        label: "Open GitHub repository",
        group: "Actions",
        hint: "External",
        keywords: "source code repo",
        run: () => {
          setOpen(false);
          window.open(GITHUB_URL, "_blank", "noreferrer");
        },
      },
      {
        id: "suggest",
        label: "Suggest a component",
        group: "Actions",
        hint: "Share",
        keywords: "idea request feedback contribute reach out propose new",
        run: () => {
          setOpen(false);
          openSuggestDialog();
        },
      },
      {
        id: "coffee",
        label: "Buy me a coffee",
        group: "Actions",
        hint: "External",
        keywords: "support donate sponsor tip thanks",
        run: () => {
          setOpen(false);
          window.open(BUYMEACOFFEE_URL, "_blank", "noreferrer");
        },
      },
    ];

    const components: Cmd[] = DOCS_NAV.flatMap((section) =>
      section.links
        .filter((l) => l.href.startsWith("/docs/components/"))
        .map((l) => ({
          id: l.href,
          label: l.label,
          group: section.title,
          hint: "Component",
          run: () => go(l.href),
        })),
    );

    return [...actions, ...components];
  }, [go, reduced, setTheme, theme]);

  // Filter by query, then bucket into ordered groups.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? commands.filter((c) =>
          `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q),
        )
      : commands;
    const groups: { title: string; items: Cmd[] }[] = [];
    for (const c of matched) {
      let g = groups.find((x) => x.title === c.group);
      if (!g) {
        g = { title: c.group, items: [] };
        groups.push(g);
      }
      g.items.push(c);
    }
    return groups;
  }, [commands, query]);

  // Flat, render-ordered list so keyboard indices line up with the DOM.
  const flat = useMemo(() => results.flatMap((g) => g.items), [results]);

  useEffect(() => setActive(0), [query]);

  // Global open shortcut (⌘K / Ctrl+K) + programmatic open event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(CMDK_EVENT, onEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(CMDK_EVENT, onEvent);
    };
  }, []);

  // On open: reset, focus the field, and lock body scroll.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Keep the highlighted row scrolled into view.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      flat[active]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-[oklch(0.15_0.01_60/0.55)] backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            onKeyDown={onKeyDown}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="sui-paper relative w-full max-w-xl overflow-hidden rounded-2xl border-2 border-border-strong bg-popover"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search components, pages, actions…"
                className="h-14 w-full bg-transparent text-[0.95rem] text-fg outline-none placeholder:text-muted"
                aria-label="Search commands"
              />
              <kbd className="hidden rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.65rem] text-muted sm:block">
                esc
              </kbd>
            </div>
            <div ref={listRef} className="max-h-[52vh] overflow-y-auto overflow-x-hidden p-2">
              {flat.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-muted">
                  No matches for “{query}”.
                </p>
              ) : (
                results.map((group) => (
                  <div key={group.title} className="mb-1">
                    <p className="eyebrow px-3 py-2 !text-[0.58rem]">{group.title}</p>
                    {group.items.map((item) => {
                      const idx = flat.indexOf(item);
                      const isActive = idx === active;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          data-idx={idx}
                          onMouseMove={() => setActive(idx)}
                          onClick={() => item.run()}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                            isActive ? "bg-accent/12" : "hover:bg-surface-strong",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold transition-colors",
                              isActive ? "bg-accent text-white" : "bg-accent/12 text-accent",
                            )}
                          >
                            {String(item.label).charAt(0)}
                          </span>
                          <span className="block min-w-0 flex-1 truncate text-sm font-medium text-fg">
                            {item.label}
                          </span>
                          {item.hint ? (
                            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider text-muted">
                              {item.hint}
                            </span>
                          ) : null}
                          <span className={cn("shrink-0 transition-opacity", isActive ? "text-accent opacity-100" : "opacity-0")}>
                            <ArrowIcon />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border bg-surface/60 px-4 py-2.5 font-mono text-[0.62rem] text-muted">
              <span className="flex items-center gap-1.5">
                <Key>↑</Key>
                <Key>↓</Key>
                navigate
              </span>
              <span className="flex items-center gap-1.5">
                <Key>↵</Key> select
                <span className="mx-1 h-3 w-px bg-border" />
                <Key>esc</Key> close
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[0.6rem] text-fg">
      {children}
    </kbd>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
