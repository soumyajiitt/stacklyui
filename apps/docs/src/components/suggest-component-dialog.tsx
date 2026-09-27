"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Input,
  Label,
  SpotlightCard,
  Textarea,
  toast,
} from "@stacklyui/ui";
import { cn } from "@/lib/utils";
import { SUGGEST_ENDPOINT, githubIssueUrl } from "@/lib/site";

const SUGGEST_EVENT = "stackly:suggest";

/** Open the "Suggest a component" dialog from anywhere (footer, ⌘K, …). */
export function openSuggestDialog() {
  window.dispatchEvent(new Event(SUGGEST_EVENT));
}

type CategoryId =
  | "layout"
  | "form"
  | "navigation"
  | "overlay"
  | "data-display"
  | "motion";

const CATEGORIES: { id: CategoryId; label: string; d: string }[] = [
  { id: "layout", label: "Layout", d: "M4 4h6v6H4zM14 4h6v6h-6zM14 14h6v6h-6zM4 14h6v6H4z" },
  { id: "form", label: "Form", d: "M3 8h18v8H3zM7 12h6" },
  { id: "navigation", label: "Nav", d: "M4 6h16M4 12h16M4 18h16" },
  { id: "overlay", label: "Overlay", d: "M8 4h12v12M4 8h12v12H4z" },
  { id: "data-display", label: "Data", d: "M5 20v-6M12 20V6M19 20v-9M3 20h18" },
  { id: "motion", label: "Motion", d: "M3 12h4l3-8 4 16 3-8h4" },
];

const TITLE_MAX = 80;
const TITLE_MIN = 3;
const DESC_MAX = 600;
const DESC_MIN = 12;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Status = "idle" | "loading" | "success";

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Global "Suggest a component" island. Mounted once in the layout; opens on the
 * `stackly:suggest` window event (fired by the footer button and ⌘K palette).
 * Posts ideas to a Cloudflare Pages Function that emails them via Resend, and
 * gracefully falls back to a prefilled GitHub issue if that request fails.
 */
export function SuggestComponentDialog() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [category, setCategory] = useState<CategoryId>("layout");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(SUGGEST_EVENT, onOpen);
    return () => window.removeEventListener(SUGGEST_EVENT, onOpen);
  }, []);

  const titleOk = title.trim().length >= TITLE_MIN;
  const descOk = description.trim().length >= DESC_MIN;
  const canSubmit = titleOk && descOk && status !== "loading";
  const slug = useMemo(() => slugify(title) || "your-component", [title]);

  function reset() {
    setStatus("idle");
    setTitle("");
    setDescription("");
    setEmail("");
    setCategory("layout");
  }

  function openGithubFallback() {
    const body = `**Category:** ${category}\n\n**Idea**\n${description || "(describe your idea)"}\n\n> Sent from the StacklyUI site`;
    window.open(githubIssueUrl(title, body), "_blank", "noreferrer");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      toast.error("That email doesn't look right");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(SUGGEST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          email: email.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          issues?: { message: string }[];
        };
        const msg =
          data.issues && data.issues.length
            ? data.issues.map((i) => i.message).join(", ")
            : (data.error ?? `Request failed (${res.status})`);
        throw new Error(msg);
      }
      setStatus("success");
      toast.success("Idea submitted — thank you!");
    } catch (err) {
      setStatus("idle");
      toast.error("Couldn't submit your idea", {
        description: err instanceof Error ? err.message : "Please try again.",
        action: { label: "Use GitHub", onClick: openGithubFallback },
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v && status === "success") reset();
      }}
    >
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <SuccessPanel
              key="success"
              reduced={!!reduced}
              onAnother={reset}
              onClose={() => setOpen(false)}
            />
          ) : (
            <motion.div
              key="form"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-5 pr-8">
                <span className="eyebrow block !text-[0.62rem]">Shape the roadmap</span>
                <DialogTitle className="display mt-2 text-2xl sm:text-3xl">
                  Suggest a component
                </DialogTitle>
                <DialogDescription className="mt-2">
                  Tell me what you&apos;d build with — behavior, states, where it
                  fits. Good ideas jump the queue.
                </DialogDescription>
              </div>

              <form onSubmit={submit} className="grid gap-6 sm:grid-cols-[1.05fr_0.95fr]">
                {/* __FORM_BODY__ */}
                {/* LEFT — the fields */}
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Category</Label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((c) => (
                        <CategoryChip
                          key={c.id}
                          cat={c}
                          active={category === c.id}
                          onClick={() => setCategory(c.id)}
                        />
                      ))}
                    </div>
                  </div>

                  <Field label="Name" hint={`${title.length}/${TITLE_MAX}`}>
                    <Input
                      value={title}
                      maxLength={TITLE_MAX}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Animated Timeline"
                      aria-label="Component name"
                    />
                  </Field>

                  <Field label="What should it do?" hint={`${description.length}/${DESC_MAX}`}>
                    <Textarea
                      value={description}
                      maxLength={DESC_MAX}
                      rows={4}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the behavior, states, and where you'd use it…"
                      aria-label="Description"
                    />
                  </Field>

                  <Field label="Email" optional>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@dev.com — get pinged when it ships"
                      aria-label="Email (optional)"
                    />
                  </Field>
                </div>

                {/* __PREVIEW_AND_ACTIONS__ */}
                {/* RIGHT — live preview card */}
                <div className="hidden sm:block">
                  <span className="eyebrow mb-2 block !text-[0.58rem]">Live preview</span>
                  <LivePreview
                    title={title}
                    description={description}
                    category={category}
                    slug={slug}
                    reduced={!!reduced}
                  />
                </div>

                {/* FOOTER — spans both columns */}
                <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:col-span-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={openGithubFallback}
                    data-cursor="hover"
                    className="text-xs text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    Prefer GitHub? Open an issue instead
                  </button>
                  <div className="flex gap-2 sm:ml-auto">
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={!canSubmit}>
                      {status === "loading" ? (
                        <>
                          <Spinner /> Sending…
                        </>
                      ) : (
                        <>
                          Send idea <ArrowIcon />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <Label>
          {label}
          {optional ? (
            <span className="ml-1 font-normal text-muted">(optional)</span>
          ) : null}
        </Label>
        {hint ? (
          <span className="font-mono text-[0.62rem] text-muted">{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function CategoryChip({
  cat,
  active,
  onClick,
}: {
  cat: { id: CategoryId; label: string; d: string };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="hover"
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-accent bg-accent/12 text-accent"
          : "border-border text-muted hover:border-border-strong hover:text-fg",
      )}
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={cat.d} />
      </svg>
      {cat.label}
    </button>
  );
}

function LivePreview({
  title,
  description,
  category,
  slug,
  reduced,
}: {
  title: string;
  description: string;
  category: CategoryId;
  slug: string;
  reduced: boolean;
}) {
  const label = CATEGORIES.find((c) => c.id === category)?.label ?? "Component";
  return (
    <SpotlightCard className="sui-paper rounded-2xl border-2 border-border-strong bg-card p-5">
      <div className="flex items-center gap-2">
        <Badge variant="soft">{label}</Badge>
        <span className="ml-auto flex items-center gap-1.5 text-[0.58rem] uppercase tracking-wider text-muted">
          <motion.span
            aria-hidden
            animate={reduced ? {} : { opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-accent"
          />
          New idea
        </span>
      </div>
      <h3 className="display mt-4 text-xl leading-tight text-fg">
        {title.trim() || "Your component name"}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
        {description.trim() ||
          "A short description of what it does will appear here as you type."}
      </p>
      <div className="mt-4 rounded-xl border border-border bg-surface p-3">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-accent/70" />
          <span className="h-2 w-2 rounded-full bg-border-strong" />
          <span className="h-2 w-2 rounded-full bg-border-strong" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-2 w-3/4 rounded bg-border-strong/60" />
          <div className="h-2 w-1/2 rounded bg-border-strong/40" />
        </div>
        <div className="mt-3 inline-flex h-7 items-center rounded-lg bg-accent px-3 text-[0.7rem] font-semibold text-accent-fg">
          Action
        </div>
      </div>
      <code className="mt-4 block truncate rounded-lg bg-surface-strong px-3 py-2 font-mono text-[0.68rem] text-muted">
        <span className="text-accent">add</span> {slug}
      </code>
    </SpotlightCard>
  );
}

function SuccessPanel({
  reduced,
  onAnother,
  onClose,
}: {
  reduced: boolean;
  onAnother: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center py-6 text-center"
    >
      <div className="relative">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-accent/25 blur-xl"
          animate={reduced ? {} : { scale: [0.8, 1.5, 1], opacity: [0.6, 0, 0] }}
          transition={{ duration: 1 }}
        />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-accent/12 text-accent">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <motion.path
              d="M5 13l4 4L19 7"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </svg>
        </span>
      </div>
      <DialogTitle className="display mt-5 text-2xl">Idea received!</DialogTitle>
      <DialogDescription className="mt-2 max-w-sm">
        Thank you — your idea just landed in my inbox. The best ones make it
        straight into the library.
      </DialogDescription>
      <div className="mt-6 flex gap-2">
        <Button variant="secondary" onClick={onAnother}>
          Suggest another
        </Button>
        <Button onClick={onClose}>Done</Button>
      </div>
    </motion.div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M21 12a9 9 0 1 1-6.2-8.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}



