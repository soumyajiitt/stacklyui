/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compile the workspace UI package from source (it ships "use client" TSX).
  transpilePackages: ["@stacklyui/ui"],
  // Emit a fully static site (apps/docs/out) for Cloudflare Pages hosting.
  output: "export",
  // Static export can't use the on-demand Image Optimization server.
  images: { unoptimized: true },
};

export default nextConfig;
