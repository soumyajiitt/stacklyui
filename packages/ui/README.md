# @stacklyui/ui

Beautifully animated, accessible React components for building standout interfaces. Every component is tuned for light **and** dark, respects `prefers-reduced-motion`, and runs its animations on the GPU.

## Install

```bash
npm i @stacklyui/ui motion react react-dom
```

`motion`, `react`, and `react-dom` are peer dependencies.

## Usage

```tsx
import { Button, GradientText, SpotlightCard } from "@stacklyui/ui";
import "@stacklyui/ui/styles.css";

export function Example() {
  return (
    <SpotlightCard>
      <GradientText>StacklyUI</GradientText>
      <Button>Get started</Button>
    </SpotlightCard>
  );
}
```

Import `@stacklyui/ui/styles.css` once at the root of your app so the component
styles and design tokens are available everywhere.

## Docs

Full documentation, live playgrounds, and the shadcn registry:
**https://dev.stacklyui.in**

You can also add components straight into your project via the registry:

```bash
npx shadcn@latest add @stacklyui/button
```

## License

MIT
