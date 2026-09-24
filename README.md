# StacklyUI

Beautifully animated, accessible React components. Copy-paste the source or install the package — every component is tuned for light and dark, respects `prefers-reduced-motion`, and runs its animations on the GPU.

Built to beat Magic UI and Aceternity UI on both developer experience and the components themselves.

## Highlights

- **Accessible by default** — reduced-motion aware, keyboard operable, visible focus, ARIA where it counts.
- **Performance first** — compositor-driven transforms; pointer effects write CSS variables instead of re-rendering React.
- **Token-driven theming** — OKLCH scale tuned for real light *and* dark modes. Rebrand by overriding a few CSS variables.
- **Dual distribution** — a shadcn-style registry (`npx shadcn add <url>`) *and* an installable npm package, from one source of truth.

## Signature components

Aurora Background · Spotlight Card · Gradient Text · Bento Grid · Animated Beam · Marquee · Magnetic Button · Number Ticker

## Monorepo layout

```
stacklyui/
├── packages/ui/     # "@stacklyui/ui" — the component source of truth (npm package)
└── apps/docs/       # Next.js docs + showcase site, and the registry host
```

## Develop

```bash
pnpm install
pnpm dev              # runs the docs site (apps/docs) at http://localhost:3000
```

Other scripts:

```bash
pnpm build            # build the ui package, then the docs site
pnpm build:ui         # build just the npm package (tsup → dist)
pnpm registry:build   # generate copy-paste registry JSON into apps/docs/public/r
pnpm typecheck        # type-check every workspace
```

## Tech

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion.

## License

MIT
