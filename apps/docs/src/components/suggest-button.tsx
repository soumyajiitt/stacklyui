"use client";

import { openSuggestDialog } from "./suggest-component-dialog";

/**
 * Client button that opens the "Suggest a component" dialog. Kept separate so
 * the (server-rendered) footer can stay a server component around it.
 */
export function SuggestButton() {
  return (
    <button
      type="button"
      onClick={openSuggestDialog}
      data-cursor="hover"
      aria-label="Suggest a component"
      className="sui-paper-sm group inline-flex items-center gap-2 rounded-xl border-2 border-border-strong bg-surface-strong px-4 py-2.5 text-sm font-bold text-fg transition-transform hover:-translate-y-0.5 active:translate-y-0"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
      Suggest a component
    </button>
  );
}
