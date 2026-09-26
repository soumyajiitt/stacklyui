import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ComponentPlayground } from "@/components/component-playground";
import { CommandBlock } from "@/components/command-block";
import { NewBadge } from "@/components/new-badge";
import { installCommands, registryCommands } from "@/lib/pm-commands";
import {
  PRIMITIVES,
  PRIMITIVE_SLUGS,
  getPrimitive,
} from "@/lib/primitives-data";

export function generateStaticParams() {
  return PRIMITIVE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getPrimitive(slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.description };
}

export default async function PrimitiveDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getPrimitive(slug);
  if (!doc) notFound();

  const index = PRIMITIVES.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? PRIMITIVES[index - 1] : undefined;
  const next = index < PRIMITIVES.length - 1 ? PRIMITIVES[index + 1] : undefined;
  const examples = doc.examples ?? [];

  const toc = [
    { href: "#preview", label: "Preview & playground" },
    ...(examples.length ? [{ href: "#examples", label: "Examples" }] : []),
    { href: "#installation", label: "Installation" },
    { href: "#usage", label: "Usage" },
  ];

  return (
    <div className="flex gap-12">
      <article className="min-w-0 flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <Link href="/components" data-cursor="hover" className="hover:text-accent">
            Components
          </Link>
          <span>/</span>
          <span className="text-fg">{doc.title}</span>
        </div>
        <h1 className="display mt-4 flex flex-wrap items-center gap-3 text-5xl sm:text-6xl">
          {doc.title}
          {doc.badge === "new" ? <NewBadge className="!text-[0.7rem]" /> : null}
        </h1>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-5 text-lg text-muted">
          {doc.description}
        </p>

        {/* Preview & playground */}
        <section id="preview" className="mt-12 scroll-mt-24">
          <div className="mb-4 flex items-center gap-3">
            <span className="rail-num">01</span>
            <h2 className="text-xl font-semibold">Preview &amp; playground</h2>
          </div>
          <p className="mb-5 text-sm text-muted">
            Edit the code — the preview updates live. Try changing props, text,
            or classes.
          </p>
          <ComponentPlayground code={doc.code} />
        </section>

        {/* Examples — permutations, each editable */}
        {examples.length ? (
          <section id="examples" className="mt-14 scroll-mt-24">
            <div className="mb-4 flex items-center gap-3">
              <span className="rail-num">02</span>
              <h2 className="text-xl font-semibold">Examples</h2>
            </div>
            <p className="mb-6 text-sm text-muted">
              Common variations — edit any of them live.
            </p>
            <div className="space-y-10">
              {examples.map((ex, i) => (
                <div key={ex.title} id={`example-${i}`}>
                  <h3 className="mb-1 font-semibold text-fg">{ex.title}</h3>
                  {ex.description ? (
                    <p className="mb-3 text-sm text-muted">{ex.description}</p>
                  ) : (
                    <div className="mb-3" />
                  )}
                  <ComponentPlayground code={ex.code} />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Installation */}
        <section id="installation" className="mt-14 scroll-mt-24">
          <div className="mb-4 flex items-center gap-3">
            <span className="rail-num">{examples.length ? "03" : "02"}</span>
            <h2 className="text-xl font-semibold">Installation</h2>
          </div>
          <p className="mb-3 text-sm text-muted">
            Copy the source into your project with the registry CLI:
          </p>
          <CommandBlock commands={registryCommands(doc.slug)} />
          <p className="mb-3 mt-6 text-sm text-muted">
            Or install the package and import it:
          </p>
          <CommandBlock commands={installCommands("@stacklyui/ui", "motion")} />
        </section>

        {/* Usage */}
        <section id="usage" className="mt-14 scroll-mt-24">
          <div className="mb-4 flex items-center gap-3">
            <span className="rail-num">{examples.length ? "04" : "03"}</span>
            <h2 className="text-xl font-semibold">Usage</h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            {doc.usage ??
              `Import ${doc.title.replace(/\s/g, "")} from "@stacklyui/ui" and compose it as shown in the playground above. Every interactive primitive is built on Radix, so keyboard navigation, focus management, and ARIA are handled for you.`}
          </p>
        </section>

        {/* Prev / next */}
        <nav className="mt-16 flex items-center justify-between gap-4 border-t border-line pt-8">
          {prev ? (
            <Link
              href={`/docs/components/${prev.slug}`}
              data-cursor="hover"
              className="flex flex-col rounded-xl border border-border px-5 py-3 transition-colors hover:border-accent/60"
            >
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">Previous</span>
              <span className="font-medium text-fg">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/docs/components/${next.slug}`}
              data-cursor="hover"
              className="flex flex-col rounded-xl border border-border px-5 py-3 text-right transition-colors hover:border-accent/60"
            >
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">Next</span>
              <span className="font-medium text-fg">{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>

      {/* On this page */}
      <aside className="sticky top-[4.5rem] hidden h-[calc(100vh-4.5rem)] w-52 shrink-0 py-1 xl:block">
        <p className="eyebrow mb-4 !text-[0.6rem]">On this page</p>
        <ul className="space-y-2.5">
          {toc.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                data-cursor="hover"
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
