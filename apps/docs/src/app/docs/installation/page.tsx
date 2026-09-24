import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { CommandBlock } from "@/components/command-block";
import { installCommands, registryCommands } from "@/lib/pm-commands";
import {
  DocHeader,
  DocPager,
  DocSectionTitle,
  Prose,
} from "@/components/docs-ui";

export const metadata: Metadata = {
  title: "Installation",
  description: "Add StacklyUI to your project — via the CLI registry or npm.",
};

const registrySetup = `{
  "registries": {
    "@stacklyui": "https://dev.stacklyui.in/r/{name}.json"
  }
}`;

const importExample = `import { AuroraBackground, MagneticButton } from "@stacklyui/ui";
import "@stacklyui/ui/styles.css";

export default function Page() {
  return (
    <AuroraBackground className="min-h-dvh">
      <MagneticButton>Get started</MagneticButton>
    </AuroraBackground>
  );
}`;

const themeSetup = `import { ThemeProvider, ThemeScript } from "@stacklyui/ui";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sets the theme class before paint — no flash */}
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}`;

export default function InstallationPage() {
  return (
    <article>
      <DocHeader
        eyebrow="Getting started"
        title="Installation"
        description="StacklyUI works two ways: install the package for quick updates, or copy the source into your project with the registry CLI and own every line."
      />

      <DocSectionTitle id="cli">Option A — Registry CLI (copy-paste)</DocSectionTitle>
      <Prose>
        <p>
          The CLI copies a component&apos;s source straight into your project,
          alongside any hooks and utilities it needs. You own the code and can
          edit it freely. This is the recommended path if you want full control.
        </p>
        <p>
          First, register the <code>@stacklyui</code> namespace once in your{" "}
          <code>components.json</code> so you can add any component by name:
        </p>
      </Prose>
      <div className="mt-4">
        <CodeBlock code={registrySetup} filename="components.json" />
      </div>
      <Prose className="mt-6">
        <p>Then add components with the namespaced shorthand:</p>
      </Prose>
      <div className="mt-4">
        <CommandBlock commands={registryCommands("spotlight-card")} />
      </div>

      <DocSectionTitle id="npm">Option B — npm package</DocSectionTitle>
      <Prose>
        <p>
          Prefer a managed dependency? Install the package and import components
          directly. You&apos;ll also need the peer dependencies: <code>react</code>,{" "}
          <code>react-dom</code>, and <code>motion</code>.
        </p>
      </Prose>
      <div className="mt-4">
        <CommandBlock commands={installCommands("@stacklyui/ui", "motion")} />
      </div>

      <Prose className="mt-6">
        <p>Then import the components and the stylesheet once:</p>
      </Prose>
      <div className="mt-4">
        <CodeBlock code={importExample} filename="app/page.tsx" />
      </div>

      <DocSectionTitle id="theme">Enable theming</DocSectionTitle>
      <Prose>
        <p>
          Wrap your app in <code>ThemeProvider</code> and add{" "}
          <code>ThemeScript</code> to your document head to switch between light
          and dark with no flash on load.
        </p>
      </Prose>
      <div className="mt-4">
        <CodeBlock code={themeSetup} filename="app/layout.tsx" />
      </div>

      <DocPager current="/docs/installation" />
    </article>
  );
}
