import { cn } from "@/lib/utils";

/**
 * A small "New" pill for flagging freshly-added components in the nav and
 * gallery. On-brand coral tint with a soft pulsing dot so it catches the eye
 * without shouting.
 */
export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-accent/12 px-1.5 py-px text-[0.6rem] font-semibold uppercase leading-tight tracking-wide text-accent ring-1 ring-inset ring-accent/20",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      New
    </span>
  );
}
