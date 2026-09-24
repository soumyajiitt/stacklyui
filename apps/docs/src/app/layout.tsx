import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider, ThemeScript } from "@stacklyui/ui";
import { SiteNav } from "@/components/site-nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CursorFollower } from "@/components/cursor-follower";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dev.stacklyui.in"),
  title: {
    default: "StacklyUI — Animated React components that ship",
    template: "%s · StacklyUI",
  },
  description:
    "A beautifully animated, accessible React component library. Copy-paste or install — built on Tailwind and Motion, tuned for light and dark.",
  keywords: [
    "react",
    "component library",
    "tailwind",
    "motion",
    "framer motion",
    "animated components",
    "ui library",
    "stacklyui",
  ],
  openGraph: {
    title: "StacklyUI",
    description:
      "Animated, accessible React components. Copy-paste or install.",
    url: "https://dev.stacklyui.in",
    siteName: "StacklyUI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript defaultTheme="light" />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} antialiased`}>
        <ThemeProvider defaultTheme="light">
          <div className="edtop" aria-hidden />
          <SmoothScroll />
          <CursorFollower />
          <SiteNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
