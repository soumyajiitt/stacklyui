import { BUYMEACOFFEE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Buy Me a Coffee button, rebuilt as a themed link instead of the injected
 * widget script so it renders reliably in the App Router and matches the
 * site's brutalist offset-shadow language. Keeps BMC's brand yellow + black.
 */
export function BuyMeCoffee({ className }: { className?: string }) {
  return (
    <a
      href={BUYMEACOFFEE_URL}
      target="_blank"
      rel="noreferrer"
      data-cursor="hover"
      aria-label="Buy me a coffee"
      className={cn(
        "group inline-flex items-center gap-2 rounded-xl border-2 border-black bg-[#FFDD00] px-4 py-2.5 text-sm font-bold text-black shadow-[3px_3px_0_0_#000] transition-transform hover:-translate-y-0.5 hover:shadow-[4px_5px_0_0_#000] active:translate-y-0 active:shadow-[2px_2px_0_0_#000]",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 transition-transform group-hover:-rotate-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" x2="6" y1="1.5" y2="4" />
        <line x1="10" x2="10" y1="1.5" y2="4" />
        <line x1="14" x2="14" y1="1.5" y2="4" />
      </svg>
      Buy me a coffee
    </a>
  );
}
