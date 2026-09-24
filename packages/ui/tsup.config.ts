import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  treeshake: true,
  minify: false,
  sourcemap: true,
  external: ["react", "react-dom", "motion", "motion/react"],
  esbuildOptions(options) {
    // Preserve the top-of-file "use client" directives that RSC bundlers rely on.
    options.banner = { js: '"use client";' };
  },
  // NOTE: dist/styles.css is produced by the Tailwind CLI step in the package
  // "build" script (tsup runs first with clean:true, then Tailwind writes the
  // self-contained sheet), so there is no CSS copy step here.
});
