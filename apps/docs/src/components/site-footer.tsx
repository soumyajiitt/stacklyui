import Link from "next/link";
import { Logo } from "./logo";
import { NewsletterForm } from "./footer-newsletter";
import { BuyMeCoffee } from "./buy-me-coffee";
import { SuggestButton } from "./suggest-button";
import { GITHUB_URL } from "@/lib/site";

const COLUMNS = [
  {
    title: "Docs",
    links: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/theming", label: "Theming" },
    ],
  },
  {
    title: "Components",
    links: [
      { href: "/docs/components/aurora-background", label: "Aurora Background" },
      { href: "/docs/components/card-3d", label: "3D Tilt Card" },
      { href: "/docs/components/magnetic-button", label: "Magnetic Button" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: GITHUB_URL, label: "GitHub" },
      { href: "/docs", label: "Changelog" },
      { href: "/docs", label: "License (MIT)" },
    ],
  },
];

const SOCIALS = [
  {
    href: GITHUB_URL,
    label: "GitHub",
    path: "M12 2A10 10 0 0 0 8.8 21.5c.5.1.7-.2.7-.5v-1.7C6.7 20 6.1 18 6.1 18c-.4-1.1-1-1.4-1-1.4-.9-.6 0-.6 0-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8 0-.7.3-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7 0-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z",
  },
  {
    href: "https://x.com",
    label: "X",
    path: "M18.9 2H22l-7.2 8.3L23 22h-6.6l-5.2-6.8L5.3 22H2l7.7-8.9L1.5 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.2 3.9H5.3L17.7 20Z",
  },
];
export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
        {/* Get involved band — share ideas for new components + support */}
        <div className="grid gap-8 border-b border-line py-14 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <span className="eyebrow">Get involved</span>
            <h2 className="display mt-3 text-3xl leading-[1.05] sm:text-4xl">
              Have an idea for a component?
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Tell me what you&apos;d like to see next, report a bug, or share a
              design idea — every suggestion helps shape what gets built.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <SuggestButton />
            <BuyMeCoffee />
          </div>
        </div>

        {/* Newsletter band */}
        <div className="grid gap-8 border-b border-line py-14 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <span className="eyebrow">Stay in the loop</span>
            <h2 className="display mt-3 text-3xl leading-[1.05] sm:text-4xl">
              Ship better UI, faster.
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Occasional notes on new components and releases. No spam, unsubscribe
              anytime.
            </p>
          </div>
          <div className="md:w-full md:max-w-sm md:justify-self-end">
            <NewsletterForm />
          </div>
        </div>

        <div className="grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-7 w-7" />
              <span className="text-base font-extrabold uppercase tracking-tight">
                Stackly<span className="text-accent">UI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Animated, accessible React components. Copy-paste or install —
              tuned for light and dark.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  data-cursor="hover"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      data-cursor="hover"
                      className="text-sm text-muted transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Oversized wordmark, editorial style. */}
        <div className="overflow-hidden border-t border-line py-10">
          <p className="display select-none text-center text-[clamp(3rem,16vw,14rem)] leading-none text-fg/[0.06]">
            STACKLYUI
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-line py-6 font-mono text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} StacklyUI — MIT Licensed</p>
          <p>Built with Next.js, Tailwind &amp; Motion</p>
        </div>
      </div>
    </footer>
  );
}

