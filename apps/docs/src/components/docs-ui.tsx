import Link from "next/link";
import { Reveal } from "@stacklyui/ui";
import { DOCS_FLAT } from "@/lib/docs-nav";
import { cn } from "@/lib/utils";

export function DocHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <Reveal as="header" className="relative mb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-6 -top-10 -z-10 hidden h-40 w-40 rounded-full bg-accent/[0.07] blur-2xl sm:block"
      />
      {eyebrow ? <span className="eyebrow block">{eyebrow}</span> : null}
      <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4.5rem)]">{title}</h1>
      <p className="mt-5 max-w-2xl border-l-2 border-accent pl-5 text-lg leading-relaxed text-muted">
        {description}
      </p>
    </Reveal>
  );
}

export function DocSectionTitle({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mt-14 mb-4 flex scroll-mt-24 items-center gap-3 text-2xl font-semibold tracking-tight"
    >
      <span aria-hidden className="h-5 w-1 rounded-full bg-accent" />
      {children}
    </h2>
  );
}

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-none space-y-4 text-[15px] leading-relaxed text-muted [&_a]:text-accent-3 [&_a:hover]:underline [&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-fg [&_strong]:text-fg", className)}>
      {children}
    </div>
  );
}

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export function PropsTable({ props }: { props: PropDef[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/40 text-xs uppercase tracking-wider text-muted">
            <th className="px-4 py-3 font-semibold">Prop</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Default</th>
            <th className="px-4 py-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-3">
                <code className="font-mono text-[13px] text-accent-3">
                  {prop.name}
                </code>
              </td>
              <td className="px-4 py-3">
                <code className="font-mono text-[12.5px] text-fg/80">
                  {prop.type}
                </code>
              </td>
              <td className="px-4 py-3 text-muted">
                {prop.default ? (
                  <code className="font-mono text-[12.5px]">{prop.default}</code>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-muted">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocPager({ current }: { current: string }) {
  const index = DOCS_FLAT.findIndex((l) => l.href === current);
  const prev = index > 0 ? DOCS_FLAT[index - 1] : undefined;
  const next =
    index >= 0 && index < DOCS_FLAT.length - 1
      ? DOCS_FLAT[index + 1]
      : undefined;

  return (
    <nav className="mt-16 flex items-center justify-between gap-4 border-t border-border/60 pt-8">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col rounded-xl border border-border px-5 py-3 transition-colors hover:border-border/80 hover:bg-surface/40"
        >
          <span className="text-xs text-muted">Previous</span>
          <span className="font-medium text-fg">{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col rounded-xl border border-border px-5 py-3 text-right transition-colors hover:border-border/80 hover:bg-surface/40"
        >
          <span className="text-xs text-muted">Next</span>
          <span className="font-medium text-fg">{next.label}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
