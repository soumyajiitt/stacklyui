"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/lib/docs-nav";
import { NewBadge } from "@/components/new-badge";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="space-y-8">
      {DOCS_NAV.map((section, i) => (
        <div key={section.title}>
          <h4 className="mb-2.5 flex items-center gap-2 px-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted/80">
            <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
            {section.title}
          </h4>
          <ul className="space-y-0.5 border-l border-line pl-1">
            {section.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-surface font-medium text-fg"
                        : "text-muted hover:bg-surface/50 hover:text-fg",
                    )}
                  >
                    {active ? (
                      <span className="absolute inset-y-1 -left-1 w-0.5 rounded-full bg-accent" />
                    ) : null}
                    <span>{link.label}</span>
                    {link.badge === "new" ? <NewBadge /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
