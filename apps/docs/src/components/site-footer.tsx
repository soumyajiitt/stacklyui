import Link from "next/link";
import { Logo } from "./logo";

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
      { href: "https://github.com", label: "GitHub" },
      { href: "/docs", label: "Changelog" },
      { href: "/docs", label: "License (MIT)" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
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
