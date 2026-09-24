import { defineConfig } from "tsup";
import { copyFileSync } from "node:fs";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  treeshake: true,
  minify: false,
  sourcemap: true,
  external: ["react", "react-dom", "motion", "motion/react"],
  loader: { ".css": "copy" },
  esbuildOptions(options) {
    // Preserve the top-of-file "use client" directives that RSC bundlers rely on.
    options.banner = { js: '"use client";' };
  },
  // styles.css is a standalone sheet (never imported into the JS graph), so copy
  // it into dist so the `@stacklyui/ui/styles.css` publish export resolves.
  async onSuccess() {
    copyFileSync("src/styles.css", "dist/styles.css");
  },
});
