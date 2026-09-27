/** Central place for outbound project links used across the site. */

export const GITHUB_URL = "https://github.com/soumyajiitt/stacklyui";

/** Prefilled "new issue" form for component ideas / requests. */
export const GITHUB_ISSUES_URL = `${GITHUB_URL}/issues/new`;

/** Buy Me a Coffee profile (slug from the official button embed). */
export const BUYMEACOFFEE_SLUG = "soumyajiitttt";
export const BUYMEACOFFEE_URL = `https://www.buymeacoffee.com/${BUYMEACOFFEE_SLUG}`;

/**
 * Optional origin override for the "Suggest a component" endpoint. In
 * production the dialog posts to a same-origin Cloudflare Pages Function at
 * `/api/suggest` (which emails the idea via Resend), so this stays empty. Set
 * `NEXT_PUBLIC_API_URL` only to target another origin — e.g. a local
 * `wrangler pages dev` server while developing.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

/** Same-origin suggestions endpoint (a Cloudflare Pages Function → Resend). */
export const SUGGEST_ENDPOINT = `${API_URL}/api/suggest`;

/** Build a prefilled "new issue" URL — the no-backend fallback for ideas. */
export function githubIssueUrl(title: string, body: string) {
  const params = new URLSearchParams({
    title: `[Component idea] ${title}`.trim(),
    body,
    labels: "component-idea",
  });
  return `${GITHUB_ISSUES_URL}?${params.toString()}`;
}
