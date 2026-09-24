export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export const PM_ORDER: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];

/**
 * The shadcn registry namespace for StacklyUI. Users map this to the registry
 * URL once in their `components.json` (`"@stacklyui":
 * "https://dev.stacklyui.in/r/{name}.json"`), then add any component by name:
 * `npx shadcn@latest add @stacklyui/spotlight-card`.
 */
export const REGISTRY_NAMESPACE = "@stacklyui";

/**
 * Build the `shadcn add` command for a registry component, per package manager.
 * Mirrors the exact runner each PM uses (dlx / npx / bunx). Uses the
 * `@stacklyui/<name>` namespace instead of a raw URL.
 */
export function registryCommands(slug: string): Record<PackageManager, string> {
  const ref = `${REGISTRY_NAMESPACE}/${slug}`;
  return {
    pnpm: `pnpm dlx shadcn@latest add ${ref}`,
    npm: `npx shadcn@latest add ${ref}`,
    yarn: `yarn dlx shadcn@latest add ${ref}`,
    bun: `bunx --bun shadcn@latest add ${ref}`,
  };
}

/** Build install commands for the npm package, per package manager. */
export function installCommands(
  pkg: string,
  extra = "",
): Record<PackageManager, string> {
  const rest = extra ? ` ${extra}` : "";
  return {
    pnpm: `pnpm add ${pkg}${rest}`,
    npm: `npm install ${pkg}${rest}`,
    yarn: `yarn add ${pkg}${rest}`,
    bun: `bun add ${pkg}${rest}`,
  };
}
