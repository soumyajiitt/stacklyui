"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@stacklyui/ui";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/components", label: "Components" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/installation", label: "Install" },
];

function CircleLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      data-cursor="hover"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children}
    </a>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[86rem] items-center gap-8 px-5 sm:px-8">
        <Link
          href="/"
          data-cursor="hover"
          className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Logo className="h-7 w-7" />
          <span className="text-base font-extrabold uppercase tracking-tight">
            Stackly<span className="text-accent">UI</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("/").slice(0, 3).join("/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                data-cursor="hover"
                className={cn(
                  "relative text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors",
                  active ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {link.label}
                {active ? (
                  <span className="absolute -bottom-2 left-0 h-px w-full bg-accent" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2.5 md:ml-0">
          <CircleLink href="https://github.com" label="GitHub repository">
            <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="currentColor" aria-hidden>
              <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.26 3.4.96.1-.76.4-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.28 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
            </svg>
          </CircleLink>
          <ThemeToggle data-cursor="hover" className="!h-10 !w-10 !rounded-full" />
        </div>
      </div>
    </header>
  );
}
