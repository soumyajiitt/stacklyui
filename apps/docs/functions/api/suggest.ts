/**
 * Cloudflare Pages Function — POST /api/suggest
 *
 * Receives a "Suggest a component" submission from the docs site and emails it
 * to the maintainer via Resend (https://resend.com). It runs on the same origin
 * as the static site, so the RESEND_API_KEY secret never ships in the browser
 * bundle. This endpoint is intentionally public (it's a suggestion box); keep
 * the payload caps below and add Cloudflare Turnstile if you start seeing spam.
 *
 * Required env — Pages → Settings → Variables (and .dev.vars for local dev):
 *   RESEND_API_KEY  Resend API key (secret, starts with "re_")
 *   MAIL_TO         Inbox that receives ideas, e.g. you@example.com
 *   MAIL_FROM       Verified sender (optional; defaults to ideas@dev.stacklyui.in)
 */

interface Env {
  RESEND_API_KEY: string;
  MAIL_TO: string;
  MAIL_FROM?: string;
}

type PagesContext = { request: Request; env: Env };

const CATEGORIES = ["layout", "form", "navigation", "overlay", "data-display", "motion"] as const;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });

/** Escape user text before dropping it into the email HTML. */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const onRequestOptions = () =>
  new Response(null, { status: 204, headers: CORS });

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  if (!env.RESEND_API_KEY || !env.MAIL_TO) {
    return json({ error: "Email delivery isn't configured on the server." }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const category = typeof body.category === "string" ? body.category : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  const issues: { message: string }[] = [];
  if (title.length < 3 || title.length > 80)
    issues.push({ message: "Name must be 3–80 characters." });
  if (description.length < 12 || description.length > 600)
    issues.push({ message: "Description must be 12–600 characters." });
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number]))
    issues.push({ message: "Unknown category." });
  if (email && !EMAIL_RE.test(email)) issues.push({ message: "Email looks invalid." });
  if (issues.length) return json({ error: "Please fix the highlighted fields.", issues }, 400);

  const from = env.MAIL_FROM || "StacklyUI Ideas <ideas@dev.stacklyui.in>";
  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px">💡 New component idea</h2>
      <p style="margin:0 0 16px;color:#666">Category: <strong>${esc(category)}</strong></p>
      <h3 style="margin:0 0 4px">${esc(title)}</h3>
      <p style="white-space:pre-wrap;line-height:1.5">${esc(description)}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
      <p style="color:#888;font-size:13px">
        From: ${email ? esc(email) : "anonymous"} · Sent via the StacklyUI suggestion box
      </p>
    </div>`;

  const payload: Record<string, unknown> = {
    from,
    to: [env.MAIL_TO],
    subject: `💡 Component idea: ${title.replace(/[\r\n]+/g, " ")}`,
    html,
  };
  if (email) payload.reply_to = email;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return json({ error: "Couldn't send the email. Please try again later." }, 502);
  }
  return json({ ok: true });
};
