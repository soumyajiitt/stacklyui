import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names with conflict resolution.
 *
 * `clsx` handles conditional/array/object inputs, and `twMerge` deduplicates
 * conflicting Tailwind utilities so the last one wins (e.g. `p-2 p-4` -> `p-4`).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
