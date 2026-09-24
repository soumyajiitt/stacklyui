/**
 * StacklyUI mark — three stacked isometric layers (a "stack" of sheets),
 * echoing the library's signature stacked-paper look. Colors are token-driven
 * (coral → orange → amber), so the mark stays on-brand and adapts to light,
 * dark, and inverted bands. Thin bg-colored separators keep the layers crisp
 * down to favicon sizes.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      role="img"
      aria-label="StacklyUI logo"
    >
      {/* bottom layer — amber */}
      <path
        d="M16 16 28 21 16 26 4 21Z"
        fill="var(--color-accent-3)"
        stroke="var(--color-bg)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* middle layer — orange */}
      <path
        d="M16 9.5 28 14.5 16 19.5 4 14.5Z"
        fill="var(--color-accent-2)"
        stroke="var(--color-bg)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* top layer — coral (the brand color, on top) */}
      <path
        d="M16 3 28 8 16 13 4 8Z"
        fill="var(--color-accent)"
        stroke="var(--color-bg)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
